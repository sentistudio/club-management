export type PlayerPosition =
  | "goalkeeper"
  | "defender"
  | "midfielder"
  | "forward"
  | "libero"
  | "setter"
  | "outside_hitter"
  | "middle_blocker"
  | "hb_goalkeeper"
  | "hb_back"
  | "hb_wing"
  | "hb_pivot";

export type RosterRole = "player" | "coach" | "assistant_coach" | "goalkeeper_coach";

export interface AttendanceStats {
  invited: number;
  attended: number;
  excused: number;
  absent: number;
}

export interface TeamRosterEntry {
  id: string;
  teamId: string;
  seasonId: string;
  personId: string;
  role: RosterRole;
  jerseyNumber?: number;
  position?: PlayerPosition;
  isActive: boolean;
  joinedTeamAt: string;
  attendanceStats: AttendanceStats;
  isCaptain?: boolean;
}

// ==========================================
// TEAM_U12 — Fußball U12 (current: s2024_u12)
// Coach: coach_marco (Marco Weber), thomas_mueller (assistant)
// Players: max_schneider, noah_hoffmann, sophie_klein, person_anna + extras
// ==========================================
const U12_ROSTER: TeamRosterEntry[] = [
  {
    id: "r_u12_marco",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "coach_marco",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 32, attended: 30, excused: 2, absent: 0 }
  },
  {
    id: "r_u12_thomas",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "thomas_mueller",
    role: "assistant_coach",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 32, attended: 28, excused: 4, absent: 0 }
  },
  {
    id: "r_u12_max",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "max_schneider",
    role: "player",
    jerseyNumber: 10,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2023-01-10",
    attendanceStats: { invited: 32, attended: 28, excused: 3, absent: 1 }
  },
  {
    id: "r_u12_noah",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "noah_hoffmann",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2023-02-20",
    attendanceStats: { invited: 32, attended: 30, excused: 1, absent: 1 }
  },
  {
    id: "r_u12_sophie",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "sophie_klein",
    role: "player",
    jerseyNumber: 5,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 32, attended: 31, excused: 1, absent: 0 }
  },
  {
    id: "r_u12_anna",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "person_anna",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-06-01",
    attendanceStats: { invited: 32, attended: 22, excused: 5, absent: 5 }
  },
  {
    id: "r_u12_p1",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_luca",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 32, attended: 29, excused: 2, absent: 1 }
  },
  {
    id: "r_u12_p2",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_ben",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 32, attended: 25, excused: 4, absent: 3 }
  },
  {
    id: "r_u12_p3",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_finn",
    role: "player",
    jerseyNumber: 6,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-08-01",
    attendanceStats: { invited: 28, attended: 24, excused: 3, absent: 1 }
  },
  {
    id: "r_u12_p4",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_leo",
    role: "player",
    jerseyNumber: 8,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 32, attended: 27, excused: 2, absent: 3 }
  },
  {
    id: "r_u12_p5",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_kai",
    role: "player",
    jerseyNumber: 9,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2024-01-15",
    attendanceStats: { invited: 20, attended: 18, excused: 2, absent: 0 }
  },
  {
    id: "r_u12_p6",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    personId: "player_u12_paul",
    role: "player",
    jerseyNumber: 11,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 32, attended: 20, excused: 6, absent: 6 }
  }
];

