export type DrillCategory = "warmup" | "technical" | "tactical" | "fitness";
export type DrillDifficulty = "beginner" | "intermediate" | "advanced";

export interface Drill {
  id: string;
  teamId?: string; // undefined = club-level (shared across teams)
  title: string;
  description: string;
  category: DrillCategory;
  duration: number; // minutes
  minPlayers: number;
  maxPlayers?: number;
  difficulty: DrillDifficulty;
  tags: string[];
  mediaUrl?: string;
  isClubDrill: boolean; // true = available to all teams
  createdBy: string;
  createdAt: string;
}

export const mockDrills: Drill[] = [
  // ==========================================
  // WARM-UP
  // ==========================================
  {
    id: "drill_wu01",
    title: "Dynamisches Aufwärmen",
    description: "Spieler laufen in einer Linie über das Spielfeld und führen verschiedene dynamische Bewegungen aus: Kniehebelauf, Anfersen, Seitgalopp, Ausfallschritte. Je 20m hin und zurück. Varianten: mit Ball am Fuß, mit Partner.",
    category: "warmup",
    duration: 10,
    minPlayers: 6,
    difficulty: "beginner",
    tags: ["aufwärmen", "beweglichkeit", "koordination"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-08-01T09:00:00Z"
  },
  {
    id: "drill_wu02",
    title: "Passspiel im Dreieck",
    description: "3 Spieler stehen im Dreieck (ca. 8m Abstand). Ball wird mit 2 Kontakten gespielt. Variation: 1 Kontakt, wechselnde Richtung, mit Gegenspieler. Fokus auf saubere Ballannahme und schnelles Weiterspielen.",
    category: "warmup",
    duration: 12,
    minPlayers: 6,
    difficulty: "beginner",
    tags: ["aufwärmen", "passspiel", "ballkontrolle"],
    isClubDrill: true,
    createdBy: "coach_marco",
    createdAt: "2024-08-15T10:00:00Z"
  },
  {
    id: "drill_wu03",
    title: "Rondo 4 gegen 1",
    description: "4 Spieler im Kreis (ca. 6m Durchmesser), 1 Spieler in der Mitte. Ziel: Ball in der Außengruppe halten. Fremdkontakt wird geahndet — wer den Ball verliert, wechselt in die Mitte. Maximal 2 Kontakte.",
    category: "warmup",
    duration: 15,
    minPlayers: 5,
    difficulty: "intermediate",
    tags: ["aufwärmen", "ballbesitz", "pressing"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-09-01T09:00:00Z"
  },
  {
    id: "drill_wu04",
    title: "Koordinationsleiter",
    description: "Spieler durchlaufen eine Koordinationsleiter mit verschiedenen Schrittfolgen: Ein-Bein, Zwei-Bein, seitlich, rückwärts. Anschließend Sprint zu einem Hütchen. Dauer pro Spieler: 30 Sekunden.",
    category: "warmup",
    duration: 10,
    minPlayers: 4,
    difficulty: "beginner",
    tags: ["koordination", "schnelligkeit", "aufwärmen"],
    isClubDrill: false,
    teamId: "team_u12",
    createdBy: "coach_marco",
    createdAt: "2024-10-05T14:00:00Z"
  },
  {
    id: "drill_wu05",
    title: "Stretching & Mobilisation",
    description: "Geführtes Dehnen: Oberschenkel, Wade, Hüftbeuger, Schultern. Je 30 Sekunden pro Übung. Dann dynamische Mobilisation der Wirbelsäule. Wichtig: keine Extremdehnungen vor dem Training, nur dynamisches Stretching.",
    category: "warmup",
    duration: 8,
    minPlayers: 1,
    difficulty: "beginner",
    tags: ["dehnen", "mobilisation", "verletzungsprävention"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-08-01T09:00:00Z"
  },

  // ==========================================
  // TECHNICAL
  // ==========================================
  {
    id: "drill_te01",
    title: "Passwand 1-2",
    description: "Spieler A spielt auf Spieler B (Passwand), läuft in die Tiefe, bekommt den Ball zurück und schließt ab. Varianten: Hereingabe und Direktabnahme, andere Fuß, Kopfball. 3 Serien pro Spieler.",
    category: "technical",
    duration: 20,
    minPlayers: 4,
    difficulty: "intermediate",
    tags: ["passspiel", "kombinationsspiel", "torabschluss"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-08-10T10:00:00Z"
  },
  {
    id: "drill_te02",
    title: "Flanke und Kopfball",
    description: "Außenspieler flankt von der Grundlinie, 2 Stürmer laufen in den Strafraum. Ziel: Kopfballtore aus der Flanke. Variation: kurze Flanke (Rückraum), hohe Flanke (langer Pfosten). 10 Flanken pro Seite.",
    category: "technical",
    duration: 25,
    minPlayers: 6,
    difficulty: "intermediate",
    tags: ["flanken", "kopfball", "torabschluss"],
    isClubDrill: false,
    teamId: "team1",
    createdBy: "thomas_mueller",
    createdAt: "2024-09-15T09:00:00Z"
  },
  {
    id: "drill_te03",
    title: "Dribbling-Parcours",
    description: "Hütchenparcours mit Slalom, Überstieg und Abschluss. Spieler dribbeln durch die Stangen, machen einen Überstieg vor dem letzten Hütchen und schließen aus 16m ab. Zeit wird gemessen.",
    category: "technical",
    duration: 20,
    minPlayers: 4,
    difficulty: "beginner",
    tags: ["dribbling", "täuschung", "torabschluss"],
    isClubDrill: false,
    teamId: "team_u12",
    createdBy: "coach_marco",
    createdAt: "2024-08-20T14:00:00Z"
  },
  {
    id: "drill_te04",
    title: "Torhüter 1-gegen-1",
    description: "Stürmer kommt aus verschiedenen Winkeln auf den Torwart zu. Ziel: Torwart übt das Herauslaufen und Eins-gegen-Eins-Situationen. 5 Angriffe aus links, 5 aus rechts, 5 zentral.",
    category: "technical",
    duration: 20,
    minPlayers: 3,
    difficulty: "intermediate",
    tags: ["torwart", "1gegen1", "stellungsspiel"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-10-01T10:00:00Z"
  },
  {
    id: "drill_te05",
    title: "Ballmitnahme und Abschluss",
    description: "Zuspiel aus verschiedenen Winkeln, Spieler nimmt den Ball in die richtige Richtung mit und schließt ab. Fokus: erste Ballberührung in Spielrichtung, schneller Abschluss. 15 Wiederholungen pro Spieler.",
    category: "technical",
    duration: 20,
    minPlayers: 3,
    difficulty: "intermediate",
    tags: ["ballmitnahme", "torabschluss", "erster-kontakt"],
    isClubDrill: true,
    createdBy: "coach_marco",
    createdAt: "2024-09-10T09:00:00Z"
  },
  {
    id: "drill_te06",
    title: "Freistoß-Training",
    description: "Spieler üben Freistöße aus verschiedenen Positionen: direkt aus 18m, halbrechts/halblinks, Variante mit Mauer. Fokus: Technik (Innenseite, Außenrist), Platzierung. 20 Schüsse pro Spieler.",
    category: "technical",
    duration: 25,
    minPlayers: 4,
    maxPlayers: 12,
    difficulty: "advanced",
    tags: ["freistoss", "standardsituation", "torabschluss"],
    isClubDrill: false,
    teamId: "team1",
    createdBy: "thomas_mueller",
    createdAt: "2024-10-15T10:00:00Z"
  },

  // ==========================================
  // TACTICAL
  // ==========================================
  {
    id: "drill_ta01",
    title: "Pressing 4-4-2 kompakt",
    description: "Übung im 4-4-2 System: Beim Ballverlust sofortige Kompaktheit herstellen. Die 4er-Kette schiebt zusammen, die Stürmer pressen als erstes. Übung auf 2/3 des Feldes, 8 gegen 8.",
    category: "tactical",
    duration: 30,
    minPlayers: 14,
    difficulty: "advanced",
    tags: ["pressing", "kompaktheit", "4-4-2"],
    isClubDrill: false,
    teamId: "team1",
    createdBy: "thomas_mueller",
    createdAt: "2024-09-05T10:00:00Z"
  },
  {
    id: "drill_ta02",
    title: "Spieleröffnung durch den Sechser",
    description: "Aufbau aus der Viererkette: Torwart spielt auf den Sechser, der zwischen den Linien steht. Sechser dreht sich und verteilt. Gegnerisches Pressing simuliert durch 2 Stürmer. Variation: Verlagerung auf die Außenverteidiger.",
    category: "tactical",
    duration: 25,
    minPlayers: 8,
    difficulty: "advanced",
    tags: ["spieleröffnung", "ballaufbau", "6er-position"],
    isClubDrill: false,
    teamId: "team1",
    createdBy: "thomas_mueller",
    createdAt: "2024-10-10T09:00:00Z"
  },
  {
    id: "drill_ta03",
    title: "Überzahlspiel 3 gegen 2",
    description: "3 Angreifer gegen 2 Verteidiger auf Minifeld (20x30m) mit zwei kleinen Toren. Angreifer versuchen eine Überzahlsituation zu kreieren und zu nutzen. Wechsel nach Tor oder Ballverlust.",
    category: "tactical",
    duration: 20,
    minPlayers: 5,
    difficulty: "intermediate",
    tags: ["überzahl", "kombinationsspiel", "finales-drittel"],
    isClubDrill: true,
    createdBy: "coach_marco",
    createdAt: "2024-08-25T14:00:00Z"
  },
  {
    id: "drill_ta04",
    title: "Eckstoß-Varianten",
    description: "Eingeübte Eckstöße: kurze Variante (Ecke + Rückgabe + Flanke), lange Variante (direkt auf den langen Pfosten), Feinte (Anlauf als würde kurz gespielt, dann langer Ball). Jede Variante 5x üben.",
    category: "tactical",
    duration: 25,
    minPlayers: 8,
    difficulty: "intermediate",
    tags: ["eckstoß", "standardsituation", "kopfball"],
    isClubDrill: false,
    teamId: "team1",
    createdBy: "thomas_mueller",
    createdAt: "2024-11-01T10:00:00Z"
  },
  {
    id: "drill_ta05",
    title: "Gegenpressing nach Ballverlust",
    description: "Übung auf 40x30m: Nach Ballverlust sofort pressen. Die nächsten 3 Spieler zum Ball. Druck ausüben innerhalb 5 Sekunden. Wenn Pressing erfolglos: geordnet zurückziehen. Spiel 6v6.",
    category: "tactical",
    duration: 30,
    minPlayers: 12,
    difficulty: "advanced",
    tags: ["gegenpressing", "ballrückeroberung", "umschalten"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-09-20T10:00:00Z"
  },

  // ==========================================
  // FITNESS
  // ==========================================
  {
    id: "drill_fi01",
    title: "Intervallläufe",
    description: "5x 200m Sprintintervalle mit 60 Sekunden Pause dazwischen. Tempo: 80% der Maximalgeschwindigkeit. Anschließend 5 Minuten lockeres Auslaufen. Gesamtdauer ca. 20 Minuten.",
    category: "fitness",
    duration: 20,
    minPlayers: 1,
    difficulty: "intermediate",
    tags: ["ausdauer", "sprint", "kondition"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-08-01T09:00:00Z"
  },
  {
    id: "drill_fi02",
    title: "Kraft-Zirkel",
    description: "5 Stationen à 45 Sekunden, 15 Sekunden Pause: 1) Liegestütze, 2) Kniebeugen, 3) Burpees, 4) Ausfallschritte, 5) Plank. 3 Durchgänge. Fokus auf saubere Ausführung, nicht auf Tempo.",
    category: "fitness",
    duration: 25,
    minPlayers: 1,
    difficulty: "intermediate",
    tags: ["kraft", "zirkeltraining", "rumpfstabilität"],
    isClubDrill: true,
    createdBy: "thomas_mueller",
    createdAt: "2024-08-15T10:00:00Z"
  },
  {
    id: "drill_fi03",
    title: "Reaktions-Sprint",
    description: "Spieler stehen in 5m Abstand. Trainer ruft Farbe (entspricht Hütchen), Spieler sprintet zum Hütchen und zurück. Variation: Trainer zeigt Hütchen, kein Ruf. 10 Wiederholungen pro Spieler.",
    category: "fitness",
    duration: 15,
    minPlayers: 2,
    difficulty: "beginner",
    tags: ["reaktion", "sprint", "koordination"],
    isClubDrill: true,
    createdBy: "coach_marco",
    createdAt: "2024-09-01T09:00:00Z"
  },
  {
    id: "drill_fi04",
    title: "Sprintprogramm mit Ball",
    description: "Spieler dribbliert 30m Sprint, lässt Ball liegen, läuft zurück, Sprint wieder vor, nimmt Ball mit. 5 Wiederholungen. Anschließend Direktschuss. Ziel: Explosivität + technische Qualität unter Ermüdung.",
    category: "fitness",
    duration: 20,
    minPlayers: 3,
    difficulty: "intermediate",
    tags: ["sprint", "ausdauer", "dribbling", "kondition"],
    isClubDrill: false,
    teamId: "team_u12",
    createdBy: "coach_marco",
    createdAt: "2024-10-10T14:00:00Z"
  }
];

export function getDrillsByCategory(category: DrillCategory): Drill[] {
  return mockDrills.filter(d => d.category === category);
}

export function getDrillsForTeam(teamId: string): Drill[] {
  return mockDrills.filter(d => d.isClubDrill || d.teamId === teamId);
}

export function getClubDrills(): Drill[] {
  return mockDrills.filter(d => d.isClubDrill);
}

export const CATEGORY_LABELS: Record<DrillCategory, string> = {
  warmup: "Aufwärmen",
  technical: "Technik",
  tactical: "Taktik",
  fitness: "Fitness"
};

export const DIFFICULTY_LABELS: Record<DrillDifficulty, string> = {
  beginner: "Anfänger",
  intermediate: "Mittel",
  advanced: "Fortgeschritten"
};
