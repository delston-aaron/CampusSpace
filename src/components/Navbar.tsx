import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ShieldCheck, UserCheck, ChevronDown, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenSso: () => void;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSso, onOpenNotifications }) => {
  const { currentUser, unreadNotificationsCount, activeView, setActiveView } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark (Single text element in high-character display style) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('sphere')}
            className="text-left group flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Nitte Space Hub
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider -mt-1 hidden sm:inline">
                NMAMIT Campus Spatial Booking
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActiveView('sphere')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'sphere' || activeView === 'isometric'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            3D Campus Map
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`transition-colors whitespace-nowrap ${
              activeView === 'calendar'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            Shared Calendar
          </button>
          <button
            onClick={() => setActiveView('admin')}
            className={`transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeView === 'admin'
                ? 'text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <span>Priority Queue & Admin</span>
            {currentUser.role === 'admin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 Primary actions (Role SSO Switcher + Real-time Notification Bell) */}
        <div className="flex items-center gap-3">
          {/* Notification Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            aria-label="Real-time Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center animate-bounce">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Institutional SSO Switcher */}
          <button
            onClick={onOpenSso}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-semibold text-amber-400 border border-slate-700">
              {currentUser.role === 'admin' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ) : currentUser.role === 'faculty' ? (
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
            </div>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-xs font-medium text-slate-200 truncate max-w-[130px]">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                {currentUser.role} · P:{currentUser.priorityScore}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
