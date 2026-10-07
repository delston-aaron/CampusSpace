import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Venue } from '../types';
import { X, Calendar, Clock, Users, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedVenue?: Venue | null;
  initialSlot?: { date: string; startTime: string; endTime: string } | null;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  preselectedVenue,
  initialSlot
}) => {
  const { venues, currentUser, createBookingOrQueue, checkSlotConflict } = useApp();

  const [venueId, setVenueId] = useState<string>(preselectedVenue?.id || venues[0]?.id || '');
  const [eventName, setEventName] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [date, setDate] = useState<string>(initialSlot?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>(initialSlot?.startTime || '14:00');
  const [endTime, setEndTime] = useState<string>(initialSlot?.endTime || '17:00');
  const [attendeesCount, setAttendeesCount] = useState<number>(120);
  const [eventType, setEventType] = useState<'symposium' | 'workshop' | 'accreditation' | 'general'>('workshop');

  // Update when props change
  useEffect(() => {
    if (preselectedVenue) setVenueId(preselectedVenue.id);
    if (initialSlot) {
      if (initialSlot.date) setDate(initialSlot.date);
      if (initialSlot.startTime) setStartTime(initialSlot.startTime);
      if (initialSlot.endTime) setEndTime(initialSlot.endTime);
    }
  }, [preselectedVenue, initialSlot]);

  const selectedVenueObj = venues.find(v => v.id === venueId) || venues[0];

  // Live conflict evaluation
  const conflict = useMemo(() => {
    if (!venueId || !date || !startTime || !endTime) return null;
    return checkSlotConflict(venueId, date, startTime, endTime);
  }, [venueId, date, startTime, endTime, checkSlotConflict]);

  // Suggested alternative venues with capacity matching if conflict occurs
  const alternativeVenues = useMemo(() => {
    if (!conflict) return [];
    return venues.filter(v => v.id !== venueId && v.capacity >= attendeesCount && !checkSlotConflict(v.id, date, startTime, endTime)).slice(0, 2);
  }, [conflict, venues, venueId, attendeesCount, date, startTime, endTime, checkSlotConflict]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    createBookingOrQueue({
      venueId,
      eventName,
      eventDescription: eventDescription.trim() || `${eventName} organized by ${currentUser.name}`,
      date,
      startTime,
      endTime,
      attendeesCount: Number(attendeesCount) || 50,
      tags: [eventType.toUpperCase(), currentUser.department]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Venue Reservation</span>
            </div>
            <h3 className="text-lg font-bold text-white">Book Space & Event Slot</h3>
            <p className="text-xs text-slate-400 mt-1">
              Active Applicant: <span className="text-slate-200 font-medium">{currentUser.name}</span> ({currentUser.role.toUpperCase()} · Priority Score: <span className="font-mono text-amber-300">{currentUser.priorityScore}</span>)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Conflict Warning or Clear Status Banner */}
        <div className="my-4">
          {conflict ? (
            <div className="p-3.5 bg-amber-950/40 border border-amber-600/50 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Scheduling Collision Detected on Shared Calendar</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-white">{selectedVenueObj.name}</span> is already reserved by{' '}
                <span className="text-amber-200 font-medium">{conflict.organizerName}</span> for{' '}
                <span className="italic">"{conflict.eventName}"</span> ({conflict.startTime} - {conflict.endTime}).
              </p>
              <div className="p-2.5 bg-slate-900/90 rounded-lg border border-amber-800/40 text-[11px] text-slate-300">
                <span className="font-semibold text-amber-300">Priority-Based Queue Resolution:</span> Submitting will place your request in the <span className="font-medium text-white">Fair Access Waitlist Queue</span>. If the slot is released or administrative triage applies, you will be notified instantly via push notification!
              </div>

              {alternativeVenues.length > 0 && (
                <div className="pt-1 text-xs">
                  <span className="text-slate-400">Available Alternative Halls for this time: </span>
                  <div className="flex gap-2 mt-1">
                    {alternativeVenues.map(alt => (
                      <button
                        key={alt.id}
                        type="button"
                        onClick={() => setVenueId(alt.id)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 rounded-md text-[11px] font-medium flex items-center gap-1 transition-colors"
                      >
                        <span>{alt.name}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Slot is clear! Instant confirmation guaranteed upon submission.</span>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Target Campus Location</label>
            <select
              value={venueId}
              onChange={e => setVenueId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
            >
              {venues.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.capacity} capacity · {v.block})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g., IEEE Hands-On PyTorch Workshop / Tech Conclave"
              value={eventName}
              onChange={e => setEventName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>End Time</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-400" />
                <span>Expected Delegates / Attendees</span>
              </label>
              <input
                type="number"
                min="10"
                max={selectedVenueObj.capacity}
                value={attendeesCount}
                onChange={e => setAttendeesCount(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none font-mono"
              />
              <span className="text-[10px] text-slate-500">Max limit: {selectedVenueObj.capacity} seats</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Event Classification</label>
              <select
                value={eventType}
                onChange={e => setEventType(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
              >
                <option value="accreditation">Academic Accreditation / Exam (+20 pts)</option>
                <option value="symposium">National Conclave / Hackathon (+15 pts)</option>
                <option value="workshop">Departmental Workshop (+10 pts)</option>
                <option value="general">Student Club Session (+5 pts)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Brief Description / Requirements</label>
            <textarea
              rows={2}
              placeholder="e.g., Audio-visual setup, podium mics, and live projector stream required."
              value={eventDescription}
              onChange={e => setEventDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center gap-1.5 ${
                conflict
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950'
              }`}
            >
              {conflict ? 'Join Fair Priority Queue' : 'Lock & Confirm Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
