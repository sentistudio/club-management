import type { Ticket, TicketMessage, TicketForm } from "../types/inbox";
import { LENA_SCHNEIDER, MAX_SCHNEIDER, DANIEL_KLEIN, PETRA_WEBER, NOAH_HOFFMANN } from "./mockDemoPersonas";

// Current user (Patrick Steuble = p1)
export const CURRENT_STAFF_ID = "p1";
export const CURRENT_STAFF_NAME = "Patrick Steuble";

// ========= TICKETS =========

export const mockTickets: Ticket[] = [
  // ==========================================
  // DEMO TICKETS FROM MEMBER PORTAL USERS
  // These appear in both the club management and member portal
  // ==========================================
  {
    id: "tkt_lena_1",
    clubId: "club1",
    requesterId: LENA_SCHNEIDER.id,
    requesterMembershipId: "cm_lena",
    requesterEmail: LENA_SCHNEIDER.email,
    requesterName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    requesterDepartment: "Fitness, Fußball",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Frage zur Trainingszeit",
    category: "general",
    status: "pending",
    priority: "normal",
    ticketNumber: "TKT-2025-0101",
    createdAt: "2025-01-28T14:30:00",
    updatedAt: "2025-01-28T15:45:00",
    previewText: "Hallo, ich wollte fragen ob es möglich ist, die Trainingszeit am Donnerstag von 18:00 auf 19:00 zu verschieben?",
    unreadCount: 0,
    messageCount: 2,
    tags: ["training", "zeitänderung"],
    departmentId: "dept_fitness"
  },
  {
    id: "tkt_lena_for_max",
    clubId: "club1",
    requesterId: LENA_SCHNEIDER.id,
    requesterMembershipId: "cm_lena",
    requesterEmail: LENA_SCHNEIDER.email,
    requesterName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    requesterDepartment: "Fußball",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Abmeldung Training nächste Woche",
    category: "absence",
    status: "open",
    priority: "normal",
    ticketNumber: "TKT-2025-0102",
    createdAt: "2025-01-29T09:15:00",
    updatedAt: "2025-01-29T09:15:00",
    previewText: "Max kann leider nächste Woche Mittwoch und Freitag nicht zum Training kommen, da wir im Urlaub sind.",
    unreadCount: 1,
    messageCount: 1,
    tags: ["abwesenheit", "training"],
    departmentId: "dept_football",
    // On behalf indicator
    isOnBehalf: true,
    onBehalfOfName: `${MAX_SCHNEIDER.firstName} ${MAX_SCHNEIDER.lastName}`,
    onBehalfOfId: MAX_SCHNEIDER.id
  },
  {
    id: "tkt_daniel_for_noah",
    clubId: "club1",
    requesterId: DANIEL_KLEIN.id,
    requesterMembershipId: "cm_daniel",
    requesterEmail: DANIEL_KLEIN.email,
    requesterName: `${DANIEL_KLEIN.firstName} ${DANIEL_KLEIN.lastName}`,
    requesterDepartment: "Fußball",
    requesterRole: "passive",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Trikotgröße für Noah",
    category: "equipment",
    status: "resolved",
    priority: "normal",
    ticketNumber: "TKT-2025-0098",
    createdAt: "2025-01-27T11:00:00",
    updatedAt: "2025-01-27T14:20:00",
    previewText: "Noah braucht ein neues Trikot. Könnten Sie mir bitte die verfügbaren Größen mitteilen?",
    unreadCount: 0,
    messageCount: 2,
    tags: ["trikot", "ausrüstung"],
    departmentId: "dept_football",
    isOnBehalf: true,
    onBehalfOfName: `${NOAH_HOFFMANN.firstName} ${NOAH_HOFFMANN.lastName}`,
    onBehalfOfId: NOAH_HOFFMANN.id
  },
  {
    id: "tkt_petra_carpool",
    clubId: "club1",
    requesterId: PETRA_WEBER.id,
    requesterMembershipId: "cm_petra",
    requesterEmail: PETRA_WEBER.email,
    requesterName: `${PETRA_WEBER.firstName} ${PETRA_WEBER.lastName}`,
    requesterDepartment: "Volleyball",
    requesterRole: "passive",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Fahrgemeinschaft zum Turnier",
    category: "organization",
    status: "open",
    priority: "normal",
    ticketNumber: "TKT-2025-0095",
    createdAt: "2025-01-26T16:45:00",
    updatedAt: "2025-01-26T16:45:00",
    previewText: "Ich würde gerne eine Fahrgemeinschaft zum Volleyball-Turnier am 15. Februar organisieren. Wer hätte Interesse?",
    unreadCount: 1,
    messageCount: 1,
    tags: ["organisation", "turnier"],
    departmentId: "dept_volleyball"
  },
  
  // ==========================================
  // DEMO: REPORTED MESSAGE TICKET
  // This ticket was created when Lena reported a message in the chat
  // ==========================================
  {
    id: "tkt_report_1",
    clubId: "club1",
    requesterId: LENA_SCHNEIDER.id,
    requesterMembershipId: "cm_lena",
    requesterEmail: LENA_SCHNEIDER.email,
    requesterName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    requesterDepartment: "Volleyball",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "🚨 Meldung: Mobbing im Team-Chat",
    category: "report",
    status: "open",
    priority: "high",
    ticketNumber: "TKT-2025-0103",
    createdAt: "2026-01-14T10:30:00",
    updatedAt: "2026-01-14T10:30:00",
    previewText: "Ich möchte eine Nachricht im Team-Chat 'Volleyball U16 Mädchen' melden. Kategorie: Mobbing. Eine Spielerin hat meine Tochter Flurina beleidigt.",
    unreadCount: 1,
    messageCount: 1,
    tags: ["meldung", "mobbing", "chat"],
    departmentId: "dept_volleyball",
    isOnBehalf: true,
    onBehalfOfName: "Flurina Schneider",
    onBehalfOfId: "p12",
    // Report-specific fields
    isReport: true,
    reportedChatId: "team_vb_u16",
    reportedChatName: "Volleyball U16 Mädchen",
    reportedMessageId: "vb_u16_demo_report",
    reportCategory: "bullying"
  },

  // ==========================================
  // EXISTING SAMPLE TICKETS
  // ==========================================
  {
    id: "tkt_1",
    clubId: "club1",
    requesterId: "p11",
    requesterMembershipId: "cm11",
    requesterEmail: "tim.jung@example.com",
    requesterName: "Tim Jung",
    requesterDepartment: "Fußball",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Frage zur Beitragsrechnung Januar",
    category: "fee_question",
    status: "open",
    priority: "normal",
    ticketNumber: "TKT-2024-0042",
    createdAt: "2024-03-15T10:30:00",
    updatedAt: "2024-03-15T14:20:00",
    previewText: "Guten Tag, ich habe eine Frage zu meiner Rechnung vom Januar. Der Betrag scheint höher zu sein als erwartet...",
    unreadCount: 2,
    messageCount: 4,
    tags: ["rechnung", "beitrag"],
    relatedInvoiceId: "inv_1",
    departmentId: "dept_football"
  },
  {
    id: "tkt_2",
    clubId: "club1",
    requesterId: "p12",
    requesterMembershipId: "cm12",
    requesterEmail: "sarah.klein@example.com",
    requesterName: "Sarah Klein",
    requesterDepartment: "Fußball",
    requesterRole: "active",
    assignedToId: "p3",
    assignedToName: "Thomas Trainer",
    subject: "Spielerpass Antrag - fehlende Dokumente",
    category: "documents",
    status: "pending",
    priority: "high",
    ticketNumber: "TKT-2024-0041",
    createdAt: "2024-03-14T09:15:00",
    updatedAt: "2024-03-15T11:00:00",
    previewText: "Hallo, ich habe meinen Spielerpass beantragt, aber es fehlen wohl noch Unterlagen...",
    unreadCount: 0,
    messageCount: 3,
    tags: ["spielerpass", "dokumente"],
    departmentId: "dept_football"
  },
  {
    id: "tkt_3",
    clubId: "club1",
    requesterId: "p5",
    requesterMembershipId: "cm5",
    requesterEmail: "lisa.schmidt@example.com",
    requesterName: "Lisa Schmidt",
    requesterDepartment: "Jugend",
    requesterRole: "passive",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Trainingszeiten U15 - Änderungswunsch",
    category: "general",
    status: "open",
    priority: "normal",
    ticketNumber: "TKT-2024-0040",
    createdAt: "2024-03-13T16:45:00",
    updatedAt: "2024-03-14T09:30:00",
    previewText: "Liebes Team, mein Sohn hat ab nächsten Monat Nachhilfe am Dienstag. Wäre es möglich...",
    unreadCount: 1,
    messageCount: 2,
    tags: ["training", "zeitänderung"],
    departmentId: "dept_youth"
  },
  {
    id: "tkt_4",
    clubId: "club1",
    requesterId: "p7",
    requesterMembershipId: "cm7",
    requesterEmail: "peter.bauer@example.com",
    requesterName: "Peter Bauer",
    requesterDepartment: "Tennis",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "SEPA-Mandat aktualisieren",
    category: "fee_question",
    status: "resolved",
    priority: "normal",
    ticketNumber: "TKT-2024-0039",
    createdAt: "2024-03-10T11:20:00",
    updatedAt: "2024-03-12T15:45:00",
    resolvedAt: "2024-03-12T15:45:00",
    previewText: "Ich habe ein neues Bankkonto und möchte mein SEPA-Mandat aktualisieren...",
    unreadCount: 0,
    messageCount: 5,
    tags: ["sepa", "bankdaten"],
    departmentId: "dept_tennis"
  },
  {
    id: "tkt_5",
    clubId: "club1",
    requesterId: "p9",
    requesterMembershipId: "cm9",
    requesterEmail: "anna.weber@example.com",
    requesterName: "Anna Weber",
    requesterDepartment: "Fußball",
    requesterRole: "active",
    subject: "Anmeldung Sommercamp 2024",
    category: "registration",
    status: "open",
    priority: "normal",
    ticketNumber: "TKT-2024-0043",
    createdAt: "2024-03-15T08:00:00",
    updatedAt: "2024-03-15T08:00:00",
    previewText: "Guten Morgen, ich möchte meine Tochter für das Sommercamp anmelden. Gibt es noch freie Plätze?",
    unreadCount: 1,
    messageCount: 1,
    tags: ["sommercamp", "anmeldung"],
    departmentId: "dept_football"
  },
  {
    id: "tkt_6",
    clubId: "club1",
    requesterId: "p6",
    requesterMembershipId: "cm6",
    requesterEmail: "michael.mueller@example.com",
    requesterName: "Michael Müller",
    requesterDepartment: "Fußball",
    requesterRole: "passive",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Kündigung zum Jahresende",
    category: "membership",
    status: "pending",
    priority: "high",
    ticketNumber: "TKT-2024-0038",
    createdAt: "2024-03-08T14:30:00",
    updatedAt: "2024-03-10T09:15:00",
    previewText: "Sehr geehrte Damen und Herren, hiermit kündige ich meine Mitgliedschaft zum 31.12.2024...",
    unreadCount: 0,
    messageCount: 4,
    tags: ["kündigung", "mitgliedschaft"],
    departmentId: "dept_football"
  },
  {
    id: "tkt_7",
    clubId: "club1",
    requesterId: "p14",
    requesterMembershipId: "cm14",
    requesterEmail: "julia.hoffmann@example.com",
    requesterName: "Julia Hoffmann",
    requesterDepartment: "Schwimmen",
    requesterRole: "admin",
    assignedToId: "p2",
    assignedToName: "Erika Maier",
    subject: "Technisches Problem mit der App",
    category: "technical",
    status: "resolved",
    priority: "low",
    ticketNumber: "TKT-2024-0037",
    createdAt: "2024-03-05T17:00:00",
    updatedAt: "2024-03-06T10:30:00",
    resolvedAt: "2024-03-06T10:30:00",
    previewText: "Die App zeigt mir keine Trainingstermine mehr an. Ich habe schon versucht...",
    unreadCount: 0,
    messageCount: 3,
    tags: ["app", "technisch"],
    departmentId: "dept_swimming"
  },
  {
    id: "tkt_8",
    clubId: "club1",
    requesterId: "p2",
    requesterMembershipId: "cm2",
    requesterEmail: "erika.maier@example.com",
    requesterName: "Erika Maier",
    requesterDepartment: "Vorstand",
    requesterRole: "admin",
    subject: "Verbesserungsvorschlag: Parkplätze",
    category: "suggestion",
    status: "closed",
    priority: "low",
    ticketNumber: "TKT-2024-0036",
    createdAt: "2024-03-01T12:00:00",
    updatedAt: "2024-03-03T16:00:00",
    resolvedAt: "2024-03-03T16:00:00",
    previewText: "Als langjähriges Mitglied möchte ich vorschlagen, dass wir mehr Parkplätze...",
    unreadCount: 0,
    messageCount: 2,
    tags: ["vorschlag", "infrastruktur"]
  },
  {
    id: "tkt_9",
    clubId: "club1",
    requesterId: "p15",
    requesterMembershipId: "cm15",
    requesterEmail: "max.neumann@example.com",
    requesterName: "Max Neumann",
    requesterDepartment: "Fußball",
    requesterRole: "active",
    assignedToId: "p1",
    assignedToName: "Patrick Steuble",
    subject: "Trikotnummer ändern",
    category: "general",
    status: "open",
    priority: "low",
    ticketNumber: "TKT-2024-0044",
    createdAt: "2024-03-15T16:00:00",
    updatedAt: "2024-03-15T16:00:00",
    previewText: "Hallo, ich würde gerne meine Trikotnummer von 14 auf 7 ändern. Ist das möglich?",
    unreadCount: 1,
    messageCount: 1,
    tags: ["trikot"],
    departmentId: "dept_football"
  },
  // Bulk Message (Rundschreiben)
  {
    id: "tkt_bulk_1",
    clubId: "club1",
    requesterId: "p1", // Sent by staff
    requesterEmail: "verein@example.com",
    requesterName: "Vereinsleitung",
    subject: "Wichtig: Neue Trainingszeiten ab April",
    category: "general",
    status: "resolved",
    priority: "normal",
    ticketNumber: "RND-2024-0001",
    createdAt: "2024-03-10T09:00:00",
    updatedAt: "2024-03-10T09:00:00",
    resolvedAt: "2024-03-10T09:00:00",
    previewText: "Liebe Mitglieder, ab dem 1. April 2024 gelten neue Trainingszeiten für alle Abteilungen...",
    unreadCount: 0,
    messageCount: 1,
    tags: ["rundschreiben", "training", "zeiten"],
    isBulkMessage: true,
    bulkRecipientCount: 156,
    bulkFilter: "Alle Mitglieder",
    bulkSentBy: "Patrick Steuble"
  },
  {
    id: "tkt_bulk_2",
    clubId: "club1",
    requesterId: "p1",
    requesterEmail: "verein@example.com",
    requesterName: "Vereinsleitung",
    subject: "Einladung zur Jahreshauptversammlung 2024",
    category: "general",
    status: "resolved",
    priority: "high",
    ticketNumber: "RND-2024-0002",
    createdAt: "2024-03-01T10:00:00",
    updatedAt: "2024-03-01T10:00:00",
    resolvedAt: "2024-03-01T10:00:00",
    previewText: "Sehr geehrte Mitglieder, hiermit laden wir Sie herzlich zur Jahreshauptversammlung am 25. März 2024 ein...",
    unreadCount: 0,
    messageCount: 1,
    tags: ["rundschreiben", "jhv", "einladung"],
    isBulkMessage: true,
    bulkRecipientCount: 156,
    bulkFilter: "Alle Mitglieder",
    bulkSentBy: "Patrick Steuble"
  },
  {
    id: "tkt_bulk_3",
    clubId: "club1",
    requesterId: "p1",
    requesterEmail: "fussball@example.com",
    requesterName: "Abteilung Fußball",
    subject: "Fußball: Saisonabschlussfeier - Save the Date!",
    category: "general",
    status: "resolved",
    priority: "normal",
    ticketNumber: "RND-2024-0003",
    createdAt: "2024-03-12T14:00:00",
    updatedAt: "2024-03-12T14:00:00",
    resolvedAt: "2024-03-12T14:00:00",
    previewText: "Liebe Fußballer, merkt euch den 15. Juni vor! An diesem Tag feiern wir unsere Saisonabschlussfeier...",
    unreadCount: 0,
    messageCount: 1,
    tags: ["rundschreiben", "fußball", "feier"],
    isBulkMessage: true,
    bulkRecipientCount: 48,
    bulkFilter: "Abteilung: Fußball",
    bulkSentBy: "Patrick Steuble"
  }
];

