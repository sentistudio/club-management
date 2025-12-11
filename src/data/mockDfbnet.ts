import type {
  PlayerPass,
  ClubEvent,
  EventRegistration,
  Document,
  Message,
  MessageTemplate,
  VolunteerTask,
  VolunteerLog,
  Match,
  TrainingSession,
  FamilyRelation
} from "../types/dfbnet";

// ========= PLAYER PASSES =========

export const mockPlayerPasses: PlayerPass[] = [
  {
    id: "pass_1",
    personId: "p1",
    clubId: "club1",
    passNumber: "BFV-2024-001234",
    passType: "amateur",
    status: "active",
    issuedAt: "2024-01-15",
    expiresAt: "2025-06-30",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    eligibleFrom: "2024-01-15",
    transferHistory: []
  },
  {
    id: "pass_2",
    personId: "p2",
    clubId: "club1",
    passNumber: "BFV-2024-001235",
    passType: "amateur",
    status: "active",
    issuedAt: "2024-01-20",
    expiresAt: "2025-06-30",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    eligibleFrom: "2024-01-20",
    transferHistory: []
  },
  {
    id: "pass_3",
    personId: "p5",
    clubId: "club1",
    passNumber: "BFV-2024-001236",
    passType: "amateur",
    status: "active",
    issuedAt: "2024-02-01",
    expiresAt: "2025-06-30",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    eligibleFrom: "2024-02-01",
    transferHistory: []
  },
  {
    id: "pass_4",
    personId: "p11",
    clubId: "club1",
    passNumber: "BFV-2024-001237",
    passType: "youth",
    status: "active",
    issuedAt: "2024-01-25",
    expiresAt: "2025-06-30",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    eligibleFrom: "2024-01-25",
    transferHistory: []
  },
  {
    id: "pass_5",
    personId: "p12",
    clubId: "club1",
    passNumber: "BFV-2024-001238",
    passType: "youth",
    status: "pending",
    issuedAt: "2024-03-01",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    transferHistory: []
  },
  {
    id: "pass_6",
    personId: "p15",
    clubId: "club1",
    passNumber: "BFV-2024-001239",
    passType: "youth",
    status: "active",
    issuedAt: "2024-01-10",
    expiresAt: "2025-06-30",
    association: "Bayerischer Fußball-Verband",
    nationality: "DE",
    eligibleFrom: "2024-01-10",
    transferHistory: []
  }
];

// ========= EVENTS =========

export const mockEvents: ClubEvent[] = [
  {
    id: "evt_1",
    clubId: "club1",
    title: "Jahreshauptversammlung 2024",
    description: "Ordentliche Mitgliederversammlung mit Neuwahlen des Vorstands",
    eventType: "meeting",
    status: "published",
    location: "Vereinsheim FC Musterstadt",
    startsAt: "2024-03-15T19:00:00",
    endsAt: "2024-03-15T22:00:00",
    isPublic: false,
    createdBy: "p1",
    createdAt: "2024-02-01"
  },
  {
    id: "evt_2",
    clubId: "club1",
    teamId: "team1",
    title: "Saisonabschlussfeier 1. Herren",
    description: "Gemeinsames Grillen und Saisonrückblick",
    eventType: "social",
    status: "published",
    location: "Sportplatz FC Musterstadt",
    startsAt: "2024-06-22T18:00:00",
    endsAt: "2024-06-22T23:00:00",
    maxParticipants: 50,
    registrationDeadline: "2024-06-15",
    isPublic: false,
    createdBy: "p3",
    createdAt: "2024-05-01"
  },
  {
    id: "evt_3",
    clubId: "club1",
    departmentId: "dept1",
    title: "Sommercamp Jugend 2024",
    description: "5-tägiges Fußballcamp für alle Jugendmannschaften",
    eventType: "camp",
    status: "published",
    location: "Sportanlage FC Musterstadt",
    startsAt: "2024-07-29T09:00:00",
    endsAt: "2024-08-02T16:00:00",
    maxParticipants: 60,
    registrationDeadline: "2024-07-15",
    isPublic: true,
    createdBy: "p3",
    createdAt: "2024-04-01"
  },
  {
    id: "evt_4",
    clubId: "club1",
    title: "Vereinsfest 2024",
    description: "Großes Sommerfest mit Tombola, Musik und Spielen",
    eventType: "social",
    status: "published",
    location: "Sportgelände FC Musterstadt",
    startsAt: "2024-06-15T14:00:00",
    endsAt: "2024-06-15T23:00:00",
    isPublic: true,
    createdBy: "p1",
    createdAt: "2024-03-01"
  },
  {
    id: "evt_5",
    clubId: "club1",
    teamId: "team7",
    title: "U13 Hallenturnier",
    description: "Teilnahme am Hallenturnier des SV Nachbarort",
    eventType: "tournament",
    status: "published",
    location: "Sporthalle Nachbarort",
    startsAt: "2024-12-14T09:00:00",
    endsAt: "2024-12-14T17:00:00",
    isPublic: false,
    createdBy: "p3",
    createdAt: "2024-10-01"
  },
  {
    id: "evt_6",
    clubId: "club1",
    title: "Vorstandssitzung April",
    description: "Monatliche Vorstandssitzung",
    eventType: "meeting",
    status: "completed",
    location: "Vereinsheim",
    startsAt: "2024-04-10T19:30:00",
    endsAt: "2024-04-10T21:30:00",
    isPublic: false,
    createdBy: "p1",
    createdAt: "2024-03-20"
  }
];