// ==========================================
// TEAM_U12 — Archived roster 2023/24 (s2023_u12)
// Smaller squad from prior season
// ==========================================
const U12_ROSTER_ARCHIVED: TeamRosterEntry[] = [
  {
    id: "r_u12_arch_marco",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "coach_marco",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 28, attended: 25, excused: 3, absent: 0 }
  },
  {
    id: "r_u12_arch_thomas",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "thomas_mueller",
    role: "assistant_coach",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 28, attended: 24, excused: 4, absent: 0 }
  },
  {
    id: "r_u12_arch_max",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "max_schneider",
    role: "player",
    jerseyNumber: 10,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2023-01-10",
    attendanceStats: { invited: 28, attended: 22, excused: 4, absent: 2 }
  },
  {
    id: "r_u12_arch_noah",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "noah_hoffmann",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2023-02-20",
    attendanceStats: { invited: 28, attended: 25, excused: 2, absent: 1 }
  },
  {
    id: "r_u12_arch_sophie",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "sophie_klein",
    role: "player",
    jerseyNumber: 5,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 28, attended: 26, excused: 2, absent: 0 }
  },
  {
    id: "r_u12_arch_anna",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "person_anna",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-06-01",
    attendanceStats: { invited: 28, attended: 18, excused: 5, absent: 5 }
  },
  {
    id: "r_u12_arch_p1",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "player_u12_luca",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 28, attended: 24, excused: 3, absent: 1 }
  },
  {
    id: "r_u12_arch_p2",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "player_u12_ben",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 28, attended: 20, excused: 4, absent: 4 }
  },
  {
    id: "r_u12_arch_p3",
    teamId: "team_u12",
    seasonId: "s2023_u12",
    personId: "player_u12_finn",
    role: "player",
    jerseyNumber: 6,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-08-01",
    attendanceStats: { invited: 28, attended: 21, excused: 4, absent: 3 }
  }
];

// ==========================================
// TEAM_U12 — Planned roster 2025/26 (s2025_u12)
// Same squad as current + 2 new players
// ==========================================
const U12_ROSTER_NEXT: TeamRosterEntry[] = [
  {
    id: "r_u12_next_marco",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "coach_marco",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_thomas",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "thomas_mueller",
    role: "assistant_coach",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_max",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "max_schneider",
    role: "player",
    jerseyNumber: 10,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2023-01-10",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_noah",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "noah_hoffmann",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2023-02-20",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_sophie",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "sophie_klein",
    role: "player",
    jerseyNumber: 5,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_anna",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "person_anna",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-06-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p1",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_luca",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p2",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_ben",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p3",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_finn",
    role: "player",
    jerseyNumber: 6,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2023-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p4",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_leo",
    role: "player",
    jerseyNumber: 8,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p5",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_kai",
    role: "player",
    jerseyNumber: 9,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2024-01-15",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_p6",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_paul",
    role: "player",
    jerseyNumber: 11,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2022-08-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_emma",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_emma",
    role: "player",
    jerseyNumber: 12,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2025-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_u12_next_tim",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    personId: "player_u12_tim",
    role: "player",
    jerseyNumber: 13,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2025-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  }
];

// ==========================================
// TEAM1 — 1. Herren (current: s2024_team1)
// Coach: thomas_mueller (head coach)
// Players: patrick_steuble + extras
// ==========================================
const HERREN1_ROSTER: TeamRosterEntry[] = [
  {
    id: "r_h1_thomas",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "thomas_mueller",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 26, excused: 2, absent: 0 }
  },
  {
    id: "r_h1_patrick",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "patrick_steuble",
    role: "player",
    jerseyNumber: 8,
    position: "midfielder",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2020-01-15",
    attendanceStats: { invited: 28, attended: 24, excused: 3, absent: 1 }
  },
  {
    id: "r_h1_p1",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_mario",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 27, excused: 1, absent: 0 }
  },
  {
    id: "r_h1_p2",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_stefan",
    role: "player",
    jerseyNumber: 2,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 28, attended: 25, excused: 2, absent: 1 }
  },
  {
    id: "r_h1_p3",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_michael",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 22, excused: 4, absent: 2 }
  },
  {
    id: "r_h1_p4",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_jan",
    role: "player",
    jerseyNumber: 5,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 28, attended: 26, excused: 1, absent: 1 }
  },
  {
    id: "r_h1_p5",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_felix",
    role: "player",
    jerseyNumber: 6,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 20, excused: 5, absent: 3 }
  },
  {
    id: "r_h1_p6",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_tobias",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 28, attended: 24, excused: 2, absent: 2 }
  },
  {
    id: "r_h1_p7",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_lukas",
    role: "player",
    jerseyNumber: 9,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 24, attended: 22, excused: 1, absent: 1 }
  },
  {
    id: "r_h1_p8",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_david",
    role: "player",
    jerseyNumber: 10,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 18, excused: 6, absent: 4 }
  },
  {
    id: "r_h1_p9",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_simon",
    role: "player",
    jerseyNumber: 11,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2024-01-01",
    attendanceStats: { invited: 18, attended: 16, excused: 2, absent: 0 }
  },
  {
    id: "r_h1_p10",
    teamId: "team1",
    seasonId: "s2024_team1",
    personId: "player_h1_oliver",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 28, attended: 23, excused: 3, absent: 2 }
  }
];

