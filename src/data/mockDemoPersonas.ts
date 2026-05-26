// ==========================================
// SHARED DEMO PERSONAS
// Used across Club Management and Member Portal
// ==========================================

export interface DemoMembership {
  departmentId: string;
  departmentName: string;
  role: "active" | "passive" | "admin";
  teamId?: string;
  teamName?: string;
  icon: string;
  coachId?: string;
  coachName?: string;
  coachAvatar?: string;
}

export interface DemoPersona {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "Spieler" | "Trainer" | "Elternteil" | "Vorstand" | "Betreuer" | "Mitglied";
  isChild?: boolean;
  parentId?: string;
  birthDate?: string;
  clubId: string;
  clubName: string;
  memberships: DemoMembership[];
  joinedAt: string;
  status: "active" | "inactive";
}

// ==========================================
// COACHES & STAFF
// ==========================================

export const COACH_MARCO: DemoPersona = {
  id: "coach_marco",
  firstName: "Marco",
  lastName: "Weber",
  email: "marco.weber@sfb.de",
  phone: "+49 170 1234567",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  role: "Trainer",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "active",
      teamId: "team_u12",
      teamName: "Fußball U12",
      icon: "⚽"
    }
  ],
  joinedAt: "2018-03-15",
  status: "active"
};

export const COACH_KATJA: DemoPersona = {
  id: "coach_katja",
  firstName: "Katja",
  lastName: "Müller",
  email: "katja.mueller@sfb.de",
  phone: "+49 171 2345678",
  avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
  role: "Trainer",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_volleyball",
      departmentName: "Volleyball",
      role: "active",
      teamId: "team_volleyball_u16",
      teamName: "Volleyball U16 Mädchen",
      icon: "🏐"
    }
  ],
  joinedAt: "2019-06-01",
  status: "active"
};

export const TRAINER_SANDRA: DemoPersona = {
  id: "trainer_sandra",
  firstName: "Sandra",
  lastName: "Fischer",
  email: "sandra.fischer@sfb.de",
  phone: "+49 172 3456789",
  avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=150&h=150&fit=crop&crop=face",
  role: "Trainer",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_fitness",
      departmentName: "Fitness",
      role: "active",
      teamName: "Fitness – Morgengruppe",
      icon: "💪"
    }
  ],
  joinedAt: "2020-01-10",
  status: "active"
};

// ==========================================
// LENA SCHNEIDER - Mother (Member Portal Main User)
// ==========================================

export const LENA_SCHNEIDER: DemoPersona = {
  id: "lena_schneider",
  firstName: "Lena",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  phone: "+49 173 4567890",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  role: "Mitglied",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_fitness",
      departmentName: "Fitness",
      role: "active",
      teamName: "Fitness – Morgengruppe",
      icon: "💪",
      coachId: "trainer_sandra",
      coachName: "Trainerin Sandra",
      coachAvatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face"
    },
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "active",
      teamId: "team_frauen_ue40",
      teamName: "Frauen Ü40",
      icon: "⚽",
      coachName: "Trainer Thomas"
    }
  ],
  joinedAt: "2021-09-01",
  status: "active"
};

// ==========================================
// FLURINA SCHNEIDER - Daughter (Child Profile)
// ==========================================

export const FLURINA_SCHNEIDER: DemoPersona = {
  id: "flurina_schneider",
  firstName: "Flurina",
  lastName: "Schneider",
  email: "lena.schneider@example.com", // Parent's email
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  role: "Spieler",
  isChild: true,
  parentId: "lena_schneider",
  birthDate: "2010-05-12",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_volleyball",
      departmentName: "Volleyball",
      role: "active",
      teamId: "team_volleyball_u16",
      teamName: "Volleyball U16 Mädchen",
      icon: "🏐",
      coachId: "coach_katja",
      coachName: "Trainerin Katja",
      coachAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face"
    }
  ],
  joinedAt: "2022-04-15",
  status: "active"
};

// ==========================================
// MAX SCHNEIDER - Son (Child Profile, Multi-Club)
// ==========================================

