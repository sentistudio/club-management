import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Home,
  Calendar,
  MessageSquare,
  Newspaper,
  User,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  Clock,
  MapPin,
  Plus,
  Send,
  Paperclip,
  ArrowLeft,
  X,
  File,
  CreditCard,
  Globe,
  QrCode,
  Eye,
  Heart,
  Check,
  Shield,
  List,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "../../i18n";
import { mockTicketForms } from "../../data/mockInbox";
import { 
  getChatMessages, 
  mockChats
} from "../../data/mockChats";
import type { Chat } from "../../data/mockChats";

// ==========================================
// TYPES
// ==========================================
interface MemberProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  clubId: string;
  clubName: string;
  memberships: {
    departmentId: string;
    departmentName: string;
    role: "active" | "passive" | "guardian";
    teamName?: string;
    icon: string;
    coachName?: string;
    coachAvatar?: string;
  }[];
  stats: {
    termine: number;
    nachrichten: number;
    rechnungen: number;
  };
  events: {
    id: string;
    title: string;
    date: string;
    time: string;
    location?: string;
    type: "training" | "match" | "event";
    teamIcon?: string;
    status?: "confirmed" | "unconfirmed" | "booked" | "free_spots";
    attendees?: number;
    maxAttendees?: number;
  }[];
  children?: MemberProfile[];
  isChild?: boolean;
  age?: number;
  parentId?: string;
}

interface EnhancedEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  location?: string;
  type: "training" | "match" | "event";
  teamIcon?: string;
  scope: "team" | "department" | "club";
  department?: string;
  team?: string;
  bannerImage?: string;
  isAllDay?: boolean;
  rsvp?: {
    status: "confirmed" | "declined" | "pending" | "maybe";
    deadline?: string;
    required: boolean;
    confirmed: number;
    declined: number;
    pending: number;
    total: number;
  };
  organizer?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  isRecurring?: boolean;
  recurringPattern?: string;
  attachments?: { name: string; type: string; size: string }[];
  notes?: string;
  visibleTo?: ("all" | "players" | "parents" | "coaches" | "board")[];
  createdBy?: string;
  createdAt?: string;
}

type ViewState = "home" | "calendar" | "chats" | "news" | "profile" | "settings" | "chat-detail" | "request-detail" | "new-request" | "event-detail";

// ==========================================
// LENA'S PROFILE (MEMBER DATA)
// ==========================================
const LENA_PROFILE: MemberProfile = {
  id: "p11",
  firstName: "Lena",
  lastName: "Schneider",
  email: "lena.schneider@example.com",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_fitness", 
      departmentName: "Fitness", 
      role: "active" as const, 
      teamName: "Fitness – Morgengruppe", 
      icon: "💪",
      coachName: "Trainerin Sandra",
      coachAvatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face"
    },
    { 
      departmentId: "dept_football", 
      departmentName: "Fußball", 
      role: "active" as const, 
      teamName: "Frauen Ü40", 
      icon: "⚽",
      coachName: "Trainer Bernd",
      coachAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face"
    }
  ],
  stats: {
    termine: 4,
    nachrichten: 8,
    rechnungen: 0,
  },
  events: [
    {
      id: "evt_lena_1",
      title: "Fitness Training",
      date: "2026-01-22",
      time: "07:00 - 08:00",
      location: "Fitness-Raum",
      type: "training",
      teamIcon: "💪",
      status: "confirmed"
    },
    {
      id: "evt_lena_2",
      title: "Frauen Ü40 Training",
      date: "2026-01-24",
      time: "19:00 - 20:30",
      location: "Platz 2",
      type: "training",
      teamIcon: "⚽",
      status: "unconfirmed"
    },
    {
      id: "evt_lena_3",
      title: "Freundschaftsspiel vs. TuS Mainberg",
      date: "2026-01-26",
      time: "15:00",
      location: "Sportplatz Burkhardsfelden",
      type: "match",
      teamIcon: "⚽",
      status: "confirmed"
    }
  ],
  children: []
};

// ==========================================
// PATRICK'S PROFILE (ADMIN WHO IS ALSO MEMBER)
// ==========================================
const PATRICK_PROFILE: MemberProfile = {
  id: "patrick_steuble",
  firstName: "Patrick",
  lastName: "Steuble",
  email: "patrick.steuble@sfb.de",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  clubId: "sfb",
  clubName: "Sportfreunde Burkhardsfelden",
  memberships: [
    { 
      departmentId: "dept_football", 
      departmentName: "Fußball", 
      role: "active" as const, 
      teamName: "Männer Ü40", 
      icon: "⚽",
      coachName: "Trainer Klaus",
      coachAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face"
    },
    { 
      departmentId: "dept_admin", 
      departmentName: "Vorstand", 
      role: "active" as const, 
      teamName: "Vereinsvorstand", 
      icon: "🛡️"
    }
  ],
  stats: {
    termine: 6,
    nachrichten: 12,
    rechnungen: 0,
  },
  events: [
    {
      id: "evt_patrick_1",
      title: "Training Männer Ü40",
      date: "2026-01-28",
      time: "19:30 - 21:00",
      location: "Sportplatz Burkhardsfelden",
      type: "training",
      teamIcon: "⚽",
      status: "confirmed"
    },
    {
      id: "evt_patrick_2",
      title: "Vorstandssitzung",
      date: "2026-01-29",
      time: "18:00 - 20:00",
      location: "Vereinsheim",
      type: "event",
      teamIcon: "🛡️",
      status: "confirmed"
    },
    {
      id: "evt_patrick_3",
      title: "Freundschaftsspiel vs. TSV Holzkirchen",
      date: "2026-02-01",
      time: "15:00",
      location: "Sportplatz Holzkirchen",
      type: "match",
      teamIcon: "⚽",
      status: "unconfirmed"
    }
  ],
  children: []
};

// Profile Map for route-based switching
const PROFILE_MAP: Record<string, MemberProfile> = {
  lena: LENA_PROFILE,
  patrick: PATRICK_PROFILE
};

