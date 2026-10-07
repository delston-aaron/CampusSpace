import React from 'react';
import { Venue } from '../types';
import { CalendarTimeline } from './CalendarTimeline';
import { X, Users, Wind, MapPin, Mail, UserCheck, ShieldCheck, Plus, CheckCircle } from 'lucide-react';

interface VenueDetailDrawerProps {
  venue: Venue | null;
  onClose: () => void;
  onOpenBookingModal: (slot?: { date: string; startTime: string; endTime: string; venueId?: string }) => void;
}

export const VenueDetailDrawer: React.FC<VenueDetailDrawerProps> = ({
  venue,
  onClose,
  onOpenBookingModal
}) => {
  if (!venue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Visual Hero Banner */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 bg-slate-950 overflow-hidden">
          <img
            src={venue.image}
            alt={venue.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Measured Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-300 hover:text-white bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md border border-slate-700/80 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content Overlay */}
          <div className="absolute bottom-4 inset-x-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono font-semibold">
                  {venue.code}
                </span>
                {venue.kannadaName && (
                  <span className="text-xs text-amber-200/90 font-medium">
                    {venue.kannadaName}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {venue.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{venue.block} · {venue.floor}</span>
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-white font-semibold">
                  {venue.capacity} Seats Max
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenBookingModal({ date: new Date().toISOString().split('T')[0], startTime: '14:00', endTime: '16:00', venueId: venue.id })}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Book This Hall</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body Content */}
        <div className="grow overflow-y-auto p-6 space-y-6">
          {/* Overview & Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Venue Specifications</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {venue.description}
              </p>

              {/* Equipment List */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-300 block mb-2">Installed Laboratory & AV Equipment</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venue.equipment.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coordinator & Administration Card */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3 h-fit">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Venue Coordinator</h4>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{venue.inCharge}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="font-mono text-[11px] truncate">{venue.contactEmail}</span>
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified NMAMIT Estate Registry</span>
              </div>
            </div>
          </div>

          {/* Embedded Live Calendar Timeline */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Live Calendar & Slot Reservation</h3>
                <p className="text-xs text-slate-400">Select any free hourly slot below to schedule with instant confirmation</p>
              </div>
            </div>

            <CalendarTimeline
              venueFilter={venue}
              onOpenBookingModal={slot => {
                if (slot) {
                  onOpenBookingModal({ ...slot, venueId: venue.id });
                } else {
                  onOpenBookingModal({
                    date: new Date().toISOString().split('T')[0],
                    startTime: '14:00',
                    endTime: '16:00',
                    venueId: venue.id
                  });
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