// ==========================================
// TEAM1 — Archived roster 2023/24 (s2023_team1)
// Same squad without player_h1_simon (joined 2024)
// ==========================================
const HERREN1_ROSTER_ARCHIVED: TeamRosterEntry[] = [
  {
    id: "r_h1_arch_thomas",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "thomas_mueller",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 26, attended: 23, excused: 3, absent: 0 }
  },
  {
    id: "r_h1_arch_patrick",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "patrick_steuble",
    role: "player",
    jerseyNumber: 8,
    position: "midfielder",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2020-01-15",
    attendanceStats: { invited: 26, attended: 22, excused: 3, absent: 1 }
  },
  {
    id: "r_h1_arch_p1",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_mario",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 26, attended: 25, excused: 1, absent: 0 }
  },
  {
    id: "r_h1_arch_p2",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_stefan",
    role: "player",
    jerseyNumber: 2,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 26, attended: 23, excused: 2, absent: 1 }
  },
  {
    id: "r_h1_arch_p3",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_michael",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 26, attended: 20, excused: 4, absent: 2 }
  },
  {
    id: "r_h1_arch_p4",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_jan",
    role: "player",
    jerseyNumber: 5,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 26, attended: 24, excused: 1, absent: 1 }
  },
  {
    id: "r_h1_arch_p5",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_felix",
    role: "player",
    jerseyNumber: 6,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 26, attended: 18, excused: 5, absent: 3 }
  },
  {
    id: "r_h1_arch_p6",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_tobias",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 26, attended: 22, excused: 2, absent: 2 }
  },
  {
    id: "r_h1_arch_p7",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_lukas",
    role: "player",
    jerseyNumber: 9,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 20, attended: 18, excused: 1, absent: 1 }
  },
  {
    id: "r_h1_arch_p8",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_david",
    role: "player",
    jerseyNumber: 10,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 26, attended: 16, excused: 6, absent: 4 }
  },
  {
    id: "r_h1_arch_p10",
    teamId: "team1",
    seasonId: "s2023_team1",
    personId: "player_h1_oliver",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 26, attended: 21, excused: 3, absent: 2 }
  }
];

// ==========================================
// TEAM1 — Planned roster 2025/26 (s2025_team1)
// Same squad as current + 1 new transfer
// ==========================================
const HERREN1_ROSTER_NEXT: TeamRosterEntry[] = [
  {
    id: "r_h1_next_thomas",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "thomas_mueller",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_patrick",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "patrick_steuble",
    role: "player",
    jerseyNumber: 8,
    position: "midfielder",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2020-01-15",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p1",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_mario",
    role: "player",
    jerseyNumber: 1,
    position: "goalkeeper",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p2",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_stefan",
    role: "player",
    jerseyNumber: 2,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p3",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_michael",
    role: "player",
    jerseyNumber: 4,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p4",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_jan",
    role: "player",
    jerseyNumber: 5,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p5",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_felix",
    role: "player",
    jerseyNumber: 6,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p6",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_tobias",
    role: "player",
    jerseyNumber: 7,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p7",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_lukas",
    role: "player",
    jerseyNumber: 9,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p8",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_david",
    role: "player",
    jerseyNumber: 10,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p9",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_simon",
    role: "player",
    jerseyNumber: 11,
    position: "midfielder",
    isActive: true,
    joinedTeamAt: "2024-01-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_p10",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_oliver",
    role: "player",
    jerseyNumber: 3,
    position: "defender",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  },
  {
    id: "r_h1_next_marc",
    teamId: "team1",
    seasonId: "s2025_team1",
    personId: "player_h1_marc",
    role: "player",
    jerseyNumber: 14,
    position: "forward",
    isActive: true,
    joinedTeamAt: "2025-07-01",
    attendanceStats: { invited: 0, attended: 0, excused: 0, absent: 0 }
  }
];

