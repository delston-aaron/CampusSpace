import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Bell, Check, Trash2, ShieldAlert, Sparkles, Send, Volume2 } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationsAsRead, 
    clearNotification, 
    requestPushPermissions, 
    browserNotificationsEnabled,
    venues,
    currentUser,
    createBookingOrQueue
  } = useApp();

  if (!isOpen) return null;

  const handleSimulateConflict = () => {
    // Attempt to book Sambharam Auditorium today at 10:00 (which is already booked!)
    const today = new Date().toISOString().split('T')[0];
    createBookingOrQueue({
      venueId: 'venue-sambharam',
      eventName: 'Simulated Urgent Tech Council Review',
      eventDescription: 'Testing real-time conflict push notification and queue waitlist placement.',
      date: today,
      startTime: '10:00',
      endTime: '12:00',
      attendeesCount: 200,
      tags: ['Simulated Collision', 'Test Alert']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Real-Time Dispatch Feed</h3>
              <p className="text-[11px] text-slate-400">Instant updates on reservations & queues</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg text-xs"
              title="Mark all as read"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Push Notification Controls Card */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Browser Push Notifications</span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              browserNotificationsEnabled
                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {browserNotificationsEnabled ? 'ACTIVE' : 'MUTED'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Receive native operating system push banners when bookings get contested, priority queues advance, or admin decisions arrive.
          </p>

          <div className="flex items-center gap-2 pt-1">
            {!browserNotificationsEnabled ? (
              <button
                onClick={requestPushPermissions}
                className="grow py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Enable Push Notifications
              </button>
            ) : (
              <div className="grow py-1 px-2.5 bg-emerald-950/40 text-emerald-400 text-[11px] rounded-lg border border-emerald-800/40 text-center font-medium">
                Push Notifications Subscribed
              </div>
            )}

            <button
              onClick={handleSimulateConflict}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
              title="Test scheduling collision"
            >
              <Send className="w-3 h-3 text-amber-400" />
              <span>Test Conflict Alert</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="grow overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-500">
              No recent notifications in your stream.
            </div>
          ) : (
            notifications.map(item => {
              const venue = venues.find(v => v.id === item.venueId);

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-1.5 relative group ${
                    item.read
                      ? 'bg-slate-900/60 border-slate-800/70 text-slate-400'
                      : 'bg-slate-850 border-slate-750 text-slate-200 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        item.type === 'CONFLICT_DETECTED' || item.type === 'QUEUE_PLACED'
                          ? 'bg-pink-400'
                          : item.type === 'BOOKING_CONFIRMED'
                          ? 'bg-emerald-400'
                          : 'bg-amber-400'
                      }`} />
                      <h4 className="text-xs font-semibold text-white leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-4">
                    {item.message}
                  </p>

                  {venue && (
                    <div className="pl-4 text-[10px] text-amber-400 font-mono">
                      Location: {venue.name} ({venue.code})
                    </div>
                  )}

                  <button
                    onClick={() => clearNotification(item.id)}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Nitte Event & Space Dispatcher · High Priority Queue Engine
        </div>
      </div>
    </div>
  );
};
