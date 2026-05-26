export type SeasonStatus = "planned" | "active" | "archived";

export interface Season {
  id: string;
  teamId?: string;
  label: string;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  isActive: boolean; // backward compat alias for status === "active"
}

// Global fallback seasons (used when a team has no team-specific seasons)
export const mockSeasons: Season[] = [
  { id: "s2022", label: "2022/23", startDate: "2022-07-01", endDate: "2023-06-30", status: "archived", isActive: false },
  { id: "s2023", label: "2023/24", startDate: "2023-07-01", endDate: "2024-06-30", status: "archived", isActive: false },
  { id: "s2024", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active",   isActive: true  },
];

// Per-team seasons — each team manages its own calendar independently
const teamSeasons: Season[] = [
  // ── 1. Herren (team1) — football, Jul–Jun ──
  { id: "s2023_team1", teamId: "team1", label: "2023/24", startDate: "2023-07-01", endDate: "2024-06-30", status: "archived", isActive: false },
  { id: "s2024_team1", teamId: "team1", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active",   isActive: true  },
  { id: "s2025_team1", teamId: "team1", label: "2025/26", startDate: "2025-07-01", endDate: "2026-06-30", status: "planned",  isActive: false },

  // ── 2. Herren (team2) ──
  { id: "s2023_team2", teamId: "team2", label: "2023/24", startDate: "2023-07-01", endDate: "2024-06-30", status: "archived", isActive: false },
  { id: "s2024_team2", teamId: "team2", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active",   isActive: true  },
  { id: "s2025_team2", teamId: "team2", label: "2025/26", startDate: "2025-07-01", endDate: "2026-06-30", status: "planned",  isActive: false },

  // ── 1. Damen (team3) ──
  { id: "s2024_team3", teamId: "team3", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active",  isActive: true  },
  { id: "s2025_team3", teamId: "team3", label: "2025/26", startDate: "2025-07-01", endDate: "2026-06-30", status: "planned", isActive: false },

  // ── U19–U11 youth (team4–team8) ──
  ...["team4", "team5", "team6", "team7", "team8"].flatMap(tid => ([
    { id: `s2024_${tid}`, teamId: tid, label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active"  as SeasonStatus, isActive: true  },
    { id: `s2025_${tid}`, teamId: tid, label: "2025/26", startDate: "2025-07-01", endDate: "2026-06-30", status: "planned" as SeasonStatus, isActive: false },
  ])),

  // ── Fußball U12 (team_u12) ──
  { id: "s2023_u12", teamId: "team_u12", label: "2023/24", startDate: "2023-07-01", endDate: "2024-06-30", status: "archived", isActive: false },
  { id: "s2024_u12", teamId: "team_u12", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active",   isActive: true  },
  { id: "s2025_u12", teamId: "team_u12", label: "2025/26", startDate: "2025-07-01", endDate: "2026-06-30", status: "planned",  isActive: false },

  // ── Frauen Ü40 ──
  { id: "s2024_frauen", teamId: "team_frauen_ue40", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active", isActive: true },

  // ── Volleyball U16 (team_volleyball_u16) — Sep–Jun calendar ──
  { id: "s2024_vu16", teamId: "team_volleyball_u16", label: "2024/25", startDate: "2024-09-01", endDate: "2025-06-30", status: "active",  isActive: true  },
  { id: "s2025_vu16", teamId: "team_volleyball_u16", label: "2025/26", startDate: "2025-09-01", endDate: "2026-06-30", status: "planned", isActive: false },

  // ── Mixed Volleyball (team11) ──
  { id: "s2024_team11", teamId: "team11", label: "2024/25", startDate: "2024-09-01", endDate: "2025-06-30", status: "active", isActive: true },

  // ── Handball (team9, team10) ──
  { id: "s2024_team9",  teamId: "team9",  label: "2024/25", startDate: "2024-09-01", endDate: "2025-05-31", status: "active",  isActive: true  },
  { id: "s2025_team9",  teamId: "team9",  label: "2025/26", startDate: "2025-09-01", endDate: "2026-05-31", status: "planned", isActive: false },
  { id: "s2024_team10", teamId: "team10", label: "2024/25", startDate: "2024-09-01", endDate: "2025-05-31", status: "active",  isActive: true  },

  // ── Fitness Morgengruppe — rolling, no fixed season end ──
  { id: "s2024_fitness", teamId: "team_fitness", label: "2024/25", startDate: "2024-07-01", endDate: "2025-06-30", status: "active", isActive: true },
];

export const allMockSeasons: Season[] = [...mockSeasons, ...teamSeasons];

export const CURRENT_SEASON_ID = "s2024";
export const CURRENT_SEASON = mockSeasons.find(s => s.isActive)!;

export function getSeasonsByTeam(teamId: string): Season[] {
  const seasons = allMockSeasons.filter(s => s.teamId === teamId);
  return seasons.length > 0 ? seasons : mockSeasons;
}

export function getActiveSeasonForTeam(teamId: string): Season {
  const seasons = getSeasonsByTeam(teamId);
  return seasons.find(s => s.status === "active") ?? seasons[seasons.length - 1];
}
