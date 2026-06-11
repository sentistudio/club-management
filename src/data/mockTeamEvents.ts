export type TeamEventType = "training" | "match" | "general";
export type TeamEventVisibility = "team_only" | "club_visible" | "public";
export type TeamEventStatus = "scheduled" | "completed" | "cancelled";
export type MatchType = "league" | "cup" | "friendly" | "tournament";
export type AttendanceStatus = "confirmed" | "declined" | "pending" | "absent";

export interface AttendanceEntry {
  personId: string;
  status: AttendanceStatus;
}

export interface TeamEventRecurrence {
  frequency: "weekly" | "biweekly";
  weekdays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  until: string; // ISO date
}

export interface TeamEvent {
  id: string;
  teamId: string;
  seasonId: string;
  type: TeamEventType;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  description?: string;
  visibility: TeamEventVisibility;
  // Match fields
  opponent?: string;
  isHome?: boolean;
  homeScore?: number;
  awayScore?: number;
  matchType?: MatchType;
  // Linked content
  linkedLineupId?: string;
  linkedTrainingPackageId?: string;
  // Recurrence
  recurrence?: TeamEventRecurrence;
  isRecurring?: boolean;
  recurrenceGroupId?: string;
  // Audience (beyond the primary team)
  audienceTeamIds?: string[];
  audienceGroupIds?: string[];
  audienceMemberIds?: string[];
  // RSVP / Teilnahmebestätigung
  rsvpRequired?: boolean;
  rsvpHoursBefore?: number;
  maxParticipants?: number;
  // Attendance
  attendanceList: AttendanceEntry[];
  status: TeamEventStatus;
  createdBy: string;
}

function daysFromToday(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ==========================================
// TEAM_U12 — Fußball U12 — Season 2024/25
// ==========================================
const U12_TEAM_MEMBERS = [
  "max_schneider", "noah_hoffmann", "sophie_klein", "person_anna",
  "player_u12_luca", "player_u12_ben", "player_u12_finn",
  "player_u12_leo", "player_u12_kai", "player_u12_paul"
];

function makeAttendance(members: string[], confirmedIds: string[], declinedIds: string[] = []): AttendanceEntry[] {
  return members.map(id => ({
    personId: id,
    status: confirmedIds.includes(id) ? "confirmed"
      : declinedIds.includes(id) ? "declined"
      : "pending"
  }));
}

const U12_TRAININGS: TeamEvent[] = [
  {
    id: "te_u12_t01",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(3),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_wed",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben"], ["person_anna"]),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_t02",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(5),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    linkedTrainingPackageId: "tp_u12_warmup",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_fri",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_finn", "player_u12_leo"], []),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_t03",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(10),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_wed",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_t04",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(12),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_fri",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  // Past training (completed)
  {
    id: "te_u12_t_past1",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(-4),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_fri",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS,
      ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo"],
      ["person_anna", "player_u12_paul"]
    ),
    status: "completed",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_t_past2",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(-6),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_wed",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS,
      ["max_schneider", "noah_hoffmann", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_kai"],
      ["player_u12_paul", "person_anna"]
    ),
    status: "completed",
    createdBy: "coach_marco"
  }
];

const U12_MATCHES: TeamEvent[] = [
  {
    id: "te_u12_m01",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Punktspiel vs. TV Lich U12",
    date: daysFromToday(4),
    startTime: "14:00",
    endTime: "16:00",
    location: "Sportplatz Lich",
    description: "Auswärtsspiel. Treffpunkt 13:00 am Vereinsheim.",
    visibility: "public",
    opponent: "TV Lich U12",
    isHome: false,
    matchType: "league",
    linkedLineupId: "lu_u12_442",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo", "player_u12_kai"], ["person_anna"]),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_m02",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Heimspiel vs. FC Bonn U12",
    date: daysFromToday(18),
    startTime: "11:00",
    endTime: "13:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "FC Bonn U12",
    isHome: true,
    matchType: "league",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  // Completed matches with scores
  {
    id: "te_u12_m_past1",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Heimspiel vs. SV Bochum U12",
    date: daysFromToday(-21),
    startTime: "11:00",
    endTime: "13:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "SV Bochum U12",
    isHome: true,
    homeScore: 3,
    awayScore: 1,
    matchType: "league",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS,
      ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo", "player_u12_kai", "player_u12_paul"],
      ["person_anna"]
    ),
    status: "completed",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_m_past2",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Auswärtsspiel vs. RW Essen U12",
    date: daysFromToday(-35),
    startTime: "14:00",
    endTime: "16:00",
    location: "Sportanlage Essen",
    visibility: "public",
    opponent: "RW Essen U12",
    isHome: false,
    homeScore: 1,
    awayScore: 2,
    matchType: "league",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS,
      ["max_schneider", "noah_hoffmann", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo", "player_u12_kai"],
      ["sophie_klein", "person_anna"]
    ),
    status: "completed",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_m_past3",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Pokalspiel vs. VfB Dortmund U12",
    date: daysFromToday(-56),
    startTime: "10:00",
    endTime: "12:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "VfB Dortmund U12",
    isHome: true,
    homeScore: 2,
    awayScore: 0,
    matchType: "cup",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS,
      ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo"],
      ["person_anna"]
    ),
    status: "completed",
    createdBy: "coach_marco"
  }
];