// ==========================================
// TEAM_VOLLEYBALL_U16 — Volleyball U16 Mädchen (s2024_vu16)
// Coach: coach_katja (Katja Müller)
// Players: flurina_schneider, anna_bauer + extras
// ==========================================
const VOLLEYBALL_ROSTER: TeamRosterEntry[] = [
  {
    id: "r_vb_katja",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "coach_katja",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2019-07-01",
    attendanceStats: { invited: 30, attended: 29, excused: 1, absent: 0 }
  },
  {
    id: "r_vb_flurina",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "flurina_schneider",
    role: "player",
    jerseyNumber: 3,
    position: "setter",
    isActive: true,
    joinedTeamAt: "2022-04-15",
    attendanceStats: { invited: 30, attended: 28, excused: 2, absent: 0 }
  },
  {
    id: "r_vb_anna",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "anna_bauer",
    role: "player",
    jerseyNumber: 7,
    position: "outside_hitter",
    isActive: true,
    isCaptain: true,
    joinedTeamAt: "2022-06-15",
    attendanceStats: { invited: 30, attended: 27, excused: 2, absent: 1 }
  },
  {
    id: "r_vb_p1",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "player_vb_mia",
    role: "player",
    jerseyNumber: 1,
    position: "libero",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 30, attended: 30, excused: 0, absent: 0 }
  },
  {
    id: "r_vb_p2",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "player_vb_lea",
    role: "player",
    jerseyNumber: 5,
    position: "middle_blocker",
    isActive: true,
    joinedTeamAt: "2023-07-01",
    attendanceStats: { invited: 26, attended: 22, excused: 3, absent: 1 }
  },
  {
    id: "r_vb_p3",
    teamId: "team_volleyball_u16",
    seasonId: "s2024_vu16",
    personId: "player_vb_nora",
    role: "player",
    jerseyNumber: 9,
    position: "outside_hitter",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 30, attended: 24, excused: 4, absent: 2 }
  }
];

// ==========================================
// FRAUEN Ü40 — Fußball (current: s2024_frauen)
// ==========================================
const FRAUEN_UE40_ROSTER: TeamRosterEntry[] = [
  {
    id: "r_ue40_bernd",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "bernd",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 28, attended: 28, excused: 0, absent: 0 }
  },
  {
    id: "r_ue40_lena",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "lena_schneider",
    role: "player",
    jerseyNumber: 10,
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 22, excused: 4, absent: 2 }
  },
  {
    id: "r_ue40_claudia",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "claudia",
    role: "player",
    jerseyNumber: 7,
    isActive: true,
    joinedTeamAt: "2021-07-01",
    attendanceStats: { invited: 28, attended: 25, excused: 2, absent: 1 }
  },
  {
    id: "r_ue40_p3",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "player_ue40_maria",
    role: "player",
    jerseyNumber: 5,
    isActive: true,
    joinedTeamAt: "2022-07-01",
    attendanceStats: { invited: 28, attended: 20, excused: 5, absent: 3 }
  },
  {
    id: "r_ue40_p4",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "player_ue40_sabine",
    role: "player",
    jerseyNumber: 9,
    isActive: true,
    joinedTeamAt: "2019-07-01",
    attendanceStats: { invited: 28, attended: 26, excused: 2, absent: 0 }
  },
  {
    id: "r_ue40_p5",
    teamId: "team_frauen_ue40",
    seasonId: "s2024_frauen",
    personId: "player_ue40_heike",
    role: "player",
    jerseyNumber: 3,
    isActive: true,
    joinedTeamAt: "2020-07-01",
    attendanceStats: { invited: 28, attended: 18, excused: 7, absent: 3 }
  }
];

