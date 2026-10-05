import React from 'react';
import { EventProvider, useEventContext } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { BookingModal } from './components/BookingModal';
import { TicketPass } from './components/TicketPass';
import { MyBookings } from './components/MyBookings';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { Toast } from './components/Toast';
import { Calendar, Search, Sparkles, Filter, Ticket } from 'lucide-react';

const MainContent: React.FC = () => {
  const { events, filter, setFilter, activeTab } = useEventContext();

  // Filter events based on search query, category, and status
  const filteredEvents = events.filter((evt) => {
    // Search Filter
    const matchesSearch =
      filter.searchQuery === '' ||
      evt.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      evt.organizer.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
      evt.speaker.name.toLowerCase().includes(filter.searchQuery.toLowerCase());

    // Category Filter
    const matchesCategory = filter.category === 'All' || evt.category === filter.category;

    // Status Filter
    let matchesStatus = true;
    if (filter.statusFilter === 'Available') {
      matchesStatus = evt.availableSeats > 0 && evt.status === 'active';
    } else if (filter.statusFilter === 'Sold Out') {
      matchesStatus = evt.availableSeats === 0 || evt.status === 'sold_out';
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalSeatsAvailable = events.reduce((sum, e) => sum + e.availableSeats, 0);

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      <div>
        <Navbar />

        {/* Tab 1: Explore Events View */}
        {activeTab === 'events' && (
          <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 space-y-6 animate-fade-in">
            
            {/* Hero Spotlight Banner */}
            <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden glass-panel border border-violet-500/30 bg-gradient-to-r from-violet-950/80 via-slate-900/90 to-cyan-950/80 shadow-2xl">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 bg-violet-500/20 text-violet-300 border border-violet-500/40 px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Real-Time Ticket Reservation Engine</span>
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Discover & Reserve <br />
                  <span className="gradient-text">World-Class Tech Summits</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Explore curated developer conferences, design workshops, and business masterclasses. Reserve seats in real-time and generate verified scannable digital passes.
                </p>

                {/* Interactive Hero Quick Filters */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
                  <button
                    onClick={() =>
                      setFilter({
                        searchQuery: '',
                        category: 'All',
                        statusFilter: 'All'
                      })
                    }
                    className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all hover:scale-105 cursor-pointer shadow-md"
                    title="Click to view all live events"
                  >
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span>{events.length} Events Live</span>
                  </button>

                  <button
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        statusFilter: 'Available'
                      }))
                    }
                    className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700/80 transition-all hover:scale-105 cursor-pointer shadow-md"
                    title="Click to filter open seats"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{totalSeatsAvailable} Seats Open</span>
                  </button>
                </div>
              </div>

              {/* Decorative Glow Orb */}
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
            </div>

            {/* Event Cards Grid Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div>
                <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <span>Upcoming Events & Masterclasses</span>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-md">
                    {filteredEvents.length} Shown
                  </span>
                </h2>
                <p className="text-xs text-slate-400">Select an event below to inspect details or reserve your seat pass</p>
              </div>

              {/* Status Filter Toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-semibold flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Availability:
                </span>
                <select
                  value={filter.statusFilter}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      statusFilter: e.target.value as any
                    }))
                  }
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer"
                >
                  <option value="All">All Seats</option>
                  <option value="Available">Seats Available</option>
                  <option value="Sold Out">Sold Out Only</option>
                </select>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="glass-panel p-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white">No Matching Events Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try adjusting your search query or switching categories to see available masterclasses.
                </p>
                <button
                  onClick={() =>
                    setFilter({
                      searchQuery: '',
                      category: 'All',
                      statusFilter: 'All'
                    })
                  }
                  className="btn-secondary text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => (
                  <EventCard key={evt.id} event={evt} />
                ))}
              </div>
            )}
          </main>
        )}

        {/* Tab 2: My Bookings View */}
        {activeTab === 'my-bookings' && <MyBookings />}

        {/* Tab 3: Organizer Dashboard */}
        {activeTab === 'organizer' && <OrganizerDashboard />}
      </div>

      {/* Global Modals & Toast Alerts */}
      <EventDetailModal />
      <BookingModal />
      <TicketPass />
      <Toast />

      {/* Production Product Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-12 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-300">EventSync v1.0</span>
            <span>•</span>
            <span>Real-Time Ticket Reservation & Management Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>© 2026 EventSync Inc.</span>
            <span>•</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <EventProvider>
      <MainContent />
    </EventProvider>
  );
};

export default App;
