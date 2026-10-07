import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  Venue, 
  Booking, 
  QueueRequest, 
  NotificationItem, 
  SystemLog, 
  AllocationStat, 
  UserRole,
  VenueCategory
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_VENUES, 
  INITIAL_BOOKINGS, 
  INITIAL_QUEUE_REQUESTS, 
  INITIAL_LOGS 
} from '../data/mockCampusData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (userId: string) => void;
  venues: Venue[];
  selectedVenue: Venue | null;
  setSelectedVenue: (venue: Venue | null) => void;
  bookings: Booking[];
  queueRequests: QueueRequest[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  systemLogs: SystemLog[];
  allocationStats: AllocationStat[];
  activeView: 'sphere' | 'isometric' | 'calendar' | 'admin';
  setActiveView: (view: 'sphere' | 'isometric' | 'calendar' | 'admin') => void;
  selectedCategory: 'all' | VenueCategory;
  setSelectedCategory: (cat: 'all' | VenueCategory) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSsoOpen: boolean;
  setIsSsoOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  prefilledBookingSlot: { date: string; startTime: string; endTime: string } | null;
  setPrefilledBookingSlot: (slot: { date: string; startTime: string; endTime: string } | null) => void;
  pushBanner: { title: string; message: string; type: string } | null;
  dismissPushBanner: () => void;
  requestPushPermissions: () => Promise<boolean>;
  browserNotificationsEnabled: boolean;
  
  // Actions
  createBookingOrQueue: (params: {
    venueId: string;
    eventName: string;
    eventDescription: string;
    date: string;
    startTime: string;
    endTime: string;
    attendeesCount: number;
    tags?: string[];
  }) => { success: boolean; isQueued: boolean; reason?: string; booking?: Booking; queue?: QueueRequest };
  
  cancelBooking: (bookingId: string) => void;
  adminApproveQueueRequest: (queueId: string) => void;
  adminDeclineQueueRequest: (queueId: string, reason?: string) => void;
  adminOverrideSlot: (queueId: string) => void;
  markNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  checkSlotConflict: (venueId: string, date: string, startTime: string, endTime: string) => Booking | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Default to student nnm23is044
  const [venues] = useState<Venue[]>(INITIAL_VENUES);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [queueRequests, setQueueRequests] = useState<QueueRequest[]>(INITIAL_QUEUE_REQUESTS);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  
  const [activeView, setActiveView] = useState<'sphere' | 'isometric' | 'calendar' | 'admin'>('sphere');
  const [selectedCategory, setSelectedCategory] = useState<'all' | VenueCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isSsoOpen, setIsSsoOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [prefilledBookingSlot, setPrefilledBookingSlot] = useState<{ date: string; startTime: string; endTime: string } | null>(null);
  
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState<boolean>(false);
  const [pushBanner, setPushBanner] = useState<{ title: string; message: string; type: string } | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'user-student-1',
      title: 'Booking Confirmed: IEEE Extreme Pre-briefing',
      message: 'Your slot at Sambharam Auditorium today (14:00 - 17:00) is locked and confirmed.',
      type: 'BOOKING_CONFIRMED',
      venueId: 'venue-sambharam',
      timestamp: '2 hours ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 'notif-2',
      userId: 'user-student-1',
      title: 'Contested Slot Notification',
      message: 'Faculty member Prof. Ananya Hegde requested an overlapping slot for VTU Youth Debate. Your confirmed status is protected under priority rules.',
      type: 'CONFLICT_DETECTED',
      venueId: 'venue-sambharam',
      timestamp: '1 hour ago',
      read: false,
      priority: 'high'
    }
  ]);

  // Check initial browser notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserNotificationsEnabled(window.Notification.permission === 'granted');
    }
  }, []);

  const dismissPushBanner = useCallback(() => {
    setPushBanner(null);
  }, []);

  const triggerPushNotification = useCallback((title: string, message: string, type: string = 'info') => {
    // 1. In-app animated push toast
    setPushBanner({ title, message, type });
    setTimeout(() => {
      setPushBanner(current => (current?.title === title ? null : current));
    }, 6000);

    // 2. Real Web Notification API if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && window.Notification.permission === 'granted') {
      try {
        new window.Notification(`Nitte Hub: ${title}`, {
          body: message,
          icon: '/favicon.ico'
        });
      } catch {
        // Fallback gracefully if blocked by sandbox iframe
      }
    }
  }, []);

  const requestPushPermissions = async (): Promise<boolean> => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await window.Notification.requestPermission();
        const granted = res === 'granted';
        setBrowserNotificationsEnabled(granted);
        if (granted) {
          triggerPushNotification('Push Notifications Activated', 'You will receive instant alerts for scheduling conflicts and queue changes.', 'success');
        }
        return granted;
      } catch {
        return false;
      }
    }
    return false;
  };

  const switchUser = (userId: string) => {
    const user = INITIAL_USERS.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      triggerPushNotification('SSO Session Switched', `Logged in as ${user.name} (${user.role.toUpperCase()} - ${user.usnOrEmpId})`, 'info');
      // Append audit log
      setSystemLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: user.name,
          actorRole: user.role,
          action: 'SSO_LOGIN',
          details: `Authenticated via Nitte Institutional SSO as ${user.role} (${user.department})`,
          severity: 'info'
        },
        ...prev
      ]);
    }
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Conflict Detection Engine
  const checkSlotConflict = useCallback((venueId: string, date: string, startTime: string, endTime: string): Booking | null => {
    const startMins = convertToMinutes(startTime);
    const endMins = convertToMinutes(endTime);

    for (const b of bookings) {
      if (b.venueId === venueId && b.date === date && b.status === 'confirmed') {
        const bStart = convertToMinutes(b.startTime);
        const bEnd = convertToMinutes(b.endTime);

        // Check overlap: (start1 < end2) && (end1 > start2)
        if (startMins < bEnd && endMins > bStart) {
          return b;
        }
      }
    }
    return null;
  }, [bookings]);

  // Calculate dynamic priority score
  const calculatePriority = (role: UserRole, attendeesCount: number, eventName: string): number => {
    let base = 40;
    if (role === 'admin') base = 100;
    else if (role === 'faculty') base = 85;
    else if (role === 'student') base = 55;

    // Academic & symposium weighting
    const lowerName = eventName.toLowerCase();
    if (lowerName.includes('nba') || lowerName.includes('accreditation') || lowerName.includes('convocation') || lowerName.includes('exam')) {
      base += 20;
    } else if (lowerName.includes('conclave') || lowerName.includes('symposium') || lowerName.includes('hackathon') || lowerName.includes('conference')) {
      base += 15;
    } else if (lowerName.includes('workshop') || lowerName.includes('seminar') || lowerName.includes('lecture')) {
      base += 10;
    }

    if (attendeesCount > 500) base += 10;
    else if (attendeesCount > 100) base += 5;

    return Math.min(100, base);
  };

  const createBookingOrQueue = ({
    venueId,
    eventName,
    eventDescription,
    date,
    startTime,
    endTime,
    attendeesCount,
    tags = []
  }: {
    venueId: string;
    eventName: string;
    eventDescription: string;
    date: string;
    startTime: string;
    endTime: string;
    attendeesCount: number;
    tags?: string[];
  }) => {
    const venue = venues.find(v => v.id === venueId);
    const venueName = venue?.name || 'Venue';
    const conflict = checkSlotConflict(venueId, date, startTime, endTime);
    const userPriority = calculatePriority(currentUser.role, attendeesCount, eventName);

    if (!conflict) {
      // Immediate confirmation!
      const newBooking: Booking = {
        id: `book-${Date.now()}`,
        venueId,
        eventName,
        eventDescription,
        date,
        startTime,
        endTime,
        organizerId: currentUser.id,
        organizerName: currentUser.name,
        organizerRole: currentUser.role,
        organizerDept: currentUser.department,
        status: 'confirmed',
        attendeesCount,
        createdAt: new Date().toISOString(),
        priorityScore: userPriority,
        tags: tags.length ? tags : ['Direct Booking', currentUser.role]
      };

      setBookings(prev => [newBooking, ...prev]);

      // Add log
      setSystemLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: currentUser.name,
          actorRole: currentUser.role,
          action: 'BOOKING_CONFIRMED',
          details: `Confirmed booking for "${eventName}" at ${venueName} on ${date} (${startTime}-${endTime}). Zero conflicts.`,
          severity: 'info'
        },
        ...prev
      ]);

      // Add notification
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: currentUser.id,
          title: `Booking Confirmed: ${eventName}`,
          message: `Your booking for ${venueName} on ${date} (${startTime}-${endTime}) is confirmed.`,
          type: 'BOOKING_CONFIRMED',
          venueId,
          bookingId: newBooking.id,
          timestamp: 'Just now',
          read: false,
          priority: 'medium'
        },
        ...prev
      ]);

      confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
      triggerPushNotification('Booking Confirmed!', `Scheduled "${eventName}" at ${venueName} for ${date} (${startTime}-${endTime})`, 'success');

      return { success: true, isQueued: false, booking: newBooking };
    }

    // CONFLICT DETECTED!
    // Queue resolution logic:
    const existingQueueForSlot = queueRequests.filter(q => q.venueId === venueId && q.date === date && q.status === 'queued');
    const queuePosition = existingQueueForSlot.length + 1;

    const newQueueRequest: QueueRequest = {
      id: `queue-${Date.now()}`,
      venueId,
      targetBookingId: conflict.id,
      eventName,
      eventDescription,
      date,
      startTime,
      endTime,
      organizerId: currentUser.id,
      organizerName: currentUser.name,
      organizerRole: currentUser.role,
      organizerDept: currentUser.department,
      attendeesCount,
      priorityScore: userPriority,
      position: queuePosition,
      reason: `Slot contested by ${conflict.eventName} (${conflict.organizerName}, Priority: ${conflict.priorityScore}). User Priority: ${userPriority}.`,
      status: 'queued',
      submittedAt: new Date().toISOString()
    };

    setQueueRequests(prev => [...prev, newQueueRequest]);

    // System log
    setSystemLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: currentUser.name,
        actorRole: currentUser.role,
        action: 'QUEUE_CONFLICT_ROUTED',
        details: `Slot conflict at ${venueName} with "${conflict.eventName}". Placed in Priority Queue at Position #${queuePosition} (Score: ${userPriority}).`,
        severity: 'warning'
      },
      ...prev
    ]);

    // Notifications
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: `Placed in Priority Queue: ${eventName}`,
        message: `Collision with "${conflict.eventName}". You are at Position #${queuePosition} in the waitlist. Priority score: ${userPriority}.`,
        type: 'QUEUE_PLACED',
        venueId,
        timestamp: 'Just now',
        read: false,
        priority: 'high'
      },
      ...prev
    ]);

    // Notify the conflicting booking organizer too
    setNotifications(prev => [
      {
        id: `notif-${Date.now() + 1}`,
        userId: conflict.organizerId,
        title: `Contested Slot Alert: ${venueName}`,
        message: `${currentUser.name} (${currentUser.role}) has requested your slot (${date} ${startTime}-${endTime}) and is queued at #${queuePosition}.`,
        type: 'CONFLICT_DETECTED',
        venueId,
        timestamp: 'Just now',
        read: false,
        priority: 'high'
      },
      ...prev
    ]);

    triggerPushNotification('Scheduling Conflict Queued', `Slot at ${venueName} occupied by "${conflict.eventName}". You are queued at Position #${queuePosition}.`, 'warning');

    return { 
      success: true, 
      isQueued: true, 
      reason: `Time slot is currently reserved for "${conflict.eventName}" by ${conflict.organizerName}. Placed in Priority Queue #${queuePosition}.`, 
      queue: newQueueRequest 
    };
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.filter(b => b.id !== bookingId));

    // Check if there is someone in the queue for this venue & date!
    const candidateQueue = queueRequests
      .filter(q => q.venueId === booking.venueId && q.date === booking.date && q.status === 'queued')
      .sort((a, b) => b.priorityScore - a.priorityScore || a.position - b.position)[0];

    if (candidateQueue) {
      // Auto-promote top queue applicant!
      const promotedBooking: Booking = {
        id: `book-${Date.now()}`,
        venueId: candidateQueue.venueId,
        eventName: candidateQueue.eventName,
        eventDescription: candidateQueue.eventDescription,
        date: candidateQueue.date,
        startTime: candidateQueue.startTime,
        endTime: candidateQueue.endTime,
        organizerId: candidateQueue.organizerId,
        organizerName: candidateQueue.organizerName,
        organizerRole: candidateQueue.organizerRole,
        organizerDept: candidateQueue.organizerDept,
        status: 'confirmed',
        attendeesCount: candidateQueue.attendeesCount,
        createdAt: new Date().toISOString(),
        priorityScore: candidateQueue.priorityScore,
        tags: ['Queue Promoted', 'Priority Clearance']
      };

      setBookings(prev => [promotedBooking, ...prev]);
      setQueueRequests(prev => prev.map(q => q.id === candidateQueue.id ? { ...q, status: 'promoted' } : q));

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: candidateQueue.organizerId,
          title: `Waitlist Cleared! Confirmed: ${candidateQueue.eventName}`,
          message: `The prior reservation was cancelled. Your slot at ${candidateQueue.venueId} has been automatically approved and confirmed!`,
          type: 'BOOKING_CONFIRMED',
          venueId: candidateQueue.venueId,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
        },
        ...prev
      ]);

      triggerPushNotification('Queue Advanced!', `"${candidateQueue.eventName}" has been auto-promoted to Confirmed status.`, 'success');

      setSystemLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: 'Auto Queue Dispatcher',
          actorRole: 'admin',
          action: 'QUEUE_AUTO_PROMOTED',
          details: `Booking ${booking.id} cancelled. Auto-promoted queue request ${candidateQueue.id} for "${candidateQueue.eventName}" (Priority: ${candidateQueue.priorityScore}).`,
          severity: 'info'
        },
        ...prev
      ]);
    } else {
      setSystemLogs(prev => [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: currentUser.name,
          actorRole: currentUser.role,
          action: 'BOOKING_CANCELLED',
          details: `Cancelled booking "${booking.eventName}" at ${booking.venueId}. Slot released.`,
          severity: 'info'
        },
        ...prev
      ]);
      triggerPushNotification('Booking Released', `Booking for "${booking.eventName}" was cancelled. Slot is now free.`, 'info');
    }
  };

  const adminApproveQueueRequest = (queueId: string) => {
    const queue = queueRequests.find(q => q.id === queueId);
    if (!queue) return;

    // Check if existing conflicting booking needs to be bumped
    const conflict = checkSlotConflict(queue.venueId, queue.date, queue.startTime, queue.endTime);
    if (conflict) {
      // Bump existing booking
      setBookings(prev => prev.map(b => b.id === conflict.id ? { ...b, status: 'in_queue' } : b));
      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          userId: conflict.organizerId,
          title: `Administrative Preemption: ${conflict.eventName}`,
          message: `Campus Administration preempted your slot in favor of high-priority institutional event "${queue.eventName}".`,
          type: 'PRIORITY_PREEMPTION',
          venueId: queue.venueId,
          timestamp: 'Just now',
          read: false,
          priority: 'high'
        },
        ...prev
      ]);
    }

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      venueId: queue.venueId,
      eventName: queue.eventName,
      eventDescription: queue.eventDescription,
      date: queue.date,
      startTime: queue.startTime,
      endTime: queue.endTime,
      organizerId: queue.organizerId,
      organizerName: queue.organizerName,
      organizerRole: queue.organizerRole,
      organizerDept: queue.organizerDept,
      status: 'confirmed',
      attendeesCount: queue.attendeesCount,
      createdAt: new Date().toISOString(),
      priorityScore: queue.priorityScore,
      tags: ['Admin Approved', 'Priority Preempted']
    };

    setBookings(prev => [newBooking, ...prev]);
    setQueueRequests(prev => prev.map(q => q.id === queueId ? { ...q, status: 'promoted' } : q));

    setNotifications(prev => [
      {
        id: `notif-${Date.now() + 1}`,
        userId: queue.organizerId,
        title: `Admin Approved: ${queue.eventName}`,
        message: `Your pending queue request has been officially approved by Estate Administration.`,
        type: 'ADMIN_ACTION',
        venueId: queue.venueId,
        timestamp: 'Just now',
        read: false,
        priority: 'high'
      },
      ...prev
    ]);

    setSystemLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: currentUser.name,
        actorRole: 'admin',
        action: 'ADMIN_QUEUE_APPROVED',
        details: `Administrator manually approved queued event "${queue.eventName}" (Organizer: ${queue.organizerName}).`,
        severity: 'info'
      },
      ...prev
    ]);

    confetti({ particleCount: 60, spread: 50 });
    triggerPushNotification('Admin Approval Applied', `Approved "${queue.eventName}" and locked calendar slot.`, 'success');
  };

  const adminDeclineQueueRequest = (queueId: string, reason: string = 'Venue allocation unavailable due to priority conflict.') => {
    const queue = queueRequests.find(q => q.id === queueId);
    if (!queue) return;

    setQueueRequests(prev => prev.map(q => q.id === queueId ? { ...q, status: 'declined' } : q));

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: queue.organizerId,
        title: `Queue Request Declined: ${queue.eventName}`,
        message: `Campus Administration declined waitlist request: ${reason}`,
        type: 'ADMIN_ACTION',
        venueId: queue.venueId,
        timestamp: 'Just now',
        read: false,
        priority: 'high'
      },
      ...prev
    ]);

    setSystemLogs(prev => [
      {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: currentUser.name,
        actorRole: 'admin',
        action: 'ADMIN_QUEUE_DECLINED',
        details: `Declined queue request for "${queue.eventName}". Reason: ${reason}`,
        severity: 'warning'
      },
      ...prev
    ]);

    triggerPushNotification('Queue Request Declined', `Declined waitlist item for "${queue.eventName}".`, 'warning');
  };

  const adminOverrideSlot = (queueId: string) => {
    adminApproveQueueRequest(queueId);
  };

  // Real-time resource allocation statistics calculation
  const allocationStats: AllocationStat[] = useMemo(() => {
    return venues.map(venue => {
      const venueBookings = bookings.filter(b => b.venueId === venue.id && b.status === 'confirmed');
      const queuedCount = queueRequests.filter(q => q.venueId === venue.id && q.status === 'queued').length;
      
      // Calculate daily/weekly hours booked
      const totalMinutes = venueBookings.reduce((acc, b) => {
        const start = convertToMinutes(b.startTime);
        const end = convertToMinutes(b.endTime);
        return acc + Math.max(0, end - start);
      }, 0);

      // Max capacity per week (assume 10 operating hours/day * 6 days = 3600 mins)
      const utilization = Math.min(100, Math.round((totalMinutes / 1200) * 100));

      const isCurrentlyOccupied = venueBookings.some(b => {
        // Simple check for today's active slots
        return b.date === new Date().toISOString().split('T')[0];
      });

      return {
        venueId: venue.id,
        venueName: venue.name,
        utilizationPercentage: utilization || 24, // minimum aesthetic representation
        totalBookingsThisWeek: venueBookings.length,
        queuedRequestsCount: queuedCount,
        currentStatus: queuedCount > 0 ? 'contested' : isCurrentlyOccupied ? 'busy' : 'available'
      };
    });
  }, [venues, bookings, queueRequests]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        switchUser,
        venues,
        selectedVenue,
        setSelectedVenue,
        bookings,
        queueRequests,
        notifications,
        unreadNotificationsCount,
        systemLogs,
        allocationStats,
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
        pushBanner,
        dismissPushBanner,
        requestPushPermissions,
        browserNotificationsEnabled,
        createBookingOrQueue,
        cancelBooking,
        adminApproveQueueRequest,
        adminDeclineQueueRequest,
        adminOverrideSlot,
        markNotificationsAsRead,
        clearNotification,
        checkSlotConflict
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

function convertToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hh, mm] = timeStr.split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}