// ========= TICKET MESSAGES =========

export const mockTicketMessages: TicketMessage[] = [
  // ==========================================
  // DEMO TICKET MESSAGES (from member portal users)
  // ==========================================
  
  // Lena's training time question
  {
    id: "msg_lena_1_1",
    ticketId: "tkt_lena_1",
    senderId: LENA_SCHNEIDER.id,
    senderName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    senderType: "member",
    senderAvatar: LENA_SCHNEIDER.avatar,
    content: "Hallo,\n\nich wollte fragen ob es möglich ist, die Trainingszeit am Donnerstag von 18:00 auf 19:00 zu verschieben? Ich habe einen Termin der sich leider nicht verschieben lässt.\n\nVielen Dank!",
    createdAt: "2025-01-28T14:30:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_lena_1_2",
    ticketId: "tkt_lena_1",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "Hallo Frau Schneider,\n\nvielen Dank für Ihre Nachricht. Ich werde das mit der Trainerin Sandra besprechen und melde mich bei Ihnen.\n\nMit freundlichen Grüßen,\nPatrick Steuble",
    createdAt: "2025-01-28T15:45:00",
    isRead: true,
    isInternal: false
  },
  
  // Lena for Max - training absence
  {
    id: "msg_lena_max_1",
    ticketId: "tkt_lena_for_max",
    senderId: LENA_SCHNEIDER.id,
    senderName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    senderType: "member",
    senderAvatar: LENA_SCHNEIDER.avatar,
    content: "Hallo Trainer Marco,\n\nMax kann leider nächste Woche Mittwoch und Freitag nicht zum Training kommen, da wir im Urlaub sind. Bitte entschuldigen Sie sein Fehlen.\n\nViele Grüße,\nLena Schneider (Mutter von Max)",
    createdAt: "2025-01-29T09:15:00",
    isRead: false,
    isInternal: false
  },
  
  // Daniel for Noah - jersey size
  {
    id: "msg_daniel_noah_1",
    ticketId: "tkt_daniel_for_noah",
    senderId: DANIEL_KLEIN.id,
    senderName: `${DANIEL_KLEIN.firstName} ${DANIEL_KLEIN.lastName}`,
    senderType: "member",
    senderAvatar: DANIEL_KLEIN.avatar,
    content: "Guten Tag,\n\nNoah braucht ein neues Trikot. Könnten Sie mir bitte die verfügbaren Größen mitteilen?\n\nMit freundlichen Grüßen,\nDaniel Klein (für Noah)",
    createdAt: "2025-01-27T11:00:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_daniel_noah_2",
    ticketId: "tkt_daniel_for_noah",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "Hallo Herr Klein,\n\nwir haben Trikots in den Größen 128, 140, 152 und 164 auf Lager. Noah trägt vermutlich 140 oder 152. Kommen Sie gerne zu den Öffnungszeiten vorbei!\n\nBeste Grüße,\nPatrick Steuble",
    createdAt: "2025-01-27T14:20:00",
    isRead: true,
    isInternal: false
  },
  
  // Petra - carpool
  {
    id: "msg_petra_1",
    ticketId: "tkt_petra_carpool",
    senderId: PETRA_WEBER.id,
    senderName: `${PETRA_WEBER.firstName} ${PETRA_WEBER.lastName}`,
    senderType: "member",
    senderAvatar: PETRA_WEBER.avatar,
    content: "Hallo,\n\nich würde gerne eine Fahrgemeinschaft zum Volleyball-Turnier am 15. Februar organisieren. Wer hätte Interesse?\n\nIch kann 3 Kinder mitnehmen.\n\nGrüße, Petra",
    createdAt: "2025-01-26T16:45:00",
    isRead: false,
    isInternal: false
  },
  
  // ==========================================
  // DEMO: REPORTED MESSAGE TICKET MESSAGE
  // ==========================================
  {
    id: "msg_report_1_1",
    ticketId: "tkt_report_1",
    senderId: LENA_SCHNEIDER.id,
    senderName: `${LENA_SCHNEIDER.firstName} ${LENA_SCHNEIDER.lastName}`,
    senderType: "member",
    senderAvatar: LENA_SCHNEIDER.avatar,
    content: `**🚨 Meldung einer Chat-Nachricht**\n\n**Chat:** Volleyball U16 Mädchen\n**Kategorie:** Mobbing\n**Betroffene Person:** Flurina Schneider\n\n**Gemeldete Nachricht:**\n> "Du bist ja eh die Schlechteste im Team..."\n\n**Meine Beschreibung:**\nEine Spielerin hat meine Tochter Flurina im Team-Chat beleidigt. Das ist nicht das erste Mal. Ich bitte um eine Überprüfung und entsprechende Maßnahmen.\n\nMit freundlichen Grüßen,\nLena Schneider`,
    createdAt: "2026-01-14T10:30:00",
    isRead: false,
    isInternal: false
  },

  // ==========================================
  // EXISTING SAMPLE MESSAGES
  // ==========================================
  
  // Ticket 1 messages
  {
    id: "msg_1_1",
    ticketId: "tkt_1",
    senderId: "p11",
    senderName: "Tim Jung",
    senderType: "member",
    content: "Guten Tag,\n\nich habe eine Frage zu meiner Rechnung vom Januar. Der Betrag scheint höher zu sein als erwartet. Laut meinem Vertrag sollte ich 25€/Monat zahlen, aber die Rechnung zeigt 35€.\n\nKönnen Sie mir bitte erklären, woher die Differenz kommt?\n\nMit freundlichen Grüßen,\nTim Jung",
    createdAt: "2024-03-15T10:30:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_1_2",
    ticketId: "tkt_1",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "Hallo Herr Jung,\n\nvielen Dank für Ihre Nachricht. Ich schaue mir das gerne an.\n\nDie Differenz von 10€ könnte durch den Vereinsfestbeitrag entstanden sein, der einmal jährlich im Januar abgebucht wird. Dieser wurde bei Ihrem Beitritt im Mitgliedsantrag vereinbart.\n\nIch prüfe das aber nochmal genau und melde mich.\n\nMit freundlichen Grüßen,\nPatrick Steuble\nGeschäftsstelle",
    createdAt: "2024-03-15T11:45:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_1_3",
    ticketId: "tkt_1",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "Interne Notiz: Habe im System nachgeschaut - Vereinsfestbeitrag ist korrekt. Mitglied hat bei Anmeldung zugestimmt.",
    createdAt: "2024-03-15T12:00:00",
    isRead: true,
    isInternal: true
  },
  {
    id: "msg_1_4",
    ticketId: "tkt_1",
    senderId: "p11",
    senderName: "Tim Jung",
    senderType: "member",
    content: "Ah, das hatte ich vergessen! Vielen Dank für die schnelle Aufklärung. Dann ist alles in Ordnung.\n\nEine Frage noch: Wann findet das Vereinsfest eigentlich statt?",
    createdAt: "2024-03-15T14:20:00",
    isRead: false,
    isInternal: false
  },

  // Ticket 2 messages
  {
    id: "msg_2_1",
    ticketId: "tkt_2",
    senderId: "p12",
    senderName: "Sarah Klein",
    senderType: "member",
    content: "Hallo,\n\nich habe meinen Spielerpass beantragt, aber es fehlen wohl noch Unterlagen. Welche Dokumente brauchen Sie noch von mir?\n\nGruß,\nSarah",
    createdAt: "2024-03-14T09:15:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_2_2",
    ticketId: "tkt_2",
    senderId: "system",
    senderName: "System",
    senderType: "system",
    content: "Ticket wurde automatisch der Kategorie 'Dokumente' zugewiesen.",
    createdAt: "2024-03-14T09:16:00",
    isRead: true,
    isInternal: true
  },
  {
    id: "msg_2_3",
    ticketId: "tkt_2",
    senderId: "p3",
    senderName: "Thomas Trainer",
    senderType: "staff",
    content: "Hallo Sarah,\n\nfür den Spielerpass benötigen wir noch:\n\n1. Kopie des Personalausweises (Vorder- und Rückseite)\n2. Aktuelles Passfoto\n3. Unterschriebene Einverständniserklärung (Formular im Anhang)\n\nBitte laden Sie die Dokumente hier hoch oder bringen Sie sie in der Geschäftsstelle vorbei.\n\nViele Grüße,\nThomas",
    attachments: [
      {
        id: "att_1",
        name: "Einverstaendniserklaerung.pdf",
        fileUrl: "/docs/forms/consent.pdf",
        fileSize: 125000,
        mimeType: "application/pdf"
      }
    ],
    createdAt: "2024-03-15T11:00:00",
    isRead: true,
    isInternal: false
  },

  // Ticket 3 messages
  {
    id: "msg_3_1",
    ticketId: "tkt_3",
    senderId: "p5",
    senderName: "Lisa Schmidt",
    senderType: "member",
    content: "Liebes Team,\n\nmein Sohn hat ab nächsten Monat Nachhilfe am Dienstag um 17:00 Uhr. Das Training der U15 ist aber auch dienstags um 17:30 Uhr.\n\nWäre es möglich, dass er stattdessen am Donnerstag mit der U14 trainiert? Die trainieren ja auch in der gleichen Halle.\n\nVielen Dank für Ihre Hilfe!",
    createdAt: "2024-03-13T16:45:00",
    isRead: true,
    isInternal: false
  },
  {
    id: "msg_3_2",
    ticketId: "tkt_3",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "Hallo Frau Schmidt,\n\nvielen Dank für Ihre Anfrage. Ich werde das mit unserem Jugendkoordinator besprechen und melde mich zeitnah.\n\nGrundsätzlich sollte ein Wechsel möglich sein, solange die Gruppengröße es erlaubt.\n\nMit freundlichen Grüßen,\nPatrick Steuble",
    createdAt: "2024-03-14T09:30:00",
    isRead: false,
    isInternal: false
  },

  // Ticket 5 messages
  {
    id: "msg_5_1",
    ticketId: "tkt_5",
    senderId: "p9",
    senderName: "Anna Weber",
    senderType: "member",
    content: "Guten Morgen,\n\nich möchte meine Tochter Emma (10 Jahre) für das Sommercamp 2024 anmelden. Gibt es noch freie Plätze?\n\nFolgende Informationen:\n- Name: Emma Weber\n- Alter: 10 Jahre\n- Mannschaft: U11 Mädchen\n- Allergien: Keine\n\nWir würden gerne die ganze Woche buchen.\n\nVielen Dank!",
    createdAt: "2024-03-15T08:00:00",
    isRead: false,
    isInternal: false
  },

  // Ticket 9 messages (new)
  {
    id: "msg_9_1",
    ticketId: "tkt_9",
    senderId: "p15",
    senderName: "Max Neumann",
    senderType: "member",
    content: "Hallo,\n\nich würde gerne meine Trikotnummer von 14 auf 7 ändern. Die Nummer 7 ist bei uns in der Mannschaft nicht vergeben.\n\nIst das möglich und wie viel würde ein neues Trikot kosten?\n\nDanke!",
    createdAt: "2024-03-15T16:00:00",
    isRead: false,
    isInternal: false
  },

  // Bulk Message 1 content
  {
    id: "msg_bulk_1_1",
    ticketId: "tkt_bulk_1",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "**Liebe Mitglieder,**\n\nab dem **1. April 2024** gelten neue Trainingszeiten für alle Abteilungen. Die Änderungen waren notwendig, um die Hallenbelegung zu optimieren.\n\n**Wichtige Änderungen:**\n\n- Fußball Herren: Dienstag & Donnerstag, 19:00 - 21:00 Uhr\n- Fußball Jugend: Montag & Mittwoch, 17:00 - 18:30 Uhr\n- Tennis: Samstag, 10:00 - 14:00 Uhr\n- Schwimmen: Freitag, 18:00 - 20:00 Uhr\n\nDie detaillierten Pläne finden Sie in Kürze im Mitgliederportal.\n\nBei Fragen wenden Sie sich bitte an die jeweilige Abteilungsleitung.\n\nMit sportlichen Grüßen,\n**Ihr Vereinsteam**",
    createdAt: "2024-03-10T09:00:00",
    isRead: true,
    isInternal: false
  },

  // Bulk Message 2 content
  {
    id: "msg_bulk_2_1",
    ticketId: "tkt_bulk_2",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "**Einladung zur Jahreshauptversammlung 2024**\n\nSehr geehrte Mitglieder,\n\nhiermit laden wir Sie herzlich zur ordentlichen Jahreshauptversammlung ein:\n\n📅 **Datum:** Montag, 25. März 2024\n🕖 **Uhrzeit:** 19:00 Uhr\n📍 **Ort:** Vereinsheim, Großer Saal\n\n**Tagesordnung:**\n\n1. Begrüßung und Feststellung der Beschlussfähigkeit\n2. Genehmigung des Protokolls der letzten JHV\n3. Jahresbericht des Vorstands\n4. Kassenbericht und Bericht der Kassenprüfer\n5. Entlastung des Vorstands\n6. Neuwahlen\n7. Verschiedenes\n\nAnträge zur Tagesordnung können bis zum 18. März 2024 schriftlich eingereicht werden.\n\nWir freuen uns auf Ihr zahlreiches Erscheinen!\n\nMit freundlichen Grüßen,\n**Der Vorstand**",
    createdAt: "2024-03-01T10:00:00",
    isRead: true,
    isInternal: false
  },

  // Bulk Message 3 content
  {
    id: "msg_bulk_3_1",
    ticketId: "tkt_bulk_3",
    senderId: "p1",
    senderName: "Patrick Steuble",
    senderType: "staff",
    content: "**🎉 Saisonabschlussfeier 2024 - Save the Date! ⚽**\n\nLiebe Fußballerinnen und Fußballer,\n\nmerkt euch den **15. Juni 2024** vor!\n\nAn diesem Tag feiern wir gemeinsam unsere Saisonabschlussfeier mit:\n\n- 🏆 Ehrungen der besten Spieler\n- 🍔 Grillen und Getränke\n- 🎵 Musik und gute Stimmung\n- 👨‍👩‍👧‍👦 Familien sind herzlich willkommen\n\n**Details:**\n- **Wann:** Samstag, 15. Juni 2024, ab 14:00 Uhr\n- **Wo:** Sportplatz am Waldweg\n- **Kosten:** Erwachsene 10€, Kinder frei\n\nBitte meldet euch bis zum **1. Juni** an, damit wir besser planen können.\n\nWir freuen uns auf euch!\n\n**Eure Abteilungsleitung Fußball**",
    createdAt: "2024-03-12T14:00:00",
    isRead: true,
    isInternal: false
  }
];

