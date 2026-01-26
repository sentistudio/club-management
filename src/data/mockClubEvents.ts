// Mock Club Events Data
// ==========================================
// Club-wide events (not team trainings/matches)
// Coherent with demo personas: Patrick (admin), Lena, Flurina, Max, Anna

import type { 
  ClubEvent, 
  AudienceMode, 
  EventStatus, 
  EventVisibility,
  StatusHistoryEntry 
} from "../types/events";

// ==========================================
// ADMIN USER
// ==========================================
export const ADMIN_USER = {
  id: "patrick_steuble",
  name: "Patrick Steuble",
  role: "Administrator"
};

// ==========================================
// DEPARTMENTS
// ==========================================
export interface Department {
  id: string;
  name: string;
  icon: string;
  memberCount: number;
}

export const mockDepartments: Department[] = [
  { id: "dept_football", name: "Fußball", icon: "⚽", memberCount: 156 },
  { id: "dept_volleyball", name: "Volleyball", icon: "🏐", memberCount: 48 },
  { id: "dept_fitness", name: "Fitness", icon: "💪", memberCount: 89 },
  { id: "dept_tennis", name: "Tennis", icon: "🎾", memberCount: 34 },
  { id: "dept_swimming", name: "Schwimmen", icon: "🏊", memberCount: 67 }
];

// ==========================================
// CUSTOM GROUPS
// ==========================================
export interface CustomGroup {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
  memberCount: number;
}

export const mockGroups: CustomGroup[] = [
  { 
    id: "grp_vorstand", 
    name: "Vorstand", 
    description: "Vereinsvorstand und erweiterte Leitung",
    memberIds: ["patrick_steuble", "thomas_mueller", "sabine_weber"],
    memberCount: 8 
  },
  { 
    id: "grp_jugendleitung", 
    name: "Jugendleitung", 
    description: "Jugendabteilungsleiter aller Abteilungen",
    memberIds: ["coach_marco", "coach_katja", "trainer_bernd"],
    memberCount: 12 
  },
  { 
    id: "grp_schiedsrichter", 
    name: "Schiedsrichter", 
    description: "Aktive Schiedsrichter des Vereins",
    memberIds: ["peter_hoffmann", "daniel_klein"],
    memberCount: 18 
  },
  { 
    id: "grp_elternbeirat", 
    name: "Elternbeirat", 
    description: "Elternvertreter der Jugendmannschaften",
    memberIds: ["lena_schneider", "peter_hoffmann", "petra_weber"],
    memberCount: 15 
  },
  { 
    id: "grp_ok_fasching", 
    name: "OK Fasching 2026", 
    description: "Organisationskomitee für den Vereinsfasching",
    memberIds: ["patrick_steuble", "lena_schneider", "thomas_mueller", "sabine_weber"],
    memberCount: 9 
  },
  { 
    id: "grp_helfer_pool", 
    name: "Helfer-Pool", 
    description: "Freiwillige Helfer für Vereinsveranstaltungen",
    memberIds: ["lena_schneider", "peter_hoffmann", "petra_weber", "daniel_klein"],
    memberCount: 42 
  }
];

// ==========================================
// CLUB MEMBERS (simplified for audience resolution)
// ==========================================
export interface ClubMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  departmentIds: string[];
  groupIds: string[];
  role: "admin" | "member" | "coach" | "parent" | "player";
  isMinor: boolean;
  parentId?: string;
}