// Mock Enhanced Events for Lena
const MOCK_LENA_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_lena_1",
    title: "Fitness Training - Morgengruppe",
    description: "Reguläres Fitnesstraining mit Fokus auf Cardio und Kräftigung.",
    date: "2026-01-27",
    startTime: "07:00",
    endTime: "08:00",
    location: "Fitness-Raum",
    type: "training",
    teamIcon: "💪",
    scope: "team",
    department: "Fitness",
    team: "Fitness – Morgengruppe",
    bannerImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=400&fit=crop",
    rsvp: {
      status: "confirmed",
      required: true,
      confirmed: 12,
      declined: 2,
      pending: 1,
      total: 15
    },
    organizer: {
      name: "Sandra Müller",
      avatar: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=50&h=50&fit=crop&crop=face",
      role: "Trainerin"
    }
  },
  {
    id: "evt_lena_2",
    title: "Frauen Ü40 Training",
    description: "Wöchentliches Mannschaftstraining mit Taktik- und Spielübungen.",
    date: "2026-01-28",
    startTime: "19:00",
    endTime: "20:30",
    location: "Platz 2",
    type: "training",
    teamIcon: "⚽",
    scope: "team",
    department: "Fußball",
    team: "Frauen Ü40",
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-01-27",
      required: true,
      confirmed: 8,
      declined: 3,
      pending: 5,
      total: 16
    },
    organizer: {
      name: "Bernd Weber",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_lena_3",
    title: "Freundschaftsspiel vs. TuS Mainberg",
    description: "Auswärtsspiel gegen TuS Mainberg. Treffpunkt 30 Minuten vor Spielbeginn.",
    date: "2026-01-29",
    startTime: "15:00",
    endTime: "17:00",
    location: "Sportplatz Mainberg",
    type: "match",
    teamIcon: "⚽",
    scope: "team",
    department: "Fußball",
    team: "Frauen Ü40",
    bannerImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop",
    rsvp: {
      status: "confirmed",
      required: true,
      confirmed: 14,
      declined: 1,
      pending: 1,
      total: 16
    },
    organizer: {
      name: "Bernd Weber",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_lena_4",
    title: "Vereinsversammlung 2026",
    description: "Jährliche Mitgliederversammlung mit Berichten des Vorstands und Wahlen.",
    date: "2026-02-15",
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Großer Saal",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-02-10",
      required: false,
      confirmed: 67,
      declined: 23,
      pending: 304,
      total: 394
    },
    organizer: {
      name: "Patrick Steuble",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      role: "Vereinsvorstand"
    }
  },
  {
    id: "evt_lena_5",
    title: "Vereinsfasching 2026",
    description: "Großer Vereinsfasching für die ganze Familie! Mit DJ, Kinderprogramm, Tombola und Buffet. Kostüme erwünscht! 🎭🎉",
    date: "2026-02-22",
    startTime: "15:00",
    endTime: "22:00",
    location: "Vereinsheim - Großer Saal",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-02-18",
      required: true,
      confirmed: 89,
      declined: 45,
      pending: 260,
      total: 394
    },
    organizer: {
      name: "Patrick Steuble",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      role: "Vereinsvorstand"
    }
  },
  {
    id: "evt_lena_6",
    title: "Elternabend Jugendfußball",
    description: "Informationsabend für alle Eltern der Jugendmannschaften (U8 bis U17). Themen: Saisonplanung, Trainingscamp Sommer.",
    date: "2026-01-30",
    startTime: "19:00",
    endTime: "21:00",
    location: "Vereinsheim - Sitzungszimmer",
    type: "event",
    scope: "department",
    department: "Fußball",
    rsvp: {
      status: "confirmed",
      deadline: "2026-01-28",
      required: true,
      confirmed: 34,
      declined: 12,
      pending: 110,
      total: 156
    },
    organizer: {
      name: "Jugendleitung",
      role: "Fußball-Abteilung"
    }
  }
];

// Mock Enhanced Events for Patrick
const MOCK_PATRICK_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_patrick_1",
    title: "Training Männer Ü40",
    description: "Wöchentliches Mannschaftstraining. Heute: Spieltaktik und Kondition.",
    date: "2026-01-28",
    startTime: "19:30",
    endTime: "21:00",
    location: "Sportplatz Burkhardsfelden",
    type: "training",
    teamIcon: "⚽",
    scope: "team",
    department: "Fußball",
    team: "Männer Ü40",
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    rsvp: {
      status: "confirmed",
      required: true,
      confirmed: 14,
      declined: 2,
      pending: 2,
      total: 18
    },
    organizer: {
      name: "Klaus Werner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_patrick_2",
    title: "Vorstandssitzung",
    description: "Monatliche Vorstandssitzung. Tagesordnung: Jahresplanung 2026, Finanzbericht, Vereinsfest.",
    date: "2026-01-29",
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Sitzungszimmer",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    isAllDay: false,
    rsvp: {
      status: "confirmed",
      required: true,
      confirmed: 6,
      declined: 1,
      pending: 1,
      total: 8
    },
    organizer: {
      name: "Vorstand",
      role: "Vereinsleitung"
    }
  },
  {
    id: "evt_patrick_3",
    title: "Freundschaftsspiel vs. TSV Holzkirchen",
    description: "Auswärtsspiel gegen TSV Holzkirchen. Treffpunkt: 14:00 am Vereinsheim (Fahrgemeinschaften).",
    date: "2026-02-01",
    startTime: "15:00",
    endTime: "17:00",
    location: "Sportplatz Holzkirchen",
    type: "match",
    teamIcon: "⚽",
    scope: "team",
    department: "Fußball",
    team: "Männer Ü40",
    bannerImage: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-01-30",
      required: true,
      confirmed: 12,
      declined: 3,
      pending: 3,
      total: 18
    },
    organizer: {
      name: "Klaus Werner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_patrick_4",
    title: "Vereinsversammlung 2026",
    description: "Jährliche Mitgliederversammlung mit Berichten des Vorstands und Wahlen.",
    date: "2026-02-15",
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Großer Saal",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    rsvp: {
      status: "confirmed",
      deadline: "2026-02-10",
      required: false,
      confirmed: 67,
      declined: 23,
      pending: 304,
      total: 394
    },
    organizer: {
      name: "Patrick Steuble",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      role: "Vereinsvorstand"
    }
  },
  {
    id: "evt_patrick_5",
    title: "Vereinsfasching 2026",
    description: "Großer Vereinsfasching für die ganze Familie! Mit DJ, Kinderprogramm, Tombola und Buffet. 🎭🎉",
    date: "2026-02-22",
    startTime: "15:00",
    endTime: "22:00",
    location: "Vereinsheim - Großer Saal",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-02-18",
      required: true,
      confirmed: 89,
      declined: 45,
      pending: 260,
      total: 394
    },
    organizer: {
      name: "OK Fasching",
      role: "Organisationskomitee"
    }
  },
  {
    id: "evt_patrick_6",
    title: "Frühjahrs-Arbeitseinsatz",
    description: "Gemeinsamer Arbeitseinsatz zur Pflege der Vereinsanlagen. Werkzeug wird gestellt, Verpflegung inklusive.",
    date: "2026-03-14",
    startTime: "09:00",
    endTime: "14:00",
    location: "Vereinsgelände",
    type: "event",
    scope: "club",
    isAllDay: false,
    bannerImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    rsvp: {
      status: "pending",
      deadline: "2026-03-10",
      required: true,
      confirmed: 23,
      declined: 8,
      pending: 120,
      total: 151
    },
    organizer: {
      name: "Platzwart Team",
      role: "Vereinsanlage"
    }
  }
];