// ========= NOTIFICATIONS =========

export interface Notification {
  id: string;
  type: "ticket_assigned" | "ticket_reply" | "ticket_mentioned" | "system";
  title: string;
  message: string;
  ticketId?: string;
  createdAt: string;
  isRead: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "ticket_assigned",
    title: "Neues Ticket zugewiesen",
    message: "Max Neumann: Trikotnummer ändern",
    ticketId: "tkt_9",
    createdAt: "2024-03-15T16:00:00",
    isRead: false
  },
  {
    id: "notif_2",
    type: "ticket_reply",
    title: "Neue Antwort",
    message: "Tim Jung hat auf Ihr Ticket geantwortet",
    ticketId: "tkt_1",
    createdAt: "2024-03-15T14:20:00",
    isRead: false
  },
  {
    id: "notif_3",
    type: "ticket_assigned",
    title: "Ticket zugewiesen",
    message: "Lisa Schmidt: Trainingszeiten U15",
    ticketId: "tkt_3",
    createdAt: "2024-03-13T17:00:00",
    isRead: true
  },
  {
    id: "notif_4",
    type: "system",
    title: "Erinnerung",
    message: "5 offene Tickets warten auf Bearbeitung",
    createdAt: "2024-03-15T09:00:00",
    isRead: true
  }
];

