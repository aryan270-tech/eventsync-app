import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { BookingItem, TicketTier } from '../types/event';

const BOOKINGS_COL = 'bookings';

export interface CreateBookingPayload {
  userId: string;
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
}

// Create a new booking in Firestore
export const createBookingInDb = async (
  payload: CreateBookingPayload
): Promise<string> => {
  const ref = await addDoc(collection(db, BOOKINGS_COL), {
    ...payload,
    status: 'confirmed',
    createdAt: serverTimestamp()
  });
  return ref.id;
};

// Get all bookings for a specific user
export const fetchUserBookings = async (userId: string): Promise<BookingItem[]> => {
  const q = query(
    collection(db, BOOKINGS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data()
  } as BookingItem));
};

// Get all bookings for a specific event (organizer view)
export const fetchEventBookings = async (eventId: string): Promise<BookingItem[]> => {
  const q = query(
    collection(db, BOOKINGS_COL),
    where('eventId', '==', eventId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BookingItem));
};

// Cancel a booking by ID
export const cancelBookingInDb = async (bookingId: string): Promise<void> => {
  await updateDoc(doc(db, BOOKINGS_COL, bookingId), { status: 'cancelled' });
};
