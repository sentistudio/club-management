// ========= ENHANCED CHATS FEATURE =========
// Based on Chat Logic Design System (Section 6-7)
// STORY: The Schneider Family at Sportfreunde Burkhardsfelden
// - Lena (p11, Mother): Fitness Morgengruppe, Frauen Ü40 Football
// - Flurina (p12, Daughter, 15): Volleyball U16 Mädchen
// - Max (p13, Son, 11): Fußball U12
//
// VISIBILITY RULES:
// - Lena sees ONLY her own team chats when logged in as herself
// - Flurina sees ONLY her Volleyball U16 chats
// - Max sees ONLY his Football U12 chats
// - When Lena switches context to Flurina/Max, she sees THEIR chats

// ========= TYPES & INTERFACES =========

export type PlayerState = "MINOR_PLAYER" | "ADULT_PLAYER_PENDING" | "ADULT_PLAYER";
export type TeamType = "youth_team" | "adult_team";
export type UserRole = "admin" | "coach" | "adult_player" | "minor" | "parent";
export type ChatType = "announcement" | "team_group" | "direct";
export type MessageVisibility = "all" | "parents_only" | "logged_monitored";

export interface ChatParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  playerState?: PlayerState;
  linkedParentId?: string;
  linkedChildIds?: string[];
  canPost: boolean;
  canReply: boolean;
  isAutoIncluded?: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  description?: string;
  participants: ChatParticipant[];
  teamId?: string;
  teamName?: string;
  teamType?: TeamType;
  departmentId?: string;
  departmentName?: string;
  visibleToProfiles: string[];
  settings: {
    repliesEnabled: boolean;
    reactionsOnly?: boolean;
    parentVisibility: boolean;
    messageMonitoring: boolean;
    minorPostingAllowed: boolean;
  };
  isLocked: boolean;
  isMuted: boolean;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  visibleToParent?: boolean;
  parentNotified?: boolean;
  onBehalfOf?: {
    childId: string;
    childName: string;
  };
  isDeleted?: boolean;
  deletedBy?: string;
  deletedAt?: string;
  isReported?: boolean;
  reportReason?: string;
  reactions?: Record<string, number>;
}

export interface ChatSettings {
  enabled: boolean;
  allowDirectMessages: boolean;
  allowGroupChats: boolean;
  teamGroupChatsEnabled: boolean;
  announcementChannelsEnabled: boolean;
  minorDMsAllowed: boolean;
  parentAutoIncludeInYouthChats: boolean;
  parentMirrorMinorMessages: boolean;
  messageRetentionDays: number;
  exportEnabled: boolean;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
  requiresParent?: boolean;
}

// ========= MESSAGE REPORTS =========
// Reports are submitted by members and appear in both:
// 1. Admin Inbox (as a ticket)
// 2. Chat Moderation (in "Achtung" section)

export type ReportCategory = 
  | "inappropriate_content"    // Unangemessene Inhalte
  | "harassment"               // Belästigung
  | "bullying"                 // Mobbing
  | "spam"                     // Spam
  | "safety_concern"           // Sicherheitsbedenken
  | "other";                   // Sonstiges

export interface ChatReport {
  id: string;
  chatId: string;
  messageId?: string;           // Optional: specific message reported
  reportedMessageContent?: string; // Snapshot of the reported message
  reportedUserId?: string;      // Who was reported
  reportedUserName?: string;
  reporterId: string;
  reporterName: string;
  category: ReportCategory;
  description: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  resolution?: string;
  linkedTicketId?: string;      // Links to inbox ticket
}

export const REPORT_CATEGORIES: { value: ReportCategory; label: string; description: string }[] = [
  { value: "inappropriate_content", label: "Unangemessene Inhalte", description: "Beleidigungen, anstößige Sprache" },
  { value: "harassment", label: "Belästigung", description: "Unerwünschte wiederholte Kontaktaufnahme" },
  { value: "bullying", label: "Mobbing", description: "Systematisches Ausgrenzen oder Schikanieren" },
  { value: "spam", label: "Spam", description: "Werbung oder unerwünschte Nachrichten" },
  { value: "safety_concern", label: "Sicherheitsbedenken", description: "Bedrohung oder gefährliches Verhalten" },
  { value: "other", label: "Sonstiges", description: "Andere Verstöße gegen die Vereinsregeln" }
];

// Mock reports for demo
export const mockChatReports: ChatReport[] = [
  {
    id: "report_1",
    chatId: "team_vb_u16",
    messageId: "vb_u16_demo_report",
    reportedMessageContent: "Du bist ja eh die Schlechteste im Team...",
    reportedUserId: "emma",
    reportedUserName: "Emma Meier",
    reporterId: "p11",  // Lena Schneider
    reporterName: "Lena Schneider",
    category: "bullying",
    description: "Eine Spielerin hat meine Tochter Flurina im Team-Chat beleidigt. Das ist nicht das erste Mal.",
    status: "pending",
    createdAt: "2026-01-14T10:30:00",
    linkedTicketId: "tkt_report_1"
  }
];

// Helper function to check if a chat has pending reports
export function chatHasReport(chatId: string): ChatReport | undefined {
  return mockChatReports.find(r => r.chatId === chatId && (r.status === "pending" || r.status === "reviewing"));
}

export function getReportsForChat(chatId: string): ChatReport[] {
  return mockChatReports.filter(r => r.chatId === chatId);
}

// ========= PERMISSION MATRIX =========

export const PERMISSION_MATRIX = {
  createTeamChat: { admin: false, coach: true, adult_player: false, minor: false, parent: false },
  postAnnouncements: { admin: true, coach: true, adult_player: false, minor: false, parent: false },
  dmCoach: { admin: false, coach: null, adult_player: true, minor: false, parent: true },
  dmMinor: { admin: false, coach: false, adult_player: false, minor: false, parent: null },
  viewChildChats: { admin: true, coach: null, adult_player: null, minor: null, parent: true },
  deleteMessages: { admin: true, coach: "own", adult_player: "own", minor: false, parent: false }
} as const;

