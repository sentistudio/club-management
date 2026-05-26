export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  assignedTo: string[]; // personIds
  status: TaskStatus;
  dueDate?: string; // YYYY-MM-DD
  completedAt?: string;
}

export interface TaskGroup {
  id: string;
  teamId?: string;  // undefined = club-level task group
  seasonId?: string;
  title: string;
  description: string;
  dueDate?: string;
  createdBy: string;
  createdAt: string;
}

export const mockTaskGroups: TaskGroup[] = [
  {
    id: "tg_u12_matchprep",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Spielvorbereitung vs. TV Lich",
    description: "Aufgaben zur Vorbereitung auf das Auswärtsspiel am 03. Mai.",
    dueDate: "2025-05-03",
    createdBy: "coach_marco",
    createdAt: "2025-04-25T10:00:00Z"
  },
  {
    id: "tg_u12_fitness",
    teamId: "team_u12",
    seasonId: "s2024_u12",
    title: "Fitness-Challenge April",
    description: "Extraaufgaben zur individuellen Fitnessverbesserung — zu erledigen außerhalb des Trainings.",
    dueDate: "2025-04-30",
    createdBy: "coach_marco",
    createdAt: "2025-04-01T10:00:00Z"
  },
  {
    id: "tg_h1_preseason",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Saisonvorbereitung 2024/25",
    description: "Aufgaben vor dem Saisonstart — individuelle Vorbereitung und Organisation.",
    dueDate: "2024-08-15",
    createdBy: "thomas_mueller",
    createdAt: "2024-07-20T09:00:00Z"
  },
  {
    id: "tg_h1_tactics",
    teamId: "team1",
    seasonId: "s2024_team1",
    title: "Taktikstudium — Gegneranalyse",
    description: "Aufgaben zur taktischen Vorbereitung auf kommende Spiele. Bitte bis Trainingstag erledigen.",
    createdBy: "thomas_mueller",
    createdAt: "2025-04-20T09:00:00Z"
  },
  {
    id: "tg_u12_nextseason",
    teamId: "team_u12",
    seasonId: "s2025_u12",
    title: "Kaderplanung 2025/26",
    description: "Vorbereitung des Kaders für die nächste Saison.",
    dueDate: "2025-06-30",
    createdBy: "coach_marco",
    createdAt: "2025-04-01T10:00:00Z"
  },
  {
    id: "tg_h1_nextseason",
    teamId: "team1",
    seasonId: "s2025_team1",
    title: "Saisonvorbereitung 2025/26",
    description: "Planung und Organisation für die Saison 2025/26.",
    dueDate: "2025-07-31",
    createdBy: "thomas_mueller",
    createdAt: "2025-04-15T09:00:00Z"
  }
];

