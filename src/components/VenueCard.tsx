import React from 'react';
import { Venue } from '../types';
import { useApp } from '../context/AppContext';
import { Users, Wind, MapPin, Calendar, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface VenueCardProps {
  venue: Venue;
  onSelect: (venue: Venue) => void;
  onDirectBook: (venue: Venue) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onSelect, onDirectBook }) => {
  const { bookings, queueRequests } = useApp();

  const isContested = queueRequests.some(q => q.venueId === venue.id && q.status === 'queued');
  const todayBookingsCount = bookings.filter(
    b => b.venueId === venue.id && b.date === new Date().toISOString().split('T')[0] && b.status === 'confirmed'
  ).length;

  return (
    <div className="group bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col">
      {/* Visual Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={venue.image}
          alt={venue.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Badges on top */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-[11px] font-mono font-semibold text-amber-400">
            {venue.code}
          </span>

          <div className="flex items-center gap-1.5">
            {isContested ? (
              <span className="px-2 py-0.5 rounded-md bg-pink-950/80 border border-pink-700/60 text-pink-300 text-[10px] font-mono flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>Queue Active</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-[10px] font-mono">
                {todayBookingsCount > 0 ? `${todayBookingsCount} Events Today` : 'Free Today'}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 inset-x-3">
          {venue.kannadaName && (
            <span className="text-[11px] text-amber-300/80 font-medium block mb-0.5">
              {venue.kannadaName}
            </span>
          )}
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
            {venue.name}
          </h3>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col grow justify-between space-y-4">
        {/* Unboxed Metadata Line */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-mono tabular-nums text-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{venue.capacity} Seats</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>{venue.block}</span>
          {venue.acAvailable && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-sky-400 flex items-center gap-1">
                <Wind className="w-3 h-3" />
                <span>HVAC</span>
              </span>
            </>
          )}
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {venue.description}
        </p>

        {/* Equipment Highlights */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Key Infrastructure</span>
          <div className="flex flex-wrap gap-1.5">
            {venue.equipment.slice(0, 2).map((eq, i) => (
              <span
                key={i}
                className="text-[11px] text-slate-300 bg-slate-800/80 border border-slate-750 px-2 py-0.5 rounded-md truncate max-w-[200px]"
              >
                {eq}
              </span>
            ))}
            {venue.equipment.length > 2 && (
              <span className="text-[11px] text-slate-500 px-1.5 py-0.5">
                +{venue.equipment.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelect(venue)}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors group-hover:translate-x-0.5"
          >
            <span>3D View & Schedule</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDirectBook(venue)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all"
          >
            Book Venue
          </button>
        </div>
      </div>
    </div>
  );
};
