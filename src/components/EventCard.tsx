import React from 'react';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Video } from 'lucide-react';
import { EventItem } from '../types/event';
import { useEventContext } from '../context/EventContext';
import { formatCurrency, getCategoryStyles } from '../utils/formatters';

interface EventCardProps {
  event: EventItem;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { openEventDetail, openBookingModal } = useEventContext();
  const categoryStyle = getCategoryStyles(event.category);

  const isSoldOut = event.status === 'sold_out' || event.availableSeats === 0;
  const isLowStock = !isSoldOut && event.availableSeats <= 10;
  const occupancyPercentage = Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100);

  return (
    <div className="glass-panel group flex flex-col h-full overflow-hidden border border-slate-800 hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/20 hover:-translate-y-1">
      
      {/* Cover Image & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span
            className="badge backdrop-blur-md"
            style={{
              backgroundColor: categoryStyle.bg,
              color: categoryStyle.text,
              borderColor: categoryStyle.border,
              borderWidth: '1px'
            }}
          >
            {event.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          {isSoldOut ? (
            <span className="badge bg-rose-950/80 text-rose-300 border border-rose-500/40">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="badge bg-amber-950/80 text-amber-300 border border-amber-500/40 animate-pulse">
              Only {event.availableSeats} Left!
            </span>
          ) : (
            <span className="badge bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              Active
            </span>
          )}
        </div>

        {/* Location Tag */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-medium truncate max-w-[70%]">
            {event.isOnline ? (
              <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            )}
            <span className="truncate">{event.location}</span>
          </div>
          <span className="text-[11px] bg-slate-900/80 px-2 py-0.5 rounded text-slate-400 font-mono">
            {event.organizer}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date} • {event.time}</span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-white group-hover:text-violet-200 transition-colors line-clamp-2 leading-snug mb-2">
            {event.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>
        </div>

        <div>
          {/* Seat Availability Bar */}
          <div className="mb-4 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-500" /> Seats Reserved
              </span>
              <span className="font-mono text-slate-300 font-semibold">
                {event.totalSeats - event.availableSeats} / {event.totalSeats} ({occupancyPercentage}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  occupancyPercentage > 85
                    ? 'bg-rose-500'
                    : occupancyPercentage > 60
                    ? 'bg-amber-500'
                    : 'bg-gradient-to-r from-violet-500 to-cyan-500'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          {/* Pricing & Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">From</span>
              <span className="font-heading font-extrabold text-xl text-white">
                {formatCurrency(event.priceGeneral)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => openEventDetail(event)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Details
              </button>
              
              <button
                disabled={isSoldOut}
                onClick={() => openBookingModal(event)}
                className="btn-primary text-xs py-2 px-3.5"
              >
                <span>{isSoldOut ? 'Sold Out' : 'Book Ticket'}</span>
                {!isSoldOut && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
