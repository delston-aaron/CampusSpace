import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, GraduationCap, School, Check, ArrowRight } from 'lucide-react';

interface SsoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SsoModal: React.FC<SsoModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, allUsers, switchUser } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
              <span>Nitte Institutional SSO</span>
              <span className="text-slate-600">·</span>
              <span>NMAMIT Portal</span>
            </div>
            <h3 className="text-lg font-bold text-white">Switch Campus Identity</h3>
            <p className="text-xs text-slate-400 mt-1">
              Select an account to test permissions, priority queue mechanics, and administrative approvals.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Hierarchy Explanation */}
        <div className="my-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center justify-between">
            <span>Fair Access Priority Weighting</span>
            <span className="text-[10px] text-amber-400 font-mono">Dynamic Queue Engine</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            In the event of scheduling collisions, room allocation is determined by institutional tier:
            <span className="text-slate-200"> Estate Admin (100)</span> →
            <span className="text-slate-200"> Senior Faculty / HoD (85–95)</span> →
            <span className="text-slate-200"> Student Club Leadership (55–65)</span>.
            Students placed on the waitlist are automatically promoted if prior slots are vacated.
          </p>
        </div>

        {/* User Options */}
        <div className="space-y-2.5">
          {allUsers.map(user => {
            const isSelected = currentUser.id === user.id;
            const roleBadge = user.role === 'admin' 
              ? { label: 'Admin', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/50' }
              : user.role === 'faculty'
              ? { label: 'Faculty', color: 'text-sky-400', bg: 'bg-sky-950/40 border-sky-800/50' }
              : { label: 'Student', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/50' };

            return (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5'
                    : 'bg-slate-850 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 border border-slate-700">
                    {user.role === 'admin' ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    ) : user.role === 'faculty' ? (
                      <School className="w-5 h-5 text-sky-400" />
                    ) : (
                      <GraduationCap className="w-5 h-5 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {user.name}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${roleBadge.bg} ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{user.email}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono tabular-nums text-slate-300">P-Score: {user.priorityScore}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {user.department} ({user.clubOrDesignation})
                    </div>
                  </div>
                </div>

                <div className="pl-3">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Active Token: Nitte Deemed University SSO</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