// ==========================================
// FITNESS MORGENGRUPPE (current: s2024_fitness)
// ==========================================
const FITNESS_ROSTER: TeamRosterEntry[] = [
  {
    id: "r_fit_sandra",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    personId: "trainer_sandra",
    role: "coach",
    isActive: true,
    joinedTeamAt: "2020-01-01",
    attendanceStats: { invited: 40, attended: 40, excused: 0, absent: 0 }
  },
  {
    id: "r_fit_lena",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    personId: "lena_schneider",
    role: "player",
    isActive: true,
    joinedTeamAt: "2021-01-01",
    attendanceStats: { invited: 40, attended: 30, excused: 7, absent: 3 }
  },
  {
    id: "r_fit_petra",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    personId: "petra",
    role: "player",
    isActive: true,
    joinedTeamAt: "2022-01-01",
    attendanceStats: { invited: 40, attended: 35, excused: 3, absent: 2 }
  },
  {
    id: "r_fit_p3",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    personId: "player_fit_gabi",
    role: "player",
    isActive: true,
    joinedTeamAt: "2021-06-01",
    attendanceStats: { invited: 40, attended: 28, excused: 8, absent: 4 }
  },
  {
    id: "r_fit_p4",
    teamId: "team_fitness",
    seasonId: "s2024_fitness",
    personId: "player_fit_monika",
    role: "player",
    isActive: true,
    joinedTeamAt: "2023-01-01",
    attendanceStats: { invited: 40, attended: 32, excused: 5, absent: 3 }
  }
];

// ==========================================
// COMBINED EXPORT
// ==========================================
export const mockTeamRoster: TeamRosterEntry[] = [
  ...U12_ROSTER,
  ...U12_ROSTER_ARCHIVED,
  ...U12_ROSTER_NEXT,
  ...HERREN1_ROSTER,
  ...HERREN1_ROSTER_ARCHIVED,
  ...HERREN1_ROSTER_NEXT,
  ...VOLLEYBALL_ROSTER,
  ...FRAUEN_UE40_ROSTER,
  ...FITNESS_ROSTER
];

export function getRosterByTeam(teamId: string, seasonId = "s2024"): TeamRosterEntry[] {
  return mockTeamRoster.filter(e => e.teamId === teamId && e.seasonId === seasonId);
}

export function getPlayersByTeam(teamId: string, seasonId = "s2024"): TeamRosterEntry[] {
  return getRosterByTeam(teamId, seasonId).filter(e => e.role === "player");
}

export function getCoachesByTeam(teamId: string, seasonId = "s2024"): TeamRosterEntry[] {
  return getRosterByTeam(teamId, seasonId).filter(
    e => e.role === "coach" || e.role === "assistant_coach" || e.role === "goalkeeper_coach"
  );
}

// Fictional player display names (for players without a full persona entry)
export const FICTIONAL_PLAYERS: Record<string, { firstName: string; lastName: string; avatarUrl?: string }> = {
  player_u12_luca: { firstName: "Luca", lastName: "Braun" },
  player_u12_ben: { firstName: "Ben", lastName: "Richter" },
  player_u12_finn: { firstName: "Finn", lastName: "Hartmann" },
  player_u12_leo: { firstName: "Leo", lastName: "Zimmermann" },
  player_u12_kai: { firstName: "Kai", lastName: "Neumann" },
  player_u12_paul: { firstName: "Paul", lastName: "Werner" },
  player_h1_mario: { firstName: "Mario", lastName: "Bauer" },
  player_h1_stefan: { firstName: "Stefan", lastName: "Krause" },
  player_h1_michael: { firstName: "Michael", lastName: "Fuchs" },
  player_h1_jan: { firstName: "Jan", lastName: "Schröder" },
  player_h1_felix: { firstName: "Felix", lastName: "Vogel" },
  player_h1_tobias: { firstName: "Tobias", lastName: "Lang" },
  player_h1_lukas: { firstName: "Lukas", lastName: "Weiß" },
  player_h1_david: { firstName: "David", lastName: "Schwarz" },
  player_h1_simon: { firstName: "Simon", lastName: "König" },
  player_h1_oliver: { firstName: "Oliver", lastName: "Meyer" },
  player_vb_mia: { firstName: "Mia", lastName: "Fischer" },
  player_vb_lea: { firstName: "Lea", lastName: "Schulz" },
  player_vb_nora: { firstName: "Nora", lastName: "Wagner" },
  player_u12_emma: { firstName: "Emma", lastName: "Berger" },
  player_u12_tim: { firstName: "Tim", lastName: "Hoffmann" },
  player_h1_marc: { firstName: "Marc", lastName: "Dietrich" },
  claudia: { firstName: "Claudia", lastName: "Weber" },
  bernd: { firstName: "Bernd", lastName: "Trainer" },
  petra: { firstName: "Petra", lastName: "Müller" },
  player_ue40_maria: { firstName: "Maria", lastName: "Hofer" },
  player_ue40_sabine: { firstName: "Sabine", lastName: "Bauer" },
  player_ue40_heike: { firstName: "Heike", lastName: "Wolf" },
  player_fit_gabi: { firstName: "Gabi", lastName: "Roth" },
  player_fit_monika: { firstName: "Monika", lastName: "Stein" }
};

