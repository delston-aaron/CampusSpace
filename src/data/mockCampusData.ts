import { Venue, Booking, QueueRequest, UserProfile, SystemLog } from '../types';

export const HERO_IMAGE = '/src/assets/images/campus_hero_aerial_1791349211665.jpg';
export const AUDITORIUM_IMAGE = '/src/assets/images/venue_auditorium_hall_1791349226666.jpg';
export const COMPUTING_LAB_IMAGE = '/src/assets/images/venue_computing_lab_1791349237766.jpg';
export const CONFERENCE_HALL_IMAGE = '/src/assets/images/venue_conference_hall_1791349258475.jpg';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-student-1',
    name: 'Neha Shenoy',
    email: 'nnm23is044@nmamit.in',
    role: 'student',
    usnOrEmpId: '4NM23IS044',
    department: 'Information Science & Engineering',
    clubOrDesignation: 'Technical Head, IEEE NMAMIT SB',
    priorityScore: 65,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=nnm23is044'
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. Shashidhar Pai',
    email: 'dr.shashidhar@nmamit.in',
    role: 'faculty',
    usnOrEmpId: 'NITTE-FAC-1042',
    department: 'Computer Science & Engineering',
    clubOrDesignation: 'Professor & Head of Department',
    priorityScore: 92,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=drshashidhar'
  },
  {
    id: 'user-faculty-2',
    name: 'Prof. Ananya Hegde',
    email: 'ananya.hegde@nmamit.in',
    role: 'faculty',
    usnOrEmpId: 'NITTE-FAC-1188',
    department: 'Biotechnology Engineering',
    clubOrDesignation: 'Associate Professor & Research Chair',
    priorityScore: 88,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ananya'
  },
  {
    id: 'user-admin-1',
    name: 'Dr. K. Rajesh Kamath',
    email: 'dean.infra@nmamit.in',
    role: 'admin',
    usnOrEmpId: 'NITTE-ADM-0019',
    department: 'Campus Infrastructure & Estate Administration',
    clubOrDesignation: 'Registrar & Facilities Controller',
    priorityScore: 100,
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=nittedean'
  }
];

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'venue-sambharam',
    name: 'Sambharam Auditorium',
    kannadaName: 'ಸಂಭ್ರಮ ಸಭಾಂಗಣ',
    code: 'AUD-01',
    block: 'Central Quadrangle Block',
    floor: 'Ground & Mezzanine Level',
    category: 'auditorium',
    capacity: 1200,
    image: AUDITORIUM_IMAGE,
    description: 'Premier university auditorium equipped with motorized acoustic dampers, Christie 4K laser projection, Dolby surround sound, green rooms, and live streaming multi-camera rig.',
    equipment: ['Christie 4K Laser Projection', 'Dolby Atmos PA System', '4x Motorized Stage Podiums', 'Backstage VIP Green Rooms', '128-Channel Digital Audio Console'],
    acAvailable: true,
    coordinates: { lat: 13.1825, lng: 74.9332, x: 0, y: 0.8, z: 1.2 },
    features: ['Live Streaming Enabled', 'Wheelchair Accessible', 'VIP Entrance', 'Backup Generator 500kVA'],
    inCharge: 'Mr. Pradeep Shetty (Chief Technical Officer)',
    contactEmail: 'sambharam.desk@nmamit.in'
  },
  {
    id: 'venue-sowparnika',
    name: 'Sowparnika Seminar Hall',
    kannadaName: 'ಸೌಪರ್ಣಿಕಾ ವಿಚಾರ ಸಂಕಿರಣ ಸಭಾಂಗಣ',
    code: 'SEM-02',
    block: 'Mechanical & Civil Engineering Block',
    floor: '2nd Floor, Wing B',
    category: 'seminar_hall',
    capacity: 280,
    image: CONFERENCE_HALL_IMAGE,
    description: 'Acoustically treated tiered seminar hall tailored for departmental symposiums, guest lectures, technical paper presentations, and corporate recruiting presentations.',
    equipment: ['Dual Sony Laser Projectors', 'Wireless Lavalier & Handheld Mics', 'Smart Interactive Whiteboard', 'Centrally Chilled HVAC'],
    acAvailable: true,
    coordinates: { lat: 13.1831, lng: 74.9341, x: 1.1, y: 0.4, z: 0.6 },
    features: ['High Tiered Seating', 'Direct Lift Access', 'LAN & High-Speed Wi-Fi 6'],
    inCharge: 'Mrs. Rekha Bhandary',
    contactEmail: 'sowparnika@nmamit.in'
  },
  {
    id: 'venue-phalguni',
    name: 'Phalguni Seminar Hall',
    kannadaName: 'ಫಲ್ಗುಣಿ ವಿಚಾರ ಸಂಕಿರಣ ಸಭಾಂಗಣ',
    code: 'SEM-03',
    block: 'Main Administrative & Tech Tower',
    floor: '1st Floor',
    category: 'seminar_hall',
    capacity: 350,
    image: AUDITORIUM_IMAGE,
    description: 'Centrally located seminar hall facing the university garden, featuring high-fidelity sound, recording facilities, and motorized podium lighting.',
    equipment: ['Ultra-Short Throw 4K Projector', 'Shure Array Microphones', 'Surround Sound', 'Full Stage Curtain Rig'],
    acAvailable: true,
    coordinates: { lat: 13.1818, lng: 74.9328, x: -1.0, y: 0.5, z: 0.7 },
    features: ['Garden View Foyer', 'Refreshment Lounge', 'Dedicated VIP Dias'],
    inCharge: 'Dr. Srinivas Bhat',
    contactEmail: 'phalguni.hall@nmamit.in'
  },
  {
    id: 'venue-shambhavi',
    name: 'Shambhavi Executive Conference Hall',
    kannadaName: 'ಶಾಂಭವಿ ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಭಾಂಗಣ',
    code: 'CNF-01',
    block: 'Golden Jubilee Academic Block',
    floor: '3rd Floor, Executive Wing',
    category: 'seminar_hall',
    capacity: 85,
    image: CONFERENCE_HALL_IMAGE,
    description: 'High-level syndicate and boardroom hall with polished teakwood elliptical conference table, individual push-to-talk microphones, and Cisco video conferencing hardware.',
    equipment: ['Cisco Webex Room Bar Pro', '85" 4K HDR Interactive Panel', 'Individual Push-to-Talk Mics', 'Polycom Conference Bridge'],
    acAvailable: true,
    coordinates: { lat: 13.1835, lng: 74.9325, x: -0.6, y: 1.1, z: -0.8 },
    features: ['Soundproof Acoustic Glass', 'Dedicated Pantry', 'Executive Restrooms'],
    inCharge: 'Dean (Academic Affairs)',
    contactEmail: 'shambhavi.conf@nmamit.in'
  },
  {
    id: 'venue-turing-lab',
    name: 'Alan Turing AI & High-Performance Lab',
    kannadaName: 'ಅಲನ್ ಟ್ಯೂರಿಂಗ್ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಪ್ರಯೋಗಾಲಯ',
    code: 'LAB-01',
    block: 'Computer Science & ISE Building',
    floor: '1st Floor, North Bay',
    category: 'computing_lab',
    capacity: 70,
    image: COMPUTING_LAB_IMAGE,
    description: 'Equipped with 60 dual-screen high-performance workstations with NVIDIA RTX A5000 GPUs, 10Gbps campus backbone, and high-density power backups for deep learning hackathons.',
    equipment: ['60x NVIDIA RTX A5000 Workstations', 'NVIDIA DGX Station Cluster Node Access', 'Dual 4K Instructor Displays', 'Redundant 10Gbps Optical Fiber'],
    acAvailable: true,
    coordinates: { lat: 13.1829, lng: 74.9318, x: -1.2, y: -0.3, z: 0.5 },
    features: ['24/7 Power Backup (Online UPS)', 'Biometric Access Control', 'Climate Controlled Server Pod'],
    inCharge: 'Prof. Venugopal K. (Lab Director)',
    contactEmail: 'turinglab@nmamit.in'
  },
  {
    id: 'venue-kalam-makerspace',
    name: 'Dr. A.P.J. Abdul Kalam Makerspace & FabLab',
    kannadaName: 'ಡಾ. ಎ.ಪಿ.ಜೆ. ಅಬ್ದುಲ್ ಕಲಾಂ ನಾವೀನ್ಯತಾ ಕೇಂದ್ರ',
    code: 'MAK-01',
    block: 'Innovation & Incubation Hub',
    floor: 'Ground Floor, Innovation Pavilion',
    category: 'makerspace',
    capacity: 55,
    image: COMPUTING_LAB_IMAGE,
    description: 'Rapid prototyping and hardware engineering facility equipped with industrial 3D printers, CNC PCB milling machines, Rohde & Schwarz digital oscilloscopes, and soldering stations.',
    equipment: ['4x Industrial Bambu & Ultimaker 3D Printers', 'LPKF PCB Prototyping Mill', '8x Digital Oscilloscopes & Function Gens', 'ESD Safe Workbenches'],
    acAvailable: true,
    coordinates: { lat: 13.1812, lng: 74.9348, x: 0.9, y: -0.7, z: 0.9 },
    features: ['Fume Extraction Hoods', 'Component Storehouse', 'Safety Goggle Dispenser'],
    inCharge: 'Er. Sandesh Nayak (Maker Lead)',
    contactEmail: 'makerspace@nmamit.in'
  },
  {
    id: 'venue-netravathi',
    name: 'Netravathi Seminar Hall',
    kannadaName: 'ನೇತ್ರಾವತಿ ವಿಚಾರ ಸಂಕಿರಣ ಸಭಾಂಗಣ',
    code: 'SEM-04',
    block: 'Biotechnology & Chemistry Complex',
    floor: 'Ground Floor',
    category: 'seminar_hall',
    capacity: 220,
    image: CONFERENCE_HALL_IMAGE,
    description: 'Modern amphitheater style seminar hall with high natural light balance, sound diffusers, and setup for interdisciplinary scientific symposia.',
    equipment: ['Epson Full HD Projector', 'Yamaha Line Array Speakers', 'Motorized Drop-Down Screen', 'Wireless Presentation Pointer'],
    acAvailable: true,
    coordinates: { lat: 13.1840, lng: 74.9335, x: 0.4, y: 1.2, z: -0.6 },
    features: ['Greenery Courtyard Access', 'Spacious Stage', 'Ample Parking Zone'],
    inCharge: 'Dr. Harshitha M.',
    contactEmail: 'netravathi@nmamit.in'
  },
  {
    id: 'venue-ada-lab',
    name: 'Ada Lovelace Cyber-Physical Systems Lab',
    kannadaName: 'ಅಡಾ ಲವ್ಲೇಸ್ ಸೈಬರ್-ಫಿಸಿಕಲ್ ಲ್ಯಾಬ್',
    code: 'LAB-02',
    block: 'Information Science & Engineering Block',
    floor: '2nd Floor, South Wing',
    category: 'computing_lab',
    capacity: 65,
    image: COMPUTING_LAB_IMAGE,
    description: 'Specialized lab for IoT sensor networks, robotics test rigs, micro-ROS development boards, and cloud computing virtual testbeds.',
    equipment: ['50x Dell UltraSharp Precision Workstations', '50x Raspberry Pi 5 & Jetson Orin Nano Kits', 'Spectrum Analyzer', 'Zigbee/LoRa Gateway Nodes'],
    acAvailable: true,
    coordinates: { lat: 13.1822, lng: 74.9352, x: 1.3, y: -0.2, z: -0.4 },
    features: ['High-speed Local Subnet', 'Soldering & Assembly Benches', 'Overhead Tool Dispensers'],
    inCharge: 'Dr. Niranjan Chiplunkar (Advisor)',
    contactEmail: 'adalab@nmamit.in'
  }
];

