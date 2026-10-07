import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, X, ShieldAlert, CheckCircle2, Info } from 'lucide-react';

export const PushNotificationToast: React.FC = () => {
  const { pushBanner, dismissPushBanner, setIsNotificationDrawerOpen } = useApp();

  if (!pushBanner) return null;

  const isSuccess = pushBanner.type === 'success';
  const isWarning = pushBanner.type === 'warning';

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
        isWarning
          ? 'bg-slate-900/95 border-amber-500/60 shadow-amber-500/10'
          : isSuccess
          ? 'bg-slate-900/95 border-emerald-500/60 shadow-emerald-500/10'
          : 'bg-slate-900/95 border-slate-700 shadow-slate-950/50'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            isWarning
              ? 'bg-amber-500/20 text-amber-400'
              : isSuccess
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-sky-500/20 text-sky-400'
          }`}>
            {isWarning ? (
              <ShieldAlert className="w-5 h-5" />
            ) : isSuccess ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>

          <div className="grow min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-xs font-bold text-white truncate">
                {pushBanner.title}
              </span>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">Now</span>
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              {pushBanner.message}
            </p>

            <div className="mt-2.5 flex items-center gap-3">
              <button
                onClick={() => {
                  dismissPushBanner();
                  setIsNotificationDrawerOpen(true);
                }}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                View Feed →
              </button>
              <button
                onClick={dismissPushBanner}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>

          <button
            onClick={dismissPushBanner}
            className="text-slate-500 hover:text-white p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