export const DIRECT_CHAT_RULES: Record<string, { allowed: boolean; conditions?: string }> = {
  "coach_adult_player": { allowed: true },
  "player_player": { allowed: true, conditions: "Same team only" },
  "coach_minor": { allowed: false, conditions: "Never allowed alone" },
  "coach_minor_parent": { allowed: true, conditions: "Parent required" },
  "parent_coach": { allowed: true }
};

export const mockChatSettings: ChatSettings = {
  enabled: true,
  allowDirectMessages: true,
  allowGroupChats: true,
  teamGroupChatsEnabled: true,
  announcementChannelsEnabled: true,
  minorDMsAllowed: false,
  parentAutoIncludeInYouthChats: true,
  parentMirrorMinorMessages: true,
  messageRetentionDays: 365,
  exportEnabled: true
};

// ========= PARTICIPANT DEFINITIONS =========

const COACH_SANDRA: ChatParticipant = {
  id: "sandra", name: "Trainerin Sandra",
  avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=100",
  role: "coach", canPost: true, canReply: true
};

const COACH_BERND: ChatParticipant = {
  id: "bernd", name: "Trainer Bernd",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
  role: "coach", canPost: true, canReply: true
};

const COACH_KATJA: ChatParticipant = {
  id: "katja", name: "Trainerin Katja",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
  role: "coach", canPost: true, canReply: true
};

const COACH_MARCO: ChatParticipant = {
  id: "marco", name: "Trainer Marco",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  role: "coach", canPost: true, canReply: true
};

// ADMIN_PATRICK removed - no longer used after removing club-wide announcements
// const ADMIN_PATRICK: ChatParticipant = {
//   id: "p1", name: "Patrick Steuble",
//   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
//   role: "admin", canPost: true, canReply: true
// };

const PLAYER_LENA: ChatParticipant = {
  id: "p11", name: "Lena Schneider",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  role: "adult_player", playerState: "ADULT_PLAYER",
  linkedChildIds: ["p12", "p13"], canPost: true, canReply: true
};

const PARENT_LENA: ChatParticipant = {
  id: "p11", name: "Lena Schneider",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
  role: "parent", linkedChildIds: ["p12", "p13"],
  canPost: true, canReply: true, isAutoIncluded: true
};

const PLAYER_FLURINA: ChatParticipant = {
  id: "p12", name: "Flurina Schneider",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
  role: "minor", playerState: "MINOR_PLAYER",
  linkedParentId: "p11", canPost: true, canReply: true
};

const PLAYER_MAX: ChatParticipant = {
  id: "p13", name: "Max Schneider",
  avatar: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=100",
  role: "minor", playerState: "MINOR_PLAYER",
  linkedParentId: "p11", canPost: true, canReply: true
};

const PLAYER_CLAUDIA: ChatParticipant = {
  id: "claudia", name: "Claudia Weber",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
  role: "adult_player", playerState: "ADULT_PLAYER", canPost: true, canReply: true
};

const PLAYER_PETRA: ChatParticipant = {
  id: "petra", name: "Petra Müller",
  avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100",
  role: "adult_player", playerState: "ADULT_PLAYER", canPost: true, canReply: true
};

const PARENT_ANDREA: ChatParticipant = {
  id: "andrea", name: "Andrea Meier",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
  role: "parent", linkedChildIds: ["emma"],
  canPost: true, canReply: true, isAutoIncluded: true
};

const PARENT_THOMAS: ChatParticipant = {
  id: "thomas", name: "Thomas Bauer",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  role: "parent", linkedChildIds: ["leon"],
  canPost: true, canReply: true, isAutoIncluded: true
};

// ========= ANNA BERGER - MINOR WITHOUT GUARDIAN =========
// Anna is 14, in Flurina's volleyball team, but has NO linked parent/guardian
// This triggers special restrictions: NO DMs allowed at all
const PLAYER_ANNA: ChatParticipant = {
  id: "p14", name: "Anna Berger",
  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100",  // Young girl photo
  role: "minor", playerState: "MINOR_PLAYER",
  linkedParentId: undefined,  // NO GUARDIAN LINKED!
  canPost: false, canReply: false  // Cannot interact - no guardian!
};

// ========= CHAT INSTANCES =========
// NOTE: Club-wide announcements removed - only TEAM-BASED announcements now

