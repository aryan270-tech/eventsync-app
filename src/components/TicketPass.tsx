import React from 'react';
import { X, QrCode, Download, Printer, CheckCircle2, MapPin, Calendar, User, Ticket, Sparkles } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { formatCurrency } from '../utils/formatters';

export const TicketPass: React.FC = () => {
  const { activeTicketPass, closeTicketPass, setActiveTab } = useEventContext();

  if (!activeTicketPass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={closeTicketPass}>
      <div
        className="glass-panel max-w-xl w-full animate-modal relative p-0 overflow-hidden border border-violet-500/40 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header Banner */}
        <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-400/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-white tracking-wide">Digital Event Pass</span>
                <p className="text-[11px] text-violet-300">Verified Admission Passport</p>
              </div>
            </div>

            <button
              onClick={closeTicketPass}
              className="text-violet-300 hover:text-white p-1 rounded-full bg-slate-950/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-xs text-cyan-300 bg-slate-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              Ref: #{activeTicketPass.id}
            </span>
            <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-3 h-3" /> Confirmed
            </span>
          </div>
        </div>

        {/* Ticket Body Card */}
        <div className="p-6 space-y-6 bg-slate-950/90" id="printable-ticket">
          {/* Main Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Event & Attendee Details (Left 2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Event Name</span>
                <h3 className="font-heading font-bold text-lg text-white leading-tight">
                  {activeTicketPass.eventTitle}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Date & Time</span>
                  <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    {activeTicketPass.eventDate}
                  </span>
                  <span className="text-[11px] text-slate-400 block">{activeTicketPass.eventTime}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Attendee</span>
                  <span className="text-slate-200 font-medium flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    {activeTicketPass.attendeeName}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">{activeTicketPass.attendeeEmail}</span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Venue / Link</span>
                <span className="text-slate-300 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  {activeTicketPass.eventLocation}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Ticket Tier</span>
                  <span className={`badge mt-0.5 ${
                    activeTicketPass.ticketTier === 'VIP'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                      : 'bg-violet-950 text-violet-300 border border-violet-500/40'
                  }`}>
                    {activeTicketPass.ticketTier} ({activeTicketPass.quantity} Seat{activeTicketPass.quantity > 1 ? 's' : ''})
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Paid Total</span>
                  <span className="font-mono text-sm font-bold text-white">
                    {formatCurrency(activeTicketPass.totalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Column (Right 1 col) */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
              <div className="bg-white p-2.5 rounded-lg shadow-md mb-2">
                <img
                  src={activeTicketPass.qrCodeData}
                  alt="Booking QR Code"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Scan at Entrance
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                closeTicketPass();
                setActiveTab('my-bookings');
              }}
              className="btn-secondary text-xs"
            >
              <Ticket className="w-3.5 h-3.5" />
              View All My Bookings
            </button>

            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="btn-primary text-xs py-2 px-4">
                <Printer className="w-3.5 h-3.5" />
                Print / Save Pass
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
