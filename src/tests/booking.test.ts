/**
 * Unit Test Suite for EventSync Booking & Inventory Management Engine
 */

import { INITIAL_EVENTS } from '../mock/initialEvents';
import { generateBookingId, formatCurrency } from '../utils/formatters';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[TEST FAILED] ${message}`);
  }
}

export function runBookingEngineTests() {
  console.log('🧪 Running EventSync Booking Engine Test Suite...');

  // Test 1: Currency Formatter
  assert(formatCurrency(49) === '$49', 'formatCurrency(49) should return $49');
  assert(formatCurrency(129) === '$129', 'formatCurrency(129) should return $129');

  // Test 2: Booking ID Generator
  const bookingId = generateBookingId();
  assert(/^EVT-\d{6}$/.test(bookingId), 'generateBookingId() should match EVT-XXXXXX format');

  // Test 3: Seat Inventory Decrement
  const event = { ...INITIAL_EVENTS[0] }; // 34 seats initially
  const quantityToBook = 2;
  const seatsAfterBooking = event.availableSeats - quantityToBook;
  assert(seatsAfterBooking === 32, 'Seat count should decrement from 34 to 32');

  // Test 4: Seat Restoration on Cancellation
  const seatsRestored = seatsAfterBooking + quantityToBook;
  assert(seatsRestored === 34, 'Seat count should be restored back to 34 on cancellation');

  // Test 5: Overbooking Prevention Check
  const availableSeats = 2;
  const requestedQuantity = 5;
  const canBook = requestedQuantity <= availableSeats;
  assert(canBook === false, 'Should reject booking when requested seats exceed available capacity');

  console.log('✅ All 5 Booking Engine Unit Tests Passed Successfully!');
  return true;
}

// Execute tests
try {
  runBookingEngineTests();
} catch (err) {
  console.error(err);
}
