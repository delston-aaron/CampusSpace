import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  Users, 
  Check, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  FileText,
  Building,
  RotateCcw
} from 'lucide-react';

export const AdminMonitor: React.FC = () => {
  const { 
    currentUser, 
    allocationStats, 
    queueRequests, 
    systemLogs, 
    adminApproveQueueRequest, 
    adminDeclineQueueRequest,
    adminOverrideSlot,
    venues,
    bookings
  } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'info' | 'warning'>('all');

  const pendingQueues = queueRequests.filter(q => q.status === 'queued');

  const filteredLogs = systemLogs.filter(log => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Privilege Header */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Campus Infrastructure & Estate Registry</span>
          </div>
          <h2 className="text-xl font-bold text-white">Resource Allocation & Queue Triage</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of campus seminar halls, computing labs, and priority queue resolutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Session: <strong className="text-white">{currentUser.name}</strong></span>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Overall Campus Utilization</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {Math.round(allocationStats.reduce((acc, s) => acc + s.utilizationPercentage, 0) / allocationStats.length)}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Calculated across 8 campus facilities</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Confirmed Scheduled Events</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active on shared calendar</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pending Waitlist Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-300">
            {pendingQueues.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting vacancy or triage</span>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Campus Locations</span>
            <Building className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {venues.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Fully mapped in 3D topography</span>
        </div>
      </div>

      {/* Real-time Resource Allocation Visualizer */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Venue Resource Allocation Monitor</h3>
            <p className="text-xs text-slate-400">Current load factor and active queues per hall/lab</p>
          </div>
          <span className="text-xs font-mono text-slate-400">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {allocationStats.map(stat => {
            const venue = venues.find(v => v.id === stat.venueId);
            return (
              <div key={stat.venueId} className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{stat.venueName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({venue?.code})</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    stat.currentStatus === 'contested' 
                      ? 'bg-pink-950/60 text-pink-300 border border-pink-800/40' 
                      : stat.currentStatus === 'busy' 
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' 
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                  }`}>
                    {stat.currentStatus.toUpperCase()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      stat.utilizationPercentage > 75 
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-amber-500'
                    }`}
                    style={{ width: `${stat.utilizationPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Capacity: {venue?.capacity} seats</span>
                  <span>Utilization: <strong className="text-slate-200">{stat.utilizationPercentage}%</strong></span>
                  <span>In Queue: <strong className={stat.queuedRequestsCount > 0 ? 'text-pink-400' : 'text-slate-500'}>{stat.queuedRequestsCount}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority-Based Scheduling Queue Triage Table */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <span>Priority Waitlist Triage Queue</span>
              {pendingQueues.length > 0 && (
                <span className="text-xs font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                  {pendingQueues.length} Pending
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Contested reservations ordered by Institutional Priority Scoring (Faculty &gt; Student)
            </p>
          </div>
        </div>

        {pendingQueues.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No scheduling collisions in queue. All campus venues operating smoothly!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-3">Pos</th>
                  <th className="py-2.5 px-3">Event & Target Hall</th>
                  <th className="py-2.5 px-3">Applicant & Role</th>
                  <th className="py-2.5 px-3">Slot Time</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pendingQueues.map(q => {
                  const venue = venues.find(v => v.id === q.venueId);
                  return (
                    <tr key={q.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-amber-400">
                        #{q.position}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-white">{q.eventName}</div>
                        <div className="text-[11px] text-slate-400">{venue?.name} · {q.attendeesCount} pax</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-200">{q.organizerName}</div>
                        <div className="text-[11px] text-slate-500">{q.organizerRole.toUpperCase()} · {q.organizerDept}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 tabular-nums">
                        <div>{q.date}</div>
                        <div className="text-slate-500">{q.startTime} - {q.endTime}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                          {q.priorityScore} pts
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => adminApproveQueueRequest(q.id)}
                            className="px-2.5 py-1 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            title="Approve and promote to confirmed"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => adminDeclineQueueRequest(q.id)}
                            className="px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                            title="Decline queue request"
                          >
                            <X className="w-3 h-3" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Audit Logs */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Real-time System Audit Logs</span>
            </h3>
            <p className="text-xs text-slate-400">Chronological activity stream of room bookings and queue events</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-800/70 rounded-lg text-xs">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSeverity === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSeverity('warning')}
              className={`px-2.5 py-1 rounded-md transition-colors ${filterSeverity === 'warning' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
            >
              Conflicts
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${log.severity === 'warning' ? 'bg-pink-400' : 'bg-emerald-400'}`} />
                  <span className="font-semibold text-white">{log.action}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400">{log.actor} ({log.actorRole.toUpperCase()})</span>
                </div>
                <p className="text-slate-300 text-[11px]">{log.details}</p>
              </div>

              <div className="shrink-0 text-slate-500 font-mono text-[10px]">
                {log.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
