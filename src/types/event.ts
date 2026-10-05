export type EventCategory = 'Tech & AI' | 'Design & UX' | 'Music & Art' | 'Business' | 'Workshops';

export type TicketTier = 'General' | 'VIP';

export interface SpeakerInfo {
  name: string;
  role: string;
  avatar: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  longDescription: string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  priceGeneral: number;
  priceVIP: number;
  totalSeats: number;
  availableSeats: number;
  image: string;
  organizer: string;
  speaker: SpeakerInfo;
  agenda: string[];
  status: 'active' | 'paused' | 'sold_out';
}

export interface BookingItem {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventImage: string;
  attendeeName: string;
  attendeeEmail: string;
  attendeePhone: string;
  ticketTier: TicketTier;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  bookingDate: string;
  qrCodeData: string;
  status: 'confirmed' | 'cancelled';
}

export interface EventFilter {
  searchQuery: string;
  category: EventCategory | 'All';
  statusFilter: 'All' | 'Available' | 'Sold Out';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
