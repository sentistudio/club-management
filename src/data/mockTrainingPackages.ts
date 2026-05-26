export interface TrainingPackageItem {
  drillId: string;
  order: number;
  durationOverride?: number; // override drill's default duration
  notes?: string;
}

export interface TrainingPackage {
  id: string;
  teamId: string;
  seasonId: string;
  title: string;
  description: string;
  totalDuration: number; // minutes (computed from items)
  items: TrainingPackageItem[];
  tags: string[];
  createdBy: string;
  createdAt: string;
}

export const mockTrainingPackages: TrainingPackage[] = [
  {
    id: "tp_u12_warmup",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "U12 Standard-Einheit",
    description: "Klassische Trainingseinheit für die U12: Aufwärmen, technische Grundlagen, Spiel. Passt für reguläres Dienstag-/Freitagstraining.",
    totalDuration: 90,
    items: [
      { drillId: "drill_wu01", order: 1 },
      { drillId: "drill_wu02", order: 2 },
      { drillId: "drill_te03", order: 3 },
      { drillId: "drill_ta03", order: 4, durationOverride: 25 },
      { drillId: "drill_fi03", order: 5 }
    ],
    tags: ["u12", "standard", "technik"],
    createdBy: "coach_marco",
    createdAt: "2024-08-20T10:00:00Z"
  },
  {
    id: "tp_u12_match_prep",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Spielvorbereitung U12",
    description: "Abschlusstraining vor einem Punktspiel. Kurz und intensiv. Keine neue Belastung, nur Aktivierung und Standardsituationen.",
    totalDuration: 60,
    items: [
      { drillId: "drill_wu03", order: 1 },
      { drillId: "drill_wu02", order: 2 },
      { drillId: "drill_te01", order: 3 },
      { drillId: "drill_ta04", order: 4, durationOverride: 15 }
    ],
    tags: ["u12", "spielvorbereitung", "leicht"],
    createdBy: "coach_marco",
    createdAt: "2024-09-01T10:00:00Z"
  },
  {
    id: "tp_h1_standard",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "1. Herren Standardeinheit",
    description: "Reguläre Trainingseinheit für die Erste. Fokus auf Ballbesitz, Pressing und schnelles Umschalten. Für Dienstag und Donnerstag.",
    totalDuration: 105,
    items: [
      { drillId: "drill_wu03", order: 1 },
      { drillId: "drill_wu05", order: 2 },
      { drillId: "drill_te01", order: 3 },
      { drillId: "drill_ta01", order: 4 },
      { drillId: "drill_ta05", order: 5 },
      { drillId: "drill_fi01", order: 6, durationOverride: 15 }
    ],
    tags: ["herren", "standard", "ballbesitz", "pressing"],
    createdBy: "thomas_mueller",
    createdAt: "2024-08-05T09:00:00Z"
  },
  {
    id: "tp_h1_taktik",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "1. Herren Taktik-Fokus",
    description: "Taktische Einheit mit Schwerpunkt Spieleröffnung und Standardsituationen. Einsatz vor wichtigen Partien.",
    totalDuration: 90,
    items: [
      { drillId: "drill_wu01", order: 1 },
      { drillId: "drill_ta02", order: 2 },
      { drillId: "drill_ta04", order: 3 },
      { drillId: "drill_te06", order: 4 }
    ],
    tags: ["herren", "taktik", "standardsituationen"],
    createdBy: "thomas_mueller",
    createdAt: "2024-10-01T09:00:00Z"
  },
  {
    id: "tp_h1_fitness",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Fitness-Schwerpunkt Herren",
    description: "Athletik und Ausdauer im Fokus. Einzusetzen am Anfang der Vorbereitung oder nach einer Pause.",
    totalDuration: 75,
    items: [
      { drillId: "drill_wu04", order: 1, durationOverride: 10 },
      { drillId: "drill_wu05", order: 2 },
      { drillId: "drill_fi01", order: 3 },
      { drillId: "drill_fi02", order: 4 },
      { drillId: "drill_fi04", order: 5, durationOverride: 15 }
    ],
    tags: ["herren", "fitness", "kondition"],
    createdBy: "thomas_mueller",
    createdAt: "2024-07-15T09:00:00Z"
  },
  {
    id: "tp_h1_preseason_2025",
    teamId: "team1",
    seasonId: "s2025_team1",
    title: "Vorbereitung 2025/26 — Konditionsaufbau",
    description: "Spezielle Vorbereitungseinheit für den Saisonstart. Fokus auf Grundlagenausdauer und Teambuilding. Einzusetzen in den ersten 4 Wochen der Vorbereitung.",
    totalDuration: 90,
    items: [
      { drillId: "drill_wu04", order: 1 },
      { drillId: "drill_wu05", order: 2 },
      { drillId: "drill_fi01", order: 3 },
      { drillId: "drill_fi02", order: 4 },
      { drillId: "drill_ta01", order: 5, durationOverride: 20 }
    ],
    tags: ["herren", "vorbereitung", "kondition", "2025"],
    createdBy: "thomas_mueller",
    createdAt: "2025-05-01T09:00:00Z"
  }
];

export function getTrainingPackagesByTeam(teamId: string, seasonId = "s2024"): TrainingPackage[] {
  return mockTrainingPackages.filter(tp => tp.teamId === teamId && tp.seasonId === seasonId);
}