export const MAX_SCHNEIDER: DemoPersona = {
  id: "max_schneider",
  firstName: "Max",
  lastName: "Schneider",
  email: "lena.schneider@example.com", // Parent's email
  avatar: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150&h=150&fit=crop&crop=face",
  role: "Spieler",
  isChild: true,
  parentId: "lena_schneider",
  birthDate: "2014-08-03",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "active",
      teamId: "team_u12",
      teamName: "Fußball U12",
      icon: "⚽",
      coachId: "coach_marco",
      coachName: "Trainer Marco",
      coachAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    }
  ],
  joinedAt: "2023-01-10",
  status: "active"
};

// ==========================================
// OTHER CLUB MEMBERS (Teammates, Parents, etc.)
// ==========================================

export const PETER_HOFFMANN: DemoPersona = {
  id: "peter_hoffmann",
  firstName: "Peter",
  lastName: "Hoffmann",
  email: "peter.hoffmann@example.com",
  phone: "+49 174 5678901",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  role: "Elternteil",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "passive",
      teamId: "team_u12",
      teamName: "Fußball U12 (Elternteil)",
      icon: "⚽"
    }
  ],
  joinedAt: "2023-02-20",
  status: "active"
};

export const NOAH_HOFFMANN: DemoPersona = {
  id: "noah_hoffmann",
  firstName: "Noah",
  lastName: "Hoffmann",
  email: "peter.hoffmann@example.com",
  role: "Spieler",
  isChild: true,
  parentId: "peter_hoffmann",
  birthDate: "2013-11-15",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "active",
      teamId: "team_u12",
      teamName: "Fußball U12",
      icon: "⚽",
      coachId: "coach_marco",
      coachName: "Trainer Marco"
    }
  ],
  joinedAt: "2023-02-20",
  status: "active"
};

export const DANIEL_KLEIN: DemoPersona = {
  id: "daniel_klein",
  firstName: "Daniel",
  lastName: "Klein",
  email: "daniel.klein@example.com",
  phone: "+49 175 6789012",
  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
  role: "Elternteil",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "passive",
      teamId: "team_u12",
      teamName: "Fußball U12 (Elternteil)",
      icon: "⚽"
    }
  ],
  joinedAt: "2022-08-01",
  status: "active"
};

export const SOPHIE_KLEIN: DemoPersona = {
  id: "sophie_klein",
  firstName: "Sophie",
  lastName: "Klein",
  email: "daniel.klein@example.com",
  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  role: "Spieler",
  isChild: true,
  parentId: "daniel_klein",
  birthDate: "2014-03-22",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "active",
      teamId: "team_u12",
      teamName: "Fußball U12",
      icon: "⚽",
      coachId: "coach_marco",
      coachName: "Trainer Marco"
    }
  ],
  joinedAt: "2022-08-01",
  status: "active"
};

export const PETRA_WEBER: DemoPersona = {
  id: "petra_weber",
  firstName: "Petra",
  lastName: "Weber",
  email: "petra.weber@example.com",
  phone: "+49 176 7890123",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  role: "Elternteil",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_volleyball",
      departmentName: "Volleyball",
      role: "passive",
      teamId: "team_volleyball_u16",
      teamName: "Volleyball U16 (Elternteil)",
      icon: "🏐"
    }
  ],
  joinedAt: "2022-05-01",
  status: "active"
};

export const ANNA_BAUER: DemoPersona = {
  id: "anna_bauer",
  firstName: "Anna",
  lastName: "Bauer",
  email: "anna.bauer@example.com",
  role: "Spieler",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_volleyball",
      departmentName: "Volleyball",
      role: "active",
      teamId: "team_volleyball_u16",
      teamName: "Volleyball U16 Mädchen",
      icon: "🏐",
      coachId: "coach_katja",
      coachName: "Trainerin Katja"
    }
  ],
  joinedAt: "2022-06-15",
  status: "active"
};