export const mockChats: Chat[] = [
  // =============================================
  // LENA'S OWN CHATS (p11 only - her teams)
  // =============================================
  
  // Fitness Announcement - LENA ONLY
  {
    id: "announce_fitness",
    type: "announcement",
    name: "Fitness Ankündigungen",
    description: "Infos für die Fitness Morgengruppe",
    participants: [COACH_SANDRA],
    teamId: "team_fitness", teamName: "Fitness – Morgengruppe",
    teamType: "adult_team", departmentId: "dept_fitness", departmentName: "Fitness",
    visibleToProfiles: ["p11"],  // ONLY Lena
    settings: {
      repliesEnabled: false, reactionsOnly: true,
      parentVisibility: false, messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "ann_fit_1", chatId: "announce_fitness",
      senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
      content: "🏋️ Neue Geräte sind da! Ab Montag Einweisungen möglich.",
      createdAt: "2026-01-13T07:00:00", isRead: false
    },
    unreadCount: 1, createdAt: "2024-01-15T00:00:00",
    updatedAt: "2026-01-13T07:00:00", createdBy: "sandra"
  },
  
  // Fitness Team Chat - LENA ONLY
  {
    id: "team_fitness",
    type: "team_group",
    name: "Fitness – Morgengruppe",
    description: "Koordination und Austausch",
    participants: [COACH_SANDRA, PLAYER_LENA, PLAYER_PETRA],
    teamId: "team_fitness", teamName: "Fitness – Morgengruppe",
    teamType: "adult_team", departmentId: "dept_fitness", departmentName: "Fitness",
    visibleToProfiles: ["p11"],
    settings: {
      repliesEnabled: true, parentVisibility: false,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "fit_5", chatId: "team_fitness",
      senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
      content: "Denkt an eure Matten für morgen! 🧘‍♀️",
      createdAt: "2026-01-13T18:45:00", isRead: false
    },
    unreadCount: 2, createdAt: "2024-01-01T00:00:00",
    updatedAt: "2026-01-13T18:45:00", createdBy: "sandra"
  },
  
  // DM: Lena ↔ Sandra - LENA ONLY
  {
    id: "dm_lena_sandra",
    type: "direct",
    name: "Trainerin Sandra",
    participants: [COACH_SANDRA, PLAYER_LENA],
    teamId: "team_fitness", departmentId: "dept_fitness", departmentName: "Fitness",
    visibleToProfiles: ["p11"],
    settings: {
      repliesEnabled: true, parentVisibility: false,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "dm_ls_4", chatId: "dm_lena_sandra",
      senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
      content: "Danke für den tollen Kurs heute! 💪",
      createdAt: "2026-01-13T08:30:00", isRead: true
    },
    unreadCount: 0, createdAt: "2024-03-01T00:00:00",
    updatedAt: "2026-01-13T08:30:00", createdBy: "p11"
  },
  
  // Frauen Ü40 Announcement - LENA ONLY
  {
    id: "announce_ue40",
    type: "announcement",
    name: "Frauen Ü40 Ankündigungen",
    description: "Wichtige Infos für die Frauen Ü40",
    participants: [COACH_BERND],
    teamId: "team_ue40", teamName: "Frauen Ü40",
    teamType: "adult_team", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p11"],  // ONLY Lena
    settings: {
      repliesEnabled: false, reactionsOnly: true,
      parentVisibility: false, messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "ann_ue40_1", chatId: "announce_ue40",
      senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
      content: "⚽ Auswärtsspiel Sonntag 14:00 gegen SV Grünberg - Treffpunkt 12:30 am Vereinsheim!",
      createdAt: "2026-01-13T10:00:00", isRead: false
    },
    unreadCount: 1, createdAt: "2024-01-15T00:00:00",
    updatedAt: "2026-01-13T10:00:00", createdBy: "bernd"
  },
  
  // Frauen Ü40 Team Chat - LENA ONLY
  {
    id: "team_frauen_ue40",
    type: "team_group",
    name: "Frauen Ü40 – Fußball",
    description: "Koordination und Austausch",
    participants: [COACH_BERND, PLAYER_LENA, PLAYER_CLAUDIA],
    teamId: "team_ue40", teamName: "Frauen Ü40",
    teamType: "adult_team", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p11"],
    settings: {
      repliesEnabled: true, parentVisibility: false,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "ue40_5", chatId: "team_frauen_ue40",
      senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
      content: "Auswärtsspiel am Sonntag - wer fährt mit? 🚌",
      createdAt: "2026-01-13T16:20:00", isRead: false
    },
    unreadCount: 3, createdAt: "2024-01-01T00:00:00",
    updatedAt: "2026-01-13T16:20:00", createdBy: "bernd"
  },
  
  // DM: Lena ↔ Bernd - LENA ONLY
  {
    id: "dm_lena_bernd",
    type: "direct",
    name: "Trainer Bernd",
    participants: [COACH_BERND, PLAYER_LENA],
    teamId: "team_ue40", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p11"],
    settings: {
      repliesEnabled: true, parentVisibility: false,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "dm_lb_3", chatId: "dm_lena_bernd",
      senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
      content: "Super Einsatz beim letzten Spiel! Weiter so! ⚽",
      createdAt: "2026-01-12T19:00:00", isRead: true
    },
    unreadCount: 0, createdAt: "2024-06-01T00:00:00",
    updatedAt: "2026-01-12T19:00:00", createdBy: "p11"
  },

  // =============================================
  // FLURINA'S CHATS (p12 only - Volleyball U16)
  // =============================================
  
  // Volleyball U16 Announcement - FLURINA & ANNA
  {
    id: "announce_vb_u16",
    type: "announcement",
    name: "Volleyball U16 Ankündigungen",
    description: "Wichtige Infos für das U16 Team",
    participants: [COACH_KATJA],
    teamId: "team_vb_u16", teamName: "Volleyball U16 Mädchen",
    teamType: "youth_team", departmentId: "dept_volleyball", departmentName: "Volleyball",
    visibleToProfiles: ["p12", "p14"],  // FLURINA & ANNA (both in same team)
    settings: {
      repliesEnabled: false, reactionsOnly: true,
      parentVisibility: true, messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "ann_vb_1", chatId: "announce_vb_u16",
      senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
      content: "🏐 Morgen Punktspiel vs. TV Lich - bitte alle 13:30 da sein!",
      createdAt: "2026-01-13T19:00:00", isRead: false
    },
    unreadCount: 1, createdAt: "2024-01-15T00:00:00",
    updatedAt: "2026-01-13T19:00:00", createdBy: "katja"
  },
  
  // Volleyball U16 Team Chat - FLURINA & ANNA
  {
    id: "team_vb_u16",
    type: "team_group",
    name: "Volleyball U16 Mädchen",
    description: "Team-Chat (Eltern haben Einblick)",
    participants: [COACH_KATJA, PLAYER_FLURINA, PLAYER_ANNA, PARENT_LENA, PARENT_ANDREA],  // Anna added!
    teamId: "team_vb_u16", teamName: "Volleyball U16 Mädchen",
    teamType: "youth_team", departmentId: "dept_volleyball", departmentName: "Volleyball",
    visibleToProfiles: ["p12", "p14"],  // FLURINA & ANNA (both see this chat)
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: true
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "vb_u16_10", chatId: "team_vb_u16",
      senderId: "p14", senderName: "Anna Berger", senderRole: "minor",
      content: "Danke Trainerin! 🥹",
      createdAt: "2026-01-13T19:44:00", isRead: false,
      visibleToParent: false  // Anna has no parent linked!
    },
    unreadCount: 4, createdAt: "2024-02-01T00:00:00",
    updatedAt: "2026-01-13T19:44:00", createdBy: "katja"
  },
  
  // DM: Katja ↔ Flurina (with parent) - FLURINA ONLY
  {
    id: "dm_katja_flurina",
    type: "direct",
    name: "Trainerin Katja",
    description: "Gespräch mit Trainerin (Mama sieht mit)",
    participants: [COACH_KATJA, PLAYER_FLURINA, PARENT_LENA],
    teamId: "team_vb_u16", departmentId: "dept_volleyball", departmentName: "Volleyball",
    visibleToProfiles: ["p12"],  // FLURINA only
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: true
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "dm_kf_6", chatId: "dm_katja_flurina",
      senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
      content: "Vielen Dank! Flurina hat sich riesig gefreut! 😊",
      createdAt: "2026-01-13T19:45:00", isRead: true,
      onBehalfOf: { childId: "p12", childName: "Flurina" }
    },
    unreadCount: 0, createdAt: "2026-01-10T00:00:00",
    updatedAt: "2026-01-13T19:45:00", createdBy: "katja"
  },

  // =============================================
  // MAX'S CHATS (p13 only - Football U12)
  // =============================================
  
  // Football U12 Announcement - MAX ONLY
  {
    id: "announce_fb_u12",
    type: "announcement",
    name: "Fußball U12 Ankündigungen",
    description: "Wichtige Infos für das U12 Team",
    participants: [COACH_MARCO],
    teamId: "team_fb_u12", teamName: "Fußball U12",
    teamType: "youth_team", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p13"],  // MAX only
    settings: {
      repliesEnabled: false, reactionsOnly: true,
      parentVisibility: true, messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "ann_fb_1", chatId: "announce_fb_u12",
      senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
      content: "⚽ Morgen Heimspiel gegen JSG Laubach - alle um 10:00 am Platz!",
      createdAt: "2026-01-13T18:00:00", isRead: false
    },
    unreadCount: 1, createdAt: "2024-01-15T00:00:00",
    updatedAt: "2026-01-13T18:00:00", createdBy: "marco"
  },
  
  // Football U12 Team Chat - MAX ONLY
  {
    id: "team_fb_u12",
    type: "team_group",
    name: "Fußball U12 – SfB",
    description: "Team-Chat (Eltern haben Einblick)",
    participants: [COACH_MARCO, PLAYER_MAX, PARENT_LENA, PARENT_THOMAS],
    teamId: "team_fb_u12", teamName: "Fußball U12",
    teamType: "youth_team", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p13"],  // MAX only
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: true
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "fb_u12_8", chatId: "team_fb_u12",
      senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
      content: "Max ist dabei! Wir sind pünktlich um 10:00 da 👍",
      createdAt: "2026-01-13T18:20:00", isRead: true,
      onBehalfOf: { childId: "p13", childName: "Max" }
    },
    unreadCount: 0, createdAt: "2024-02-01T00:00:00",
    updatedAt: "2026-01-13T18:20:00", createdBy: "marco"
  },
  
  // DM: Marco ↔ Max (with parent) - MAX ONLY
  {
    id: "dm_marco_max",
    type: "direct",
    name: "Trainer Marco",
    description: "Gespräch mit Trainer (Mama sieht mit)",
    participants: [COACH_MARCO, PLAYER_MAX, PARENT_LENA],
    teamId: "team_fb_u12", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p13"],  // MAX only
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: true
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "dm_mm_5", chatId: "dm_marco_max",
      senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
      content: "Danke! Max strahlt über beide Ohren! ⚽",
      createdAt: "2026-01-13T17:45:00", isRead: true,
      onBehalfOf: { childId: "p13", childName: "Max" }
    },
    unreadCount: 0, createdAt: "2026-01-10T00:00:00",
    updatedAt: "2026-01-13T17:45:00", createdBy: "marco"
  },

  // =============================================
  // PARENT GROUPS (LENA only - she's the parent)
  // =============================================
  {
    id: "eltern_vb_u16",
    type: "team_group",
    name: "Elterngruppe Volleyball U16",
    description: "Austausch unter Eltern",
    participants: [PARENT_LENA, PARENT_ANDREA],
    teamId: "team_vb_u16", teamName: "Volleyball U16 Mädchen",
    teamType: "youth_team", departmentId: "dept_volleyball", departmentName: "Volleyball",
    visibleToProfiles: ["p11"],  // LENA only (parent group)
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "eltern_vb_3", chatId: "eltern_vb_u16",
      senderId: "andrea", senderName: "Andrea Meier", senderRole: "parent",
      content: "Wer bringt die Getränke zum Turnier? 🥤",
      createdAt: "2026-01-13T14:30:00", isRead: true
    },
    unreadCount: 0, createdAt: "2024-03-01T00:00:00",
    updatedAt: "2026-01-13T14:30:00", createdBy: "p11"
  },
  
  {
    id: "eltern_fb_u12",
    type: "team_group",
    name: "Elterngruppe Fußball U12",
    description: "Austausch unter Eltern",
    participants: [PARENT_LENA, PARENT_THOMAS],
    teamId: "team_fb_u12", teamName: "Fußball U12",
    teamType: "youth_team", departmentId: "dept_football", departmentName: "Fußball",
    visibleToProfiles: ["p11"],  // LENA only (parent group)
    settings: {
      repliesEnabled: true, parentVisibility: true,
      messageMonitoring: true, minorPostingAllowed: false
    },
    isLocked: false, isMuted: false,
    lastMessage: {
      id: "eltern_fb_4", chatId: "eltern_fb_u12",
      senderId: "thomas", senderName: "Thomas Bauer", senderRole: "parent",
      content: "Können wir Fahrgemeinschaft machen morgen? 🚗",
      createdAt: "2026-01-13T18:30:00", isRead: false
    },
    unreadCount: 1, createdAt: "2024-03-01T00:00:00",
    updatedAt: "2026-01-13T18:30:00", createdBy: "thomas"
  }
];