// Helper to format dates relative to today
const getSampleDate = (offsetDays: number = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-101',
    venueId: 'venue-sambharam',
    eventName: 'Incredia 2026: National Tech & Cultural Conclave Inauguration',
    eventDescription: 'Annual premier university festival keynotes, chief guest felicitation, and inaugural ceremonies for students and delegates.',
    date: getSampleDate(0), // Today
    startTime: '09:30',
    endTime: '12:30',
    organizerId: 'user-faculty-1',
    organizerName: 'Dr. Shashidhar Pai',
    organizerRole: 'faculty',
    organizerDept: 'Computer Science & Engineering',
    status: 'confirmed',
    attendeesCount: 950,
    createdAt: '2026-10-01T10:00:00Z',
    priorityScore: 95,
    tags: ['University Conclave', 'National Level', 'High Priority']
  },
  {
    id: 'book-102',
    venueId: 'venue-sambharam',
    eventName: 'IEEE Extreme 24-Hour Hackathon Pre-briefing',
    eventDescription: 'Technical orientation, rules briefing, and mentor matching for 150 student developer teams.',
    date: getSampleDate(0), // Today
    startTime: '14:00',
    endTime: '17:00',
    organizerId: 'user-student-1',
    organizerName: 'Neha Shenoy',
    organizerRole: 'student',
    organizerDept: 'Information Science & Engineering',
    status: 'confirmed',
    attendeesCount: 320,
    createdAt: '2026-10-02T11:20:00Z',
    priorityScore: 68,
    tags: ['IEEE SB', 'Student Technical', 'Hackathon']
  },
  {
    id: 'book-103',
    venueId: 'venue-turing-lab',
    eventName: 'Deep Learning on Jetson & RTX Workstations Workshop',
    eventDescription: 'Hands-on practical laboratory session running PyTorch 2.4 model fine-tuning with multi-GPU acceleration.',
    date: getSampleDate(0), // Today
    startTime: '10:00',
    endTime: '13:00',
    organizerId: 'user-faculty-1',
    organizerName: 'Dr. Shashidhar Pai',
    organizerRole: 'faculty',
    organizerDept: 'Computer Science & Engineering',
    status: 'confirmed',
    attendeesCount: 60,
    createdAt: '2026-10-03T09:15:00Z',
    priorityScore: 90,
    tags: ['AI Laboratory', 'Hands-on', 'Faculty Led']
  },
  {
    id: 'book-104',
    venueId: 'venue-shambhavi',
    eventName: 'University Academic Council & NBA Accreditation Review',
    eventDescription: 'Statutory board review of curriculum revisions and National Board of Accreditation outcomes.',
    date: getSampleDate(0), // Today
    startTime: '11:00',
    endTime: '13:30',
    organizerId: 'user-admin-1',
    organizerName: 'Dr. K. Rajesh Kamath',
    organizerRole: 'admin',
    organizerDept: 'Campus Infrastructure & Estate Administration',
    status: 'confirmed',
    attendeesCount: 45,
    createdAt: '2026-09-28T08:00:00Z',
    priorityScore: 100,
    tags: ['NBA Audit', 'Academic Council', 'Statutory']
  },
  {
    id: 'book-105',
    venueId: 'venue-sowparnika',
    eventName: 'Automotive Embedded Systems Industry Masterclass (Bosch Global)',
    eventDescription: 'Guest lecture by Principal Architects from Bosch India on AUTOSAR and vehicle dynamics.',
    date: getSampleDate(1), // Tomorrow
    startTime: '14:00',
    endTime: '17:00',
    organizerId: 'user-faculty-2',
    organizerName: 'Prof. Ananya Hegde',
    organizerRole: 'faculty',
    organizerDept: 'Biotechnology Engineering',
    status: 'confirmed',
    attendeesCount: 220,
    createdAt: '2026-10-04T12:00:00Z',
    priorityScore: 88,
    tags: ['Industry Lecture', 'Placement Cell']
  },
  {
    id: 'book-106',
    venueId: 'venue-kalam-makerspace',
    eventName: 'Robotics Rover Rapid Prototyping Sprint',
    eventDescription: 'Student robotics team design review and 3D printing of chassis components for University Rover Challenge.',
    date: getSampleDate(1), // Tomorrow
    startTime: '09:00',
    endTime: '13:00',
    organizerId: 'user-student-1',
    organizerName: 'Neha Shenoy',
    organizerRole: 'student',
    organizerDept: 'Information Science & Engineering',
    status: 'confirmed',
    attendeesCount: 35,
    createdAt: '2026-10-04T15:30:00Z',
    priorityScore: 65,
    tags: ['Maker Sprint', 'Robotics']
  }
];

