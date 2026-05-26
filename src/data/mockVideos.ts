export type VideoType = "match" | "training" | "highlight";

export interface VideoSequence {
  id: string;
  videoId: string;
  title: string;
  startTime: number; // seconds
  endTime: number; // seconds
  tags: string[];
  note?: string;
}

export interface TeamVideo {
  id: string;
  teamId?: string;  // undefined = club-level video
  seasonId?: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  videoUrl: string; // direct video URL or embed URL
  duration: number; // seconds
  type: VideoType;
  linkedEventId?: string;
  tags: string[];
  uploadedBy: string;
  uploadedAt: string;
  sequences: VideoSequence[];
}

export const mockVideos: TeamVideo[] = [
  // ==========================================
  // 1. HERREN
  // ==========================================
  {
    id: "vid_h1_01",
    teamId: "team1",
    seasonId: "s2024",
    title: "Spielanalyse vs. BV 04 Meiderich (2:0)",
    description: "Vollständige Aufnahme des Heimspiels vom 06. April. Highlights: Pressing-Momente und beide Tore.",
    thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=338&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 5400,
    type: "match",
    linkedEventId: "te_h1_m_past2",
    tags: ["heim", "sieg", "liga"],
    uploadedBy: "thomas_mueller",
    uploadedAt: "2025-04-07T12:00:00Z",
    sequences: [
      {
        id: "seq_h1_01_01",
        videoId: "vid_h1_01",
        title: "1. Tor — Konter nach Pressing",
        startTime: 1523,
        endTime: 1560,
        tags: ["tor", "konter", "pressing"],
        note: "Perfektes Beispiel für unser Gegenpressing — Ball zurückerobert, sofort in die Tiefe."
      },
      {
        id: "seq_h1_01_02",
        videoId: "vid_h1_01",
        title: "2. Tor — Freistoß",
        startTime: 2874,
        endTime: 2905,
        tags: ["tor", "freistoß", "standard"],
        note: "Neue Freistoss-Variante — super umgesetzt von Tobias."
      },
      {
        id: "seq_h1_01_03",
        videoId: "vid_h1_01",
        title: "Pressing-Sequenz 35. Minute",
        startTime: 2050,
        endTime: 2120,
        tags: ["pressing", "defensiv", "kompakt"],
        note: "Hier sehen wir die 4-Kette sehr kompakt — gutes Beispiel für die Trainingsarbeit."
      }
    ]
  },
  {
    id: "vid_h1_02",
    teamId: "team1",
    seasonId: "s2024",
    title: "Training-Highlights — Taktikeinheit April",
    description: "Zusammenschnitt der besten Szenen aus dem Taktiktraining. Pressing-Übungen und Spieleröffnung.",
    thumbnailUrl: "https://images.unsplash.com/photo-1551958219-acbc679c0d47?w=600&h=338&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 480,
    type: "training",
    tags: ["taktik", "pressing", "highlight"],
    uploadedBy: "thomas_mueller",
    uploadedAt: "2025-04-22T16:00:00Z",
    sequences: [
      {
        id: "seq_h1_02_01",
        videoId: "vid_h1_02",
        title: "Spieleröffnung durch den Sechser",
        startTime: 45,
        endTime: 120,
        tags: ["ballaufbau", "sechser"],
        note: "Patrick dreht sich toll weg — das soll in Zukunft Standard sein."
      }
    ]
  },
  {
    id: "vid_h1_03",
    teamId: "team1",
    seasonId: "s2024",
    title: "Saisonhighlights 2024/25",
    description: "Die schönsten Tore und Szenen der Saison. Motivation für das Saisonfinale.",
    thumbnailUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600&h=338&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 312,
    type: "highlight",
    tags: ["highlight", "saison", "tore"],
    uploadedBy: "thomas_mueller",
    uploadedAt: "2025-04-28T18:00:00Z",
    sequences: []
  },

  // ==========================================
  // TEAM_U12
  // ==========================================
  {
    id: "vid_u12_01",
    teamId: "team_u12",
    seasonId: "s2024",
    title: "Spielfilm: Heimsieg vs. SV Bochum (3:1)",
    description: "Das gesamte Heimspiel vom 12. April. Alle 3 Tore von Noah und Sophie.",
    thumbnailUrl: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=338&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 4200,
    type: "match",
    linkedEventId: "te_u12_m_past1",
    tags: ["heim", "sieg", "liga"],
    uploadedBy: "coach_marco",
    uploadedAt: "2025-04-13T20:00:00Z",
    sequences: [
      {
        id: "seq_u12_01_01",
        videoId: "vid_u12_01",
        title: "1. Tor Noah — Direktschuss",
        startTime: 842,
        endTime: 870,
        tags: ["tor", "noah", "direktschuss"],
        note: "Herrlicher Direktschuss nach Pass von Max."
      },
      {
        id: "seq_u12_01_02",
        videoId: "vid_u12_01",
        title: "Toller Ballgewinn Sophie",
        startTime: 1540,
        endTime: 1590,
        tags: ["defensive", "sophie", "pressing"],
        note: "Sophie kämpft sich durch und leitet das 2. Tor ein."
      },
      {
        id: "seq_u12_01_03",
        videoId: "vid_u12_01",
        title: "3. Tor Max — Assist Noah",
        startTime: 2980,
        endTime: 3010,
        tags: ["tor", "max", "assist-noah"],
        note: "Schöne Kombination — genau wie im Training einstudiert!"
      }
    ]
  },
  {
    id: "vid_u12_02",
    teamId: "team_u12",
    seasonId: "s2024",
    title: "Training-Highlights — Dribbling Parcours",
    description: "Videoaufnahme der Dribbling-Übungen vom letzten Freitag. Zur Eigenkontrolle für die Spieler.",
    thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=338&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 360,
    type: "training",
    tags: ["dribbling", "technik", "training"],
    uploadedBy: "coach_marco",
    uploadedAt: "2025-04-26T20:00:00Z",
    sequences: []
  },

  // ==========================================
  // CLUB-LEVEL (no teamId)
  // ==========================================
  {
    id: "vid_club_01",
    title: "Aufwärmroutine Vereinsstandard",
    description: "Die offizielle Aufwärmroutine des Vereins — für alle Altersgruppen geeignet. 15 Minuten strukturiertes Aufwärmen nach dem Vereinsleitfaden.",
    thumbnailUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 900,
    type: "training",
    tags: ["aufwärmen", "standard", "alle-teams"],
    uploadedBy: "thomas_mueller",
    uploadedAt: "2024-09-01T09:00:00Z",
    sequences: [
      { id: "seq_clu01_1", videoId: "vid_club_01", title: "Einlaufen & Mobilisation", startTime: 0, endTime: 180, tags: ["mobilisation"] },
      { id: "seq_clu01_2", videoId: "vid_club_01", title: "Dynamisches Dehnen", startTime: 181, endTime: 420, tags: ["dehnen"] },
      { id: "seq_clu01_3", videoId: "vid_club_01", title: "Koordination & Aktivierung", startTime: 421, endTime: 900, tags: ["koordination"] }
    ]
  },
  {
    id: "vid_club_02",
    title: "Saisonhighlights 2023/24",
    description: "Die besten Momente der Saison 2023/24 — Tore, Paraden und besondere Aktionen aller Vereinsmannschaften.",
    thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=225&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    duration: 480,
    type: "highlight",
    tags: ["highlights", "saison", "tore"],
    uploadedBy: "thomas_mueller",
    uploadedAt: "2024-07-15T14:00:00Z",
    sequences: []
  }
];

export function getVideosByTeam(teamId: string, seasonId = "s2024"): TeamVideo[] {
  return mockVideos.filter(v => v.teamId === teamId && v.seasonId === seasonId);
}

export function getClubVideos(): TeamVideo[] {
  return mockVideos.filter(v => !v.teamId);
}

export function getVideoById(id: string): TeamVideo | undefined {
  return mockVideos.find(v => v.id === id);
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export const VIDEO_TYPE_LABELS: Record<VideoType, string> = {
  match: "Spielfilm",
  training: "Training",
  highlight: "Highlights"
};