// ========= CHATS (for Member Portal) =========

export interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  participants: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  avatarInitials?: string;
  isTeamChat?: boolean;
  teamId?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export const mockChats: Chat[] = [
  {
    id: "chat_1",
    type: "group",
    name: "Herren 1. Mannschaft",
    participants: ["p1", "p3", "p11", "p12", "p15"],
    lastMessage: "Training morgen fällt aus wegen Platzpflege",
    lastMessageAt: "2024-03-15T14:00:00",
    unreadCount: 3,
    isTeamChat: true,
    teamId: "team_h1"
  },
  {
    id: "chat_2",
    type: "direct",
    name: "Thomas Trainer",
    participants: ["p11", "p3"],
    lastMessage: "Alles klar, bis Donnerstag dann!",
    lastMessageAt: "2024-03-14T18:30:00",
    unreadCount: 0,
    avatarInitials: "TT"
  },
  {
    id: "chat_3",
    type: "group",
    name: "U15 Junioren",
    participants: ["p1", "p5", "p9"],
    lastMessage: "Bitte Getränke für das Turnier nicht vergessen",
    lastMessageAt: "2024-03-13T10:00:00",
    unreadCount: 1,
    isTeamChat: true,
    teamId: "team_u15"
  }
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "cmsg_1",
    chatId: "chat_1",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Training morgen fällt aus wegen Platzpflege",
    createdAt: "2024-03-15T14:00:00",
    isRead: false
  },
  {
    id: "cmsg_2",
    chatId: "chat_1",
    senderId: "p15",
    senderName: "Max Neumann",
    content: "Schade, hatte mich schon gefreut",
    createdAt: "2024-03-15T14:05:00",
    isRead: false
  },
  {
    id: "cmsg_3",
    chatId: "chat_1",
    senderId: "p12",
    senderName: "Sarah Klein",
    content: "Gibt es dann Ersatztraining am Freitag?",
    createdAt: "2024-03-15T14:10:00",
    isRead: false
  },
  {
    id: "cmsg_4",
    chatId: "chat_2",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Hi Tim, kannst du mir deine Schuhgröße für die neuen Stollen sagen?",
    createdAt: "2024-03-14T17:00:00",
    isRead: true
  },
  {
    id: "cmsg_5",
    chatId: "chat_2",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Größe 43, danke!",
    createdAt: "2024-03-14T18:00:00",
    isRead: true
  },
  {
    id: "cmsg_6",
    chatId: "chat_2",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Alles klar, bis Donnerstag dann!",
    createdAt: "2024-03-14T18:30:00",
    isRead: true
  }
];