const U12_GENERAL: TeamEvent[] = [
  {
    id: "te_u12_gen01",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "general",
    title: "Elternabend Fußball U12",
    date: daysFromToday(8),
    startTime: "19:30",
    endTime: "21:00",
    location: "Vereinsheim – Raum 1",
    description: "Informationsabend für Eltern und Erziehungsberechtigte der U12-Spieler. Themen: Saison-Vorschau, Fahrgemeinschaften, Turnier.",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "coach_marco"
  }
];

// ==========================================
// TEAM_U12 — Pre-Season 2025/26
// ==========================================
const U12_PRESEASON_NEXT: TeamEvent[] = [
  {
    id: "te_u12_pre01",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(60),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_next_wed",
    attendanceList: [],
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_pre02",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(62),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_next_fri",
    attendanceList: [],
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_pre03",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(67),
    startTime: "17:00",
    endTime: "18:30",
    location: "Sportplatz 2",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_pre_m01",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    type: "match",
    title: "Testspiel vs. FC Lünen U12",
    date: daysFromToday(77),
    startTime: "11:00",
    endTime: "13:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "FC Lünen U12",
    isHome: true,
    matchType: "friendly",
    attendanceList: [],
    status: "scheduled",
    createdBy: "coach_marco"
  }
];

// ==========================================
// TEAM1 — 1. Herren — Season 2024/25
// ==========================================
const HERREN1_MEMBERS = [
  "patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael",
  "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_lukas",
  "player_h1_david", "player_h1_simon", "player_h1_oliver"
];

