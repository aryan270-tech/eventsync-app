import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EventItem, BookingItem, EventFilter, TicketTier, ToastMessage } from '../types/event';
import { INITIAL_EVENTS } from '../mock/initialEvents';
import { generateBookingId, generateQRCodeData } from '../utils/formatters';

interface BookingPayload {
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketTier: TicketTier;
  quantity: number;
}

interface NewEventPayload {
  title: string;
  category: EventItem['category'];
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  priceGeneral: number;
  priceVIP: number;
  totalSeats: number;
  image: string;
  organizer: string;
  speakerName: string;
  speakerRole: string;
  agendaText: string;
}

interface EventContextType {
  events: EventItem[];
  bookings: BookingItem[];
  filter: EventFilter;
  activeTab: 'events' | 'my-bookings' | 'organizer';
  selectedEvent: EventItem | null;
  bookingModalEvent: EventItem | null;
  activeTicketPass: BookingItem | null;
  toasts: ToastMessage[];

  // Actions
  setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
  setActiveTab: (tab: 'events' | 'my-bookings' | 'organizer') => void;
  openEventDetail: (event: EventItem) => void;
  closeEventDetail: () => void;
  openBookingModal: (event: EventItem) => void;
  closeBookingModal: () => void;
  openTicketPass: (booking: BookingItem) => void;
  closeTicketPass: () => void;
  processBooking: (payload: BookingPayload) => boolean;
  cancelBooking: (bookingId: string) => boolean;
  createEvent: (payload: NewEventPayload) => void;
  toggleEventStatus: (eventId: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEYS = {
  EVENTS: 'eventsync_events_v1',
  BOOKINGS: 'eventsync_bookings_v1'
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. State setup with LocalStorage persistence
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [filter, setFilter] = useState<EventFilter>({
    searchQuery: '',
    category: 'All',
    statusFilter: 'All'
  });

  const [activeTab, setActiveTab] = useState<'events' | 'my-bookings' | 'organizer'>('events');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [bookingModalEvent, setBookingModalEvent] = useState<EventItem | null>(null);
  const [activeTicketPass, setActiveTicketPass] = useState<BookingItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to LocalStorage on state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to sync events to localStorage', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {
      console.error('Failed to sync bookings to localStorage', e);
    }
  }, [bookings]);

  // Toast Helper
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modal Actions
  const openEventDetail = (event: EventItem) => setSelectedEvent(event);
  const closeEventDetail = () => setSelectedEvent(null);

  const openBookingModal = (event: EventItem) => {
    setSelectedEvent(null);
    setBookingModalEvent(event);
  };
  const closeBookingModal = () => setBookingModalEvent(null);

  const openTicketPass = (booking: BookingItem) => setActiveTicketPass(booking);
  const closeTicketPass = () => setActiveTicketPass(null);

  // Core Workflow 3: Booking Checkout & Inventory Processing Engine
  const processBooking = (payload: BookingPayload): boolean => {
    const targetEvent = events.find((e) => e.id === payload.eventId);
    if (!targetEvent) {
      addToast('Selected event not found.', 'error');
      return false;
    }

    if (targetEvent.availableSeats < payload.quantity) {
      addToast(`Only ${targetEvent.availableSeats} seats available. Cannot complete booking.`, 'error');
      return false;
    }

    const unitPrice = payload.ticketTier === 'VIP' ? targetEvent.priceVIP : targetEvent.priceGeneral;
    const totalPrice = unitPrice * payload.quantity;
    const bookingId = generateBookingId();
    const qrCodeData = generateQRCodeData(bookingId, targetEvent.title, payload.attendeeName);

    const newBooking: BookingItem = {
      id: bookingId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      eventDate: targetEvent.date,
      eventTime: targetEvent.time,
      eventLocation: targetEvent.location,
      eventImage: targetEvent.image,
      attendeeName: payload.attendeeName,
      attendeeEmail: payload.attendeeEmail,
      attendeePhone: payload.attendeePhone,
      ticketTier: payload.ticketTier,
      quantity: payload.quantity,
      unitPrice,
      totalPrice,
      bookingDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      qrCodeData,
      status: 'confirmed'
    };

    // Decrement available seats & update event status if sold out
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === targetEvent.id) {
          const newAvailable = evt.availableSeats - payload.quantity;
          return {
            ...evt,
            availableSeats: newAvailable,
            status: newAvailable === 0 ? 'sold_out' : evt.status
          };
        }
        return evt;
      })
    );

    // Append to user bookings
    setBookings((prev) => [newBooking, ...prev]);

    // Close modal and pop celebration confetti!
    setBookingModalEvent(null);
    setActiveTicketPass(newBooking);
    addToast(`Success! Reserved ${payload.quantity} ${payload.ticketTier} pass(es) for ${targetEvent.title}`, 'success');

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti fails
    }

    return true;
  };

  // Core Workflow 4: Cancellation & Seat Refund Workflow
  const cancelBooking = (bookingId: string): boolean => {
    const targetBooking = bookings.find((b) => b.id === bookingId);
    if (!targetBooking) {
      addToast('Booking reference not found.', 'error');
      return false;
    }

    if (targetBooking.status === 'cancelled') {
      addToast('This booking is already cancelled.', 'info');
      return false;
    }

    // Restore seats back to inventory
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === targetBooking.eventId) {
          const restoredSeats = evt.availableSeats + targetBooking.quantity;
          return {
            ...evt,
            availableSeats: restoredSeats,
            status: evt.status === 'sold_out' && restoredSeats > 0 ? 'active' : evt.status
          };
        }
        return evt;
      })
    );

    // Update booking status
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    addToast(`Booking ${bookingId} cancelled. ${targetBooking.quantity} seat(s) restored to inventory.`, 'info');
    return true;
  };

  // Core Workflow 5: Create New Event (Organizer Dashboard)
  const createEvent = (payload: NewEventPayload) => {
    const newId = `evt-${Date.now().toString().slice(-4)}`;
    const agendaList = payload.agendaText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const newEvt: EventItem = {
      id: newId,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      longDescription: payload.longDescription || payload.description,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      isOnline: payload.isOnline,
      priceGeneral: payload.priceGeneral,
      priceVIP: payload.priceVIP,
      totalSeats: payload.totalSeats,
      availableSeats: payload.totalSeats,
      image: payload.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      organizer: payload.organizer || 'EventSync Host',
      speaker: {
        name: payload.speakerName || 'Keynote Speaker',
        role: payload.speakerRole || 'Industry Expert',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      agenda: agendaList.length > 0 ? agendaList : ['Keynote & Main Session', 'Interactive Q&A'],
      status: 'active'
    };

    setEvents((prev) => [newEvt, ...prev]);
    addToast(`New event "${newEvt.title}" published successfully!`, 'success');
  };

  // Toggle Event Status (Organizer)
  const toggleEventStatus = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          const nextStatus = evt.status === 'active' ? 'paused' : 'active';
          addToast(`Event "${evt.title}" status changed to ${nextStatus.toUpperCase()}`, 'info');
          return { ...evt, status: nextStatus };
        }
        return evt;
      })
    );
  };

  return (
    <EventContext.Provider
      value={{
        events,
        bookings,
        filter,
        activeTab,
        selectedEvent,
        bookingModalEvent,
        activeTicketPass,
        toasts,
        setFilter,
        setActiveTab,
        openEventDetail,
        closeEventDetail,
        openBookingModal,
        closeBookingModal,
        openTicketPass,
        closeTicketPass,
        processBooking,
        cancelBooking,
        createEvent,
        toggleEventStatus,
        addToast,
        removeToast
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};