// ========= TICKET FORMS =========

export const mockTicketForms: TicketForm[] = [
  {
    id: "form_1",
    clubId: "club1",
    name: "Allgemeine Anfrage",
    description: "Für allgemeine Fragen und Anliegen",
    category: "general",
    isActive: true,
    fields: [
      { id: "f1", name: "subject", label: "Betreff", type: "text", required: true, placeholder: "Worum geht es?" },
      { id: "f2", name: "message", label: "Ihre Nachricht", type: "textarea", required: true, placeholder: "Beschreiben Sie Ihr Anliegen..." }
    ]
  },
  {
    id: "form_2",
    clubId: "club1",
    name: "Beitragsfrage",
    description: "Fragen zu Rechnungen, Beiträgen oder Zahlungen",
    category: "fee_question",
    isActive: true,
    fields: [
      { id: "f1", name: "invoice_number", label: "Rechnungsnummer (falls vorhanden)", type: "text", required: false, placeholder: "z.B. INV-2024-001" },
      { id: "f2", name: "subject", label: "Betreff", type: "text", required: true, placeholder: "z.B. Frage zur Rechnung Januar" },
      { id: "f3", name: "message", label: "Ihre Frage", type: "textarea", required: true, placeholder: "Beschreiben Sie Ihre Frage..." }
    ]
  },
  {
    id: "form_3",
    clubId: "club1",
    name: "Dokument einreichen",
    description: "Laden Sie benötigte Dokumente hoch",
    category: "documents",
    isActive: true,
    fields: [
      { id: "f1", name: "document_type", label: "Art des Dokuments", type: "select", required: true, options: ["Spielerpass-Antrag", "Ärztliches Attest", "Einverständniserklärung", "Sonstiges"] },
      { id: "f2", name: "file", label: "Dokument hochladen", type: "file", required: true },
      { id: "f3", name: "notes", label: "Anmerkungen", type: "textarea", required: false, placeholder: "Zusätzliche Informationen..." }
    ]
  },
  {
    id: "form_4",
    clubId: "club1",
    name: "Anmeldung / Registrierung",
    description: "Für Anmeldungen zu Events, Camps oder Kursen",
    category: "registration",
    isActive: true,
    fields: [
      { id: "f1", name: "event", label: "Veranstaltung", type: "select", required: true, options: ["Sommercamp 2024", "Ostercamp 2024", "Trainerlehrgang", "Erste-Hilfe-Kurs"] },
      { id: "f2", name: "participant_name", label: "Name des Teilnehmers", type: "text", required: true },
      { id: "f3", name: "participant_age", label: "Alter", type: "text", required: true },
      { id: "f4", name: "allergies", label: "Allergien / Besonderheiten", type: "textarea", required: false },
      { id: "f5", name: "emergency_contact", label: "Notfallkontakt (Telefon)", type: "phone", required: true }
    ]
  },
  {
    id: "form_5",
    clubId: "club1",
    name: "Mitgliedschaftsänderung",
    description: "Änderungen an Ihrer Mitgliedschaft",
    category: "membership",
    isActive: true,
    fields: [
      { id: "f1", name: "change_type", label: "Art der Änderung", type: "select", required: true, options: ["Adressänderung", "Bankdaten ändern", "Abteilungswechsel", "Kündigung", "Sonstiges"] },
      { id: "f2", name: "details", label: "Details", type: "textarea", required: true, placeholder: "Beschreiben Sie die gewünschte Änderung..." },
      { id: "f3", name: "effective_date", label: "Gewünschtes Datum", type: "date", required: false }
    ]
  },
  {
    id: "form_6",
    clubId: "club1",
    name: "Technisches Problem",
    description: "Probleme mit der App oder Website melden",
    category: "technical",
    isActive: true,
    fields: [
      { id: "f1", name: "platform", label: "Plattform", type: "select", required: true, options: ["App (iOS)", "App (Android)", "Website", "Sonstiges"] },
      { id: "f2", name: "problem", label: "Problem beschreiben", type: "textarea", required: true, placeholder: "Was funktioniert nicht?" },
      { id: "f3", name: "screenshot", label: "Screenshot (optional)", type: "file", required: false }
    ]
  },
  {
    id: "form_7",
    clubId: "club1",
    name: "Nachricht melden",
    description: "Eine Nachricht oder Verhalten im Chat melden",
    category: "report",
    isActive: true,
    icon: "🚨",
    fields: [
      { id: "f1", name: "report_category", label: "Art der Meldung", type: "select", required: true, options: ["Unangemessene Inhalte", "Belästigung", "Mobbing", "Spam", "Sicherheitsbedenken", "Sonstiges"] },
      { id: "f2", name: "chat_name", label: "Chat-Name", type: "text", required: true, placeholder: "z.B. Volleyball U16 Team" },
      { id: "f3", name: "reported_message", label: "Gemeldete Nachricht", type: "textarea", required: false, placeholder: "Kopieren Sie die Nachricht hier..." },
      { id: "f4", name: "description", label: "Beschreibung", type: "textarea", required: true, placeholder: "Beschreiben Sie den Vorfall..." },
      { id: "f5", name: "affected_person", label: "Betroffene Person (optional)", type: "text", required: false, placeholder: "Wer ist betroffen?" }
    ]
  }
];

// Helper function to get messages for a ticket
export function getTicketMessages(ticketId: string): TicketMessage[] {
  return mockTicketMessages.filter(m => m.ticketId === ticketId);
}

// Helper function to get tickets for a member
export function getMemberTickets(personId: string): Ticket[] {
  return mockTickets.filter(t => t.requesterId === personId);
}

// Helper function to get tickets assigned to a staff member
export function getAssignedTickets(staffId: string): Ticket[] {
  return mockTickets.filter(t => t.assignedToId === staffId);
}

// Helper function to get unread notifications
export function getUnreadNotifications(): Notification[] {
  return mockNotifications.filter(n => !n.isRead);
}

// Helper function to get chat messages
export function getChatMessages(chatId: string): ChatMessage[] {
  return mockChatMessages.filter(m => m.chatId === chatId);
}

// Helper function to get chats for a member
export function getMemberChats(personId: string): Chat[] {
  return mockChats.filter(c => c.participants.includes(personId));
}
