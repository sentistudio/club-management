import type { Ticket, TicketMessage, TicketForm } from "../types/inbox";

// Current user (Patrick Steuble = p1)
export const CURRENT_STAFF_ID = "p1";
export const CURRENT_STAFF_NAME = "Patrick Steuble";

// ========= TICKETS =========

export const mockTickets: Ticket[] = [
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
  }
];

// ========= TICKET MESSAGES =========

export const mockTicketMessages: TicketMessage[] = [
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
