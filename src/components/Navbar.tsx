import React from 'react';
import { Ticket, Calendar, LayoutDashboard, Search, PlusCircle, Sparkles } from 'lucide-react';
import { useEventContext } from '../context/EventContext';
import { EventCategory } from '../types/event';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, bookings, filter, setFilter, events } = useEventContext();

  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const categories: (EventCategory | 'All')[] = [
    'All',
    'Tech & AI',
    'Design & UX',
    'Business',
    'Workshops',
    'Music & Art'
  ];

  return (
    <header className="glass-nav sticky top-0 z-50 px-4 lg:px-8 py-3.5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div 
            onClick={() => setActiveTab('events')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white transform -rotate-12" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">Event<span className="gradient-text">Sync</span></span>
                <span className="text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1.5 py-0.5 rounded font-mono font-semibold">PRO</span>
              </div>
              <p className="text-xs text-slate-400">Reserve & Manage Event Passports</p>
            </div>
          </div>

          {/* Mobile Booking Counter */}
          <button 
            onClick={() => setActiveTab('my-bookings')}
            className="md:hidden flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/30 px-3 py-1.5 rounded-lg text-xs text-violet-300 font-semibold"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Passes ({activeBookingsCount})</span>
          </button>
        </div>

        {/* Search Bar (Only visible when on Events Tab) */}
        {activeTab === 'events' && (
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, category, speaker..."
              value={filter.searchQuery}
              onChange={(e) => setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 bg-slate-900/60 border border-slate-800 p-1.5 rounded-xl w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Explore Events</span>
          </button>

          <button
            onClick={() => setActiveTab('my-bookings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all relative ${
              activeTab === 'my-bookings'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings</span>
            {activeBookingsCount > 0 && (
              <span className="bg-cyan-500 text-slate-950 font-extrabold text-[11px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {activeBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('organizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'organizer'
                ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Organizer Studio</span>
          </button>
        </nav>

      </div>

      {/* Category Pills (Visible on Events Tab) */}
      {activeTab === 'events' && (
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter((prev) => ({ ...prev, category: cat }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border ${
                filter.category === cat
                  ? 'bg-violet-500/20 border-violet-500 text-violet-300 font-semibold'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