// ========= CHAT MESSAGES =========
// Coherent story with proper sender information

export const mockChatMessages: ChatMessage[] = [

  // =============================================
  // FITNESS ANKÜNDIGUNGEN - Sandra → Lena
  // =============================================
  {
    id: "ann_fit_1", chatId: "announce_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "🏋️ Neue Geräte sind da! Ab Montag stehen euch die neuen Kraft- und Ausdauergeräte zur Verfügung. Einweisungstermine könnt ihr ab sofort buchen.",
    createdAt: "2026-01-13T07:00:00", isRead: false
  },
  {
    id: "ann_fit_2", chatId: "announce_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "📅 Kursplan Änderung: Die Mittwoch-Einheit startet ab 07.01. um 07:00 statt 06:45 Uhr. Bitte entsprechend einplanen!",
    createdAt: "2026-01-08T08:00:00", isRead: true
  },
  {
    id: "ann_fit_3", chatId: "announce_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "❄️ Frohe Feiertage! Die Morgengruppe macht vom 23.12. bis 5.01. Pause. Wir starten fit und motiviert ins neue Jahr – bis dann! 💪",
    createdAt: "2025-12-22T09:00:00", isRead: true
  },
  {
    id: "ann_fit_4", chatId: "announce_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "🧘 Nächste Woche machen wir ausnahmsweise Yoga & Mobility statt Core-Training. Bringt bitte eine Matte mit!",
    createdAt: "2025-12-15T07:30:00", isRead: true
  },

  // =============================================
  // FRAUEN Ü40 ANKÜNDIGUNGEN - Bernd → Lena
  // =============================================
  {
    id: "ann_ue40_1", chatId: "announce_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "⚽ Auswärtsspiel Sonntag 14:00 gegen SV Grünberg – Treffpunkt 12:30 am Vereinsheim! Bitte rechtzeitig da sein.",
    createdAt: "2026-01-13T10:00:00", isRead: false
  },
  {
    id: "ann_ue40_2", chatId: "announce_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "🏆 Toller Sieg am Wochenende – 3:1 gegen FC Rabenau! Ihr seid großartig. Training Dienstag findet wie gewohnt statt.",
    createdAt: "2026-01-11T18:00:00", isRead: true,
    reactions: { "👍": 8, "🎉": 5, "❤️": 3 }
  },
  {
    id: "ann_ue40_3", chatId: "announce_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "📋 Kader für Samstag: Bitte bis Donnerstag 12 Uhr Rückmeldung, ob ihr spielen könnt. Wir brauchen mindestens 11 Zusagen.",
    createdAt: "2026-01-08T11:00:00", isRead: true
  },
  {
    id: "ann_ue40_4", chatId: "announce_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "❌ Training heute fällt leider aus – Platzsperrung wegen Frost. Nächster Termin: Dienstag 19:30 Uhr.",
    createdAt: "2026-01-06T15:00:00", isRead: true
  },
  {
    id: "ann_ue40_5", chatId: "announce_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "🎉 Willkommen im neuen Jahr! Vorbereitung auf die Rückrunde startet kommende Woche. Fitnesstests am Dienstag – bitte alle erscheinen!",
    createdAt: "2026-01-05T09:00:00", isRead: true,
    reactions: { "👍": 6, "🎉": 4 }
  },

  // =============================================
  // VOLLEYBALL U16 ANKÜNDIGUNGEN - Katja → Flurina & Anna
  // =============================================
  {
    id: "ann_vb_1", chatId: "announce_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "🏐 Morgen Punktspiel vs. TV Lich – bitte alle 13:30 Uhr da sein! Vereinstrikot und Volleyballschuhe nicht vergessen.",
    createdAt: "2026-01-13T19:00:00", isRead: false
  },
  {
    id: "ann_vb_2", chatId: "announce_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "✅ Klasse Trainingswoche! Besonders der Aufschlag ist deutlich besser geworden. Weiter so! 🌟",
    createdAt: "2026-01-10T18:00:00", isRead: true,
    reactions: { "👍": 7, "❤️": 4, "🎉": 2 }
  },
  {
    id: "ann_vb_3", chatId: "announce_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "📣 Kreismeisterschaft Anmeldung: Wir nehmen teil! Datum: 22. Februar in der Sporthalle Burkhardsfelden. Eltern sind herzlich eingeladen zuzuschauen.",
    createdAt: "2026-01-07T17:00:00", isRead: true
  },
  {
    id: "ann_vb_4", chatId: "announce_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "⚠️ Training am Freitag findet in der kleinen Halle statt (Umbau in Haupthalle). Treffpunkt Eingang C!",
    createdAt: "2026-01-05T16:30:00", isRead: true
  },
  {
    id: "ann_vb_5", chatId: "announce_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "🎄 Schöne Ferien euch allen! Training startet wieder am 8. Januar. Bleibt gesund und übt den Aufschlag zuhause 😄🏐",
    createdAt: "2025-12-20T15:00:00", isRead: true
  },

  // =============================================
  // FUßBALL U12 ANKÜNDIGUNGEN - Marco → Max
  // =============================================
  {
    id: "ann_fb_1", chatId: "announce_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "⚽ Morgen Heimspiel gegen JSG Laubach – alle um 10:00 Uhr am Platz! Treffpunkt Kabine 1. Eltern können an der Seitenlinie anfeuern.",
    createdAt: "2026-01-13T18:00:00", isRead: false
  },
  {
    id: "ann_fb_2", chatId: "announce_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "🏅 Super Training heute! Besonders die Passübungen haben geklappt. Nächste Woche konzentrieren wir uns auf Standardsituationen.",
    createdAt: "2026-01-11T17:30:00", isRead: true,
    reactions: { "👍": 5, "🎉": 3 }
  },
  {
    id: "ann_fb_3", chatId: "announce_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "👕 Trikots: Bitte alle Trikots bis Freitag gereinigt mitbringen – wir machen das Mannschaftsfoto vor dem Spiel!",
    createdAt: "2026-01-08T16:00:00", isRead: true
  },
  {
    id: "ann_fb_4", chatId: "announce_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "❄️ Training am Dienstag findet trotz Kälte statt – bitte warme Sachen anziehen! Stollen oder Winterschuhe empfohlen.",
    createdAt: "2026-01-06T14:00:00", isRead: true
  },
  {
    id: "ann_fb_5", chatId: "announce_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "🎉 Rückrunde startet! Spielplan ist raus – alle Termine findet ihr im Vereinskalender. Erstes Spiel: 28. Januar zu Hause gegen JSG Laubach!",
    createdAt: "2026-01-04T11:00:00", isRead: true
  },

  // =============================================
  // FITNESS TEAM CHAT - Lena's own team
  // =============================================
  {
    id: "fit_1", chatId: "team_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "Guten Morgen zusammen! 🌅",
    createdAt: "2026-01-13T06:00:00", isRead: true
  },
  {
    id: "fit_2", chatId: "team_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "Heute machen wir einen intensiven Core-Workout. Bringt gute Laune mit!",
    createdAt: "2026-01-13T06:05:00", isRead: true,
    reactions: { "😂": 3, "👍": 2 }
  },
  {
    id: "fit_3", chatId: "team_fitness",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
    content: "Super, ich freu mich! Bis gleich 💪",
    createdAt: "2026-01-13T06:30:00", isRead: true
  },
  {
    id: "fit_4", chatId: "team_fitness",
    senderId: "petra", senderName: "Petra Müller", senderRole: "adult_player",
    content: "Bin auch dabei! Meine Lieblingsübung 😊",
    createdAt: "2026-01-13T06:32:00", isRead: true
  },
  {
    id: "fit_5", chatId: "team_fitness",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "Denkt an eure Matten für morgen! 🧘‍♀️",
    createdAt: "2026-01-13T18:45:00", isRead: false
  },
  
  // =============================================
  // DM LENA ↔ SANDRA - Lena's direct chat
  // =============================================
  {
    id: "dm_ls_1", chatId: "dm_lena_sandra",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "Hallo Lena! Wie geht es deinem Rücken nach dem letzten Training?",
    createdAt: "2026-01-12T10:00:00", isRead: true
  },
  {
    id: "dm_ls_2", chatId: "dm_lena_sandra",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
    content: "Viel besser, danke der Nachfrage! Die Übungen haben wirklich geholfen.",
    createdAt: "2026-01-12T10:30:00", isRead: true
  },
  {
    id: "dm_ls_3", chatId: "dm_lena_sandra",
    senderId: "sandra", senderName: "Trainerin Sandra", senderRole: "coach",
    content: "Das freut mich! Mach weiter so mit den Dehnübungen zu Hause 🙏",
    createdAt: "2026-01-12T10:35:00", isRead: true
  },
  {
    id: "dm_ls_4", chatId: "dm_lena_sandra",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
    content: "Danke für den tollen Kurs heute! 💪",
    createdAt: "2026-01-13T08:30:00", isRead: true
  },
  
  // =============================================
  // FRAUEN Ü40 TEAM CHAT - Lena's football team
  // =============================================
  {
    id: "ue40_1", chatId: "team_frauen_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "Damen, tolles Training gestern! Ihr werdet immer besser ⚽",
    createdAt: "2026-01-12T19:00:00", isRead: true
  },
  {
    id: "ue40_2", chatId: "team_frauen_ue40",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
    content: "Danke Bernd! Hat richtig Spaß gemacht.",
    createdAt: "2026-01-12T19:15:00", isRead: true
  },
  {
    id: "ue40_3", chatId: "team_frauen_ue40",
    senderId: "claudia", senderName: "Claudia Weber", senderRole: "adult_player",
    content: "Ich kann fahren am Sonntag - habe Platz für 3 weitere! 🚗",
    createdAt: "2026-01-13T16:25:00", isRead: true,
    reactions: { "👍": 3, "❤️": 2 }
  },
  {
    id: "ue40_4", chatId: "team_frauen_ue40",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "adult_player",
    content: "Super Claudia! Ich fahre mit dir. Danke! 🙏",
    createdAt: "2026-01-13T16:28:00", isRead: true
  },
  {
    id: "ue40_5", chatId: "team_frauen_ue40",
    senderId: "bernd", senderName: "Trainer Bernd", senderRole: "coach",
    content: "Auswärtsspiel am Sonntag - wer fährt mit? 🚌",
    createdAt: "2026-01-13T16:20:00", isRead: false
  },
  
  // =============================================
  // VOLLEYBALL U16 TEAM CHAT - Flurina's team
  // Messages from Flurina, her mom Lena (on behalf), Coach, and other parents
  // =============================================
  {
    id: "vb_u16_1", chatId: "team_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "Super Leistung heute Mädels! 🌟",
    createdAt: "2026-01-12T19:00:00", isRead: true, visibleToParent: true
  },
  {
    id: "vb_u16_2", chatId: "team_vb_u16",
    senderId: "andrea", senderName: "Andrea Meier", senderRole: "parent",
    content: "Emma war begeistert! Das war ein tolles Training!",
    createdAt: "2026-01-12T19:05:00", isRead: true,
    onBehalfOf: { childId: "emma", childName: "Emma" }
  },
  {
    id: "vb_u16_3", chatId: "team_vb_u16",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Flurina hat es auch sehr gefallen! Sie übt fleißig weiter 🏐",
    createdAt: "2026-01-12T19:10:00", isRead: true,
    onBehalfOf: { childId: "p12", childName: "Flurina" }
  },
  {
    id: "vb_u16_4", chatId: "team_vb_u16",
    senderId: "p12", senderName: "Flurina Schneider", senderRole: "minor",
    content: "Das Aufschlagtraining war echt gut! Ich übe das nochmal daheim 🏐",
    createdAt: "2026-01-12T19:15:00", isRead: true, visibleToParent: true, parentNotified: true
  },
  {
    id: "vb_u16_5", chatId: "team_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "Morgen bitte alle in Vereinstrikot zum Spiel! 🏐",
    createdAt: "2026-01-13T19:30:00", isRead: false, visibleToParent: true
  },
  {
    id: "vb_u16_6", chatId: "team_vb_u16",
    senderId: "andrea", senderName: "Andrea Meier", senderRole: "parent",
    content: "Emma ist dabei und hat schon alles gepackt! 😊",
    createdAt: "2026-01-13T19:35:00", isRead: true,
    onBehalfOf: { childId: "emma", childName: "Emma" }
  },
  {
    id: "vb_u16_7", chatId: "team_vb_u16",
    senderId: "p12", senderName: "Flurina Schneider", senderRole: "minor",
    content: "Ich freu mich so aufs Spiel morgen! 🏐💪",
    createdAt: "2026-01-13T19:40:00", isRead: false, visibleToParent: true, parentNotified: true
  },
  // === DEMO: REPORTED MESSAGE (for moderation demo) ===
  // This message was reported by Lena Schneider (Flurina's mom)
  {
    id: "vb_u16_demo_report", chatId: "team_vb_u16",
    senderId: "emma", senderName: "Emma Meier", senderRole: "minor",
    content: "Du bist ja eh die Schlechteste im Team...",
    createdAt: "2026-01-14T09:00:00", isRead: true,
    visibleToParent: true, parentNotified: true,
    isReported: true,
    reportReason: "Mobbing - Beleidigung gegenüber Flurina"
  },
  
  // === ANNA'S MESSAGES (Minor WITHOUT guardian) ===
  // Note: Anna's messages have visibleToParent: false because she has NO linked parent!
  {
    id: "vb_u16_8", chatId: "team_vb_u16",
    senderId: "p14", senderName: "Anna Berger", senderRole: "minor",
    content: "Ich bin auch mega aufgeregt! Mein erstes Punktspiel 😬🏐",
    createdAt: "2026-01-13T19:42:00", isRead: false,
    visibleToParent: false  // NO PARENT LINKED - no one sees this externally
  },
  {
    id: "vb_u16_9", chatId: "team_vb_u16",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "@Anna Das wird super! Du hast so gut trainiert 💪",
    createdAt: "2026-01-13T19:43:00", isRead: false, visibleToParent: true
  },
  {
    id: "vb_u16_10", chatId: "team_vb_u16",
    senderId: "p14", senderName: "Anna Berger", senderRole: "minor",
    content: "Danke Trainerin! 🥹",
    createdAt: "2026-01-13T19:44:00", isRead: false,
    visibleToParent: false  // NO PARENT LINKED
  },
  
  // =============================================
  // DM KATJA ↔ FLURINA - With parent involved
  // =============================================
  {
    id: "dm_kf_1", chatId: "dm_katja_flurina",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "Hallo! Wie geht es Flurinas Knie nach dem Sturz?",
    createdAt: "2026-01-11T15:00:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_kf_2", chatId: "dm_katja_flurina",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Hallo Frau Katja, hier ist Lena (Flurinas Mama). Dem Knie geht es viel besser!",
    createdAt: "2026-01-11T15:30:00", isRead: true,
    onBehalfOf: { childId: "p12", childName: "Flurina" }
  },
  {
    id: "dm_kf_3", chatId: "dm_katja_flurina",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "Das freut mich! Dann kann Flurina morgen wieder trainieren?",
    createdAt: "2026-01-11T15:35:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_kf_4", chatId: "dm_katja_flurina",
    senderId: "p12", senderName: "Flurina Schneider", senderRole: "minor",
    content: "Ja, ich bin wieder fit! Freu mich schon aufs Training! 🏐",
    createdAt: "2026-01-11T15:40:00", isRead: true, visibleToParent: true, parentNotified: true
  },
  {
    id: "dm_kf_5", chatId: "dm_katja_flurina",
    senderId: "katja", senderName: "Trainerin Katja", senderRole: "coach",
    content: "Super Flurina! Du hast heute toll gespielt, großes Lob! 🌟",
    createdAt: "2026-01-13T19:30:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_kf_6", chatId: "dm_katja_flurina",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Vielen Dank! Flurina hat sich riesig gefreut! 😊",
    createdAt: "2026-01-13T19:45:00", isRead: true,
    onBehalfOf: { childId: "p12", childName: "Flurina" }
  },
  
  // =============================================
  // FOOTBALL U12 TEAM CHAT - Max's team
  // =============================================
  {
    id: "fb_u12_1", chatId: "team_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "Jungs, tolles Spiel am Wochenende! 3:1 gewonnen! 🎉",
    createdAt: "2026-01-12T18:00:00", isRead: true, visibleToParent: true
  },
  {
    id: "fb_u12_2", chatId: "team_fb_u12",
    senderId: "thomas", senderName: "Thomas Bauer", senderRole: "parent",
    content: "Leon ist überglücklich! Das war ein super Spiel!",
    createdAt: "2026-01-12T18:05:00", isRead: true,
    onBehalfOf: { childId: "leon", childName: "Leon" }
  },
  {
    id: "fb_u12_3", chatId: "team_fb_u12",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Max ist total happy über den Sieg! Er hat sogar ein Tor geschossen! ⚽",
    createdAt: "2026-01-12T18:10:00", isRead: true,
    onBehalfOf: { childId: "p13", childName: "Max" }
  },
  {
    id: "fb_u12_4", chatId: "team_fb_u12",
    senderId: "p13", senderName: "Max Schneider", senderRole: "minor",
    content: "Das war so cool! Mein erstes Ligator!! ⚽🎉",
    createdAt: "2026-01-12T18:15:00", isRead: true, visibleToParent: true, parentNotified: true
  },
  {
    id: "fb_u12_5", chatId: "team_fb_u12",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "Morgen Heimspiel - alle bitte pünktlich um 10:00! ⚽",
    createdAt: "2026-01-13T18:00:00", isRead: true, visibleToParent: true
  },
  {
    id: "fb_u12_6", chatId: "team_fb_u12",
    senderId: "thomas", senderName: "Thomas Bauer", senderRole: "parent",
    content: "Leon ist dabei! Wir bringen Orangenscheiben mit 🍊",
    createdAt: "2026-01-13T18:15:00", isRead: true,
    onBehalfOf: { childId: "leon", childName: "Leon" }
  },
  {
    id: "fb_u12_7", chatId: "team_fb_u12",
    senderId: "p13", senderName: "Max Schneider", senderRole: "minor",
    content: "Ich kann es kaum erwarten! Schieß wieder ein Tor! 🤩⚽",
    createdAt: "2026-01-13T18:18:00", isRead: true, visibleToParent: true, parentNotified: true
  },
  {
    id: "fb_u12_8", chatId: "team_fb_u12",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Max ist dabei! Wir sind pünktlich um 10:00 da 👍",
    createdAt: "2026-01-13T18:20:00", isRead: true,
    onBehalfOf: { childId: "p13", childName: "Max" }
  },
  
  // =============================================
  // DM MARCO ↔ MAX - With parent
  // =============================================
  {
    id: "dm_mm_1", chatId: "dm_marco_max",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "Hallo! Wie geht es Max nach dem Training gestern?",
    createdAt: "2026-01-12T14:00:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_mm_2", chatId: "dm_marco_max",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Hallo Herr Marco! Ihm geht es super! Er übt jeden Tag Dribbeln im Garten 😊",
    createdAt: "2026-01-12T14:30:00", isRead: true,
    onBehalfOf: { childId: "p13", childName: "Max" }
  },
  {
    id: "dm_mm_3", chatId: "dm_marco_max",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "Das sieht man auch im Training - er macht tolle Fortschritte! 🌟",
    createdAt: "2026-01-12T14:35:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_mm_4", chatId: "dm_marco_max",
    senderId: "marco", senderName: "Trainer Marco", senderRole: "coach",
    content: "Max hat heute ein klasse Tor geschossen! Großes Lob! 👏",
    createdAt: "2026-01-13T17:30:00", isRead: true, visibleToParent: true
  },
  {
    id: "dm_mm_5", chatId: "dm_marco_max",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Danke! Max strahlt über beide Ohren! ⚽",
    createdAt: "2026-01-13T17:45:00", isRead: true,
    onBehalfOf: { childId: "p13", childName: "Max" }
  },
  
  // =============================================
  // PARENT GROUPS
  // =============================================
  {
    id: "eltern_vb_1", chatId: "eltern_vb_u16",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Hallo zusammen! Können wir Fahrgemeinschaft zum Turnier machen? 🚗",
    createdAt: "2026-01-12T10:00:00", isRead: true
  },
  {
    id: "eltern_vb_2", chatId: "eltern_vb_u16",
    senderId: "andrea", senderName: "Andrea Meier", senderRole: "parent",
    content: "Gerne! Ich kann 4 Kinder mitnehmen.",
    createdAt: "2026-01-12T10:30:00", isRead: true
  },
  {
    id: "eltern_vb_3", chatId: "eltern_vb_u16",
    senderId: "andrea", senderName: "Andrea Meier", senderRole: "parent",
    content: "Wer bringt die Getränke zum Turnier? 🥤",
    createdAt: "2026-01-13T14:30:00", isRead: true
  },
  
  {
    id: "eltern_fb_1", chatId: "eltern_fb_u12",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Hat jemand noch Schienbeinschoner in Größe XS? Max hat seine vergessen 😅",
    createdAt: "2026-01-10T16:00:00", isRead: true
  },
  {
    id: "eltern_fb_2", chatId: "eltern_fb_u12",
    senderId: "thomas", senderName: "Thomas Bauer", senderRole: "parent",
    content: "Ich bringe welche mit! Leon hat noch ein Paar über.",
    createdAt: "2026-01-10T16:15:00", isRead: true
  },
  {
    id: "eltern_fb_3", chatId: "eltern_fb_u12",
    senderId: "p11", senderName: "Lena Schneider", senderRole: "parent",
    content: "Ihr seid die Besten! Danke! 🙏",
    createdAt: "2026-01-10T16:20:00", isRead: true
  },
  {
    id: "eltern_fb_4", chatId: "eltern_fb_u12",
    senderId: "thomas", senderName: "Thomas Bauer", senderRole: "parent",
    content: "Können wir Fahrgemeinschaft machen morgen? 🚗",
    createdAt: "2026-01-13T18:30:00", isRead: false
  }
];

