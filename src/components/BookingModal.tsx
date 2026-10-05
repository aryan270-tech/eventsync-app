import React, { useState } from 'react';
import { X, Ticket, ShieldCheck, User, Mail, Phone } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { TicketTier } from '../types/event';
import { formatCurrency } from '../utils/formatters';

export const BookingModal: React.FC = () => {
  const { bookingModalEvent, closeBookingModal, processBooking } = useEventContext();

  const [ticketTier, setTicketTier] = useState<TicketTier>('General');
  const [quantity, setQuantity] = useState<number>(1);
  const [attendeeName, setAttendeeName] = useState<string>('');
  const [attendeeEmail, setAttendeeEmail] = useState<string>('');
  const [attendeePhone, setAttendeePhone] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!bookingModalEvent) return null;

  const unitPrice = ticketTier === 'VIP' ? bookingModalEvent.priceVIP : bookingModalEvent.priceGeneral;
  const subtotal = unitPrice * quantity;
  const serviceFee = 2; // Flat service fee
  const totalPrice = subtotal + serviceFee;

  const validateForm = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!attendeeName.trim()) {
      errs.name = 'Full name is required';
    }

    if (!attendeeEmail.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(attendeeEmail)) {
      errs.email = 'Invalid email format (e.g. user@example.com)';
    }

    if (!attendeePhone.trim()) {
      errs.phone = 'Phone number is required';
    }

    if (quantity > bookingModalEvent.availableSeats) {
      errs.quantity = `Only ${bookingModalEvent.availableSeats} seats available`;
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment / network latency
    setTimeout(() => {
      const success = processBooking({
        eventId: bookingModalEvent.id,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        ticketTier,
        quantity
      });

      setIsProcessing(false);
      if (success) {
        // Modal closes on success
      }
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={closeBookingModal}>
      <div
        className="glass-panel max-w-lg w-full flex flex-col animate-modal relative p-0 overflow-hidden border border-slate-700/80 shadow-2xl" style={{ maxHeight: 'min(90vh, 680px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Reserve Tickets</h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px] md:max-w-[300px]">{bookingModalEvent.title}</p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="booking-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4" style={{ paddingBottom: '8px' }}>
          
          {/* Step 1: Select Tier */}
          <div>
            <label className="block text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              Select Ticket Tier
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTicketTier('General')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  ticketTier === 'General'
                    ? 'bg-violet-600/20 border-violet-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-sm text-white">General Access</div>
                <div className="text-xs font-mono text-violet-300 font-semibold mt-1">
                  {formatCurrency(bookingModalEvent.priceGeneral)}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTicketTier('VIP')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  ticketTier === 'VIP'
                    ? 'bg-cyan-600/20 border-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-heading font-bold text-sm text-white flex items-center gap-1">
                  <span>VIP Pass</span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">VIP</span>
                </div>
                <div className="text-xs font-mono text-cyan-300 font-semibold mt-1">
                  {formatCurrency(bookingModalEvent.priceVIP)}
                </div>
              </button>
            </div>
          </div>

          {/* Ticket Quantity Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Quantity
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {bookingModalEvent.availableSeats} seats available
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  disabled={num > bookingModalEvent.availableSeats}
                  onClick={() => setQuantity(num)}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold border transition-all ${
                    quantity === num
                      ? 'bg-violet-600 text-white border-violet-500 shadow-md'
                      : num > bookingModalEvent.availableSeats
                      ? 'opacity-30 cursor-not-allowed border-slate-800 bg-slate-900'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            {errors.quantity && <p className="text-xs text-rose-400 mt-1">{errors.quantity}</p>}
          </div>

          {/* Step 2: Attendee Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Attendee Information</h4>

            {/* Name Input */}
            <div>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors ${
                    errors.name ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="Email Address (for pass delivery)"
                  value={attendeeEmail}
                  onChange={(e) => setAttendeeEmail(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors ${
                    errors.email ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Input */}
            <div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  placeholder="Phone Number (SMS updates)"
                  value={attendeePhone}
                  onChange={(e) => setAttendeePhone(e.target.value)}
                  className={`w-full bg-slate-950 border rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 transition-colors ${
                    errors.phone ? 'border-rose-500' : 'border-slate-800'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>{quantity}x {ticketTier} Pass ({formatCurrency(unitPrice)} ea)</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Processing Fee</span>
              <span className="font-mono">{formatCurrency(serviceFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-white">
              <span>Total Payable</span>
              <span className="font-mono text-cyan-400">{formatCurrency(totalPrice)}</span>
            </div>
          </div>

        </form>

        {/* Fixed Sticky Footer - Always Visible Submit Button */}
        <div className="shrink-0 px-5 py-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm">
          <button
            type="submit"
            form="booking-form"
            disabled={isProcessing}
            className="btn-primary w-full py-3 text-sm justify-center shadow-lg"
            style={{ minHeight: '48px' }}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing Booking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                Confirm &amp; Generate Digital Ticket
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
