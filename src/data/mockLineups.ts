export type Formation = "4-4-2" | "4-3-3" | "3-5-2" | "4-2-3-1";

export interface LineupPosition {
  slot: string; // e.g. "gk", "lb", "cb1", "cb2", "rb", "lm", "cm1", "cm2", "rm", "st1", "st2"
  personId?: string;
  jerseyNumber?: number;
  label?: string; // display label override
}

export interface Lineup {
  id: string;
  teamId: string;
  seasonId: string;
  name: string;
  formation: Formation;
  linkedMatchId?: string;
  positions: LineupPosition[];
  notes?: string;
  createdBy: string;
  createdAt: string;
}

// Formation slot definitions
export const FORMATION_SLOTS: Record<Formation, { slot: string; x: number; y: number; label: string }[]> = {
  "4-4-2": [
    { slot: "gk", x: 50, y: 90, label: "TW" },
    { slot: "rb", x: 82, y: 72, label: "RV" },
    { slot: "cb1", x: 62, y: 72, label: "IV" },
    { slot: "cb2", x: 38, y: 72, label: "IV" },
    { slot: "lb", x: 18, y: 72, label: "LV" },
    { slot: "rm", x: 82, y: 48, label: "RAM" },
    { slot: "cm1", x: 62, y: 48, label: "ZM" },
    { slot: "cm2", x: 38, y: 48, label: "ZM" },
    { slot: "lm", x: 18, y: 48, label: "LAM" },
    { slot: "st1", x: 62, y: 24, label: "ST" },
    { slot: "st2", x: 38, y: 24, label: "ST" }
  ],
  "4-3-3": [
    { slot: "gk", x: 50, y: 90, label: "TW" },
    { slot: "rb", x: 82, y: 72, label: "RV" },
    { slot: "cb1", x: 62, y: 72, label: "IV" },
    { slot: "cb2", x: 38, y: 72, label: "IV" },
    { slot: "lb", x: 18, y: 72, label: "LV" },
    { slot: "cm1", x: 65, y: 48, label: "ZM" },
    { slot: "cm2", x: 50, y: 48, label: "ZM" },
    { slot: "cm3", x: 35, y: 48, label: "ZM" },
    { slot: "rw", x: 80, y: 22, label: "RA" },
    { slot: "st", x: 50, y: 18, label: "ST" },
    { slot: "lw", x: 20, y: 22, label: "LA" }
  ],
  "3-5-2": [
    { slot: "gk", x: 50, y: 90, label: "TW" },
    { slot: "cb1", x: 68, y: 72, label: "IV" },
    { slot: "cb2", x: 50, y: 72, label: "IV" },
    { slot: "cb3", x: 32, y: 72, label: "IV" },
    { slot: "rwb", x: 88, y: 50, label: "RMF" },
    { slot: "cm1", x: 65, y: 48, label: "ZM" },
    { slot: "dm", x: 50, y: 52, label: "6er" },
    { slot: "cm2", x: 35, y: 48, label: "ZM" },
    { slot: "lwb", x: 12, y: 50, label: "LMF" },
    { slot: "st1", x: 62, y: 22, label: "ST" },
    { slot: "st2", x: 38, y: 22, label: "ST" }
  ],
  "4-2-3-1": [
    { slot: "gk", x: 50, y: 90, label: "TW" },
    { slot: "rb", x: 82, y: 72, label: "RV" },
    { slot: "cb1", x: 62, y: 72, label: "IV" },
    { slot: "cb2", x: 38, y: 72, label: "IV" },
    { slot: "lb", x: 18, y: 72, label: "LV" },
    { slot: "dm1", x: 60, y: 56, label: "6er" },
    { slot: "dm2", x: 40, y: 56, label: "6er" },
    { slot: "ram", x: 75, y: 36, label: "RAM" },
    { slot: "zeh", x: 50, y: 33, label: "10er" },
    { slot: "lam", x: 25, y: 36, label: "LAM" },
    { slot: "st", x: 50, y: 16, label: "ST" }
  ]
};

