// ========= CHATS FEATURE =========

export interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  participants: string[]; // personIds
  teamId?: string; // For team group chats
  departmentId?: string; // Which department this chat belongs to
  departmentName?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
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

export interface ChatSettings {
  enabled: boolean;
  allowDirectMessages: boolean;
  allowGroupChats: boolean;
  teamGroupChatsEnabled: boolean;
}

// Chat settings (admin configurable)
export const mockChatSettings: ChatSettings = {
  enabled: true,
  allowDirectMessages: true,
  allowGroupChats: true,
  teamGroupChatsEnabled: true
};

// Mock chats for member Tim Jung (p11)
// Tim is in two departments:
// - Fußball → Team: Herren 1. Mannschaft
// - Fitness → General Fitness Team
export const mockChats: Chat[] = [
  // Team Group Chats
  {
    id: "chat_1",
    type: "group",
    name: "Herren 1. Mannschaft",
    participants: ["p11", "p3", "p5", "p6", "p7", "p8", "p10"],
    teamId: "team1",
    departmentId: "dept1",
    departmentName: "Fußball",
    lastMessage: {
      id: "msg_g1_5",
      chatId: "chat_1",
      senderId: "p3",
      senderName: "Thomas Trainer",
      content: "Training morgen fällt aus wegen Platzsperrung! 🚫",
      createdAt: "2024-03-15T18:30:00",
      isRead: false
    },
    unreadCount: 3,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-03-15T18:30:00"
  },
  {
    id: "chat_4",
    type: "group",
    name: "Fitness Team",
    participants: ["p11", "p20", "p21", "p22", "p23"],
    teamId: "team_fitness",
    departmentId: "dept2",
    departmentName: "Fitness",
    lastMessage: {
      id: "msg_g2_3",
      chatId: "chat_4",
      senderId: "p20",
      senderName: "Maria Fitness",
      content: "Neuer Kursplan für April ist online! 💪",
      createdAt: "2024-03-15T12:00:00",
      isRead: false
    },
    unreadCount: 1,
    createdAt: "2024-02-01T00:00:00",
    updatedAt: "2024-03-15T12:00:00"
  },
  // Direct Chats
  {
    id: "chat_2",
    type: "direct",
    name: "Thomas Trainer",
    participants: ["p11", "p3"],
    departmentId: "dept1",
    departmentName: "Fußball",
    lastMessage: {
      id: "msg_d1_4",
      chatId: "chat_2",
      senderId: "p3",
      senderName: "Thomas Trainer",
      content: "Alles klar, bis Donnerstag dann!",
      createdAt: "2024-03-14T16:45:00",
      isRead: true
    },
    unreadCount: 0,
    createdAt: "2024-02-15T10:00:00",
    updatedAt: "2024-03-14T16:45:00"
  },
  {
    id: "chat_3",
    type: "direct",
    name: "Patrick Steuble",
    participants: ["p11", "p1"],
    lastMessage: {
      id: "msg_d2_2",
      chatId: "chat_3",
      senderId: "p1",
      senderName: "Patrick Steuble",
      content: "Ihre Anfrage wurde bearbeitet. Bei Fragen melden Sie sich gerne.",
      createdAt: "2024-03-10T11:20:00",
      isRead: true
    },
    unreadCount: 0,
    createdAt: "2024-03-08T09:00:00",
    updatedAt: "2024-03-10T11:20:00"
  },
  {
    id: "chat_5",
    type: "direct",
    name: "Maria Fitness",
    participants: ["p11", "p20"],
    departmentId: "dept2",
    departmentName: "Fitness",
    lastMessage: {
      id: "msg_d3_2",
      chatId: "chat_5",
      senderId: "p20",
      senderName: "Maria Fitness",
      content: "Perfekt, dann sehen wir uns Mittwoch zum Kurs!",
      createdAt: "2024-03-12T09:30:00",
      isRead: true
    },
    unreadCount: 0,
    createdAt: "2024-03-10T14:00:00",
    updatedAt: "2024-03-12T09:30:00"
  }
];

