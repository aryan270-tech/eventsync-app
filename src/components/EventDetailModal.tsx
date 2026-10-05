import React from 'react';
import { X, Calendar, MapPin, Users, Ticket, Check, ShieldCheck, UserCheck } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { formatCurrency, getCategoryStyles } from '../utils/formatters';

export const EventDetailModal: React.FC = () => {
  const { selectedEvent, closeEventDetail, openBookingModal } = useEventContext();

  if (!selectedEvent) return null;

  const categoryStyle = getCategoryStyles(selectedEvent.category);
  const isSoldOut = selectedEvent.status === 'sold_out' || selectedEvent.availableSeats === 0;

  return (
    <div className="modal-overlay" onClick={closeEventDetail}>
      <div
        className="glass-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal relative p-0 overflow-hidden border border-slate-700/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image */}
        <div className="relative h-64 w-full">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={closeEventDetail}
            className="absolute top-4 right-4 bg-slate-950/80 text-slate-300 hover:text-white p-2 rounded-full border border-slate-700/80 backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badges */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <span
              className="badge text-xs"
              style={{
                backgroundColor: categoryStyle.bg,
                color: categoryStyle.text,
                borderColor: categoryStyle.border,
                borderWidth: '1px'
              }}
            >
              {selectedEvent.category}
            </span>
            <span className="text-xs bg-slate-900/90 text-violet-300 px-3 py-1 rounded-full font-mono border border-slate-700">
              Host: {selectedEvent.organizer}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">
              {selectedEvent.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 text-violet-300 font-semibold">
                <Calendar className="w-4 h-4" />
                {selectedEvent.date} ({selectedEvent.time})
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {selectedEvent.location}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Users className="w-4 h-4" />
                {selectedEvent.availableSeats} Seats Remaining
              </span>
            </div>
          </div>

          {/* Long Description */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-2">About The Event</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-xl border border-slate-800">
              {selectedEvent.longDescription}
            </p>
          </div>

          {/* Speaker Info */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">Featured Keynote Speaker</h4>
            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <img
                src={selectedEvent.speaker.avatar}
                alt={selectedEvent.speaker.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-violet-500/40 shadow-lg"
              />
              <div>
                <h5 className="font-heading font-bold text-white text-base flex items-center gap-1.5">
                  {selectedEvent.speaker.name}
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                </h5>
                <p className="text-xs text-slate-400">{selectedEvent.speaker.role}</p>
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">Event Schedule & Agenda</h4>
            <div className="space-y-2">
              {selectedEvent.agenda.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs text-slate-300 bg-slate-900/30 p-2.5 rounded-lg border border-slate-800/60">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Ticket Options Comparison */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-3">Ticket Pass Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">General Access</span>
                  <div className="font-heading font-extrabold text-2xl text-white my-1">
                    {formatCurrency(selectedEvent.priceGeneral)}
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1.5 mt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Standard Event Seat
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Digital Ticket Pass
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-violet-950/20 p-4 rounded-xl border border-violet-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-violet-300 uppercase">VIP VIP Pass</span>
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded font-bold">PERKS</span>
                  </div>
                  <div className="font-heading font-extrabold text-2xl text-white my-1">
                    {formatCurrency(selectedEvent.priceVIP)}
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1.5 mt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400" /> Priority Front-Row Access
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-cyan-400" /> Speaker Networking Session
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Capacity</span>
              <span className="font-mono text-sm text-slate-200 font-bold">
                {selectedEvent.availableSeats} of {selectedEvent.totalSeats} seats open
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={closeEventDetail} className="btn-secondary text-xs">
                Close
              </button>
              <button
                disabled={isSoldOut}
                onClick={() => openBookingModal(selectedEvent)}
                className="btn-primary text-sm px-6"
              >
                <Ticket className="w-4 h-4" />
                <span>{isSoldOut ? 'Sold Out' : 'Proceed to Booking'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