// ========= HELPER FUNCTIONS =========

export function getChatMessages(chatId: string): ChatMessage[] {
  return mockChatMessages.filter(m => m.chatId === chatId);
}

export function getChatsForProfile(profileId: string): Chat[] {
  return mockChats.filter(c => c.visibleToProfiles.includes(profileId));
}

export function getMemberChats(personId: string): Chat[] {
  return getChatsForProfile(personId);
}

export function getUnreadChatsCount(personId: string): number {
  return getChatsForProfile(personId).reduce((sum, c) => sum + c.unreadCount, 0);
}

export function getChatsByType(personId: string, type: ChatType): Chat[] {
  return getChatsForProfile(personId).filter(c => c.type === type);
}

export function canSendDM(
  senderRole: UserRole,
  senderState: PlayerState | undefined,
  recipientRole: UserRole,
  recipientState: PlayerState | undefined
): PermissionResult {
  if (senderRole === "admin") {
    return { allowed: false, reason: "Admins use the inbox system for communication" };
  }
  if (senderRole === "minor" || senderState === "MINOR_PLAYER") {
    return { allowed: false, reason: "Minors cannot send direct messages alone", requiresParent: true };
  }
  if (senderRole === "coach" && (recipientRole === "minor" || recipientState === "MINOR_PLAYER")) {
    return { allowed: false, reason: "Coach cannot message minor without parent", requiresParent: true };
  }
  if (senderRole === "adult_player" && recipientRole === "adult_player") {
    return { allowed: true };
  }
  if (senderRole === "parent" && recipientRole === "coach") {
    return { allowed: true };
  }
  if (senderRole === "adult_player" && recipientRole === "coach") {
    return { allowed: true };
  }
  return { allowed: false, reason: "This conversation type is not allowed" };
}