export function getPositionLabel(position?: PlayerPosition): string {
  const labels: Record<string, string> = {
    goalkeeper: "Torwart",
    defender: "Verteidiger",
    midfielder: "Mittelfeld",
    forward: "Stürmer",
    libero: "Libero",
    setter: "Zuspieler",
    outside_hitter: "Außenangreifer",
    middle_blocker: "Mittelblocker",
    hb_goalkeeper: "Torwart",
    hb_back: "Rückraum",
    hb_wing: "Außen",
    hb_pivot: "Kreisläufer"
  };
  return position ? labels[position] ?? position : "—";
}

export type PositionSchemaKey = "football" | "volleyball" | "handball" | "fitness" | "none";

export interface PositionFilterOption {
  value: PlayerPosition | "all";
  label: string;
  color: string;
}

const SCHEMA_FILTERS: Record<PositionSchemaKey, PositionFilterOption[]> = {
  football: [
    { value: "all",        label: "Alle",        color: "" },
    { value: "goalkeeper", label: "Torwart",     color: "bg-yellow-100 text-yellow-700" },
    { value: "defender",   label: "Verteidiger", color: "bg-blue-100 text-blue-700" },
    { value: "midfielder", label: "Mittelfeld",  color: "bg-teal-100 text-teal-700" },
    { value: "forward",    label: "Stürmer",     color: "bg-orange-100 text-orange-700" },
  ],
  volleyball: [
    { value: "all",           label: "Alle",           color: "" },
    { value: "setter",        label: "Zuspieler",      color: "bg-teal-100 text-teal-700" },
    { value: "libero",        label: "Libero",         color: "bg-yellow-100 text-yellow-700" },
    { value: "outside_hitter",label: "Außenangreifer", color: "bg-orange-100 text-orange-700" },
    { value: "middle_blocker",label: "Mittelblocker",  color: "bg-blue-100 text-blue-700" },
  ],
  handball: [
    { value: "all",          label: "Alle",         color: "" },
    { value: "hb_goalkeeper",label: "Torwart",      color: "bg-yellow-100 text-yellow-700" },
    { value: "hb_back",      label: "Rückraum",     color: "bg-blue-100 text-blue-700" },
    { value: "hb_wing",      label: "Außen",        color: "bg-orange-100 text-orange-700" },
    { value: "hb_pivot",     label: "Kreisläufer",  color: "bg-purple-100 text-purple-700" },
  ],
  fitness: [
    { value: "all", label: "Alle Teilnehmer", color: "" },
  ],
  none: [
    { value: "all", label: "Alle", color: "" },
  ],
};

const DEPT_SCHEMA_MAP: Record<string, PositionSchemaKey> = {
  dept_football:   "football",
  dept_volleyball: "volleyball",
  dept_handball:   "handball",
  dept_fitness:    "fitness",
};

export function getPositionFilters(
  schema: import("../contexts/TeamVisibilityContext").PositionSchema,
  departmentId?: string
): PositionFilterOption[] {
  const resolved: PositionSchemaKey =
    schema === "auto"
      ? (DEPT_SCHEMA_MAP[departmentId ?? ""] ?? "none")
      : schema;
  return SCHEMA_FILTERS[resolved];
}

export function getPositionColor(position: string, schema: PositionSchemaKey): string {
  const filters = SCHEMA_FILTERS[schema] ?? SCHEMA_FILTERS.none;
  return filters.find(f => f.value === position)?.color ?? "bg-neutral-100 text-neutral-600";
}
