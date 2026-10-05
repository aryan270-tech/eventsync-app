import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle, DollarSign, Users, Ticket, Calendar, TrendingUp, Power, X, Layers } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { EventCategory } from '../types/event';
import { formatCurrency } from '../utils/formatters';

export const OrganizerDashboard: React.FC = () => {
  const { events, bookings, createEvent, toggleEventStatus } = useEventContext();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Tech & AI');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [priceGeneral, setPriceGeneral] = useState<number>(49);
  const [priceVIP, setPriceVIP] = useState<number>(129);
  const [totalSeats, setTotalSeats] = useState<number>(100);
  const [organizer, setOrganizer] = useState('');
  const [speakerName, setSpeakerName] = useState('');
  const [speakerRole, setSpeakerRole] = useState('');
  const [agendaText, setAgendaText] = useState('');

  // Analytics Calculations
  const totalEventsCount = events.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalBookingsCount = confirmedBookings.reduce((sum, b) => sum + b.quantity, 0);
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const totalCapacity = events.reduce((sum, e) => sum + e.totalSeats, 0);
  const totalReserved = events.reduce((sum, e) => sum + (e.totalSeats - e.availableSeats), 0);
  const overallOccupancy = totalCapacity > 0 ? Math.round((totalReserved / totalCapacity) * 100) : 0;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time || !location) {
      alert('Please fill in all required fields (Title, Date, Time, Location).');
      return;
    }

    createEvent({
      title,
      category,
      description: description || 'Exciting new event hosted on EventSync.',
      longDescription: longDescription || description,
      date,
      time,
      location,
      isOnline,
      priceGeneral: Number(priceGeneral),
      priceVIP: Number(priceVIP),
      totalSeats: Number(totalSeats),
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
      organizer: organizer || 'Verified Host',
      speakerName: speakerName || 'Keynote Speaker',
      speakerRole: speakerRole || 'Industry Specialist',
      agendaText
    });

    setShowCreateModal(false);
    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-2xl font-bold text-white">Organizer Command Studio</h2>
            <span className="badge bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">Real-Time Metrics</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track revenue streams, seats occupied across active events, or publish new conferences.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-xs py-2.5 px-5"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Total Ticket Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-white my-2">
            {formatCurrency(totalRevenue)}
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Gross ticket sales across confirmed passes
          </p>
        </div>

        {/* Total Seats Reserved */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Reserved Seats</span>
            <div className="w-9 h-9 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-white my-2">
            {totalBookingsCount} <span className="text-xs font-normal text-slate-400">/ {totalCapacity}</span>
          </div>
          <p className="text-[11px] text-slate-400">Total confirmed tickets sold</p>
        </div>

        {/* Occupancy Rate */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Avg Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-white my-2">
            {overallOccupancy}%
          </div>
          <p className="text-[11px] text-slate-400">Average venue capacity filled</p>
        </div>

        {/* Active Events */}
        <div className="glass-panel p-5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-slate-400">Published Events</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading font-extrabold text-2xl text-white my-2">
            {totalEventsCount}
          </div>
          <p className="text-[11px] text-slate-400">Managed in catalog</p>
        </div>

      </div>

      {/* Published Events Management Table / List */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <h3 className="font-heading font-bold text-lg text-white">Event Inventory & Status Manager</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing</th>
                <th className="py-3 px-4">Seats Reserved</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {events.map((evt) => {
                const reserved = evt.totalSeats - evt.availableSeats;
                const occ = Math.round((reserved / evt.totalSeats) * 100);

                return (
                  <tr key={evt.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.image}
                          alt={evt.title}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block truncate max-w-xs">{evt.title}</span>
                          <span className="text-[11px] text-slate-400">{evt.date} • {evt.location}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-300">{evt.category}</td>

                    <td className="py-3.5 px-4 font-mono">
                      {formatCurrency(evt.priceGeneral)} <span className="text-slate-500">/ {formatCurrency(evt.priceVIP)}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-mono">{reserved}/{evt.totalSeats}</span>
                          <span className="text-slate-400 font-bold">{occ}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${occ}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`badge text-[10px] ${
                          evt.status === 'active'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : evt.status === 'sold_out'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                            : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {evt.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleEventStatus(evt.id)}
                        className={`btn-secondary text-[11px] py-1 px-2.5 ${
                          evt.status === 'active' ? 'hover:border-rose-500 hover:text-rose-300' : 'hover:border-emerald-500 hover:text-emerald-300'
                        }`}
                        title="Toggle Event Pause / Active Status"
                      >
                        <Power className="w-3 h-3" />
                        <span>{evt.status === 'active' ? 'Pause' : 'Activate'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Publish New Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div
            className="glass-panel max-w-xl w-full max-h-[90vh] overflow-y-auto animate-modal relative p-6 border border-slate-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-violet-400" />
                Publish New Event / Workshop
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autonomous AI Hackathon 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  >
                    <option value="Tech & AI">Tech & AI</option>
                    <option value="Design & UX">Design & UX</option>
                    <option value="Business">Business</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Music & Art">Music & Art</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Organizer</label>
                  <input
                    type="text"
                    placeholder="e.g. TechLabs Global"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dec 12, 2026"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3:00 PM IST"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Location / Online Link *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Convention Center, Hall B / Zoom Link"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">General Price ($)</label>
                  <input
                    type="number"
                    value={priceGeneral}
                    onChange={(e) => setPriceGeneral(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">VIP Price ($)</label>
                  <input
                    type="number"
                    value={priceVIP}
                    onChange={(e) => setPriceVIP(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Total Seats</label>
                  <input
                    type="number"
                    value={totalSeats}
                    onChange={(e) => setTotalSeats(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Keynote Speaker Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Sarah Connor"
                    value={speakerName}
                    onChange={(e) => setSpeakerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Speaker Role / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. VP of Engineering"
                    value={speakerRole}
                    onChange={(e) => setSpeakerRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description for event card..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Agenda Items (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="10:00 AM — Keynote Speech&#10;11:30 AM — Interactive Workshop"
                  value={agendaText}
                  onChange={(e) => setAgendaText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-violet-500 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs py-2 px-5">
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
