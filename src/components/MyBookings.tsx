import React, { useState } from 'react';
import { Ticket, Calendar, MapPin, User, AlertCircle, Trash2, Eye, ExternalLink } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { formatCurrency } from '../utils/formatters';

export const MyBookings: React.FC = () => {
  const { bookings, cancelBooking, openTicketPass, setActiveTab } = useEventContext();
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'confirmed') return b.status === 'confirmed';
    if (statusFilter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleCancel = (bookingId: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to cancel your booking for "${eventTitle}"? This will restore seats to the inventory.`)) {
      setCancellingId(bookingId);
      setTimeout(() => {
        cancelBooking(bookingId);
        setCancellingId(null);
      }, 400);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-bold text-white">My Reserved Passes</h2>
            <span className="bg-violet-500/20 text-violet-300 font-mono text-xs px-2.5 py-0.5 rounded-full font-bold border border-violet-500/30">
              {bookings.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your digital event tickets, view scannable pass QR codes, or process cancellations.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-violet-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Passes ({bookings.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Confirmed ({bookings.filter((b) => b.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cancelled ({bookings.filter((b) => b.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="glass-panel text-center p-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="font-heading text-lg font-bold text-white">No Tickets Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {statusFilter === 'all'
              ? "You haven't booked any event tickets yet. Explore upcoming workshops & conferences!"
              : `No ${statusFilter} bookings found matching your filter.`}
          </p>
          <button
            onClick={() => setActiveTab('events')}
            className="btn-primary text-xs py-2.5 px-5"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => {
            const isConfirmed = booking.status === 'confirmed';

            return (
              <div
                key={booking.id}
                className={`glass-panel p-5 flex flex-col justify-between border transition-all ${
                  isConfirmed ? 'border-slate-800 hover:border-violet-500/40' : 'border-rose-900/30 opacity-70'
                }`}
              >
                <div>
                  {/* Status & Ref Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-slate-400 font-bold">#{booking.id}</span>
                    <span
                      className={`badge text-[10px] ${
                        isConfirmed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Event Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src={booking.eventImage}
                      alt={booking.eventTitle}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm line-clamp-2 leading-tight">
                        {booking.eventTitle}
                      </h4>
                      <p className="text-xs text-violet-300 font-semibold mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {booking.eventDate}
                      </p>
                    </div>
                  </div>

                  {/* Location & Ticket Summary */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{booking.eventLocation}</span>
                    </div>

                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>Attendee: <strong className="text-slate-200">{booking.attendeeName}</strong></span>
                      <span>Tier: <strong className="text-cyan-400">{booking.ticketTier} ({booking.quantity}x)</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Paid</span>
                    <span className="font-mono text-sm font-bold text-white">{formatCurrency(booking.totalPrice)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isConfirmed && (
                      <>
                        <button
                          onClick={() => handleCancel(booking.id, booking.eventTitle)}
                          disabled={cancellingId === booking.id}
                          className="btn-danger text-xs p-2"
                          title="Cancel Booking & Refund Seats"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openTicketPass(booking)}
                          className="btn-primary text-xs py-2 px-3"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Pass
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