export const THOMAS_MUELLER: DemoPersona = {
  id: "thomas_mueller",
  firstName: "Thomas",
  lastName: "Müller",
  email: "thomas.mueller@sfb.de",
  phone: "+49 177 8901234",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  role: "Trainer",
  clubId: "sfb",
  clubName: "Borussia Dortmund",
  memberships: [
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "admin",
      teamId: "team1",
      teamName: "1. Herren",
      icon: "⚽",
      coachId: "thomas_mueller",
      coachName: "Trainer Thomas"
    },
    {
      departmentId: "dept_football",
      departmentName: "Fußball",
      role: "admin",
      teamId: "team_u12",
      teamName: "Fußball U12",
      icon: "⚽",
      coachId: "thomas_mueller",
      coachName: "Trainer Thomas"
    }
  ],
  joinedAt: "2015-01-01",
  status: "active"
};

// ==========================================
// COLLECTIONS
// ==========================================

// All demo personas for club management
export const ALL_DEMO_PERSONAS: DemoPersona[] = [
  COACH_MARCO,
  COACH_KATJA,
  TRAINER_SANDRA,
  LENA_SCHNEIDER,
  FLURINA_SCHNEIDER,
  MAX_SCHNEIDER,
  PETER_HOFFMANN,
  NOAH_HOFFMANN,
  DANIEL_KLEIN,
  SOPHIE_KLEIN,
  PETRA_WEBER,
  ANNA_BAUER,
  THOMAS_MUELLER
];

// The Schneider family (for member portal profile switching)
export const SCHNEIDER_FAMILY = {
  parent: LENA_SCHNEIDER,
  children: [FLURINA_SCHNEIDER, MAX_SCHNEIDER]
};

// Teams with their members
export const TEAM_MEMBERS = {
  team_u12: [MAX_SCHNEIDER, NOAH_HOFFMANN, SOPHIE_KLEIN],
  team_volleyball_u16: [FLURINA_SCHNEIDER, ANNA_BAUER],
  team_frauen_ue40: [LENA_SCHNEIDER],
  team_fitness: [LENA_SCHNEIDER]
};

// Demo messages for inbox (from member portal users to admin)
export interface DemoInboxMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  senderDepartment: string;
  isOnBehalf?: boolean;
  onBehalfOf?: string;
  subject: string;
  preview: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    isStaff: boolean;
    isOnBehalf?: boolean;
  }[];
  category: string;
  status: "open" | "pending" | "closed";
  createdAt: string;
  updatedAt: string;
}