export const mockLineups: Lineup[] = [
  // ==========================================
  // 1. HERREN
  // ==========================================
  {
    id: "lu_h1_433",
    teamId: "team1",
    seasonId: "s2024_team1",
    name: "Heimspiel vs. FC Schwarz-Weiß",
    formation: "4-3-3",
    linkedMatchId: "te_h1_m01",
    notes: "Simon auf Links, Tobias als Mittelstürmer. David kommt ab der 60. Minute für Felix.",
    positions: [
      { slot: "gk", personId: "player_h1_mario", jerseyNumber: 1 },
      { slot: "rb", personId: "player_h1_jan", jerseyNumber: 5 },
      { slot: "cb1", personId: "player_h1_michael", jerseyNumber: 4 },
      { slot: "cb2", personId: "player_h1_stefan", jerseyNumber: 2 },
      { slot: "lb", personId: "player_h1_oliver", jerseyNumber: 3 },
      { slot: "cm1", personId: "player_h1_felix", jerseyNumber: 6 },
      { slot: "cm2", personId: "patrick_steuble", jerseyNumber: 8 },
      { slot: "cm3", personId: "player_h1_simon", jerseyNumber: 11 },
      { slot: "rw", personId: "player_h1_lukas", jerseyNumber: 9 },
      { slot: "st", personId: "player_h1_tobias", jerseyNumber: 7 },
      { slot: "lw", personId: "player_h1_david", jerseyNumber: 10 }
    ],
    createdBy: "thomas_mueller",
    createdAt: "2025-05-08T10:00:00Z"
  },
  {
    id: "lu_h1_442",
    teamId: "team1",
    seasonId: "s2024_team1",
    name: "Standard 4-4-2",
    formation: "4-4-2",
    notes: "Unsere Standardaufstellung für Auswärtsspiele.",
    positions: [
      { slot: "gk", personId: "player_h1_mario", jerseyNumber: 1 },
      { slot: "rb", personId: "player_h1_jan", jerseyNumber: 5 },
      { slot: "cb1", personId: "player_h1_michael", jerseyNumber: 4 },
      { slot: "cb2", personId: "player_h1_stefan", jerseyNumber: 2 },
      { slot: "lb", personId: "player_h1_oliver", jerseyNumber: 3 },
      { slot: "rm", personId: "player_h1_lukas", jerseyNumber: 9 },
      { slot: "cm1", personId: "patrick_steuble", jerseyNumber: 8 },
      { slot: "cm2", personId: "player_h1_felix", jerseyNumber: 6 },
      { slot: "lm", personId: "player_h1_simon", jerseyNumber: 11 },
      { slot: "st1", personId: "player_h1_tobias", jerseyNumber: 7 },
      { slot: "st2", personId: "player_h1_david", jerseyNumber: 10 }
    ],
    createdBy: "thomas_mueller",
    createdAt: "2024-08-15T09:00:00Z"
  },
  {
    id: "lu_h1_next_442",
    teamId: "team1",
    seasonId: "s2025_team1",
    name: "Entwurf 4-4-2 Neue Saison",
    formation: "4-4-2",
    notes: "Planungsaufstellung — Marc als neue Option vorne. Noch nicht final.",
    positions: [
      { slot: "gk", personId: "player_h1_mario", jerseyNumber: 1 },
      { slot: "rb", personId: "player_h1_jan", jerseyNumber: 5 },
      { slot: "cb1", personId: "player_h1_michael", jerseyNumber: 4 },
      { slot: "cb2", personId: "player_h1_stefan", jerseyNumber: 2 },
      { slot: "lb", personId: "player_h1_oliver", jerseyNumber: 3 },
      { slot: "rm", personId: "player_h1_lukas", jerseyNumber: 9 },
      { slot: "cm1", personId: "patrick_steuble", jerseyNumber: 8 },
      { slot: "cm2", personId: "player_h1_felix", jerseyNumber: 6 },
      { slot: "lm", personId: "player_h1_simon", jerseyNumber: 11 },
      { slot: "st1", personId: "player_h1_marc", jerseyNumber: 14 },
      { slot: "st2", personId: "player_h1_tobias", jerseyNumber: 7 }
    ],
    createdBy: "thomas_mueller",
    createdAt: "2025-05-01T10:00:00Z"
  },

  // ==========================================
  // TEAM_U12
  // ==========================================
  {
    id: "lu_u12_442",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    name: "Auswärtsspiel vs. TV Lich",
    formation: "4-4-2",
    linkedMatchId: "te_u12_m01",
    notes: "Luca im Tor. Noah und Kai als Sturmduo. Anna ist abgemeldet — Paul kommt für sie.",
    positions: [
      { slot: "gk", personId: "player_u12_luca", jerseyNumber: 1 },
      { slot: "rb", personId: "player_u12_ben", jerseyNumber: 4 },
      { slot: "cb1", personId: "person_anna", jerseyNumber: 3 },
      { slot: "cb2", personId: "player_u12_finn", jerseyNumber: 6 },
      { slot: "lb", personId: "player_u12_leo", jerseyNumber: 8 },
      { slot: "rm", personId: "sophie_klein", jerseyNumber: 5 },
      { slot: "cm1", personId: "max_schneider", jerseyNumber: 10 },
      { slot: "cm2" },
      { slot: "lm" },
      { slot: "st1", personId: "noah_hoffmann", jerseyNumber: 7 },
      { slot: "st2", personId: "player_u12_kai", jerseyNumber: 9 }
    ],
    createdBy: "coach_marco",
    createdAt: "2025-04-30T19:00:00Z"
  },
  {
    id: "lu_u12_433",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    name: "Angriffsvariante 4-3-3",
    formation: "4-3-3",
    notes: "Für Spiele, wo wir mehr Risiko gehen müssen.",
    positions: [
      { slot: "gk", personId: "player_u12_luca", jerseyNumber: 1 },
      { slot: "rb", personId: "player_u12_ben", jerseyNumber: 4 },
      { slot: "cb1", personId: "person_anna", jerseyNumber: 3 },
      { slot: "cb2", personId: "player_u12_finn", jerseyNumber: 6 },
      { slot: "lb", personId: "player_u12_leo", jerseyNumber: 8 },
      { slot: "cm1", personId: "sophie_klein", jerseyNumber: 5 },
      { slot: "cm2", personId: "max_schneider", jerseyNumber: 10 },
      { slot: "cm3", personId: "player_u12_paul", jerseyNumber: 11 },
      { slot: "rw", personId: "player_u12_kai", jerseyNumber: 9 },
      { slot: "st", personId: "noah_hoffmann", jerseyNumber: 7 },
      { slot: "lw" }
    ],
    createdBy: "coach_marco",
    createdAt: "2025-02-10T19:00:00Z"
  }
];

export function getLineupsByTeam(teamId: string, seasonId = "s2024"): Lineup[] {
  return mockLineups.filter(l => l.teamId === teamId && l.seasonId === seasonId);
}

export function getLineupById(id: string): Lineup | undefined {
  return mockLineups.find(l => l.id === id);
}

export const FORMATION_LABELS: Record<Formation, string> = {
  "4-4-2": "4-4-2",
  "4-3-3": "4-3-3",
  "3-5-2": "3-5-2",
  "4-2-3-1": "4-2-3-1"
};
