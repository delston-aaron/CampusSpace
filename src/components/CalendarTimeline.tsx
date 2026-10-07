import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Venue, Booking } from '../types';
import { Calendar as CalendarIcon, Clock, Users, ShieldAlert, Plus, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarTimelineProps {
  venueFilter?: Venue | null;
  onOpenBookingModal?: (slot?: { date: string; startTime: string; endTime: string; venueId?: string }) => void;
}

export const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ venueFilter, onOpenBookingModal }) => {
  const { venues, bookings, queueRequests, currentUser, cancelBooking } = useApp();

  // Date offsets from today
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);
  const [activeVenueId, setActiveVenueId] = useState<string>(venueFilter ? venueFilter.id : venues[0]?.id || '');

  // Keep in sync if venueFilter prop changes
  React.useEffect(() => {
    if (venueFilter) {
      setActiveVenueId(venueFilter.id);
    }
  }, [venueFilter]);

  // Generate date list (next 7 days)
  const daysList = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return { offset: i, dateStr, dayName, dayNumber, monthName };
  });

  const currentDateObj = daysList[selectedDayOffset] || daysList[0];
  const targetVenue = venues.find(v => v.id === activeVenueId) || venues[0];

  // Time slots from 08:00 to 19:00 (1 hour increments)
  const timeSlots = [
    { start: '08:00', end: '09:00', label: '08:00 AM' },
    { start: '09:00', end: '10:00', label: '09:00 AM' },
    { start: '10:00', end: '11:00', label: '10:00 AM' },
    { start: '11:00', end: '12:00', label: '11:00 AM' },
    { start: '12:00', end: '13:00', label: '12:00 PM' },
    { start: '13:00', end: '14:00', label: '01:00 PM' },
    { start: '14:00', end: '15:00', label: '02:00 PM' },
    { start: '15:00', end: '16:00', label: '03:00 PM' },
    { start: '16:00', end: '17:00', label: '04:00 PM' },
    { start: '17:00', end: '18:00', label: '05:00 PM' },
    { start: '18:00', end: '19:00', label: '06:00 PM' },
    { start: '19:00', end: '20:00', label: '07:00 PM' }
  ];

  // Bookings for current venue & selected date
  const currentVenueBookings = bookings.filter(
    b => b.venueId === targetVenue?.id && b.date === currentDateObj.dateStr && b.status === 'confirmed'
  );

  // Queued requests for current venue & selected date
  const currentVenueQueues = queueRequests.filter(
    q => q.venueId === targetVenue?.id && q.date === currentDateObj.dateStr && q.status === 'queued'
  );

  // Helper to check if a timeslot overlaps with any booking
  const getBookingForSlot = (slotStart: string, slotEnd: string): Booking | undefined => {
    const sStart = toMinutes(slotStart);
    const sEnd = toMinutes(slotEnd);

    return currentVenueBookings.find(b => {
      const bStart = toMinutes(b.startTime);
      const bEnd = toMinutes(b.endTime);
      return sStart < bEnd && sEnd > bStart;
    });
  };

  const toMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const handleBookSlotClick = (slot: { start: string; end: string }) => {
    if (onOpenBookingModal) {
      onOpenBookingModal({
        date: currentDateObj.dateStr,
        startTime: slot.start,
        endTime: slot.end,
        venueId: targetVenue.id
      });
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
      {/* Calendar Header with Venue Selector & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Shared Collision-Free Schedule</span>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{targetVenue?.name}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">({targetVenue?.code})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {targetVenue?.block} · Max Capacity: <span className="font-mono tabular-nums text-slate-200">{targetVenue?.capacity}</span> seats
          </p>
        </div>

        {/* Venue Selector (if not locked to a specific venue) */}
        {!venueFilter && (
          <div className="flex items-center gap-2">
            <select
              value={activeVenueId}
              onChange={e => setActiveVenueId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
            >
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.capacity} seats)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Date Tabs (Next 7 Days) */}
      <div className="py-4 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none border-b border-slate-800/80">
        <button
          onClick={() => setSelectedDayOffset(Math.max(0, selectedDayOffset - 1))}
          disabled={selectedDayOffset === 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 grow justify-start sm:justify-center">
          {daysList.map(item => {
            const isSelected = selectedDayOffset === item.offset;
            const isToday = item.offset === 0;

            return (
              <button
                key={item.offset}
                onClick={() => setSelectedDayOffset(item.offset)}
                className={`px-3 py-2 rounded-xl text-center transition-all flex flex-col items-center min-w-[68px] ${
                  isSelected
                    ? 'bg-amber-500/20 border border-amber-500/60 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-[10px] font-medium uppercase tracking-wider">
                  {isToday ? 'Today' : item.dayName}
                </span>
                <span className="text-base font-bold font-mono tabular-nums leading-tight mt-0.5">
                  {item.dayNumber}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  {item.monthName}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSelectedDayOffset(Math.min(6, selectedDayOffset + 1))}
          disabled={selectedDayOffset === 6}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Hourly Slots */}
      <div className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Operating Hours (08:00 AM – 08:00 PM)</span>
          <span>Date: <span className="font-mono text-slate-200">{currentDateObj.dateStr}</span></span>
        </div>

        {timeSlots.map(slot => {
          const booking = getBookingForSlot(slot.start, slot.end);
          const isOccupied = !!booking;
          const isSlotContested = currentVenueQueues.some(q => {
            const qStart = toMinutes(q.startTime);
            const qEnd = toMinutes(q.endTime);
            const sStart = toMinutes(slot.start);
            const sEnd = toMinutes(slot.end);
            return sStart < qEnd && sEnd > qStart;
          });

          const isUserBooking = booking && booking.organizerId === currentUser.id;

          return (
            <div
              key={slot.start}
              className={`group p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isOccupied
                  ? isUserBooking
                    ? 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                    : 'bg-slate-850/80 border-slate-800/80'
                  : 'bg-slate-900/40 hover:bg-slate-850 border-dashed border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Left Column: Time & Status */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-20 text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{slot.label}</span>
                </div>

                <div className="hidden sm:block w-px h-6 bg-slate-800" />

                {/* State Tag */}
                {isOccupied ? (
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Reserved</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Free Slot</span>
                  </div>
                )}
              </div>

              {/* Middle Column: Event Details or Vacant CTA */}
              <div className="grow min-w-0">
                {isOccupied && booking ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-white truncate max-w-md">
                        {booking.eventName}
                      </h4>
                      {isUserBooking && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Your Event
                        </span>
                      )}
                    </div>
                    
                    {/* Unboxed metadata row with typographic separators */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span>{booking.organizerName} ({booking.organizerDept})</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{booking.startTime} - {booking.endTime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{booking.attendeesCount} pax</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">Priority: {booking.priorityScore}</span>
                    </div>

                    {isSlotContested && (
                      <div className="flex items-center gap-1.5 text-[11px] text-pink-400 font-medium pt-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Contested by waitlisted delegation (Priority queue active)</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Available for reservation. No conflicts detected on this coordinate.
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="shrink-0 flex items-center gap-2 justify-end">
                {isOccupied && booking ? (
                  isUserBooking || currentUser.role === 'admin' ? (
                    <button
                      onClick={() => cancelBooking(booking.id)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/40 rounded-lg transition-colors whitespace-nowrap"
                    >
                      {currentUser.role === 'admin' ? 'Release / Override' : 'Cancel Booking'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookSlotClick(slot)}
                      className="px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Contest / Queue</span>
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handleBookSlotClick(slot)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Book Slot</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Real-time concurrency lock active: double bookings are mathematically prohibited.</span>
        </div>
        <div className="font-mono text-slate-400">
          NMAMIT Campus Server Synced
        </div>
      </div>
    </div>
  );
};
