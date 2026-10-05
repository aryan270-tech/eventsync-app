import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { EventItem } from '../types/event';
import { INITIAL_EVENTS } from '../mock/initialEvents';

const EVENTS_COL = 'events';

// Fetch all events from Firestore
export const fetchEvents = async (): Promise<EventItem[]> => {
  const snap = await getDocs(collection(db, EVENTS_COL));
  if (snap.empty) {
    // Seed initial events on first load
    await seedInitialEvents();
    return INITIAL_EVENTS;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventItem));
};

// Get a single event by ID
export const fetchEventById = async (eventId: string): Promise<EventItem | null> => {
  const snap = await getDoc(doc(db, EVENTS_COL, eventId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as EventItem;
};

// Organizer creates a new event
export const createEventInDb = async (
  eventData: Omit<EventItem, 'id'>,
  organizerId: string,
  organizerEmail?: string
): Promise<string> => {
  const ref = await addDoc(collection(db, EVENTS_COL), {
    ...eventData,
    organizerId,
    organizerEmail: organizerEmail || '',
    createdAt: serverTimestamp()
  });
  return ref.id;
};

// Update event available seats after booking
export const updateEventSeats = async (
  eventId: string,
  quantityBooked: number
): Promise<void> => {
  const ref = doc(db, EVENTS_COL, eventId);
  await updateDoc(ref, {
    availableSeats: increment(-quantityBooked)
  });
};

// Restore seats on booking cancellation
export const restoreEventSeats = async (
  eventId: string,
  quantity: number
): Promise<void> => {
  const ref = doc(db, EVENTS_COL, eventId);
  await updateDoc(ref, {
    availableSeats: increment(quantity)
  });
};

// Toggle event status (organizer)
export const updateEventStatus = async (
  eventId: string,
  status: 'active' | 'paused' | 'sold_out'
): Promise<void> => {
  await updateDoc(doc(db, EVENTS_COL, eventId), { status });
};

// Fetch events created by a specific organizer
export const fetchOrganizerEvents = async (organizerId: string): Promise<EventItem[]> => {
  const q = query(collection(db, EVENTS_COL), where('organizerId', '==', organizerId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as EventItem));
};

// Seed Firestore with initial mock events (one-time setup)
const seedInitialEvents = async (): Promise<void> => {
  const batch = writeBatch(db);
  INITIAL_EVENTS.forEach((evt) => {
    const ref = doc(db, EVENTS_COL, evt.id);
    batch.set(ref, { ...evt, organizerId: 'system', createdAt: serverTimestamp() });
  });
  await batch.commit();
};