export const mockEventRegistrations: EventRegistration[] = [
  { id: "reg_1", eventId: "evt_2", personId: "p1", status: "registered", registeredAt: "2024-05-10" },
  { id: "reg_2", eventId: "evt_2", personId: "p2", status: "registered", registeredAt: "2024-05-11" },
  { id: "reg_3", eventId: "evt_2", personId: "p3", status: "registered", registeredAt: "2024-05-12" },
  { id: "reg_4", eventId: "evt_3", personId: "p11", status: "registered", registeredAt: "2024-04-20" },
  { id: "reg_5", eventId: "evt_3", personId: "p12", status: "registered", registeredAt: "2024-04-22" },
  { id: "reg_6", eventId: "evt_3", personId: "p15", status: "waitlist", registeredAt: "2024-07-10" },
  { id: "reg_7", eventId: "evt_4", personId: "p1", status: "registered", registeredAt: "2024-04-01" },
  { id: "reg_8", eventId: "evt_4", personId: "p2", status: "registered", registeredAt: "2024-04-02" }
];

// ========= DOCUMENTS =========

export const mockDocuments: Document[] = [
  {
    id: "doc_1",
    clubId: "club1",
    name: "Satzung FC Musterstadt e.V.",
    documentType: "other",
    status: "valid",
    fileUrl: "/docs/satzung.pdf",
    fileSize: 245000,
    mimeType: "application/pdf",
    uploadedBy: "p1",
    uploadedAt: "2024-01-01"
  },
  {
    id: "doc_2",
    clubId: "club1",
    personId: "p11",
    name: "Einverständniserklärung Eltern",
    documentType: "consent",
    status: "valid",
    fileUrl: "/docs/consent_p11.pdf",
    fileSize: 120000,
    mimeType: "application/pdf",
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    uploadedBy: "p3",
    uploadedAt: "2024-01-20"
  },
  {
    id: "doc_3",
    clubId: "club1",
    personId: "p12",
    name: "Ärztliche Sporttauglichkeit",
    documentType: "medical",
    status: "valid",
    fileUrl: "/docs/medical_p12.pdf",
    fileSize: 89000,
    mimeType: "application/pdf",
    validFrom: "2024-02-15",
    validUntil: "2025-02-15",
    uploadedBy: "p3",
    uploadedAt: "2024-02-20"
  },
  {
    id: "doc_4",
    clubId: "club1",
    personId: "p1",
    name: "Trainervertrag",
    documentType: "contract",
    status: "valid",
    fileUrl: "/docs/contract_p1.pdf",
    fileSize: 156000,
    mimeType: "application/pdf",
    validFrom: "2024-01-01",
    validUntil: "2025-12-31",
    uploadedBy: "p1",
    uploadedAt: "2023-12-15"
  },
  {
    id: "doc_5",
    clubId: "club1",
    teamId: "team1",
    name: "Mannschaftsfoto 2024",
    documentType: "other",
    status: "valid",
    fileUrl: "/docs/team1_photo.jpg",
    fileSize: 2500000,
    mimeType: "image/jpeg",
    uploadedBy: "p3",
    uploadedAt: "2024-02-01"
  },
  {
    id: "doc_6",
    clubId: "club1",
    personId: "p15",
    name: "Spielerpass-Antrag",
    documentType: "id_document",
    status: "pending",
    fileUrl: "/docs/pass_application_p15.pdf",
    fileSize: 340000,
    mimeType: "application/pdf",
    uploadedBy: "p3",
    uploadedAt: "2024-03-01"
  }
];

// ========= MESSAGES =========

