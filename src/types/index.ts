export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  usnOrEmpId: string;
  department: string;
  clubOrDesignation: string;
  priorityScore: number;
  avatarUrl?: string;
}

export type VenueCategory = 'auditorium' | 'seminar_hall' | 'computing_lab' | 'makerspace';

export interface Venue {
  id: string;
  name: string;
  kannadaName?: string;
  code: string;
  block: string;
  floor: string;
  category: VenueCategory;
  capacity: number;
  image: string;
  description: string;
  equipment: string[];
  acAvailable: boolean;
  coordinates: {
    lat: number;
    lng: number;
    x: number;
    y: number;
    z: number;
  };
  features: string[];
  inCharge: string;
  contactEmail: string;
}

export type BookingStatus = 'confirmed' | 'pending' | 'in_queue' | 'rejected' | 'cancelled';

export interface Booking {
  id: string;
  venueId: string;
  eventName: string;
  eventDescription: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  organizerId: string;
  organizerName: string;
  organizerRole: UserRole;
  organizerDept: string;
  status: BookingStatus;
  attendeesCount: number;
  createdAt: string;
  priorityScore: number;
  tags: string[];
}

export interface QueueRequest {
  id: string;
  venueId: string;
  targetBookingId?: string; // If contesting an existing booking
  eventName: string;
  eventDescription: string;
  date: string;
  startTime: string;
  endTime: string;
  organizerId: string;
  organizerName: string;
  organizerRole: UserRole;
  organizerDept: string;
  attendeesCount: number;
  priorityScore: number;
  position: number;
  reason: string;
  status: 'queued' | 'promoted' | 'declined';
  submittedAt: string;
}

export type NotificationType = 
  | 'BOOKING_CONFIRMED'
  | 'QUEUE_PLACED'
  | 'CONFLICT_DETECTED'
  | 'PRIORITY_PREEMPTION'
  | 'ADMIN_ACTION'
  | 'SYSTEM_ALERT';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  venueId?: string;
  bookingId?: string;
  timestamp: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface AllocationStat {
  venueId: string;
  venueName: string;
  utilizationPercentage: number;
  totalBookingsThisWeek: number;
  queuedRequestsCount: number;
  currentStatus: 'available' | 'busy' | 'contested';
}