export const DEMO_INBOX_MESSAGES: DemoInboxMessage[] = [
  {
    id: "inbox_lena_1",
    senderId: "lena_schneider",
    senderName: "Lena Schneider",
    senderAvatar: LENA_SCHNEIDER.avatar!,
    senderRole: "Mitglied",
    senderDepartment: "Fitness, Fußball",
    subject: "Frage zur Trainingszeit",
    preview: "Hallo, ich wollte fragen ob es möglich ist...",
    messages: [
      {
        id: "msg_1",
        senderId: "lena_schneider",
        senderName: "Lena Schneider",
        content: "Hallo,\n\nich wollte fragen ob es möglich ist, die Trainingszeit am Donnerstag von 18:00 auf 19:00 zu verschieben? Ich habe einen Termin der sich leider nicht verschieben lässt.\n\nVielen Dank!",
        createdAt: "2025-01-28T14:30:00",
        isStaff: false
      },
      {
        id: "msg_2",
        senderId: "staff_peter",
        senderName: "Peter Schmidt",
        content: "Hallo Frau Schneider,\n\nvielen Dank für Ihre Nachricht. Ich werde das mit dem Trainer besprechen und melde mich bei Ihnen.\n\nMit freundlichen Grüßen",
        createdAt: "2025-01-28T15:45:00",
        isStaff: true
      }
    ],
    category: "Allgemein",
    status: "pending",
    createdAt: "2025-01-28T14:30:00",
    updatedAt: "2025-01-28T15:45:00"
  },
  {
    id: "inbox_lena_for_max",
    senderId: "lena_schneider",
    senderName: "Lena Schneider",
    senderAvatar: LENA_SCHNEIDER.avatar!,
    senderRole: "Elternteil",
    senderDepartment: "Fußball",
    isOnBehalf: true,
    onBehalfOf: "Max Schneider",
    subject: "Abmeldung Training nächste Woche",
    preview: "Max kann leider nächste Woche nicht zum Training kommen...",
    messages: [
      {
        id: "msg_1",
        senderId: "lena_schneider",
        senderName: "Lena Schneider",
        content: "Hallo Trainer Marco,\n\nMax kann leider nächste Woche Mittwoch und Freitag nicht zum Training kommen, da wir im Urlaub sind. Bitte entschuldigen Sie sein Fehlen.\n\nViele Grüße,\nLena Schneider (Mutter von Max)",
        createdAt: "2025-01-29T09:15:00",
        isStaff: false,
        isOnBehalf: true
      }
    ],
    category: "Abwesenheit",
    status: "open",
    createdAt: "2025-01-29T09:15:00",
    updatedAt: "2025-01-29T09:15:00"
  },
  {
    id: "inbox_daniel_for_noah",
    senderId: "daniel_klein",
    senderName: "Daniel Klein",
    senderAvatar: DANIEL_KLEIN.avatar!,
    senderRole: "Elternteil",
    senderDepartment: "Fußball",
    isOnBehalf: true,
    onBehalfOf: "Noah Hoffmann",
    subject: "Trikotgröße für Noah",
    preview: "Könnten Sie mir bitte die verfügbaren Trikotgrößen mitteilen?",
    messages: [
      {
        id: "msg_1",
        senderId: "daniel_klein",
        senderName: "Daniel Klein",
        content: "Guten Tag,\n\nNoah braucht ein neues Trikot. Könnten Sie mir bitte die verfügbaren Größen mitteilen?\n\nMit freundlichen Grüßen,\nDaniel Klein (für Noah)",
        createdAt: "2025-01-27T11:00:00",
        isStaff: false,
        isOnBehalf: true
      },
      {
        id: "msg_2",
        senderId: "staff_peter",
        senderName: "Peter Schmidt",
        content: "Hallo Herr Klein,\n\nwir haben Trikots in den Größen 128, 140, 152 und 164 auf Lager. Noah trägt vermutlich 140 oder 152. Kommen Sie gerne vorbei!\n\nBeste Grüße",
        createdAt: "2025-01-27T14:20:00",
        isStaff: true
      }
    ],
    category: "Ausrüstung",
    status: "closed",
    createdAt: "2025-01-27T11:00:00",
    updatedAt: "2025-01-27T14:20:00"
  },
  {
    id: "inbox_petra_for_flurina_teammate",
    senderId: "petra_weber",
    senderName: "Petra Weber",
    senderAvatar: PETRA_WEBER.avatar!,
    senderRole: "Elternteil",
    senderDepartment: "Volleyball",
    subject: "Fahrgemeinschaft zum Turnier",
    preview: "Ich würde gerne eine Fahrgemeinschaft zum Turnier organisieren...",
    messages: [
      {
        id: "msg_1",
        senderId: "petra_weber",
        senderName: "Petra Weber",
        content: "Hallo,\n\nich würde gerne eine Fahrgemeinschaft zum Volleyball-Turnier am 15. Februar organisieren. Wer hätte Interesse?\n\nIch kann 3 Kinder mitnehmen.\n\nGrüße, Petra",
        createdAt: "2025-01-26T16:45:00",
        isStaff: false
      }
    ],
    category: "Organisation",
    status: "open",
    createdAt: "2025-01-26T16:45:00",
    updatedAt: "2025-01-26T16:45:00"
  }
];

// Demo events that appear in both systems
export interface DemoEvent {
  id: string;
  title: string;
  eventType: string;
  scope: "team" | "department" | "club";
  teamId?: string;
  teamName?: string;
  departmentId?: string;
  departmentName?: string;
  startsAt: string;
  endsAt: string;
  location: string;
  description?: string;
  maxParticipants?: number;
  isPublic: boolean;
  status: "draft" | "published" | "cancelled" | "completed";
  participants: string[]; // Array of persona IDs
}