export const INITIAL_QUEUE_REQUESTS: QueueRequest[] = [
  {
    id: 'queue-201',
    venueId: 'venue-sambharam',
    targetBookingId: 'book-102',
    eventName: 'Annual VTU Inter-Collegiate Youth Debate Prelims',
    eventDescription: 'State level inter-collegiate youth debate round requiring auditorium acoustics.',
    date: getSampleDate(0),
    startTime: '14:30',
    endTime: '16:30',
    organizerId: 'user-faculty-2',
    organizerName: 'Prof. Ananya Hegde',
    organizerRole: 'faculty',
    organizerDept: 'Biotechnology Engineering',
    attendeesCount: 180,
    priorityScore: 85,
    position: 1,
    reason: 'Faculty-endorsed university delegation event overlapping with student pre-briefing.',
    status: 'queued',
    submittedAt: '2026-10-04T16:00:00Z'
  },
  {
    id: 'queue-202',
    venueId: 'venue-turing-lab',
    targetBookingId: 'book-103',
    eventName: 'CSI CodeSprint Open Practice Session',
    eventDescription: 'Open student algorithmic contest trial for second year engineers.',
    date: getSampleDate(0),
    startTime: '11:00',
    endTime: '12:30',
    organizerId: 'user-student-2',
    organizerName: 'Karthik Rao (4NM23CS082)',
    organizerRole: 'student',
    organizerDept: 'Computer Science & Engineering',
    attendeesCount: 40,
    priorityScore: 50,
    position: 2,
    reason: 'Slot requested during AI workshop; waitlisted with lower priority score.',
    status: 'queued',
    submittedAt: '2026-10-05T09:00:00Z'
  }
];

export const INITIAL_LOGS: SystemLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-10-06 18:30',
    actor: 'Dr. K. Rajesh Kamath',
    actorRole: 'admin',
    action: 'BOOKING_APPROVED',
    details: 'Approved Sambharam Auditorium for Incredia 2026 Inaugural session.',
    severity: 'info'
  },
  {
    id: 'log-02',
    timestamp: '2026-10-06 18:45',
    actor: 'Priority Engine',
    actorRole: 'admin',
    action: 'QUEUE_CONFLICT_DETECTED',
    details: 'Detected slot collision at Sambharam Auditorium (14:30). Placed Prof. Ananya Hegde in Priority Queue #1 (Score: 85).',
    severity: 'warning'
  },
  {
    id: 'log-03',
    timestamp: '2026-10-06 19:10',
    actor: 'Neha Shenoy',
    actorRole: 'student',
    action: 'BOOKING_REQUESTED',
    details: 'Requested Makerspace booking for Rover Prototyping Sprint. Auto-confirmed (no collision).',
    severity: 'info'
  }
];