export const mockChatMessages: ChatMessage[] = [
  // Herren 1. Mannschaft (Fußball) group chat messages
  {
    id: "msg_g1_1",
    chatId: "chat_1",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Hallo Team! Bitte denkt an die Trikots für Samstag. 👕",
    createdAt: "2024-03-15T10:00:00",
    isRead: true
  },
  {
    id: "msg_g1_2",
    chatId: "chat_1",
    senderId: "p5",
    senderName: "Lisa Schmidt",
    content: "Alles klar, Coach!",
    createdAt: "2024-03-15T10:15:00",
    isRead: true
  },
  {
    id: "msg_g1_3",
    chatId: "chat_1",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Wird gemacht 👍",
    createdAt: "2024-03-15T10:20:00",
    isRead: true
  },
  {
    id: "msg_g1_4",
    chatId: "chat_1",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Super! Außerdem: Wer kann am Sonntag beim Aufbau helfen?",
    createdAt: "2024-03-15T14:00:00",
    isRead: true
  },
  {
    id: "msg_g1_5",
    chatId: "chat_1",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Training morgen fällt aus wegen Platzsperrung! 🚫",
    createdAt: "2024-03-15T18:30:00",
    isRead: false
  },
  
  // Fitness Team group chat messages
  {
    id: "msg_g2_1",
    chatId: "chat_4",
    senderId: "p20",
    senderName: "Maria Fitness",
    content: "Willkommen in der Fitness-Gruppe! Hier gibt's alle News zu Kursen und Events. 🏋️",
    createdAt: "2024-03-01T09:00:00",
    isRead: true
  },
  {
    id: "msg_g2_2",
    chatId: "chat_4",
    senderId: "p21",
    senderName: "Hans Müller",
    content: "Super, danke für die Info!",
    createdAt: "2024-03-01T10:30:00",
    isRead: true
  },
  {
    id: "msg_g2_3",
    chatId: "chat_4",
    senderId: "p20",
    senderName: "Maria Fitness",
    content: "Neuer Kursplan für April ist online! 💪",
    createdAt: "2024-03-15T12:00:00",
    isRead: false
  },

  // Direct chat with Thomas Trainer (Fußball)
  {
    id: "msg_d1_1",
    chatId: "chat_2",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Hallo Thomas, ich kann am Donnerstag leider nicht zum Training kommen. Ist das okay?",
    createdAt: "2024-03-14T15:30:00",
    isRead: true
  },
  {
    id: "msg_d1_2",
    chatId: "chat_2",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Kein Problem, Tim. Grund?",
    createdAt: "2024-03-14T16:00:00",
    isRead: true
  },
  {
    id: "msg_d1_3",
    chatId: "chat_2",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Arzttermin, den ich nicht verschieben konnte.",
    createdAt: "2024-03-14T16:30:00",
    isRead: true
  },
  {
    id: "msg_d1_4",
    chatId: "chat_2",
    senderId: "p3",
    senderName: "Thomas Trainer",
    content: "Alles klar, bis Donnerstag dann!",
    createdAt: "2024-03-14T16:45:00",
    isRead: true
  },

  // Direct chat with Patrick Steuble (Admin)
  {
    id: "msg_d2_1",
    chatId: "chat_3",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Hallo, ich habe eine Frage zu meiner Rechnung.",
    createdAt: "2024-03-08T09:00:00",
    isRead: true
  },
  {
    id: "msg_d2_2",
    chatId: "chat_3",
    senderId: "p1",
    senderName: "Patrick Steuble",
    content: "Ihre Anfrage wurde bearbeitet. Bei Fragen melden Sie sich gerne.",
    createdAt: "2024-03-10T11:20:00",
    isRead: true
  },

  // Direct chat with Maria Fitness
  {
    id: "msg_d3_1",
    chatId: "chat_5",
    senderId: "p11",
    senderName: "Tim Jung",
    content: "Hallo Maria, gibt es noch Plätze im Yoga-Kurs am Mittwoch?",
    createdAt: "2024-03-12T08:00:00",
    isRead: true
  },
  {
    id: "msg_d3_2",
    chatId: "chat_5",
    senderId: "p20",
    senderName: "Maria Fitness",
    content: "Perfekt, dann sehen wir uns Mittwoch zum Kurs!",
    createdAt: "2024-03-12T09:30:00",
    isRead: true
  }
];

// Helper functions
export function getChatMessages(chatId: string): ChatMessage[] {
  return mockChatMessages.filter(m => m.chatId === chatId);
}

export function getMemberChats(personId: string): Chat[] {
  return mockChats.filter(c => c.participants.includes(personId));
}

export function getUnreadChatsCount(personId: string): number {
  return getMemberChats(personId).reduce((sum, c) => sum + c.unreadCount, 0);
}

// Get chats grouped by department
export function getChatsByDepartment(personId: string): Record<string, Chat[]> {
  const chats = getMemberChats(personId);
  const grouped: Record<string, Chat[]> = {
    "Allgemein": []
  };
  
  chats.forEach(chat => {
    if (chat.departmentName) {
      if (!grouped[chat.departmentName]) {
        grouped[chat.departmentName] = [];
      }
      grouped[chat.departmentName].push(chat);
    } else {
      grouped["Allgemein"].push(chat);
    }
  });
  
  return grouped;
}
