import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { EventItem, BookingItem, EventFilter, TicketTier, ToastMessage } from '../types/event';
import { generateBookingId, generateQRCodeData } from '../utils/formatters';
import { useAuth } from './AuthContext';
import {
  fetchEvents,
  createEventInDb,
  updateEventSeats,
  restoreEventSeats,
  updateEventStatus,
  fetchOrganizerEvents
} from '../services/eventService';
import {
  createBookingInDb,
  fetchUserBookings,
  cancelBookingInDb
} from '../services/bookingService';

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
  loadingEvents: boolean;
  loadingBookings: boolean;

  setFilter: React.Dispatch<React.SetStateAction<EventFilter>>;
  setActiveTab: (tab: 'events' | 'my-bookings' | 'organizer') => void;
  openEventDetail: (event: EventItem) => void;
  closeEventDetail: () => void;
  openBookingModal: (event: EventItem) => void;
  closeBookingModal: () => void;
  openTicketPass: (booking: BookingItem) => void;
  closeTicketPass: () => void;
  processBooking: (payload: BookingPayload) => Promise<boolean>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  createEvent: (payload: NewEventPayload) => Promise<void>;
  toggleEventStatus: (eventId: string) => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshBookings: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState<EventFilter>({ searchQuery: '', category: 'All', statusFilter: 'All' });
  const [activeTab, setActiveTab] = useState<'events' | 'my-bookings' | 'organizer'>('events');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [bookingModalEvent, setBookingModalEvent] = useState<EventItem | null>(null);
  const [activeTicketPass, setActiveTicketPass] = useState<BookingItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Load events from Firestore on mount
  useEffect(() => {
    setLoadingEvents(true);
    fetchEvents()
      .then(setEvents)
      .catch(() => addToast('Failed to load events. Please refresh.', 'error'))
      .finally(() => setLoadingEvents(false));
  }, []);

  // Load user bookings from Firestore when user logs in
  const refreshBookings = useCallback(async () => {
    if (!currentUser) { setBookings([]); return; }
    setLoadingBookings(true);
    try {
      const data = await fetchUserBookings(currentUser.uid);
      setBookings(data);
    } catch {
      addToast('Failed to load bookings.', 'error');
    } finally {
      setLoadingBookings(false);
    }
  }, [currentUser]);

  useEffect(() => {
    refreshBookings();
  }, [refreshBookings]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Modal Actions
  const openEventDetail = (event: EventItem) => setSelectedEvent(event);
  const closeEventDetail = () => setSelectedEvent(null);
  const openBookingModal = (event: EventItem) => { setSelectedEvent(null); setBookingModalEvent(event); };
  const closeBookingModal = () => setBookingModalEvent(null);
  const openTicketPass = (booking: BookingItem) => setActiveTicketPass(booking);
  const closeTicketPass = () => setActiveTicketPass(null);

  // Core Workflow: Process Booking → Save to Firestore
  const processBooking = async (payload: BookingPayload): Promise<boolean> => {
    if (!currentUser || !userProfile) {
      addToast('Please log in to book tickets.', 'error');
      return false;
    }

    const targetEvent = events.find((e) => e.id === payload.eventId);
    if (!targetEvent) { addToast('Event not found.', 'error'); return false; }
    if (targetEvent.availableSeats < payload.quantity) {
      addToast(`Only ${targetEvent.availableSeats} seats available.`, 'error');
      return false;
    }

    const unitPrice = payload.ticketTier === 'VIP' ? targetEvent.priceVIP : targetEvent.priceGeneral;
    const totalPrice = unitPrice * payload.quantity + 2; // +$2 processing fee
    const bookingId = generateBookingId();
    const qrCodeData = generateQRCodeData(bookingId, targetEvent.title, payload.attendeeName);
    const bookingDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    try {
      // 1. Save booking to Firestore
      const firestoreId = await createBookingInDb({
        userId: currentUser.uid,
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
        bookingDate,
        qrCodeData
      });

      // 2. Decrement seats in Firestore
      await updateEventSeats(targetEvent.id, payload.quantity);

      // 3. Update local state
      const newBooking: BookingItem = {
        id: firestoreId,
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
        bookingDate,
        qrCodeData,
        status: 'confirmed'
      };

      setEvents((prev) => prev.map((evt) =>
        evt.id === targetEvent.id
          ? { ...evt, availableSeats: evt.availableSeats - payload.quantity, status: evt.availableSeats - payload.quantity === 0 ? 'sold_out' : evt.status }
          : evt
      ));
      setBookings((prev) => [newBooking, ...prev]);
      setBookingModalEvent(null);
      setActiveTicketPass(newBooking);
      addToast(`Reserved ${payload.quantity} ${payload.ticketTier} pass(es) for ${targetEvent.title}!`, 'success');

      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
      return true;
    } catch (err) {
      addToast('Booking failed. Please try again.', 'error');
      return false;
    }
  };

  // Core Workflow: Cancel Booking → Update Firestore
  const cancelBooking = async (bookingId: string): Promise<boolean> => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) { addToast('Booking not found.', 'error'); return false; }
    if (target.status === 'cancelled') { addToast('Already cancelled.', 'info'); return false; }

    try {
      await cancelBookingInDb(bookingId);
      await restoreEventSeats(target.eventId, target.quantity);

      setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
      setEvents((prev) => prev.map((evt) =>
        evt.id === target.eventId
          ? { ...evt, availableSeats: evt.availableSeats + target.quantity, status: evt.status === 'sold_out' && evt.availableSeats + target.quantity > 0 ? 'active' : evt.status }
          : evt
      ));
      addToast(`Booking cancelled. ${target.quantity} seat(s) restored.`, 'info');
      return true;
    } catch {
      addToast('Cancellation failed. Please try again.', 'error');
      return false;
    }
  };

  // Core Workflow: Create Event → Save to Firestore (Organizer)
  const createEvent = async (payload: NewEventPayload) => {
    if (!currentUser) { addToast('Please log in as organizer.', 'error'); return; }

    const agendaList = payload.agendaText.split('\n').map((l) => l.trim()).filter(Boolean);
    const newEvt: Omit<EventItem, 'id'> = {
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
      organizer: payload.organizer || userProfile?.name || 'EventSync Host',
      speaker: { name: payload.speakerName || 'Keynote Speaker', role: payload.speakerRole || 'Industry Expert', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
      agenda: agendaList.length > 0 ? agendaList : ['Keynote & Main Session', 'Interactive Q&A'],
      status: 'active'
    };

    try {
      const id = await createEventInDb(newEvt, currentUser.uid);
      setEvents((prev) => [{ id, ...newEvt }, ...prev]);
      addToast(`Event "${newEvt.title}" published!`, 'success');
    } catch {
      addToast('Failed to create event. Try again.', 'error');
    }
  };

  // Toggle event status (local + Firestore)
  const toggleEventStatus = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    if (!evt) return;
    const next = evt.status === 'active' ? 'paused' : 'active';
    updateEventStatus(eventId, next).catch(() => {});
    setEvents((prev) => prev.map((e) => e.id === eventId ? { ...e, status: next } : e));
    addToast(`Event "${evt.title}" is now ${next.toUpperCase()}`, 'info');
  };

  return (
    <EventContext.Provider value={{
      events, bookings, filter, activeTab, selectedEvent, bookingModalEvent,
      activeTicketPass, toasts, loadingEvents, loadingBookings,
      setFilter, setActiveTab, openEventDetail, closeEventDetail,
      openBookingModal, closeBookingModal, openTicketPass, closeTicketPass,
      processBooking, cancelBooking, createEvent, toggleEventStatus,
      addToast, removeToast, refreshBookings
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEventContext must be used within an EventProvider');
  return context;
};