const HERREN1_TRAININGS: TeamEvent[] = [
  {
    id: "te_h1_t01",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "training",
    title: "Training",
    date: daysFromToday(2),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_h1_tue",
    attendanceList: makeAttendance(HERREN1_MEMBERS, ["patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix"], ["player_h1_david"]),
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_t02",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "training",
    title: "Training",
    date: daysFromToday(4),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_h1_thu",
    attendanceList: makeAttendance(HERREN1_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_t03",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "training",
    title: "Training",
    date: daysFromToday(9),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_h1_tue",
    attendanceList: makeAttendance(HERREN1_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_t_past1",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "training",
    title: "Training",
    date: daysFromToday(-5),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_h1_thu",
    attendanceList: makeAttendance(HERREN1_MEMBERS,
      ["patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_simon"],
      ["player_h1_david"]
    ),
    status: "completed",
    createdBy: "thomas_mueller"
  }
];

const HERREN1_MATCHES: TeamEvent[] = [
  {
    id: "te_h1_m01",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "match",
    title: "Heimspiel vs. FC Schwarz-Weiß",
    date: daysFromToday(14),
    startTime: "15:00",
    endTime: "17:00",
    location: "Sportplatz 1",
    description: "Wichtiges Heimspiel im Abstiegskampf!",
    visibility: "public",
    opponent: "FC Schwarz-Weiß",
    isHome: true,
    matchType: "league",
    linkedLineupId: "lu_h1_433",
    attendanceList: makeAttendance(HERREN1_MEMBERS, ["patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_lukas", "player_h1_simon", "player_h1_oliver"], ["player_h1_david"]),
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_m_past1",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "match",
    title: "Auswärtsspiel vs. TSG Wuppertal",
    date: daysFromToday(-7),
    startTime: "15:00",
    endTime: "17:00",
    location: "Stadion Wuppertal",
    visibility: "public",
    opponent: "TSG Wuppertal",
    isHome: false,
    homeScore: 1,
    awayScore: 1,
    matchType: "league",
    attendanceList: makeAttendance(HERREN1_MEMBERS,
      ["patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_lukas", "player_h1_simon"],
      ["player_h1_david"]
    ),
    status: "completed",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_m_past2",
    teamId: "team1",
    seasonId: "s2024_team1",
    type: "match",
    title: "Heimspiel vs. BV 04 Meiderich",
    date: daysFromToday(-28),
    startTime: "15:00",
    endTime: "17:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "BV 04 Meiderich",
    isHome: true,
    homeScore: 2,
    awayScore: 0,
    matchType: "league",
    attendanceList: makeAttendance(HERREN1_MEMBERS,
      ["patrick_steuble", "player_h1_mario", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_lukas", "player_h1_david", "player_h1_simon", "player_h1_oliver"],
      []
    ),
    status: "completed",
    createdBy: "thomas_mueller"
  }
];

// ==========================================
// TEAM1 — 1. Herren — Pre-Season 2025/26
// ==========================================
const HERREN1_PRESEASON_NEXT: TeamEvent[] = [
  {
    id: "te_h1_pre01",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "training",
    title: "Auftakttraining 2025/26",
    date: daysFromToday(42),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_pre02",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(44),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_pre03",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(49),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_pre04",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "training",
    title: "Vorbereitungstraining",
    date: daysFromToday(51),
    startTime: "19:00",
    endTime: "20:45",
    location: "Sportplatz 1",
    visibility: "club_visible",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_pre_m01",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "match",
    title: "Testspiel vs. SV Borussia",
    date: daysFromToday(63),
    startTime: "15:00",
    endTime: "17:00",
    location: "Sportplatz 1",
    visibility: "public",
    opponent: "SV Borussia",
    isHome: true,
    matchType: "friendly",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  },
  {
    id: "te_h1_pre_m02",
    teamId: "team1",
    seasonId: "s2025_team1",
    type: "match",
    title: "Testspiel vs. FC Grün-Weiß",
    date: daysFromToday(70),
    startTime: "15:00",
    endTime: "17:00",
    location: "Auswärts",
    visibility: "public",
    opponent: "FC Grün-Weiß",
    isHome: false,
    matchType: "friendly",
    attendanceList: [],
    status: "scheduled",
    createdBy: "thomas_mueller"
  }
];

// ==========================================
// TEAM_U12 — Extra (additional training slot + tournament)
// ==========================================
const U12_EXTRA: TeamEvent[] = [
  {
    id: "te_u12_t05",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "training",
    title: "Training",
    date: daysFromToday(1),
    startTime: "16:00",
    endTime: "17:30",
    location: "Sportanlage Scharnhorst",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_u12_tue",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, ["max_schneider", "noah_hoffmann", "player_u12_luca", "player_u12_ben"], []),
    status: "scheduled",
    createdBy: "coach_marco"
  },
  {
    id: "te_u12_m03",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    type: "match",
    title: "Osterturnier Wettenberg",
    date: daysFromToday(18),
    startTime: "09:00",
    endTime: "14:00",
    location: "Sportpark Wettenberg",
    visibility: "public",
    opponent: "Verschiedene Teams",
    isHome: false,
    matchType: "tournament",
    attendanceList: makeAttendance(U12_TEAM_MEMBERS, ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben"], ["person_anna"]),
    status: "scheduled",
    createdBy: "coach_marco"
  }
];

// ==========================================
// TEAM_VOLLEYBALL_U16 — Volleyball U16 — Season 2024/25
// ==========================================
const VB_U16_MEMBERS = [
  "flurina_schneider", "anna_bauer", "player_vb_mia", "player_vb_lea", "player_vb_nora"
];

const VB_U16_TRAININGS: TeamEvent[] = [
  {
    id: "te_vb_t01",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "training",
    title: "Training",
    date: daysFromToday(0),
    startTime: "17:30",
    endTime: "19:00",
    location: "Sporthalle Aplerbeck",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_vb_tue",
    attendanceList: makeAttendance(VB_U16_MEMBERS, ["flurina_schneider", "anna_bauer", "player_vb_mia", "player_vb_nora"], []),
    status: "scheduled",
    createdBy: "coach_katja"
  },
  {
    id: "te_vb_t02",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "training",
    title: "Training",
    date: daysFromToday(1),
    startTime: "16:00",
    endTime: "17:30",
    location: "Sporthalle Aplerbeck",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_vb_wed",
    attendanceList: makeAttendance(VB_U16_MEMBERS, ["flurina_schneider", "anna_bauer", "player_vb_mia"], []),
    status: "scheduled",
    createdBy: "coach_katja"
  },
  {
    id: "te_vb_t03",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "training",
    title: "Training",
    date: daysFromToday(2),
    startTime: "17:30",
    endTime: "19:00",
    location: "Sporthalle Aplerbeck",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_vb_thu",
    attendanceList: makeAttendance(VB_U16_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "coach_katja"
  },
  {
    id: "te_vb_t04",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "training",
    title: "Training",
    date: daysFromToday(7),
    startTime: "17:30",
    endTime: "19:00",
    location: "Sporthalle Aplerbeck",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_vb_tue",
    attendanceList: makeAttendance(VB_U16_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "coach_katja"
  },
  {
    id: "te_vb_t_past1",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "training",
    title: "Training",
    date: daysFromToday(-3),
    startTime: "17:30",
    endTime: "19:00",
    location: "Sporthalle Aplerbeck",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_vb_tue",
    attendanceList: makeAttendance(VB_U16_MEMBERS, ["flurina_schneider", "anna_bauer", "player_vb_mia", "player_vb_lea", "player_vb_nora"], []),
    status: "completed",
    createdBy: "coach_katja"
  }
];

const VB_U16_MATCHES: TeamEvent[] = [
  {
    id: "te_vb_m01",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "match",
    title: "Heimspiel vs. VfL Marburg U16",
    date: daysFromToday(5),
    startTime: "11:00",
    endTime: "13:00",
    location: "Sporthalle Aplerbeck, Harkortstr. 8",
    visibility: "public",
    opponent: "VfL Marburg U16",
    isHome: true,
    matchType: "league",
    attendanceList: makeAttendance(VB_U16_MEMBERS, ["flurina_schneider", "anna_bauer", "player_vb_mia", "player_vb_lea", "player_vb_nora"], []),
    status: "scheduled",
    createdBy: "coach_katja"
  },
  {
    id: "te_vb_m02",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    type: "match",
    title: "Gießen Cup Turnier",
    date: daysFromToday(12),
    startTime: "09:00",
    endTime: "17:00",
    location: "Sportanlage Gießen",
    visibility: "public",
    opponent: "Verschiedene Teams",
    isHome: false,
    matchType: "tournament",
    attendanceList: makeAttendance(VB_U16_MEMBERS, ["flurina_schneider", "anna_bauer", "player_vb_mia", "player_vb_lea"], []),
    status: "scheduled",
    createdBy: "coach_katja"
  }
];

// ==========================================
// TEAM_FRAUEN_UE40 — Frauen Ü40 — Season 2024/25
// ==========================================
const FRAUEN_MEMBERS = [
  "lena_schneider", "claudia", "player_ue40_maria", "player_ue40_sabine", "player_ue40_heike"
];

const FRAUEN_TRAININGS: TeamEvent[] = [
  {
    id: "te_frauen_t01",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    type: "training",
    title: "Training",
    date: daysFromToday(1),
    startTime: "15:30",
    endTime: "17:30",
    location: "Sportplatz 1 – Zone 4–6",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_frauen_tue",
    attendanceList: makeAttendance(FRAUEN_MEMBERS, ["lena_schneider", "claudia", "player_ue40_sabine", "player_ue40_heike"], []),
    status: "scheduled",
    createdBy: "bernd"
  },
  {
    id: "te_frauen_t02",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    type: "training",
    title: "Training",
    date: daysFromToday(6),
    startTime: "15:30",
    endTime: "17:30",
    location: "Sportplatz 1 – Zone 4–6",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_frauen_sun",
    attendanceList: makeAttendance(FRAUEN_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "bernd"
  },
  {
    id: "te_frauen_t03",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    type: "training",
    title: "Training",
    date: daysFromToday(8),
    startTime: "15:30",
    endTime: "17:30",
    location: "Sportplatz 1 – Zone 4–6",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_frauen_tue",
    attendanceList: makeAttendance(FRAUEN_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "bernd"
  },
  {
    id: "te_frauen_t_past1",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    type: "training",
    title: "Training",
    date: daysFromToday(-3),
    startTime: "15:30",
    endTime: "17:30",
    location: "Sportplatz 1 – Zone 4–6",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_frauen_tue",
    attendanceList: makeAttendance(FRAUEN_MEMBERS, ["lena_schneider", "claudia", "player_ue40_maria", "player_ue40_sabine"], ["player_ue40_heike"]),
    status: "completed",
    createdBy: "bernd"
  }
];

// ==========================================
// TEAM_FITNESS — Fitness Morgengruppe — Season 2024/25
// ==========================================
const FITNESS_MEMBERS = [
  "lena_schneider", "petra", "player_fit_gabi", "player_fit_monika"
];

const FITNESS_TRAININGS: TeamEvent[] = [
  {
    id: "te_fit_t01",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    type: "training",
    title: "Fitness Morgengruppe",
    date: daysFromToday(0),
    startTime: "07:00",
    endTime: "08:00",
    location: "FitX Dortmund",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_fit_mon",
    attendanceList: makeAttendance(FITNESS_MEMBERS, ["lena_schneider", "petra", "player_fit_gabi"], []),
    status: "scheduled",
    createdBy: "trainer_sandra"
  },
  {
    id: "te_fit_t02",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    type: "training",
    title: "Fitness Morgengruppe",
    date: daysFromToday(2),
    startTime: "07:00",
    endTime: "08:00",
    location: "FitX Dortmund",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_fit_wed",
    attendanceList: makeAttendance(FITNESS_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "trainer_sandra"
  },
  {
    id: "te_fit_t03",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    type: "training",
    title: "Fitness Morgengruppe",
    date: daysFromToday(7),
    startTime: "07:00",
    endTime: "08:00",
    location: "FitX Dortmund",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_fit_mon",
    attendanceList: makeAttendance(FITNESS_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "trainer_sandra"
  },
  {
    id: "te_fit_t04",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    type: "training",
    title: "Fitness Morgengruppe",
    date: daysFromToday(16),
    startTime: "07:00",
    endTime: "08:00",
    location: "FitX Dortmund",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_fit_wed",
    attendanceList: makeAttendance(FITNESS_MEMBERS, [], []),
    status: "scheduled",
    createdBy: "trainer_sandra"
  },
  {
    id: "te_fit_t_past1",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    type: "training",
    title: "Fitness Morgengruppe",
    date: daysFromToday(-5),
    startTime: "07:00",
    endTime: "08:00",
    location: "FitX Dortmund",
    visibility: "club_visible",
    isRecurring: true,
    recurrenceGroupId: "rg_fit_wed",
    attendanceList: makeAttendance(FITNESS_MEMBERS, ["lena_schneider", "petra", "player_fit_gabi", "player_fit_monika"], []),
    status: "completed",
    createdBy: "trainer_sandra"
  }
];

// ==========================================
// COMBINED EXPORT
// ==========================================
export const mockTeamEvents: TeamEvent[] = [
  ...U12_TRAININGS,
  ...U12_MATCHES,
  ...U12_GENERAL,
  ...U12_EXTRA,
  ...U12_PRESEASON_NEXT,
  ...HERREN1_TRAININGS,
  ...HERREN1_MATCHES,
  ...HERREN1_PRESEASON_NEXT,
  ...VB_U16_TRAININGS,
  ...VB_U16_MATCHES,
  ...FRAUEN_TRAININGS,
  ...FITNESS_TRAININGS
];

export function getTeamEventsByTeam(teamId: string, seasonId = "s2024"): TeamEvent[] {
  return mockTeamEvents.filter(e => e.teamId === teamId && e.seasonId === seasonId);
}

export function getUpcomingTeamEvents(teamId: string, seasonId = "s2024", limit = 5): TeamEvent[] {
  const today = new Date().toISOString().split("T")[0];
  return getTeamEventsByTeam(teamId, seasonId)
    .filter(e => e.date >= today && e.status === "scheduled")
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, limit);
}

export function getPastMatches(teamId: string, seasonId = "s2024", limit = 5): TeamEvent[] {
  return getTeamEventsByTeam(teamId, seasonId)
    .filter(e => e.type === "match" && e.status === "completed")
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getClubVisibleEvents(): TeamEvent[] {
  return mockTeamEvents.filter(
    e => e.visibility === "club_visible" || e.visibility === "public"
  );
}

export function getPublicEvents(): TeamEvent[] {
  return mockTeamEvents.filter(e => e.visibility === "public");
}

export function getLastMatchResult(teamId: string, seasonId = "s2024"): TeamEvent | null {
  const past = getPastMatches(teamId, seasonId, 1);
  return past[0] ?? null;
}