// Events map for profile-based access
const EVENTS_MAP: Record<string, EnhancedEvent[]> = {
  lena: MOCK_LENA_EVENTS,
  patrick: MOCK_PATRICK_EVENTS
};

// Mock Club News for Lena
const MOCK_CLUB_NEWS = [
  {
    id: "news_1",
    title: "Neuer Fitnessraum ab Februar",
    excerpt: "Der renovierte Fitnessraum wird ab 1. Februar wieder verfügbar sein mit neuen Geräten.",
    date: "2026-01-18",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop",
    department: "Fitness",
    views: 234,
    likes: 45
  },
  {
    id: "news_2",
    title: "Frauen Ü40: Erfolgreicher Saisonstart",
    excerpt: "Mit 3 Siegen in 4 Spielen startet das Team erfolgreich in die Rückrunde.",
    date: "2026-01-15",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
    department: "Fußball",
    views: 189,
    likes: 67
  },
  {
    id: "news_3",
    title: "Mitgliederversammlung 2026",
    excerpt: "Einladung zur jährlichen Mitgliederversammlung am 15. Februar um 18:00 Uhr.",
    date: "2026-01-10",
    image: null,
    department: "Verein",
    views: 456,
    likes: 12
  }
];

// Filter chats for a profile
const getProfileChats = (profileKey: string) => {
  const profile = PROFILE_MAP[profileKey] || LENA_PROFILE;
  return mockChats.filter(chat => {
    // Check if profile is a participant or can see this chat
    return chat.visibleToProfiles?.includes(profileKey) || 
           chat.participants.some(p => p.id === profile.id);
  });
};

// ==========================================
// MEMBER SIDEBAR COMPONENT
// ==========================================
// Helper to get chat avatar
const getChatAvatar = (chat: Chat): string | undefined => {
  // For DMs, get the other participant's avatar
  if (chat.type === "direct" && chat.participants.length > 0) {
    const otherParticipant = chat.participants.find(p => p.id !== LENA_PROFILE.id);
    return otherParticipant?.avatar;
  }
  // For group chats, return first participant's avatar or undefined
  return chat.participants[0]?.avatar;
};

// Helper to format time from ISO string
const formatMessageTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
};

interface MemberSidebarProps {
  activeView: ViewState;
  onNavigate: (view: ViewState) => void;
  profile: MemberProfile;
  unreadMessages: number;
  currentProfileKey: string;
  onProfileSwitch: (profileKey: string) => void;
}

