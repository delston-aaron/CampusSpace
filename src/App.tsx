import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ThreeCampusMap } from './components/ThreeCampusMap';
import { VenueCard } from './components/VenueCard';
import { CalendarTimeline } from './components/CalendarTimeline';
import { AdminMonitor } from './components/AdminMonitor';
import { BookingFormModal } from './components/BookingFormModal';
import { VenueDetailDrawer } from './components/VenueDetailDrawer';
import { SsoModal } from './components/SsoModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { PushNotificationToast } from './components/PushNotificationToast';
import { Venue, VenueCategory } from './types';
import { HERO_IMAGE } from './data/mockCampusData';
import { 
  Sparkles, 
  Search, 
  Plus, 
  MapPin, 
  Calendar as CalendarIcon, 
  ShieldCheck, 
  Compass, 
  Activity,
  ArrowRight,
  Layers
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    venues, 
    selectedVenue, 
    setSelectedVenue, 
    activeView, 
    setActiveView, 
    selectedCategory, 
    setSelectedCategory,
    searchQuery, 
    setSearchQuery,
    isSsoOpen,
    setIsSsoOpen,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    isBookingModalOpen,
    setIsBookingModalOpen,
    prefilledBookingSlot,
    setPrefilledBookingSlot,
    currentUser,
    bookings,
    queueRequests
  } = useApp();

  const [detailModalVenue, setDetailModalVenue] = useState<Venue | null>(null);

  // Filter venues by category & search query
  const filteredVenues = venues.filter(v => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.equipment.some(eq => eq.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleOpenBooking = (slot?: { date: string; startTime: string; endTime: string; venueId?: string }) => {
    if (slot) {
      setPrefilledBookingSlot({
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      });
      if (slot.venueId) {
        const found = venues.find(v => v.id === slot.venueId);
        if (found) setSelectedVenue(found);
      }
    } else {
      setPrefilledBookingSlot(null);
    }
    setIsBookingModalOpen(true);
  };

  const handleSelectVenueFrom3D = (venue: Venue) => {
    setDetailModalVenue(venue);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenSso={() => setIsSsoOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Main View Container */}
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Editorial Hero Banner with Cinematic Campus Photography */}
        {activeView !== 'admin' && (
          <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            {/* Background Aerial Photo with Measured Scrim */}
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_IMAGE}
                alt="NMAM Institute of Technology Campus"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center brightness-75 scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40" />
            </div>

            {/* Hero Copy */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-5">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>NMAMIT · Nitte Deemed to be University</span>
                <span className="text-slate-500">/</span>
                <span>Campus Estate Hub</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Fluid Spatial Booking & Fair Priority Access.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Explore campus auditoriums and computing labs across an interactive 3D spatial sphere.
                Shared calendar concurrency locks prevent duplicate reservations while automated priority queues guarantee fair access for students and faculty.
              </p>

              {/* Unboxed Metadata Metrics */}
              <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap pt-2">
                <div>
                  <span className="font-mono text-base font-bold text-white tabular-nums">8</span>
                  <span className="text-slate-400 ml-1.5">Campus Venues</span>
                </div>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <div>
                  <span className="font-mono text-base font-bold text-white tabular-nums">2,400+</span>
                  <span className="text-slate-400 ml-1.5">Seat Capacity</span>
                </div>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <div>
                  <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">0</span>
                  <span className="text-slate-400 ml-1.5">Scheduling Collisions</span>
                </div>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <div>
                  <span className="font-mono text-base font-bold text-amber-400 tabular-nums">{queueRequests.filter(q => q.status === 'queued').length}</span>
                  <span className="text-slate-400 ml-1.5">Active Queue</span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-400/10 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Reserve a Space</span>
                </button>
                <button
                  onClick={() => setActiveView('calendar')}
                  className="px-4 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs rounded-xl backdrop-blur-md transition-colors flex items-center gap-1.5"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Full Schedule</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* View Switcher: 3D Campus Map vs Shared Calendar vs Admin */}
        {activeView === 'calendar' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Campus Shared Calendar Timeline</h2>
                <p className="text-xs text-slate-400">Continuous timeline of scheduled events across all facilities</p>
              </div>
              <button
                onClick={() => setActiveView('sphere')}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Back to 3D Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <CalendarTimeline onOpenBookingModal={handleOpenBooking} />
          </section>
        ) : activeView === 'admin' ? (
          <section>
            <AdminMonitor />
          </section>
        ) : (
          /* Default: 3D Spatial Map & Venues Showcase */
          <div className="space-y-10">
            {/* 3D Model Sphere Map Section */}
            <section className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    <span>3D Campus Spatial Globe & Venue Topography</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Scroll, drag, or tap any location node to view live availability, equipment specs, and shared schedule.
                  </p>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Coordinates: 13.1825° N, 74.9332° E (Nitte)
                </div>
              </div>

              {/* 3D Canvas Map */}
              <ThreeCampusMap onSelectVenue={handleSelectVenueFrom3D} />
            </section>

            {/* Search & Category Filter Section */}
            <section className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Segmented Filter Control */}
                <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto scrollbar-none">
                  {(['all', 'auditorium', 'seminar_hall', 'computing_lab', 'makerspace'] as const).map(cat => {
                    const label = cat === 'all' 
                      ? 'All Campus Hubs' 
                      : cat === 'auditorium' 
                      ? 'Auditoriums' 
                      : cat === 'seminar_hall' 
                      ? 'Seminar Halls' 
                      : cat === 'computing_lab' 
                      ? 'AI & Computing Labs' 
                      : 'Makerspace / FabLab';

                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          selectedCategory === cat
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by hall, equipment, block..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Venues Showcase Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map(venue => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onSelect={v => setDetailModalVenue(v)}
                    onDirectBook={v => handleOpenBooking({ date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '16:00', venueId: v.id })}
                  />
                ))}
              </div>

              {filteredVenues.length === 0 && (
                <div className="py-16 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No venues found matching "{searchQuery}". Try selecting another category.
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-semibold text-slate-300">
              NMAM Institute of Technology (Nitte Deemed to be University)
            </span>
            <p className="text-slate-500 text-[11px]">
              Karkala Taluk, Udupi District, Karnataka, India · PIN: 574110
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Estate & Infrastructure Directorate</span>
            <span aria-hidden="true">·</span>
            <span>NBA & NAAC A+ Accredited Campus</span>
          </div>
        </div>
      </footer>

      {/* Floating Push Notification Toast */}
      <PushNotificationToast />

      {/* Slide-over / Modal Drawers */}
      <VenueDetailDrawer
        venue={detailModalVenue}
        onClose={() => setDetailModalVenue(null)}
        onOpenBookingModal={handleOpenBooking}
      />

      <BookingFormModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        preselectedVenue={selectedVenue}
        initialSlot={prefilledBookingSlot}
      />

      <SsoModal
        isOpen={isSsoOpen}
        onClose={() => setIsSsoOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