export const mockMessages: Message[] = [
  {
    id: "msg_1",
    clubId: "club1",
    subject: "Einladung zur Jahreshauptversammlung 2024",
    body: "Liebe Mitglieder,\n\nhiermit laden wir Sie herzlich zur ordentlichen Jahreshauptversammlung...",
    messageType: "email",
    status: "sent",
    recipientType: "all",
    recipientIds: [],
    sentAt: "2024-02-15T10:00:00",
    sentBy: "p1",
    createdAt: "2024-02-14",
    openRate: 68
  },
  {
    id: "msg_2",
    clubId: "club1",
    subject: "Training fällt aus - 15.04.2024",
    body: "Aufgrund der Platzsperrung fällt das Training am Montag leider aus.",
    messageType: "email",
    status: "sent",
    recipientType: "team",
    recipientIds: ["team1"],
    sentAt: "2024-04-14T08:30:00",
    sentBy: "p3",
    createdAt: "2024-04-14",
    openRate: 92
  },
  {
    id: "msg_3",
    clubId: "club1",
    subject: "Erinnerung: Beitragszahlung 2024",
    body: "Sehr geehrte Mitglieder,\n\nwir möchten Sie freundlich an die ausstehende Beitragszahlung erinnern...",
    messageType: "email",
    status: "scheduled",
    recipientType: "custom",
    recipientIds: ["cm3", "cm9"],
    scheduledAt: "2024-05-01T09:00:00",
    sentBy: "p1",
    createdAt: "2024-04-25"
  },
  {
    id: "msg_4",
    clubId: "club1",
    subject: "Vereinsfest 2024 - Helfer gesucht!",
    body: "Für unser Vereinsfest am 15. Juni suchen wir noch fleißige Helfer...",
    messageType: "email",
    status: "sent",
    recipientType: "all",
    recipientIds: [],
    sentAt: "2024-05-20T14:00:00",
    sentBy: "p1",
    createdAt: "2024-05-19",
    openRate: 45
  }
];

export const mockMessageTemplates: MessageTemplate[] = [
  {
    id: "tpl_1",
    clubId: "club1",
    name: "Willkommen neues Mitglied",
    subject: "Herzlich willkommen im FC Musterstadt!",
    body: "Liebe/r {{firstName}},\n\nwir freuen uns sehr, Sie als neues Mitglied...",
    category: "onboarding",
    isActive: true
  },
  {
    id: "tpl_2",
    clubId: "club1",
    name: "Beitragserinnerung",
    subject: "Erinnerung: Offener Mitgliedsbeitrag",
    body: "Sehr geehrte/r {{firstName}} {{lastName}},\n\nwir möchten Sie freundlich erinnern...",
    category: "billing",
    isActive: true
  },
  {
    id: "tpl_3",
    clubId: "club1",
    name: "Trainingsausfall",
    subject: "Training fällt aus - {{date}}",
    body: "Liebe Spieler,\n\ndas Training am {{date}} muss leider ausfallen...",
    category: "training",
    isActive: true
  }
];

// ========= VOLUNTEERING =========

export const mockVolunteerTasks: VolunteerTask[] = [
  {
    id: "vtask_1",
    clubId: "club1",
    eventId: "evt_4",
    title: "Getränkestand Vereinsfest",
    description: "Betreuung des Getränkestands während des Vereinsfests",
    requiredVolunteers: 4,
    assignedVolunteers: ["p6", "p7"],
    status: "assigned",
    startsAt: "2024-06-15T14:00:00",
    endsAt: "2024-06-15T23:00:00",
    hoursAwarded: 9,
    location: "Sportgelände"
  },
  {
    id: "vtask_2",
    clubId: "club1",
    eventId: "evt_4",
    title: "Grillstation Vereinsfest",
    description: "Grillen und Essensausgabe",
    requiredVolunteers: 3,
    assignedVolunteers: ["p1", "p3"],
    status: "assigned",
    startsAt: "2024-06-15T15:00:00",
    endsAt: "2024-06-15T21:00:00",
    hoursAwarded: 6,
    location: "Sportgelände"
  },
  {
    id: "vtask_3",
    clubId: "club1",
    title: "Platzdienst Heimspiel",
    description: "Einlasskontrolle und Ordnungsdienst beim Heimspiel",
    requiredVolunteers: 2,
    assignedVolunteers: [],
    status: "open",
    startsAt: "2024-05-18T13:00:00",
    endsAt: "2024-05-18T17:00:00",
    hoursAwarded: 4,
    location: "Sportplatz"
  },
  {
    id: "vtask_4",
    clubId: "club1",
    eventId: "evt_3",
    title: "Betreuer Sommercamp",
    description: "Betreuung der Kinder während des Sommercamps",
    requiredVolunteers: 6,
    assignedVolunteers: ["p2", "p5", "p7", "p9"],
    status: "assigned",
    startsAt: "2024-07-29T08:00:00",
    endsAt: "2024-08-02T17:00:00",
    hoursAwarded: 40,
    location: "Sportanlage"
  }
];