function MemberSidebar({ activeView, onNavigate, profile, unreadMessages, currentProfileKey, onProfileSwitch }: MemberSidebarProps) {
  const { t } = useLanguage();
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  
  const navItems = [
    { id: "home" as ViewState, icon: Home, label: t("nav.home"), badge: 0 },
    { id: "calendar" as ViewState, icon: Calendar, label: t("nav.events"), badge: 0 },
    { id: "chats" as ViewState, icon: MessageSquare, label: t("nav.chats"), badge: unreadMessages },
    { id: "news" as ViewState, icon: Newspaper, label: t("nav.news"), badge: 0 },
    { id: "profile" as ViewState, icon: User, label: t("memberPortal.myProfile"), badge: 0 },
  ];

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-neutral-200 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-4 border-b border-neutral-200">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
          <span className="text-white font-bold text-lg">cb</span>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-900">{t("nav.memberPortal")}</p>
          <p className="text-xs text-neutral-500">Sportfreunde Burkhardsfelden</p>
        </div>
      </div>

      {/* Club Logo */}
      <div className="px-4 py-5 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">SfB</span>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{profile.clubName}</p>
            <p className="text-xs text-neutral-500">Mitglied</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id || 
              (item.id === "chats" && (activeView === "chat-detail" || activeView === "request-detail" || activeView === "new-request")) ||
              (item.id === "calendar" && activeView === "event-detail");
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? "bg-teal-50 text-teal-600" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="mt-6 pt-4 border-t border-neutral-200">
          <button
            onClick={() => onNavigate("settings")}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              text-sm font-medium transition-all duration-150
              ${activeView === "settings" 
                ? "bg-teal-50 text-teal-600" 
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
              }
            `}
          >
            <Settings className="w-5 h-5" />
            <span>{t("nav.settings")}</span>
          </button>
        </div>
      </nav>

      {/* User Profile with Profile Switcher */}
      <div className="p-4 border-t border-neutral-200 relative">
        <button 
          onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors"
        >
          <img 
            src={profile.avatar} 
            alt={profile.firstName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-xs text-neutral-500">
              {currentProfileKey === "patrick" ? "Admin & Mitglied" : "Mitglied"}
            </p>
          </div>
          <RefreshCw className="w-4 h-4 text-neutral-400" />
        </button>

        {/* Profile Switcher Dropdown */}
        {showProfileSwitcher && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowProfileSwitcher(false)} 
            />
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
              <div className="p-2">
                <p className="px-3 py-1.5 text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Demo: Profil wechseln
                </p>
                {Object.entries(PROFILE_MAP).map(([key, p]) => (
                  <button
                    key={key}
                    onClick={() => {
                      onProfileSwitch(key);
                      setShowProfileSwitcher(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      currentProfileKey === key 
                        ? "bg-teal-50 text-teal-700" 
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <img 
                      src={p.avatar} 
                      alt={p.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-neutral-500">
                        {key === "patrick" ? "Admin & Mitglied" : "Mitglied"}
                      </p>
                    </div>
                    {currentProfileKey === key && (
                      <Check className="w-4 h-4 text-teal-600" />
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200">
                <p className="text-xs text-neutral-500">
                  💡 Demo: Wechsle zwischen Profilen, um verschiedene Mitglieder-Ansichten zu testen.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export function MemberWebPortal() {
  // i18n
  const { t, lang, getWeekday } = useLanguage();
  const { profile: profileParam } = useParams<{ profile?: string }>();
  const navigate = useNavigate();
  
  const [view, setView] = useState<ViewState>("home");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedForm, setSelectedForm] = useState<typeof mockTicketForms[0] | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chatTab, setChatTab] = useState<"announcements" | "team" | "direct" | "requests">("announcements");
  
  // Get profile based on route param (default to Lena)
  const profileKey = profileParam || "lena";
  const profile = PROFILE_MAP[profileKey] || LENA_PROFILE;

  // Get events for current profile
  const profileEvents = useMemo(() => {
    return EVENTS_MAP[profileKey] || MOCK_LENA_EVENTS;
  }, [profileKey]);

  // Calculate unread messages
  const unreadMessages = useMemo(() => {
    const chats = getProfileChats(profileKey);
    return chats.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
  }, [profileKey]);

  // Filter chats based on tab
  const filteredChats = useMemo(() => {
    const chats = getProfileChats(profileKey);
    const filtered = chats.filter(chat => {
      switch (chatTab) {
        case "announcements":
          return chat.type === "announcement";
        case "team":
          return chat.type === "team_group";
        case "direct":
          return chat.type === "direct";
        case "requests":
          return false; // Requests are handled separately
        default:
          return true;
      }
    });
    
    if (searchTerm) {
      return filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [chatTab, searchTerm]);

  // Event helpers
  // Types: training (from team schedule), match (from team schedule), event (from admin-created club events)
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training": return "bg-teal-100 text-teal-700";
      case "match": return "bg-orange-100 text-orange-700";
      case "event": return "bg-violet-100 text-violet-700";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "training": return "Training";
      case "match": return lang === "de" ? "Spiel" : "Match";
      case "event": return "Event";
      default: return type;
    }
  };

  // ==========================================
  // RENDER: HOME VIEW
  // ==========================================
  const renderHome = () => (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <img 
            src={profile.avatar} 
            alt={profile.firstName}
            className="w-16 h-16 rounded-full border-2 border-white/30"
          />
          <div>
            <h1 className="text-2xl font-bold">Hallo, {profile.firstName}!</h1>
            <p className="text-teal-100">{t("memberPortal.welcome")} {profile.clubName}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{profile.stats.termine}</p>
              <p className="text-sm text-neutral-500">{t("nav.events")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{profile.stats.nachrichten}</p>
              <p className="text-sm text-neutral-500">{t("nav.chats")}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-900">{profile.stats.rechnungen}</p>
              <p className="text-sm text-neutral-500">Offene Rechnungen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Memberships */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="font-semibold text-neutral-900">Meine Mitgliedschaften</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {profile.memberships.map((membership, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              <span className="text-2xl">{membership.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{membership.teamName || membership.departmentName}</p>
                <p className="text-sm text-neutral-500">{membership.departmentName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                membership.role === "active" ? "bg-teal-100 text-teal-700" : "bg-neutral-100 text-neutral-600"
              }`}>
                {membership.role === "active" ? "Aktiv" : "Passiv"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">{t("memberPortal.upcomingEvents")}</h2>
          <button 
            onClick={() => setView("calendar")}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Alle anzeigen
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => {
                setSelectedEvent(event);
                setView("event-detail");
              }}
              className="bg-neutral-50 rounded-xl overflow-hidden hover:bg-neutral-100 transition-colors cursor-pointer group border border-neutral-100"
            >
              {/* Mini Banner */}
              {event.bannerImage && (
                <div className="h-24 w-full overflow-hidden">
                  <img 
                    src={event.bannerImage} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-teal-700">
                    {new Date(event.date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                    {getEventTypeLabel(event.type)}
                  </span>
                </div>
                <p className="font-medium text-neutral-900 truncate text-sm">{event.title}</p>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500">
                  <Clock className="w-3 h-3" />
                  <span>{event.isAllDay ? t("common.allDay") : event.startTime}</span>
                  {event.location && (
                    <>
                      <span>•</span>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </>
                  )}
                </div>
                {event.rsvp && (
                  <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
                    <span>{event.rsvp.confirmed}/{event.rsvp.total}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      event.rsvp.status === "confirmed" ? "bg-green-500" :
                      event.rsvp.status === "declined" ? "bg-red-500" : "bg-amber-400"
                    }`} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Aktuelle News</h2>
          <button 
            onClick={() => setView("news")}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            Alle anzeigen
          </button>
        </div>
        <div className="divide-y divide-neutral-100">
          {MOCK_CLUB_NEWS.slice(0, 2).map((news) => (
            <div key={news.id} className="p-4 flex gap-4">
              {news.image && (
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900">{news.title}</p>
                <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{news.excerpt}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-neutral-400">{news.department}</span>
                  <span className="text-xs text-neutral-400">•</span>
                  <span className="text-xs text-neutral-400">{news.views} Aufrufe</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ==========================================
  // RENDER: CALENDAR VIEW
  // ==========================================
  const [calendarViewMode, setCalendarViewMode] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedEventDate, setSelectedEventDate] = useState<string | null>(null);
  
  const renderCalendar = () => {
    // Group events by time sections
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const monthEnd = new Date(today);
    monthEnd.setMonth(monthEnd.getMonth() + 1);
    
    type SectionKey = "today" | "tomorrow" | "thisWeek" | "thisMonth" | "later";
    
    const sections: { key: SectionKey; label: string; bgColor: string; events: EnhancedEvent[] }[] = [
      { key: "today", label: "Heute", bgColor: "bg-amber-500", events: [] },
      { key: "tomorrow", label: "Morgen", bgColor: "bg-orange-400", events: [] },
      { key: "thisWeek", label: "Diese Woche", bgColor: "bg-teal-600", events: [] },
      { key: "thisMonth", label: "Diesen Monat", bgColor: "bg-neutral-500", events: [] },
      { key: "later", label: "Später", bgColor: "bg-neutral-400", events: [] }
    ];
    
    const sortedEvents = [...profileEvents].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    sortedEvents.forEach(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      
      if (eventDate.getTime() === today.getTime()) {
        sections.find(s => s.key === "today")!.events.push(event);
      } else if (eventDate.getTime() === tomorrow.getTime()) {
        sections.find(s => s.key === "tomorrow")!.events.push(event);
      } else if (eventDate < weekEnd) {
        sections.find(s => s.key === "thisWeek")!.events.push(event);
      } else if (eventDate < monthEnd) {
        sections.find(s => s.key === "thisMonth")!.events.push(event);
      } else {
        sections.find(s => s.key === "later")!.events.push(event);
      }
    });
    
    // Calendar grid helper
    const getCalendarDays = () => {
      const year = calendarMonth.getFullYear();
      const month = calendarMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startPadding = (firstDay.getDay() + 6) % 7;
      
      const days: { date: Date; isCurrentMonth: boolean; events: EnhancedEvent[] }[] = [];
      
      // Previous month padding
      for (let i = startPadding - 1; i >= 0; i--) {
        const d = new Date(year, month, -i);
        const dateStr = d.toISOString().split("T")[0];
        days.push({ date: d, isCurrentMonth: false, events: profileEvents.filter(e => e.date === dateStr) });
      }
      
      // Current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(year, month, i);
        const dateStr = d.toISOString().split("T")[0];
        days.push({ date: d, isCurrentMonth: true, events: profileEvents.filter(e => e.date === dateStr) });
      }
      
      // Next month padding
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        const d = new Date(year, month + 1, i);
        const dateStr = d.toISOString().split("T")[0];
        days.push({ date: d, isCurrentMonth: false, events: profileEvents.filter(e => e.date === dateStr) });
      }
      
      return days;
    };
    
    return (
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{t("nav.events")}</h1>
            <p className="text-sm text-neutral-500 mt-0.5">{profileEvents.length} {t("nav.events")}</p>
          </div>
          
          {/* View Toggle */}
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden text-sm">
            <button
              onClick={() => setCalendarViewMode("list")}
              className={`px-3 py-1.5 flex items-center gap-1.5 ${calendarViewMode === "list" ? "bg-teal-600 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"}`}
            >
              <List className="w-4 h-4" />
              {t("views.list")}
            </button>
            <button
              onClick={() => setCalendarViewMode("calendar")}
              className={`px-3 py-1.5 flex items-center gap-1.5 ${calendarViewMode === "calendar" ? "bg-teal-600 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"}`}
            >
              <Calendar className="w-4 h-4" />
              {t("views.calendar")}
            </button>
          </div>
        </div>

        {/* LIST VIEW - Clean Design */}
        {calendarViewMode === "list" && (
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden flex-1 flex flex-col">
            {/* Integrated Week Navigator */}
            <div className="border-b border-neutral-200 p-3 bg-neutral-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      const newDate = new Date(calendarMonth);
                      newDate.setDate(newDate.getDate() - 7);
                      setCalendarMonth(newDate);
                    }}
                    className="p-1 hover:bg-white rounded"
                  >
                    <ChevronLeft className="w-4 h-4 text-neutral-500" />
                  </button>
                  <span className="text-sm font-medium text-neutral-700 min-w-[100px] text-center">
                    {calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short", year: "numeric" })}
                  </span>
                  <button
                    onClick={() => {
                      const newDate = new Date(calendarMonth);
                      newDate.setDate(newDate.getDate() + 7);
                      setCalendarMonth(newDate);
                    }}
                    className="p-1 hover:bg-white rounded"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-500" />
                  </button>
                  <button
                    onClick={() => { setCalendarMonth(new Date()); setSelectedEventDate(null); }}
                    className="ml-1 text-xs px-2 py-1 text-teal-600 hover:bg-teal-50 rounded"
                  >
                    {t("common.today")}
                  </button>
                </div>
                
                {selectedEventDate ? (
                  <button
                    onClick={() => setSelectedEventDate(null)}
                    className="text-xs px-2 py-1 bg-teal-600 text-white rounded flex items-center gap-1"
                  >
                    {new Date(selectedEventDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs text-neutral-500">{profileEvents.length} {t("nav.events")}</span>
                )}
              </div>
              
              {/* Compact Week Strip */}
              <div className="flex gap-1">
                {(() => {
                  const startOfWeek = new Date(calendarMonth);
                  const dayOfWeek = startOfWeek.getDay();
                  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                  startOfWeek.setDate(startOfWeek.getDate() + diff);
                  
                  const days = [];
                  for (let i = 0; i < 7; i++) {
                    const d = new Date(startOfWeek);
                    d.setDate(d.getDate() + i);
                    days.push(d);
                  }
                  
                  const todayDate = new Date();
                  todayDate.setHours(0, 0, 0, 0);
                  
                  return days.map((day, i) => {
                    const dateStr = day.toISOString().split("T")[0];
                    const isToday = day.toDateString() === todayDate.toDateString();
                    const dayEvents = profileEvents.filter(e => e.date === dateStr);
                    const hasEvents = dayEvents.length > 0;
                    const isSelected = selectedEventDate === dateStr;
                    
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedEventDate(isSelected ? null : dateStr)}
                        className={`flex-1 py-1.5 rounded text-center transition-all ${
                          isSelected 
                            ? "bg-teal-600 text-white" 
                            : isToday 
                            ? "bg-teal-100 text-teal-700" 
                            : hasEvents
                            ? "bg-white hover:bg-neutral-100"
                            : "hover:bg-white"
                        }`}
                      >
                        <p className={`text-[10px] uppercase ${isSelected ? "text-white/70" : "text-neutral-400"}`}>
                          {getWeekday(day)}
                        </p>
                        <p className={`text-sm font-bold ${isSelected ? "text-white" : isToday ? "text-teal-700" : "text-neutral-700"}`}>
                          {day.getDate()}
                        </p>
                        {hasEvents && (
                          <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${isSelected ? "bg-white" : "bg-teal-500"}`} />
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
            
            {/* Events List */}
            <div className="flex-1 overflow-y-auto">
              {(() => {
                const displayEvents = selectedEventDate 
                  ? profileEvents.filter(e => e.date === selectedEventDate)
                  : profileEvents;
                  
                if (displayEvents.length === 0) {
                  return (
                    <div className="text-center py-16 px-4">
                      <Calendar className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                      <p className="text-neutral-600 font-medium">
                        {selectedEventDate ? t("events.noEventsOnDay") : t("events.noEvents")}
                      </p>
                      <p className="text-sm text-neutral-400 mt-1">
                        {selectedEventDate ? t("events.selectAnotherDay") : t("events.noEventsDesc")}
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div className="divide-y divide-neutral-100">
                    {displayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => {
                          setSelectedEvent(event);
                          setView("event-detail");
                        }}
                        className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Date Badge */}
                          <div className="flex-shrink-0 w-10 h-10 bg-teal-600 rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-[9px] font-medium leading-none opacity-80">
                              {new Date(event.date).toLocaleDateString("de-DE", { month: "short" }).toUpperCase()}
                            </span>
                            <span className="text-base font-bold leading-none">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title + Type */}
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-neutral-800 group-hover:text-teal-700 transition-colors truncate">
                                {event.title}
                              </h3>
                              <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                {getEventTypeLabel(event.type)}
                              </span>
                            </div>
                            
                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-neutral-500">
                              <span>
                                {event.isAllDay ? t("common.allDay") : `${event.startTime} - ${event.endTime}`}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[150px]">{event.location}</span>
                                </span>
                              )}
                            </div>
                            
                            {/* RSVP - Subtle */}
                            {event.rsvp && (
                              <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                                <span>{event.rsvp.confirmed}/{event.rsvp.total} {t("common.confirmed")}</span>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  event.rsvp.status === "confirmed" ? "bg-green-500" :
                                  event.rsvp.status === "declined" ? "bg-red-500" : "bg-amber-400"
                                }`} />
                              </div>
                            )}
                          </div>
                          
                          {/* Arrow */}
                          <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 flex-shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        
        {/* CALENDAR VIEW */}
        {calendarViewMode === "calendar" && (
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <h2 className="text-lg font-semibold text-neutral-800">
                {calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-neutral-200 rounded-lg overflow-hidden">
              {/* Weekday Headers */}
              {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(day => (
                <div key={day} className="bg-neutral-50 p-2 text-center text-sm font-medium text-neutral-600">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {getCalendarDays().map((day, i) => {
                const isToday = day.date.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={i}
                    className={`bg-white min-h-[80px] p-1.5 ${!day.isCurrentMonth ? "bg-neutral-50" : ""}`}
                  >
                    <p className={`text-sm font-medium mb-1 ${
                      !day.isCurrentMonth ? "text-neutral-400" :
                      isToday ? "w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto" :
                      "text-neutral-700 text-center"
                    }`}>
                      {day.date.getDate()}
                    </p>
                    <div className="space-y-0.5">
                      {day.events.slice(0, 2).map(event => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedEvent(event);
                            setView("event-detail");
                          }}
                          className="w-full text-left px-1 py-0.5 rounded text-xs truncate bg-teal-100 text-teal-800 hover:bg-teal-200"
                        >
                          {event.title}
                        </button>
                      ))}
                      {day.events.length > 2 && (
                        <p className="text-xs text-neutral-500 px-1">
                          +{day.events.length - 2}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER: EVENT DETAIL
  // ==========================================
  const renderEventDetail = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="p-6 space-y-6">
        <button 
          onClick={() => setView("calendar")}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t("memberPortal.backToCalendar")}</span>
        </button>

        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Banner Image */}
          {selectedEvent.bannerImage && (
            <div className="h-48 w-full overflow-hidden">
              <img 
                src={selectedEvent.bannerImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Header */}
          <div className={`p-6 border-b border-neutral-200 ${selectedEvent.bannerImage ? "-mt-12 relative z-10 bg-white mx-6 rounded-t-xl shadow-lg" : ""}`}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 flex items-center justify-center text-3xl">
                {selectedEvent.teamIcon || "📅"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                    {getEventTypeLabel(selectedEvent.type)}
                  </span>
                  {selectedEvent.isAllDay && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {t("common.allDay")}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">{selectedEvent.title}</h1>
                <p className="text-neutral-500 mt-1">{selectedEvent.team || selectedEvent.department || "Vereinsweit"}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">
                  {new Date(selectedEvent.date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}
                </p>
                <p className="text-sm text-neutral-500">
                  {selectedEvent.startTime} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}
                </p>
              </div>
            </div>

            {selectedEvent.location && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-neutral-400" />
                <p className="font-medium text-neutral-900">{selectedEvent.location}</p>
              </div>
            )}

            {selectedEvent.organizer && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-neutral-400" />
                <div className="flex items-center gap-2">
                  {selectedEvent.organizer.avatar && (
                    <img 
                      src={selectedEvent.organizer.avatar} 
                      alt={selectedEvent.organizer.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-neutral-900">{selectedEvent.organizer.name}</p>
                    {selectedEvent.organizer.role && (
                      <p className="text-xs text-neutral-500">{selectedEvent.organizer.role}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {selectedEvent.description && (
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-900 mb-2">Beschreibung</h3>
                <p className="text-neutral-600">{selectedEvent.description}</p>
              </div>
            )}

            {/* RSVP */}
            {selectedEvent.rsvp && selectedEvent.rsvp.required && (
              <div className="pt-4 border-t border-neutral-200">
                <h3 className="font-medium text-neutral-900 mb-3">Teilnahme</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-neutral-100 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-green-600">{selectedEvent.rsvp.confirmed}</p>
                    <p className="text-xs text-neutral-500">Zugesagt</p>
                  </div>
                  <div className="flex-1 bg-neutral-100 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-red-600">{selectedEvent.rsvp.declined}</p>
                    <p className="text-xs text-neutral-500">Abgesagt</p>
                  </div>
                  <div className="flex-1 bg-neutral-100 rounded-lg p-3 text-center">
                    <p className="text-lg font-bold text-amber-600">{selectedEvent.rsvp.pending}</p>
                    <p className="text-xs text-neutral-500">Ausstehend</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    selectedEvent.rsvp.status === "confirmed" 
                      ? "bg-green-600 text-white" 
                      : "bg-neutral-100 text-neutral-700 hover:bg-green-100"
                  }`}>
                    <Check className="w-4 h-4 inline mr-2" />
                    Zusagen
                  </button>
                  <button className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                    selectedEvent.rsvp.status === "declined" 
                      ? "bg-red-600 text-white" 
                      : "bg-neutral-100 text-neutral-700 hover:bg-red-100"
                  }`}>
                    <X className="w-4 h-4 inline mr-2" />
                    Absagen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER: CHATS VIEW
  // ==========================================
  const renderChats = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">{t("nav.chats")}</h1>
        <button 
          onClick={() => setView("new-request")}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Neue Anfrage
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Chats durchsuchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-neutral-100 rounded-xl">
        {[
          { id: "announcements", label: t("memberPortal.announcements") },
          { id: "team", label: t("memberPortal.teamChats") },
          { id: "direct", label: t("memberPortal.directMessages") },
          { id: "requests", label: t("memberPortal.requests") }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setChatTab(tab.id as typeof chatTab)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              chatTab === tab.id 
                ? "bg-white text-neutral-900 shadow-sm" 
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {chatTab === "requests" ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">{lang === "de" ? "Keine offenen Anfragen" : "No open requests"}</p>
            <p className="text-sm text-neutral-400 mt-1">Erstelle eine neue Anfrage an den Verein</p>
            <button 
              onClick={() => setView("new-request")}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              Neue Anfrage erstellen
            </button>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-600 font-medium">Keine Chats gefunden</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setView("chat-detail");
                }}
                className="w-full p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left"
              >
                {getChatAvatar(chat) ? (
                  <img 
                    src={getChatAvatar(chat)} 
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                    <span className="text-white text-lg">{chat.name[0]}</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-neutral-900 truncate">{chat.name}</p>
                    {chat.lastMessage && (
                      <span className="text-xs text-neutral-400">
                        {formatMessageTime(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-neutral-500 truncate mt-0.5">
                      {chat.lastMessage.content}
                    </p>
                  )}
                </div>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // ==========================================
  // RENDER: CHAT DETAIL
  // ==========================================
  const renderChatDetail = () => {
    if (!selectedChat) return null;
    
    const messages = getChatMessages(selectedChat.id);
    const isAnnouncement = selectedChat.type === "announcement";
    
    return (
      <div className="h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 bg-white flex items-center gap-4">
          <button 
            onClick={() => {
              setSelectedChat(null);
              setView("chats");
            }}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          {getChatAvatar(selectedChat) ? (
            <img 
              src={getChatAvatar(selectedChat)} 
              alt={selectedChat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white">{selectedChat.name[0]}</span>
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-neutral-900">{selectedChat.name}</p>
            <p className="text-sm text-neutral-500">
              {selectedChat.participants.length} Teilnehmer
            </p>
          </div>
          {isAnnouncement && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
              Nur-Lese-Kanal
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50">
          {messages.map((msg) => {
            const isSent = msg.senderId === profile.id;
            return (
              <div key={msg.id} className={`flex ${isSent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] ${isSent ? "" : "flex gap-2"}`}>
                  {!isSent && msg.senderAvatar && (
                    <img 
                      src={msg.senderAvatar} 
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full flex-shrink-0"
                    />
                  )}
                  <div>
                    {!isSent && (
                      <p className="text-xs text-neutral-500 mb-1 ml-1">{msg.senderName}</p>
                    )}
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      isSent 
                        ? "bg-teal-600 text-white rounded-br-md" 
                        : "bg-white border border-neutral-200 rounded-bl-md"
                    }`}>
                      <p className={isSent ? "text-white" : "text-neutral-900"}>{msg.content}</p>
                    </div>
                    <p className={`text-xs text-neutral-400 mt-1 ${isSent ? "text-right" : "ml-1"}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        {!isAnnouncement && (
          <div className="p-4 border-t border-neutral-200 bg-white">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-neutral-500" />
              </button>
              <input
                type="text"
                placeholder="Nachricht schreiben..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-neutral-100 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500"
              />
              <button 
                className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
                disabled={!replyText.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER: NEW REQUEST
  // ==========================================
  const renderNewRequest = () => {
    // Filter forms available to members (not report)
    const memberForms = mockTicketForms.filter(f => f.category !== "report");
    
    if (!selectedForm) {
      return (
        <div className="p-6 space-y-6">
          <button 
            onClick={() => setView("chats")}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück</span>
          </button>

          <h1 className="text-2xl font-bold text-neutral-900">Neue Anfrage</h1>
          <p className="text-neutral-500">Wähle eine Kategorie für deine Anfrage</p>

          <div className="grid grid-cols-2 gap-4">
            {memberForms.map((form) => (
              <button
                key={form.id}
                onClick={() => setSelectedForm(form)}
                className="bg-white rounded-xl border border-neutral-200 p-6 text-left hover:border-teal-300 hover:bg-teal-50/30 transition-colors"
              >
                <span className="text-3xl mb-3 block">{form.icon || "📝"}</span>
                <p className="font-medium text-neutral-900">{form.name}</p>
                <p className="text-sm text-neutral-500 mt-1">{form.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <button 
          onClick={() => setSelectedForm(null)}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Zurück zur Auswahl</span>
        </button>

        <div>
          <span className="text-3xl">{selectedForm.icon || "📝"}</span>
          <h1 className="text-2xl font-bold text-neutral-900 mt-2">{selectedForm.name}</h1>
          <p className="text-neutral-500">{selectedForm.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
          {selectedForm.fields.map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500 resize-none"
                  rows={4}
                />
              ) : field.type === "select" ? (
                <select className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500 bg-white">
                  <option value="">Bitte wählen...</option>
                  {field.options?.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-teal-500"
                />
              )}
            </div>
          ))}

          <div className="pt-4">
            <button className="w-full py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors">
              Anfrage absenden
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // RENDER: NEWS VIEW
  // ==========================================
  const renderNews = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Club News</h1>

      <div className="space-y-4">
        {MOCK_CLUB_NEWS.map((news) => (
          <div key={news.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {news.image && (
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                  {news.department}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(news.date).toLocaleDateString("de-DE")}
                </span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900">{news.title}</h2>
              <p className="text-neutral-600 mt-2">{news.excerpt}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-sm text-neutral-500 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {news.views}
                </span>
                <span className="text-sm text-neutral-500 flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  {news.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ==========================================
  // RENDER: PROFILE VIEW
  // ==========================================
  const renderProfile = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Mein Profil</h1>

      {/* Profile Header */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <div className="flex items-center gap-6">
          <img 
            src={profile.avatar} 
            alt={profile.firstName}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-neutral-500">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                Aktives Mitglied
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Memberships */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-900">Mitgliedschaften</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {profile.memberships.map((membership, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              <span className="text-2xl">{membership.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{membership.teamName || membership.departmentName}</p>
                <p className="text-sm text-neutral-500">{membership.departmentName}</p>
                {membership.coachName && (
                  <div className="flex items-center gap-2 mt-2">
                    {membership.coachAvatar && (
                      <img 
                        src={membership.coachAvatar} 
                        alt={membership.coachName}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span className="text-xs text-neutral-400">{membership.coachName}</span>
                  </div>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                membership.role === "active" ? "bg-teal-100 text-teal-700" : "bg-neutral-100 text-neutral-600"
              }`}>
                {membership.role === "active" ? "Aktiv" : "Passiv"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
          <CreditCard className="w-5 h-5 text-neutral-400" />
          <span className="font-medium text-neutral-900">Zahlungen</span>
        </button>
        <button className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
          <File className="w-5 h-5 text-neutral-400" />
          <span className="font-medium text-neutral-900">Dokumente</span>
        </button>
        <button className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors">
          <QrCode className="w-5 h-5 text-neutral-400" />
          <span className="font-medium text-neutral-900">Mitgliedsausweis</span>
        </button>
        <button 
          onClick={() => setView("settings")}
          className="bg-white rounded-xl border border-neutral-200 p-4 flex items-center gap-3 hover:bg-neutral-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-neutral-400" />
          <span className="font-medium text-neutral-900">Einstellungen</span>
        </button>
      </div>
    </div>
  );

  // ==========================================
  // RENDER: SETTINGS VIEW
  // ==========================================
  const { lang: currentLang, setLang } = useLanguage();
  
  const renderSettings = () => (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">{t("nav.settings")}</h1>

      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <div className="divide-y divide-neutral-100">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">{currentLang === "de" ? "Sprache" : "Language"}</p>
                <p className="text-sm text-neutral-500">{currentLang === "de" ? "Deutsch / English" : "German / English"}</p>
              </div>
            </div>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setLang("de")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentLang === "de" ? "bg-teal-600 text-white" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  currentLang === "en" ? "bg-teal-600 text-white" : "text-neutral-500 hover:bg-neutral-100"
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Benachrichtigungen</p>
                <p className="text-sm text-neutral-500">Push & E-Mail aktiviert</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Datenschutz</p>
                <p className="text-sm text-neutral-500">Privatsphäre-Einstellungen</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">Profil bearbeiten</p>
                <p className="text-sm text-neutral-500">Kontaktdaten ändern</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </div>

      <button className="w-full p-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
        <LogOut className="w-5 h-5" />
        Abmelden
      </button>
    </div>
  );

  // ==========================================
  // MAIN RENDER
  // ==========================================
  const renderContent = () => {
    switch (view) {
      case "home":
        return renderHome();
      case "calendar":
        return renderCalendar();
      case "event-detail":
        return renderEventDetail();
      case "chats":
        return renderChats();
      case "chat-detail":
        return renderChatDetail();
      case "new-request":
        return renderNewRequest();
      case "news":
        return renderNews();
      case "profile":
        return renderProfile();
      case "settings":
        return renderSettings();
      default:
        return renderHome();
    }
  };

  // Handle profile switching
  const handleProfileSwitch = (newProfileKey: string) => {
    navigate(`/member/${newProfileKey}`);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <MemberSidebar 
        activeView={view}
        onNavigate={setView}
        profile={profile}
        unreadMessages={unreadMessages}
        currentProfileKey={profileKey}
        onProfileSwitch={handleProfileSwitch}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