export const mockTasks: Task[] = [
  // ==========================================
  // tg_u12_matchprep
  // ==========================================
  {
    id: "t_u12_mp01",
    groupId: "tg_u12_matchprep",
    title: "Gegneranalyse TV Lich anschauen",
    description: "Video der letzten 2 TV-Lich-Spiele ansehen und 3 Stärken/Schwächen nennen können.",
    assignedTo: ["noah_hoffmann", "max_schneider", "sophie_klein"],
    status: "in_progress",
    dueDate: "2025-05-01"
  },
  {
    id: "t_u12_mp02",
    groupId: "tg_u12_matchprep",
    title: "Trikots und Ausrüstung vorbereiten",
    description: "Schienbeinschoner, Stollen, Trinkflasche einpacken.",
    assignedTo: ["max_schneider", "noah_hoffmann", "sophie_klein", "person_anna", "player_u12_luca", "player_u12_ben", "player_u12_finn", "player_u12_leo", "player_u12_kai", "player_u12_paul"],
    status: "todo",
    dueDate: "2025-05-03"
  },
  {
    id: "t_u12_mp03",
    groupId: "tg_u12_matchprep",
    title: "Anfahrt zum Sportplatz Lich klären",
    description: "Eltern informieren — Treffpunkt 13:00 Uhr am Vereinsheim, Abfahrt 13:15 Uhr.",
    assignedTo: ["max_schneider", "noah_hoffmann"],
    status: "done",
    dueDate: "2025-04-28",
    completedAt: "2025-04-27T18:00:00Z"
  },
  {
    id: "t_u12_mp04",
    groupId: "tg_u12_matchprep",
    title: "Eckstoß-Varianten einüben",
    description: "Die kurze Eckstoss-Variante aus dem letzten Training nochmals zuhause mental durchgehen.",
    assignedTo: ["noah_hoffmann", "sophie_klein", "player_u12_finn"],
    status: "todo",
    dueDate: "2025-05-02"
  },

  // ==========================================
  // tg_u12_fitness
  // ==========================================
  {
    id: "t_u12_fi01",
    groupId: "tg_u12_fitness",
    title: "3× Laufen in dieser Woche",
    description: "Mindestens 3x 20 Minuten laufen oder Fahrrad fahren diese Woche.",
    assignedTo: ["max_schneider", "noah_hoffmann", "sophie_klein", "player_u12_luca", "player_u12_ben"],
    status: "done",
    dueDate: "2025-04-27",
    completedAt: "2025-04-26T20:00:00Z"
  },
  {
    id: "t_u12_fi02",
    groupId: "tg_u12_fitness",
    title: "10 Minuten Stretching täglich",
    description: "Jeden Tag 10 Minuten dehnen — Oberschenkel, Waden, Rücken.",
    assignedTo: ["max_schneider", "noah_hoffmann", "sophie_klein", "person_anna"],
    status: "in_progress",
    dueDate: "2025-04-30"
  },
  {
    id: "t_u12_fi03",
    groupId: "tg_u12_fitness",
    title: "Passspiel mit Elternteil üben",
    description: "Mindestens 2× diese Woche 15 Minuten Passspiel mit einem Elternteil oder Freund üben.",
    assignedTo: ["player_u12_finn", "player_u12_leo", "player_u12_kai", "player_u12_paul"],
    status: "todo",
    dueDate: "2025-04-30"
  },

  // ==========================================
  // tg_h1_preseason
  // ==========================================
  {
    id: "t_h1_pre01",
    groupId: "tg_h1_preseason",
    title: "Konditionsprogramm absolvieren",
    description: "Das PDF-Programm von Thomas durcharbeiten: 3 Wochen, 4x pro Woche.",
    assignedTo: ["patrick_steuble", "player_h1_stefan", "player_h1_michael", "player_h1_jan", "player_h1_felix", "player_h1_tobias", "player_h1_lukas"],
    status: "done",
    dueDate: "2024-08-10",
    completedAt: "2024-08-09T20:00:00Z"
  },
  {
    id: "t_h1_pre02",
    groupId: "tg_h1_preseason",
    title: "Mitgliedschaft verlängern und Beitrag bezahlen",
    description: "Bitte Jahresbeitrag bis Saisonbeginn überweisen.",
    assignedTo: ["player_h1_mario", "player_h1_david", "player_h1_simon", "player_h1_oliver"],
    status: "done",
    dueDate: "2024-08-01",
    completedAt: "2024-07-31T10:00:00Z"
  },
  {
    id: "t_h1_pre03",
    groupId: "tg_h1_preseason",
    title: "Spieler-Selfies für Vereinsheft einschicken",
    description: "Foto einsenden bis 15. August an thomas.mueller@sfb.de",
    assignedTo: ["player_h1_jan", "player_h1_felix", "player_h1_lukas", "player_h1_simon", "player_h1_oliver"],
    status: "done",
    dueDate: "2024-08-15",
    completedAt: "2024-08-14T18:00:00Z"
  },

  // ==========================================
  // tg_h1_tactics
  // ==========================================
  {
    id: "t_h1_ta01",
    groupId: "tg_h1_tactics",
    title: "Video FC Schwarz-Weiß analysieren",
    description: "Letztes Heimspiel von Schwarz-Weiß ansehen (Link im Gruppen-Chat). Notizen zu ihrer Pressing-Auslösung machen.",
    assignedTo: ["patrick_steuble", "player_h1_stefan", "player_h1_michael"],
    status: "in_progress",
    dueDate: "2025-05-09"
  },
  {
    id: "t_h1_ta02",
    groupId: "tg_h1_tactics",
    title: "Standardsituationen wiederholen",
    description: "Die neuen Eckstoss-Varianten aus dem letzten Training nochmals mental durchgehen.",
    assignedTo: ["player_h1_tobias", "player_h1_lukas", "player_h1_simon", "player_h1_jan"],
    status: "todo",
    dueDate: "2025-05-10"
  },
  {
    id: "t_h1_ta03",
    groupId: "tg_h1_tactics",
    title: "Aufstellungs-Feedback geben",
    description: "Kurze persönliche Einschätzung zur geplanten Aufstellung an Thomas schicken bis Donnerstag.",
    assignedTo: ["patrick_steuble", "player_h1_mario", "player_h1_felix"],
    status: "done",
    dueDate: "2025-05-08",
    completedAt: "2025-05-07T21:00:00Z"
  },

  // ==========================================
  // tg_u12_nextseason
  // ==========================================
  {
    id: "t_u12_ns01",
    groupId: "tg_u12_nextseason",
    title: "Neue Spieler sichten",
    assignedTo: ["coach_marco"],
    status: "in_progress",
    dueDate: "2025-05-31"
  },
  {
    id: "t_u12_ns02",
    groupId: "tg_u12_nextseason",
    title: "Trainingszeiten für 2025/26 bestätigen",
    assignedTo: ["coach_marco", "thomas_mueller"],
    status: "todo",
    dueDate: "2025-06-15"
  },

  // ==========================================
  // tg_h1_nextseason
  // ==========================================
  {
    id: "t_h1_ns01",
    groupId: "tg_h1_nextseason",
    title: "Transferliste erstellen",
    assignedTo: ["thomas_mueller"],
    status: "done",
    dueDate: "2025-05-01",
    completedAt: "2025-04-30T18:00:00Z"
  },
  {
    id: "t_h1_ns02",
    groupId: "tg_h1_nextseason",
    title: "Vorbereitungsturnier buchen",
    assignedTo: ["thomas_mueller", "patrick_steuble"],
    status: "in_progress",
    dueDate: "2025-06-01"
  },
  {
    id: "t_h1_ns03",
    groupId: "tg_h1_nextseason",
    title: "Spieler über Vorbereitung informieren",
    assignedTo: ["thomas_mueller"],
    status: "todo",
    dueDate: "2025-06-15"
  },

  // Club-level tasks
  {
    id: "task_club_01",
    groupId: "tg_club_saisonvorbereitung",
    title: "Platzpflege & Markierungen erneuern",
    description: "Vor Saisonbeginn alle Spielfelder neu markieren und Tore auf Schäden prüfen.",
    assignedTo: ["thomas_mueller"],
    status: "done",
    dueDate: "2024-08-25",
    completedAt: "2024-08-24T16:00:00Z"
  },
  {
    id: "task_club_02",
    groupId: "tg_club_saisonvorbereitung",
    title: "Trikotsatz alle Mannschaften prüfen",
    description: "Trikots auf Vollständigkeit und Zustand prüfen. Fehlende Nummern nachbestellen.",
    assignedTo: ["thomas_mueller", "coach_marco"],
    status: "in_progress",
    dueDate: "2025-06-30"
  },
  {
    id: "task_club_03",
    groupId: "tg_club_saisonvorbereitung",
    title: "Schiedsrichter für Heimspiele buchen",
    description: "Über den Verband Schiedsrichter für alle Heimspiele der kommenden Saison anfragen.",
    assignedTo: ["thomas_mueller"],
    status: "todo",
    dueDate: "2025-07-15"
  }
];

// ==========================================
// CLUB-LEVEL TASK GROUPS (no teamId)
// ==========================================
export const mockClubTaskGroups: TaskGroup[] = [
  {
    id: "tg_club_saisonvorbereitung",
    title: "Saisonvorbereitung 2025/26",
    description: "Vereinsweite Aufgaben zur Vorbereitung der neuen Saison",
    dueDate: "2025-07-31",
    createdBy: "thomas_mueller",
    createdAt: "2025-05-01T08:00:00Z"
  }
];

export function getTaskGroupsByTeam(teamId: string, seasonId = "s2024"): TaskGroup[] {
  return mockTaskGroups.filter(tg => tg.teamId === teamId && tg.seasonId === seasonId);
}

export function getClubTaskGroups(): TaskGroup[] {
  return mockClubTaskGroups;
}

export function getTasksByGroup(groupId: string): Task[] {
  return mockTasks.filter(t => t.groupId === groupId);
}

export function getTasksForPerson(personId: string): Task[] {
  return mockTasks.filter(t => t.assignedTo.includes(personId));
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "Offen",
  in_progress: "In Bearbeitung",
  done: "Erledigt"
};