export const mockVolunteerLogs: VolunteerLog[] = [
  { id: "vlog_1", personId: "p1", clubId: "club1", description: "Vorstandssitzung April", hours: 2, date: "2024-04-10", verifiedBy: "p2", verifiedAt: "2024-04-11" },
  { id: "vlog_2", personId: "p2", clubId: "club1", description: "Vorstandssitzung April", hours: 2, date: "2024-04-10", verifiedBy: "p1", verifiedAt: "2024-04-11" },
  { id: "vlog_3", personId: "p3", clubId: "club1", description: "Jugendtraining Vertretung", hours: 3, date: "2024-04-12", verifiedBy: "p1", verifiedAt: "2024-04-13" },
  { id: "vlog_4", personId: "p6", clubId: "club1", description: "Platzpflege Frühjahr", hours: 4, date: "2024-03-23", verifiedBy: "p1", verifiedAt: "2024-03-24" },
  { id: "vlog_5", personId: "p7", clubId: "club1", description: "Schiedsrichter Jugendspiel", hours: 2, date: "2024-04-06", verifiedBy: "p3", verifiedAt: "2024-04-07" }
];

// ========= MATCHES =========

export const mockMatches: Match[] = [
  {
    id: "match_1",
    teamId: "team1",
    clubId: "club1",
    matchType: "league",
    status: "completed",
    homeTeam: "FC Musterstadt",
    awayTeam: "SV Nachbarort",
    isHome: true,
    scheduledAt: "2024-04-14T15:00:00",
    location: "Sportplatz FC Musterstadt",
    homeScore: 3,
    awayScore: 1,
    competition: "Kreisliga A",
    matchday: 24
  },
  {
    id: "match_2",
    teamId: "team1",
    clubId: "club1",
    matchType: "league",
    status: "scheduled",
    homeTeam: "TSV Weitdorf",
    awayTeam: "FC Musterstadt",
    isHome: false,
    scheduledAt: "2024-04-21T15:00:00",
    location: "Sportplatz TSV Weitdorf",
    competition: "Kreisliga A",
    matchday: 25
  },
  {
    id: "match_3",
    teamId: "team1",
    clubId: "club1",
    matchType: "cup",
    status: "scheduled",
    homeTeam: "FC Musterstadt",
    awayTeam: "SpVgg Oberland",
    isHome: true,
    scheduledAt: "2024-05-01T18:00:00",
    location: "Sportplatz FC Musterstadt",
    competition: "Kreispokal"
  },
  {
    id: "match_4",
    teamId: "team3",
    clubId: "club1",
    matchType: "league",
    status: "completed",
    homeTeam: "FC Musterstadt Damen",
    awayTeam: "SV Frauenpower",
    isHome: true,
    scheduledAt: "2024-04-13T13:00:00",
    location: "Sportplatz FC Musterstadt",
    homeScore: 2,
    awayScore: 2,
    competition: "Bezirksliga Frauen",
    matchday: 18
  },
  {
    id: "match_5",
    teamId: "team7",
    clubId: "club1",
    matchType: "league",
    status: "completed",
    homeTeam: "JSG Talstadt U13",
    awayTeam: "FC Musterstadt U13",
    isHome: false,
    scheduledAt: "2024-04-13T11:00:00",
    location: "Sportplatz Talstadt",
    homeScore: 1,
    awayScore: 4,
    competition: "Kreisliga U13",
    matchday: 16
  }
];

// ========= TRAINING SESSIONS =========

export const mockTrainingSessions: TrainingSession[] = [
  {
    id: "train_1",
    teamId: "team1",
    clubId: "club1",
    title: "Taktiktraining",
    startsAt: "2024-04-16T19:00:00",
    endsAt: "2024-04-16T21:00:00",
    location: "Hauptplatz",
    coachId: "p3",
    status: "scheduled",
    attendees: []
  },
  {
    id: "train_2",
    teamId: "team1",
    clubId: "club1",
    title: "Spielvorbereitung",
    startsAt: "2024-04-19T18:30:00",
    endsAt: "2024-04-19T20:00:00",
    location: "Hauptplatz",
    coachId: "p3",
    status: "scheduled",
    attendees: []
  },
  {
    id: "train_3",
    teamId: "team7",
    clubId: "club1",
    title: "Koordinationstraining",
    startsAt: "2024-04-17T17:00:00",
    endsAt: "2024-04-17T18:30:00",
    location: "Nebenplatz",
    coachId: "p3",
    status: "scheduled",
    attendees: []
  }
];

// ========= FAMILY RELATIONS =========

export const mockFamilyRelations: FamilyRelation[] = [
  { id: "fam_1", personId: "p11", relatedPersonId: "p2", relationType: "parent", isPrimaryContact: true },
  { id: "fam_2", personId: "p12", relatedPersonId: "p6", relationType: "parent", isPrimaryContact: true }
];