export const mockClubMembers: ClubMember[] = [
  // Admin
  {
    id: "patrick_steuble",
    firstName: "Patrick",
    lastName: "Steuble",
    email: "patrick.steuble@sfb.de",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football"],
    groupIds: ["grp_vorstand", "grp_ok_fasching"],
    role: "admin",
    isMinor: false
  },
  // Lena - Adult player + Parent
  {
    id: "lena_schneider",
    firstName: "Lena",
    lastName: "Schneider",
    email: "lena.schneider@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football", "dept_fitness"],
    groupIds: ["grp_elternbeirat", "grp_ok_fasching", "grp_helfer_pool"],
    role: "parent",
    isMinor: false
  },
  // Flurina - Child of Lena
  {
    id: "flurina_schneider",
    firstName: "Flurina",
    lastName: "Schneider",
    email: "",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_volleyball"],
    groupIds: [],
    role: "player",
    isMinor: true,
    parentId: "lena_schneider"
  },
  // Max - Child of Lena
  {
    id: "max_schneider",
    firstName: "Max",
    lastName: "Schneider",
    email: "",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football"],
    groupIds: [],
    role: "player",
    isMinor: true,
    parentId: "lena_schneider"
  },
  // Anna - Minor WITHOUT parent linked
  {
    id: "anna_berger",
    firstName: "Anna",
    lastName: "Berger",
    email: "",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_volleyball"],
    groupIds: [],
    role: "player",
    isMinor: true
    // No parentId - special case
  },
  // Coaches
  {
    id: "coach_marco",
    firstName: "Marco",
    lastName: "Weber",
    email: "marco.weber@sfb.de",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football"],
    groupIds: ["grp_jugendleitung"],
    role: "coach",
    isMinor: false
  },
  {
    id: "coach_katja",
    firstName: "Katja",
    lastName: "Müller",
    email: "katja.mueller@sfb.de",
    avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_volleyball"],
    groupIds: ["grp_jugendleitung"],
    role: "coach",
    isMinor: false
  },
  // Other parents
  {
    id: "peter_hoffmann",
    firstName: "Peter",
    lastName: "Hoffmann",
    email: "peter.hoffmann@example.com",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football"],
    groupIds: ["grp_schiedsrichter", "grp_elternbeirat", "grp_helfer_pool"],
    role: "parent",
    isMinor: false
  },
  {
    id: "petra_weber",
    firstName: "Petra",
    lastName: "Weber",
    email: "petra.weber@example.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_volleyball"],
    groupIds: ["grp_elternbeirat", "grp_helfer_pool"],
    role: "parent",
    isMinor: false
  },
  // Board members
  {
    id: "thomas_mueller",
    firstName: "Thomas",
    lastName: "Müller",
    email: "thomas.mueller@sfb.de",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50&h=50&fit=crop&crop=face",
    departmentIds: [],
    groupIds: ["grp_vorstand", "grp_ok_fasching"],
    role: "admin",
    isMinor: false
  },
  {
    id: "sabine_weber",
    firstName: "Sabine",
    lastName: "Weber",
    email: "sabine.weber@sfb.de",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&h=50&fit=crop&crop=face",
    departmentIds: [],
    groupIds: ["grp_vorstand", "grp_ok_fasching"],
    role: "admin",
    isMinor: false
  },
  {
    id: "daniel_klein",
    firstName: "Daniel",
    lastName: "Klein",
    email: "daniel.klein@example.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
    departmentIds: ["dept_football"],
    groupIds: ["grp_schiedsrichter", "grp_helfer_pool"],
    role: "parent",
    isMinor: false
  }
];