export const DEMO_EVENTS: DemoEvent[] = [
  {
    id: "event_u12_training_1",
    title: "Fußball U12 Training",
    eventType: "training",
    scope: "team",
    teamId: "team_u12",
    teamName: "Fußball U12",
    departmentId: "dept_football",
    departmentName: "Fußball",
    startsAt: "2025-01-31T17:00:00",
    endsAt: "2025-01-31T18:30:00",
    location: "Sportplatz 2",
    description: "Reguläres Mannschaftstraining. Bitte Schienbeinschoner mitbringen!",
    maxParticipants: 20,
    isPublic: false,
    status: "published",
    participants: ["max_schneider", "noah_hoffmann", "sophie_klein", "coach_marco"]
  },
  {
    id: "event_u12_match",
    title: "Punktspiel vs. TV Lich U12",
    eventType: "match",
    scope: "team",
    teamId: "team_u12",
    teamName: "Fußball U12",
    departmentId: "dept_football",
    departmentName: "Fußball",
    startsAt: "2025-02-01T14:00:00",
    endsAt: "2025-02-01T16:00:00",
    location: "Sportplatz Lich",
    description: "Auswärtsspiel. Treffpunkt 13:00 am Vereinsheim.",
    isPublic: false,
    status: "published",
    participants: ["max_schneider", "noah_hoffmann", "sophie_klein", "coach_marco"]
  },
  {
    id: "event_volleyball_training",
    title: "Volleyball U16 Training",
    eventType: "training",
    scope: "team",
    teamId: "team_volleyball_u16",
    teamName: "Volleyball U16 Mädchen",
    departmentId: "dept_volleyball",
    departmentName: "Volleyball",
    startsAt: "2025-01-30T18:00:00",
    endsAt: "2025-01-30T19:30:00",
    location: "Sporthalle 1",
    description: "Techniktraining mit Fokus auf Aufschlag",
    maxParticipants: 15,
    isPublic: false,
    status: "published",
    participants: ["flurina_schneider", "anna_bauer", "coach_katja"]
  },
  {
    id: "event_fitness_morning",
    title: "Fitness Morgengruppe",
    eventType: "training",
    scope: "team",
    teamName: "Fitness – Morgengruppe",
    departmentId: "dept_fitness",
    departmentName: "Fitness",
    startsAt: "2025-01-30T08:00:00",
    endsAt: "2025-01-30T09:00:00",
    location: "Fitnessstudio",
    description: "Cardio & Krafttraining",
    maxParticipants: 20,
    isPublic: false,
    status: "published",
    participants: ["lena_schneider", "trainer_sandra"]
  },
  {
    id: "event_club_assembly",
    title: "Jahreshauptversammlung 2025",
    eventType: "general_assembly",
    scope: "club",
    startsAt: "2025-02-15T19:00:00",
    endsAt: "2025-02-15T22:00:00",
    location: "Vereinsheim - Großer Saal",
    description: "Jahresbericht, Entlastung des Vorstands, Neuwahlen. Alle Mitglieder sind herzlich eingeladen!",
    isPublic: true,
    status: "published",
    participants: []
  },
  {
    id: "event_club_carnival",
    title: "Vereins-Fasching",
    eventType: "club_festival",
    scope: "club",
    startsAt: "2025-02-22T15:00:00",
    endsAt: "2025-02-22T22:00:00",
    location: "Vereinsheim",
    description: "Karneval für die ganze Familie! Kostüme erwünscht 🎭",
    isPublic: true,
    status: "published",
    participants: []
  }
];

// Helper function to get persona by ID
export const getPersonaById = (id: string): DemoPersona | undefined => {
  return ALL_DEMO_PERSONAS.find(p => p.id === id);
};

// Helper function to get team members
export const getTeamMembers = (teamId: string): DemoPersona[] => {
  return ALL_DEMO_PERSONAS.filter(p => 
    p.memberships.some(m => m.teamId === teamId)
  );
};

// Helper function to get children of a parent
export const getChildrenOf = (parentId: string): DemoPersona[] => {
  return ALL_DEMO_PERSONAS.filter(p => p.parentId === parentId);
};