export function shouldParentSeeMessage(
  chatType: ChatType,
  senderRole: UserRole,
  teamType?: TeamType
): boolean {
  if (chatType === "announcement") return true;
  if (chatType === "team_group" && teamType === "youth_team") return true;
  if (chatType === "direct" && senderRole === "minor") return true;
  return false;
}

export function getChatsByDepartment(personId: string): Record<string, Chat[]> {
  const chats = getChatsForProfile(personId);
  const grouped: Record<string, Chat[]> = { "Allgemein": [] };
  
  chats.forEach(chat => {
    if (chat.departmentName) {
      if (!grouped[chat.departmentName]) {
        grouped[chat.departmentName] = [];
      }
      grouped[chat.departmentName].push(chat);
    } else {
      grouped["Allgemein"].push(chat);
    }
  });
  
  return grouped;
}

export function formatRole(role: UserRole): string {
  const roleLabels: Record<UserRole, string> = {
    admin: "Admin", coach: "Trainer",
    adult_player: "Spieler", minor: "Jugendspieler", parent: "Elternteil"
  };
  return roleLabels[role];
}

export function getChatTypeLabel(type: ChatType): string {
  const typeLabels: Record<ChatType, string> = {
    announcement: "Ankündigung", team_group: "Team-Chat", direct: "Direktnachricht"
  };
  return typeLabels[type];
}

export function getChatTypeBadgeColor(type: ChatType): { bg: string; text: string } {
  const colors: Record<ChatType, { bg: string; text: string }> = {
    announcement: { bg: "#FEF3C7", text: "#92400E" },
    team_group: { bg: "#D1FAE5", text: "#065F46" },
    direct: { bg: "#DBEAFE", text: "#1E40AF" }
  };
  return colors[type];
}