// ==========================================
// HELPER: Create status history
// ==========================================
function createHistory(...entries: { status: EventStatus; daysAgo: number; reason?: string }[]): StatusHistoryEntry[] {
  return entries.map(e => ({
    status: e.status,
    timestamp: new Date(Date.now() - e.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
    userId: ADMIN_USER.id,
    userName: ADMIN_USER.name,
    reason: e.reason
  }));
}

// ==========================================
// CLUB EVENTS
// ==========================================
export const mockClubEvents: ClubEvent[] = [
  // ═══════════════════════════════════════════
  // 1. JAHRESHAUPTVERSAMMLUNG - Public / All Members
  // ═══════════════════════════════════════════
  {
    id: "evt_jhv_2026",
    title: "Jahreshauptversammlung 2026",
    description: "Ordentliche Mitgliederversammlung mit Jahresbericht, Entlastung des Vorstands, Neuwahlen und Ausblick auf das kommende Jahr. Anträge bitte bis 01.02.2026 schriftlich einreichen.",
    date: "2026-02-15",
    startTime: "19:00",
    endTime: "22:00",
    location: "Vereinsheim - Großer Saal",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    audience: {
      mode: "all" as AudienceMode
    },
    resolvedMemberCount: 394,
    visibility: "public" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-02-10T23:59:00",
    maxParticipants: 150,
    rsvpStats: {
      invited: 394,
      confirmed: 67,
      declined: 23,
      pending: 304,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 45 },
      { status: "published", daysAgo: 30 }
    ),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Versammlung",
    tags: ["Pflichttermin", "Wahlen"]
  },

  // ═══════════════════════════════════════════
  // 2. ELTERNABEND JUGEND - Private / Football Department
  // ═══════════════════════════════════════════
  {
    id: "evt_elternabend_fussball",
    title: "Elternabend Jugendfußball",
    description: "Informationsabend für alle Eltern der Jugendmannschaften (U8 bis U17). Themen: Saisonplanung, Trainingscamp Sommer, Elternmitarbeit bei Heimspielen, Fahrgemeinschaften.",
    date: "2026-01-30",
    startTime: "19:00",
    endTime: "21:00",
    location: "Vereinsheim - Sitzungszimmer",
    audience: {
      mode: "departments" as AudienceMode,
      departmentIds: ["dept_football"]
    },
    resolvedMemberCount: 156,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-01-28T18:00:00",
    maxParticipants: 60,
    rsvpStats: {
      invited: 156,
      confirmed: 34,
      declined: 12,
      pending: 110,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 14 },
      { status: "published", daysAgo: 10 }
    ),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Elternabend"
  },

  // ═══════════════════════════════════════════
  // 3. OK FASCHING - Private / Custom Group / Recurring
  // ═══════════════════════════════════════════
  {
    id: "evt_ok_fasching_1",
    title: "OK-Sitzung Vereinsfasching",
    description: "Regelmäßige Planungssitzung des Organisationskomitees für den Vereinsfasching 2026. Bitte Aufgabenliste aus letzter Sitzung mitbringen.",
    date: "2026-01-27",
    startTime: "19:30",
    endTime: "21:00",
    location: "Vereinsheim - Kleiner Besprechungsraum",
    audience: {
      mode: "groups" as AudienceMode,
      groupIds: ["grp_ok_fasching"]
    },
    resolvedMemberCount: 9,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-01-26T18:00:00",
    rsvpStats: {
      invited: 9,
      confirmed: 7,
      declined: 1,
      pending: 1,
      waitlist: 0
    },
    recurrence: {
      enabled: true,
      frequency: "weekly",
      weekdays: [1], // Monday
      until: "2026-02-22"
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 21 },
      { status: "published", daysAgo: 18 }
    ),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Organisationssitzung"
  },

  // ═══════════════════════════════════════════
  // 4. SCHIRI-WORKSHOP - Private / Schiedsrichter Group
  // ═══════════════════════════════════════════
  {
    id: "evt_schiri_workshop",
    title: "Schiedsrichter-Workshop: Regeländerungen 2026",
    description: "Pflichtfortbildung für alle aktiven Schiedsrichter. Wir besprechen die neuen Regeländerungen zur Rückrunde und machen praktische Übungen zu schwierigen Spielsituationen.",
    date: "2026-02-08",
    startTime: "10:00",
    endTime: "14:00",
    location: "Vereinsheim + Sportplatz",
    audience: {
      mode: "groups" as AudienceMode,
      groupIds: ["grp_schiedsrichter"]
    },
    resolvedMemberCount: 18,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-02-05T23:59:00",
    maxParticipants: 20,
    rsvpStats: {
      invited: 18,
      confirmed: 14,
      declined: 2,
      pending: 2,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 28 },
      { status: "published", daysAgo: 21 }
    ),
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Workshop",
    tags: ["Pflichtfortbildung"]
  },

  // ═══════════════════════════════════════════
  // 5. VEREINSFASCHING - Public / All
  // ═══════════════════════════════════════════
  {
    id: "evt_vereinsfasching",
    title: "Vereinsfasching 2026",
    description: "Großer Vereinsfasching für die ganze Familie! Mit DJ, Kinderprogramm, Tombola und Buffet. Kostüme erwünscht! 🎭🎉",
    date: "2026-02-22",
    startTime: "15:00",
    endTime: "22:00",
    location: "Vereinsheim - Großer Saal",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop",
    audience: {
      mode: "all" as AudienceMode
    },
    resolvedMemberCount: 394,
    visibility: "public" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-02-18T23:59:00",
    maxParticipants: 200,
    rsvpStats: {
      invited: 394,
      confirmed: 89,
      declined: 45,
      pending: 260,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 60 },
      { status: "published", daysAgo: 45 }
    ),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Fest"
  },

  // ═══════════════════════════════════════════
  // 6. VORSTANDSSITZUNG - Private / Vorstand Group
  // ═══════════════════════════════════════════
  {
    id: "evt_vorstand_sitzung",
    title: "Vorstandssitzung Februar",
    description: "Monatliche Vorstandssitzung. Tagesordnung: Finanzbericht, Vorbereitung JHV, Personalangelegenheiten, Sonstiges.",
    date: "2026-02-03",
    startTime: "19:00",
    endTime: "21:30",
    location: "Vereinsheim - Sitzungszimmer",
    audience: {
      mode: "groups" as AudienceMode,
      groupIds: ["grp_vorstand"]
    },
    resolvedMemberCount: 8,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-02-02T12:00:00",
    rsvpStats: {
      invited: 8,
      confirmed: 6,
      declined: 1,
      pending: 1,
      waitlist: 0
    },
    recurrence: {
      enabled: true,
      frequency: "monthly",
      until: "2026-12-31"
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 7 },
      { status: "published", daysAgo: 5 }
    ),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Sitzung"
  },

  // ═══════════════════════════════════════════
  // 7. HELFER-EINSATZ SPORTFEST (Draft)
  // ═══════════════════════════════════════════
  {
    id: "evt_helfer_sportfest",
    title: "Helfer-Einsatz Sportfest",
    description: "Wir brauchen Helfer für den Auf- und Abbau sowie die Betreuung der Stationen beim Sportfest. Verpflegung wird gestellt!",
    date: "2026-06-14",
    startTime: "08:00",
    endTime: "18:00",
    location: "Sportgelände",
    audience: {
      mode: "groups" as AudienceMode,
      groupIds: ["grp_helfer_pool"]
    },
    resolvedMemberCount: 42,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-06-10T23:59:00",
    maxParticipants: 30,
    rsvpStats: {
      invited: 0,
      confirmed: 0,
      declined: 0,
      pending: 0,
      waitlist: 0
    },
    status: "draft" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 2 }
    ),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Helfereinsatz"
  },

  // ═══════════════════════════════════════════
  // 8. ABGESAGTER EVENT (Cancelled)
  // ═══════════════════════════════════════════
  {
    id: "evt_neujahrsempfang",
    title: "Neujahrsempfang 2026",
    description: "Traditioneller Neujahrsempfang mit Sektempfang und Ausblick auf das neue Jahr.",
    date: "2026-01-11",
    startTime: "11:00",
    endTime: "14:00",
    location: "Vereinsheim - Großer Saal",
    audience: {
      mode: "all" as AudienceMode
    },
    resolvedMemberCount: 394,
    visibility: "public" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-01-08T23:59:00",
    maxParticipants: 100,
    rsvpStats: {
      invited: 394,
      confirmed: 45,
      declined: 67,
      pending: 282,
      waitlist: 0
    },
    status: "cancelled" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 45 },
      { status: "published", daysAgo: 30 },
      { status: "cancelled", daysAgo: 18, reason: "Wasserschaden im Vereinsheim - Sanierung läuft" }
    ),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Empfang"
  },

  // ═══════════════════════════════════════════
  // 9. VERGANGENER EVENT (Completed)
  // ═══════════════════════════════════════════
  {
    id: "evt_weihnachtsfeier_2025",
    title: "Vereins-Weihnachtsfeier 2025",
    description: "Gemütliche Weihnachtsfeier mit Glühwein, Plätzchen und Geschenken für die Kinder.",
    date: "2025-12-14",
    startTime: "15:00",
    endTime: "20:00",
    location: "Vereinsheim - Großer Saal",
    bannerImage: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=400&fit=crop",
    audience: {
      mode: "all" as AudienceMode
    },
    resolvedMemberCount: 394,
    visibility: "public" as EventVisibility,
    rsvpRequired: true,
    maxParticipants: 150,
    rsvpStats: {
      invited: 394,
      confirmed: 112,
      declined: 89,
      pending: 0,
      waitlist: 0
    },
    status: "completed" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 90 },
      { status: "published", daysAgo: 75 },
      { status: "completed", daysAgo: 42 }
    ),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Fest"
  },

  // ═══════════════════════════════════════════
  // 10. VOLLEYBALL ABTEILUNGSVERSAMMLUNG
  // ═══════════════════════════════════════════
  {
    id: "evt_vb_abteilung",
    title: "Abteilungsversammlung Volleyball",
    description: "Jahresversammlung der Volleyballabteilung. Rückblick Saison, Trainerwechsel, Planungen für die Hallensaison.",
    date: "2026-02-20",
    startTime: "19:00",
    endTime: "21:00",
    location: "Vereinsheim - Sitzungszimmer",
    audience: {
      mode: "departments" as AudienceMode,
      departmentIds: ["dept_volleyball"]
    },
    resolvedMemberCount: 48,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-02-18T18:00:00",
    rsvpStats: {
      invited: 48,
      confirmed: 22,
      declined: 8,
      pending: 18,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 14 },
      { status: "published", daysAgo: 10 }
    ),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Versammlung"
  },

  // ═══════════════════════════════════════════
  // 11. SPORTPLATZTAG - All Day Event
  // ═══════════════════════════════════════════
  {
    id: "evt_sportplatztag",
    title: "Sportplatztag - Arbeitseinsatz",
    description: "Ganztägiger Arbeitseinsatz für die Pflege unserer Sportanlagen. Kommt vorbei, wann es euch passt! Verpflegung wird gestellt. 🔧⚽",
    date: "2026-03-15",
    isAllDay: true,
    startTime: "00:00",
    endTime: "23:59",
    location: "Sportgelände",
    bannerImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    audience: {
      mode: "groups" as AudienceMode,
      groupIds: ["grp_helfer_pool"]
    },
    resolvedMemberCount: 42,
    visibility: "private" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-03-12T23:59:00",
    rsvpStats: {
      invited: 42,
      confirmed: 18,
      declined: 5,
      pending: 19,
      waitlist: 0
    },
    status: "published" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 21 },
      { status: "published", daysAgo: 14 }
    ),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Arbeitseinsatz"
  },

  // ═══════════════════════════════════════════
  // 12. SOMMERCAMP - All Day Event Draft
  // ═══════════════════════════════════════════
  {
    id: "evt_sommercamp",
    title: "Jugend-Sommercamp 2026",
    description: "Einwöchiges Sommercamp für alle Jugendlichen von 10-16 Jahren. Fußball, Volleyball, Schwimmen, Lagerfeuer und mehr!",
    date: "2026-08-03",
    isAllDay: true,
    startTime: "00:00",
    endTime: "23:59",
    location: "Sportcamp Bodensee",
    bannerImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop",
    audience: {
      mode: "all" as AudienceMode
    },
    resolvedMemberCount: 89,
    visibility: "public" as EventVisibility,
    rsvpRequired: true,
    rsvpDeadline: "2026-06-30T23:59:00",
    maxParticipants: 50,
    rsvpStats: {
      invited: 89,
      confirmed: 0,
      declined: 0,
      pending: 89,
      waitlist: 0
    },
    status: "draft" as EventStatus,
    statusHistory: createHistory(
      { status: "draft", daysAgo: 3 }
    ),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: ADMIN_USER.id,
    createdByName: ADMIN_USER.name,
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "Camp",
    tags: ["Jugend", "Sommer"]
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getEventById(id: string): ClubEvent | undefined {
  return mockClubEvents.find(e => e.id === id);
}

export function getDepartmentById(id: string): Department | undefined {
  return mockDepartments.find(d => d.id === id);
}

export function getGroupById(id: string): CustomGroup | undefined {
  return mockGroups.find(g => g.id === id);
}

export function getMemberById(id: string): ClubMember | undefined {
  return mockClubMembers.find(m => m.id === id);
}

export function getAudienceDescription(event: ClubEvent): string {
  switch (event.audience.mode) {
    case "all":
      return "Alle Mitglieder";
    case "departments":
      const depts = event.audience.departmentIds
        ?.map(id => getDepartmentById(id)?.name)
        .filter(Boolean)
        .join(", ");
      return depts || "Ausgewählte Abteilungen";
    case "groups":
      const groups = event.audience.groupIds
        ?.map(id => getGroupById(id)?.name)
        .filter(Boolean)
        .join(", ");
      return groups || "Ausgewählte Gruppen";
    case "manual":
      return `${event.audience.memberIds?.length || 0} ausgewählte Mitglieder`;
    default:
      return "";
  }
}

// Resolve full audience member list
export function resolveEventAudience(event: ClubEvent): ClubMember[] {
  const memberIds = new Set<string>();

  switch (event.audience.mode) {
    case "all":
      return mockClubMembers;

    case "departments":
      if (event.audience.departmentIds) {
        mockClubMembers.forEach(m => {
          if (m.departmentIds.some(dId => event.audience.departmentIds!.includes(dId))) {
            memberIds.add(m.id);
          }
        });
      }
      break;

    case "groups":
      if (event.audience.groupIds) {
        event.audience.groupIds.forEach(gId => {
          const group = getGroupById(gId);
          group?.memberIds.forEach(mId => memberIds.add(mId));
        });
      }
      break;

    case "manual":
      if (event.audience.memberIds) {
        event.audience.memberIds.forEach(mId => memberIds.add(mId));
      }
      break;
  }

  return mockClubMembers.filter(m => memberIds.has(m.id));
}
