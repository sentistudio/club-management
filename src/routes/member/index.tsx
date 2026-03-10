/**
 * Member Portal Views
 * 
 * These components render inside AppLayout with the unified navigation.
 * The sidebar automatically shows member-specific menu items when on /member/* routes.
 */

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  MessageSquare,
  Heart,
  Eye,
  CreditCard,
  Shield,
  QrCode,
  Globe,
  Bell,
  ArrowLeft,
  Send,
  Megaphone,
  Users,
  User,
  Inbox,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Card, Badge, Button } from "../../components/ui";
import { useLanguage } from "../../i18n";
import { useRole } from "../../contexts";
import { mockChats, mockChatMessages, type Chat, type ChatMessage } from "../../data/mockChats";
import { mockClubEvents } from "../../data/mockClubEvents";
import { mockTickets } from "../../data/mockInbox";
import { getFieldById } from "../../data/mockFields";
import { ZoneGrid } from "../../components/fields/ZoneGrid";

// ==========================================
// MOCK DATA
// ==========================================
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
  fieldId?: string;
  bookingScope?: "full_field" | "zones";
  bookedZoneIds?: string[];
  rsvp?: {
    status: "confirmed" | "declined" | "pending" | "maybe";
    deadline?: string;
    required: boolean;
    confirmed: number;
    maybe: number;
    declined: number;
    pending: number;
    total: number;
  };
  organizer?: {
    name: string;
    avatar?: string;
    role?: string;
  };
}

const dft = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

const MOCK_PATRICK_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_p1",
    title: "Training Männer Ü40",
    description: "Wöchentliches Mannschaftstraining. Heute: Spieltaktik und Kondition.",
    date: dft(0),
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
      maybe: 1,
      declined: 2,
      pending: 1,
      total: 18
    },
    organizer: {
      name: "Klaus Werner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_p2",
    title: "Vorstandssitzung",
    description: "Monatliche Vorstandssitzung. Tagesordnung: Jahresplanung 2026, Finanzbericht.",
    date: dft(1),
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Sitzungszimmer",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    rsvp: {
      status: "maybe",
      required: true,
      confirmed: 5,
      maybe: 1,
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
    id: "evt_p3",
    title: "Freundschaftsspiel vs. TSV Holzkirchen",
    description: "Auswärtsspiel gegen TSV Holzkirchen. Treffpunkt: 14:00 am Vereinsheim.",
    date: dft(4),
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
      confirmed: 11,
      maybe: 2,
      declined: 3,
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
    id: "evt_p4",
    title: "Vereinsversammlung 2026",
    description: "Jährliche Mitgliederversammlung mit Berichten des Vorstands und Wahlen.",
    date: dft(15),
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
      maybe: 42,
      declined: 23,
      pending: 262,
      total: 394
    }
  }
];

// Lena's events
const MOCK_LENA_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_l1",
    title: "Fitness Training - Morgengruppe",
    description: "Reguläres Fitnesstraining mit Fokus auf Cardio und Kräftigung.",
    date: dft(0),
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
      confirmed: 11,
      maybe: 1,
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
    id: "evt_l2",
    title: "Frauen Ü40 Training",
    description: "Wöchentliches Mannschaftstraining mit Taktik- und Spielübungen.",
    date: dft(2),
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
      deadline: "2026-01-28",
      required: true,
      confirmed: 7,
      maybe: 2,
      declined: 3,
      pending: 4,
      total: 16
    },
    organizer: {
      name: "Bernd Weber",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
      role: "Trainer"
    }
  },
  {
    id: "evt_l3",
    title: "Freundschaftsspiel vs. TuS Mainberg",
    description: "Auswärtsspiel gegen TuS Mainberg. Treffpunkt 30 Minuten vor Spielbeginn.",
    date: dft(5),
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
      confirmed: 13,
      maybe: 1,
      declined: 1,
      pending: 1,
      total: 16
    }
  },
  {
    id: "evt_l4",
    title: "Vereinsversammlung 2026",
    description: "Jährliche Mitgliederversammlung mit Berichten des Vorstands und Wahlen.",
    date: dft(14),
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Großer Saal",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
    rsvp: {
      status: "maybe",
      deadline: "2026-02-10",
      required: false,
      confirmed: 67,
      maybe: 42,
      declined: 23,
      pending: 262,
      total: 394
    }
  }
];

const MOCK_FLURINA_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_f1", title: "Training Volleyball U16", date: dft(0),
    startTime: "17:30", endTime: "19:00", location: "Sporthalle SfB",
    type: "training", teamIcon: "🏐", scope: "team", department: "Volleyball",
    team: "Volleyball U16 Mädchen",
    rsvp: { status: "confirmed", required: true, confirmed: 10, maybe: 1, declined: 0, pending: 1, total: 12 },
    organizer: { name: "Trainerin Katja", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=50&h=50&fit=crop&crop=face", role: "Trainerin" }
  },
  {
    id: "evt_f2", title: "Training Volleyball U16", date: dft(2),
    startTime: "17:30", endTime: "19:00", location: "Sporthalle SfB",
    type: "training", teamIcon: "🏐", scope: "team", department: "Volleyball",
    team: "Volleyball U16 Mädchen",
    rsvp: { status: "confirmed", required: true, confirmed: 10, maybe: 0, declined: 1, pending: 1, total: 12 }
  },
  {
    id: "evt_f3", title: "Heimspiel U16 – SfB vs. VfL Marburg", date: dft(5),
    startTime: "11:00", endTime: "13:00", location: "Sporthalle SfB",
    type: "match", teamIcon: "🏐", scope: "team", department: "Volleyball",
    team: "Volleyball U16 Mädchen",
    bannerImage: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=400&fit=crop",
    rsvp: { status: "confirmed", required: true, confirmed: 11, maybe: 0, declined: 0, pending: 1, total: 12 }
  },
  {
    id: "evt_f4", title: "Training Volleyball U16", date: dft(7),
    startTime: "17:30", endTime: "19:00", location: "Sporthalle SfB",
    type: "training", teamIcon: "🏐", scope: "team", department: "Volleyball",
    team: "Volleyball U16 Mädchen",
    rsvp: { status: "pending", required: true, confirmed: 8, maybe: 1, declined: 0, pending: 3, total: 12 }
  },
  {
    id: "evt_f5", title: "Gießen Cup Turnier", date: dft(12),
    startTime: "09:00", endTime: "17:00", location: "Sportanlage Gießen",
    type: "match", teamIcon: "🏆", scope: "department", department: "Volleyball",
    team: "Volleyball U16 Mädchen",
    bannerImage: "https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800&h=400&fit=crop",
    rsvp: { status: "pending", required: true, confirmed: 7, maybe: 2, declined: 0, pending: 3, total: 12 }
  }
];

const MOCK_MAX_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_m1", title: "Training Fußball U12", date: dft(0),
    startTime: "16:00", endTime: "17:30", location: "Trainingsplatz A",
    type: "training", teamIcon: "⚽", scope: "team", department: "Fußball",
    team: "Fußball U12",
    rsvp: { status: "confirmed", required: true, confirmed: 14, maybe: 0, declined: 1, pending: 1, total: 16 },
    organizer: { name: "Trainer Marco", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face", role: "Trainer" }
  },
  {
    id: "evt_m2", title: "Training Fußball U12", date: dft(3),
    startTime: "16:00", endTime: "17:30", location: "Trainingsplatz A",
    type: "training", teamIcon: "⚽", scope: "team", department: "Fußball",
    team: "Fußball U12",
    rsvp: { status: "confirmed", required: true, confirmed: 13, maybe: 1, declined: 0, pending: 2, total: 16 }
  },
  {
    id: "evt_m3", title: "Ligaspiel U12 – SfB vs. FC Lahntal", date: dft(5),
    startTime: "10:30", endTime: "12:00", location: "Nebenplatz SfB",
    type: "match", teamIcon: "⚽", scope: "team", department: "Fußball",
    team: "Fußball U12",
    bannerImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
    rsvp: { status: "confirmed", required: true, confirmed: 14, maybe: 0, declined: 1, pending: 1, total: 16 }
  },
  {
    id: "evt_m4", title: "Training Fußball U12", date: dft(7),
    startTime: "16:00", endTime: "17:30", location: "Trainingsplatz A",
    type: "training", teamIcon: "⚽", scope: "team", department: "Fußball",
    team: "Fußball U12",
    rsvp: { status: "pending", required: true, confirmed: 10, maybe: 0, declined: 0, pending: 6, total: 16 }
  },
  {
    id: "evt_m5", title: "Osterturnier Wettenberg", date: dft(18),
    startTime: "09:00", endTime: "14:00", location: "Sportpark Wettenberg",
    type: "match", teamIcon: "🏆", scope: "department", department: "Fußball",
    team: "Fußball U12",
    bannerImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=400&fit=crop",
    rsvp: { status: "pending", required: true, confirmed: 8, maybe: 3, declined: 0, pending: 5, total: 16 }
  }
];

// Helper to get events based on resolved person id
const getUserEvents = (resolvedId: string): EnhancedEvent[] => {
  if (resolvedId === "lena_schneider") return MOCK_LENA_EVENTS;
  if (resolvedId === "flurina") return MOCK_FLURINA_EVENTS;
  if (resolvedId === "max") return MOCK_MAX_EVENTS;
  return MOCK_PATRICK_EVENTS;
};

// ── Chat helpers ─────────────────────────────────────────────────────────────

// Maps the app's user/child IDs → chat profile IDs used in mockChats
const PERSON_TO_PROFILE: Record<string, string> = {
  lena_schneider: "p11",
  flurina: "p12",
  max: "p13",
};

/** Returns chats visible to any of the resolved person IDs */
const getChatsForPersons = (resolvedIds: string[]): Chat[] => {
  const profileIds = resolvedIds.map(id => PERSON_TO_PROFILE[id]).filter(Boolean);
  if (profileIds.length === 0) return [];
  return mockChats.filter(chat =>
    chat.visibleToProfiles.some(pid => profileIds.includes(pid))
  );
};

/** Returns messages for a given chat id */
const getMessagesForChat = (chatId: string): ChatMessage[] =>
  mockChatMessages.filter(m => m.chatId === chatId);

// ── Club-event helpers ────────────────────────────────────────────────────────

const PERSON_DEPARTMENTS: Record<string, string[]> = {
  lena_schneider: ["dept_football", "dept_fitness"],
  flurina: ["dept_volleyball"],
  max: ["dept_football"],
  patrick_steuble: ["dept_football"],
};

const PERSONA_MEMBER_IDS: Record<string, string> = {
  patrick_steuble: "patrick_steuble",
  lena_schneider: "lena_schneider",
  flurina: "flurina_schneider",
  max: "max_schneider",
};

/** Returns published club-wide/department events relevant to the person list, as EnhancedEvent */
const getClubEventsForPersons = (resolvedIds: string[]): EnhancedEvent[] => {
  const depts = resolvedIds.flatMap(id => PERSON_DEPARTMENTS[id] ?? []);
  return mockClubEvents
    .filter(evt => evt.status === "published")
    .filter(evt => {
      if (evt.audience.mode === "all") return true;
      if (evt.audience.mode === "departments") {
        return evt.audience.departmentIds?.some(d => depts.includes(d)) ?? false;
      }
      if (evt.audience.mode === "manual") {
        const memberIds = resolvedIds.map(id => PERSONA_MEMBER_IDS[id] ?? id);
        return evt.audience.memberIds?.some(mid => memberIds.includes(mid)) ?? false;
      }
      return false;
    })
    .map(evt => ({
      id: evt.id,
      title: evt.title,
      description: evt.description,
      date: evt.date,
      startTime: evt.startTime,
      endTime: evt.endTime,
      location: evt.location,
      bannerImage: evt.bannerImage,
      type: "event" as const,
      scope: "club" as const,
      isAllDay: evt.isAllDay,
      fieldId: evt.fieldId,
      bookingScope: evt.bookingScope,
      bookedZoneIds: evt.bookedZoneIds,
      organizer: { name: evt.createdByName },
      rsvp: evt.rsvpStats
        ? {
            status: "pending" as const,
            deadline: evt.rsvpDeadline?.split("T")[0],
            required: evt.rsvpRequired,
            confirmed: evt.rsvpStats.confirmed,
            maybe: 0,
            declined: evt.rsvpStats.declined,
            pending: evt.rsvpStats.pending,
            total: evt.rsvpStats.invited,
          }
        : undefined,
    }));
};

// Helper to get user memberships
const getUserMemberships = (userId: string) => {
  if (userId === "lena_schneider") {
    return [
      { icon: "💪", name: "Fitness – Morgengruppe", department: "Fitness", role: "Aktiv" },
      { icon: "⚽", name: "Frauen Ü40", department: "Fußball", role: "Spielerin" }
    ];
  }
  return [
    { icon: "⚽", name: "Männer Ü40", department: "Fußball", role: "Spieler" },
    { icon: "🛡️", name: "Vereinsvorstand", department: "Verein", role: "Vorsitzender" }
  ];
};

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
    title: "Männer Ü40: Erfolgreicher Saisonstart",
    excerpt: "Mit 3 Siegen in 4 Spielen startet das Team erfolgreich in die Rückrunde.",
    date: "2026-01-15",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop",
    department: "Fußball",
    views: 189,
    likes: 67
  }
];

// ==========================================
// MEMBER HOME
// ==========================================
export function MemberHome() {
  const { user, selectedPersons } = useRole();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // Resolve person ids
  const resolvedIds = selectedPersons.map(p => p === "me" ? user.id : p);

  // Welcome banner: show first selected person
  const firstPerson = selectedPersons[0];
  const firstChild = user.linkedChildren?.find(c => c.id === firstPerson);
  const displayName = firstPerson === "me" ? user.firstName : (firstChild?.firstName ?? user.firstName);
  const displayAvatar = firstPerson === "me" ? user.avatar : (firstChild?.avatar ?? user.avatar);
  const displayTeam = firstPerson === "me" ? user.team : firstChild?.team;

  // Merge + sort events from all selected persons + club events, deduplicate by id
  const upcomingEvents = useMemo(() => {
    const seen = new Set<string>();
    const clubEvts = getClubEventsForPersons(resolvedIds);
    return [...resolvedIds.flatMap(id => getUserEvents(id)), ...clubEvts]
      .filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  }, [resolvedIds.join(",")]);

  // Real unread counts from chats
  const chats = useMemo(() => getChatsForPersons(resolvedIds), [resolvedIds.join(",")]);
  const totalUnread = chats.reduce((sum, c) => sum + c.unreadCount, 0);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training": return "bg-blue-100 text-blue-700";
      case "match": return "bg-amber-100 text-amber-700";
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

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <img
            src={displayAvatar}
            alt={displayName}
            className="w-16 h-16 rounded-full border-2 border-white/30 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{lang === "de" ? `Hallo, ${displayName}!` : `Hello, ${displayName}!`}</h1>
            <p className="text-teal-100">{displayTeam ?? (lang === "de" ? "Willkommen im Mitglieder-Portal" : "Welcome to the Member Portal")}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <Calendar className="w-8 h-8 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{upcomingEvents.length}</p>
          <p className="text-sm text-neutral-500">{t("nav.events")}</p>
        </Card>
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/member/chats")}>
          <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{totalUnread > 0 ? totalUnread : chats.length}</p>
          <p className="text-sm text-neutral-500">{totalUnread > 0 ? "Ungelesen" : t("nav.chats")}</p>
        </Card>
        <Card className="text-center">
          <Shield className="w-8 h-8 text-violet-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">2</p>
          <p className="text-sm text-neutral-500">{t("nav.teams")}</p>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">{t("memberPortal.upcomingEvents")}</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/member/calendar")}>
              {t("common.showAll")}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {upcomingEvents.map((event) => (
            <div 
              key={event.id}
              className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Date Badge */}
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="bg-teal-500 text-white rounded-t text-[10px] font-medium py-0.5">
                    {new Date(event.date).toLocaleDateString("de-DE", { month: "short" })}
                  </div>
                  <div className="bg-white border border-t-0 border-neutral-200 rounded-b py-1">
                    <p className="text-lg font-bold text-neutral-900">
                      {new Date(event.date).getDate()}
                    </p>
                  </div>
                </div>
                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.teamIcon} {getEventTypeLabel(event.type)}
                    </span>
                  </div>
                  <p className="font-medium text-neutral-900">{event.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {event.startTime}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                    {event.fieldId && (() => {
                      const field = getFieldById(event.fieldId!);
                      if (!field) return null;
                      const zoneLabel = event.bookingScope === "zones" && event.bookedZoneIds?.length
                        ? ` · Zone ${event.bookedZoneIds.map(zId => field.zones.find(z => z.id === zId)?.zoneNumber).filter(Boolean).join(", ")}`
                        : "";
                      return (
                        <span className="flex items-center gap-1 text-teal-600">
                          <MapPin className="w-3 h-3" />
                          {field.name}{zoneLabel}
                        </span>
                      );
                    })()}
                  </div>
                </div>
                {/* RSVP Status */}
                {event.rsvp && (
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.rsvp.status === "confirmed" ? "bg-green-100 text-green-700" :
                    event.rsvp.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-neutral-100 text-neutral-700"
                  }`}>
                    {event.rsvp.status === "confirmed" ? "Zugesagt" : "Ausstehend"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Chats */}
      {chats.length > 0 && (
        <Card padding="none">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Nachrichten</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate("/member/chats")}>
                Alle anzeigen
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {chats
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 3)
              .map(chat => {
                const typeIcon = chat.type === "announcement" ? "📢" : chat.type === "direct" ? "💬" : "👥";
                return (
                  <div
                    key={chat.id}
                    onClick={() => navigate("/member/chats")}
                    className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-lg flex-shrink-0">
                      {typeIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium truncate ${chat.unreadCount > 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                          {chat.name}
                        </p>
                        <span className="text-xs text-neutral-400 flex-shrink-0">
                          {new Date(chat.updatedAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 truncate mt-0.5">{chat.lastMessage?.content}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-1">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* Recent News */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Neuigkeiten</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/member/news")}>
              Alle anzeigen
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {MOCK_CLUB_NEWS.map((news) => (
            <div 
              key={news.id}
              className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors flex gap-4"
            >
              {news.image && (
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900">{news.title}</p>
                <p className="text-sm text-neutral-500 line-clamp-1">{news.excerpt}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-neutral-400">
                  <span>{news.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {news.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {news.likes}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// MEMBER CALENDAR
// ==========================================
type MemberViewMode = "list" | "calendar";
type EventTypeFilter = "all" | "training" | "match" | "event";

export function MemberCalendar() {
  const { user, selectedPersons } = useRole();
  const { t, lang, getWeekday, getMonth } = useLanguage();

  const resolvedIds = selectedPersons.map(p => p === "me" ? user.id : p);
  const displayName = selectedPersons.map(p => {
    if (p === "me") return user.firstName;
    return user.linkedChildren?.find(c => c.id === p)?.firstName ?? "";
  }).filter(Boolean).join(", ");

  // State
  const [viewMode, setViewMode] = useState<MemberViewMode>("list");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<EventTypeFilter>("all");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EnhancedEvent | null>(null);

  // Merge team events + club events, deduplicate by id
  const allEvents = useMemo(() => {
    const seen = new Set<string>();
    const clubEvts = getClubEventsForPersons(resolvedIds);
    return [...resolvedIds.flatMap(id => getUserEvents(id)), ...clubEvts]
      .filter(e => { if (seen.has(e.id)) return false; seen.add(e.id); return true; });
  }, [resolvedIds.join(",")]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let events = [...allEvents];

    // Type filter
    if (typeFilter !== "all") {
      events = events.filter(e => e.type === typeFilter);
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return events;
  }, [allEvents, typeFilter]);

  // Display events (filtered by selected date if applicable)
  const displayEvents = selectedDate 
    ? filteredEvents.filter(e => e.date === selectedDate)
    : filteredEvents;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "training": return "bg-blue-100 text-blue-700";
      case "match": return "bg-amber-100 text-amber-700";
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

  const getRsvpStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return lang === "de" ? "✓ Zugesagt" : "✓ Confirmed";
      case "declined": return lang === "de" ? "✗ Abgesagt" : "✗ Declined";
      case "maybe": return lang === "de" ? "? Vielleicht" : "? Maybe";
      case "pending": return lang === "de" ? "Ausstehend" : "Pending";
      default: return status;
    }
  };

  // Calendar helpers
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    
    const days: { date: Date; isCurrentMonth: boolean; events: EnhancedEvent[] }[] = [];
    
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const dayEvents = filteredEvents.filter(e => e.date === dateStr);
      days.push({ date, isCurrentMonth: true, events: dayEvents });
    }
    
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    return days;
  };

  // Event detail modal
  const renderEventDetail = () => {
    if (!selectedEvent) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Banner */}
          {selectedEvent.bannerImage && (
            <div className="relative h-48">
              <img 
                src={selectedEvent.bannerImage} 
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
          )}
          
          <div className="p-6">
            {/* Type Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(selectedEvent.type)}`}>
                {selectedEvent.teamIcon} {getEventTypeLabel(selectedEvent.type)}
              </span>
              {selectedEvent.rsvp && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedEvent.rsvp.status === "confirmed" ? "bg-green-100 text-green-700" :
                  selectedEvent.rsvp.status === "declined" ? "bg-red-100 text-red-700" :
                  selectedEvent.rsvp.status === "maybe" ? "bg-violet-100 text-violet-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                  {getRsvpStatusLabel(selectedEvent.rsvp.status)}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">{selectedEvent.title}</h2>
            
            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-neutral-600">
                <Calendar className="w-5 h-5 text-neutral-400" />
                <span>
                  {new Date(selectedEvent.date).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { 
                    weekday: "long", 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <Clock className="w-5 h-5 text-neutral-400" />
                <span>
                  {selectedEvent.isAllDay 
                    ? (lang === "de" ? "Ganztägig" : "All Day")
                    : `${selectedEvent.startTime} - ${selectedEvent.endTime}`
                  }
                </span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-neutral-600">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
              {selectedEvent.fieldId && (() => {
                const field = getFieldById(selectedEvent.fieldId);
                if (!field) return null;
                return (
                  <div className="flex items-start gap-3 text-neutral-600">
                    <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-700">{field.name}</p>
                      {field.isDivisibleInto6 && (
                        <div className="mt-1.5">
                          <ZoneGrid
                            zones={field.zones}
                            ownZones={selectedEvent.bookingScope === "zones" ? (selectedEvent.bookedZoneIds ?? []) : []}
                            fullField={selectedEvent.bookingScope === "full_field"}
                            readOnly
                            compact
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              {selectedEvent.team && (
                <div className="flex items-center gap-3 text-neutral-600">
                  <span className="w-5 h-5 text-center">{selectedEvent.teamIcon}</span>
                  <span>{selectedEvent.team}</span>
                </div>
              )}
            </div>
            
            {/* Description */}
            {selectedEvent.description && (
              <p className="text-neutral-600 mb-6">{selectedEvent.description}</p>
            )}
            
            {/* RSVP Section */}
            {selectedEvent.rsvp && (
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex items-center justify-between text-sm text-neutral-500 mb-3">
                  <span>{selectedEvent.rsvp.confirmed}/{selectedEvent.rsvp.total} {lang === "de" ? "Zusagen" : "Confirmed"}</span>
                  {selectedEvent.rsvp.deadline && (
                    <span>{lang === "de" ? "Frist:" : "Deadline:"} {new Date(selectedEvent.rsvp.deadline).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}</span>
                  )}
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${(selectedEvent.rsvp.confirmed / selectedEvent.rsvp.total) * 100}%` }}
                  />
                </div>
                
                {/* RSVP Actions */}
                {selectedEvent.rsvp.required && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                          selectedEvent.rsvp.status === "confirmed" 
                            ? "bg-green-600 text-white" 
                            : "bg-neutral-100 text-neutral-700 hover:bg-green-100"
                        }`}
                        onClick={() => setSelectedEvent(null)}
                      >
                        {lang === "de" ? "Zusagen" : "Confirm"}
                      </button>
                      <button 
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                          selectedEvent.rsvp.status === "maybe" 
                            ? "bg-violet-600 text-white" 
                            : "bg-neutral-100 text-neutral-700 hover:bg-violet-100"
                        }`}
                        onClick={() => setSelectedEvent(null)}
                      >
                        {lang === "de" ? "Vielleicht" : "Maybe"}
                      </button>
                      <button 
                        className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                          selectedEvent.rsvp.status === "declined" 
                            ? "bg-red-600 text-white" 
                            : "bg-neutral-100 text-neutral-700 hover:bg-red-100"
                        }`}
                        onClick={() => setSelectedEvent(null)}
                      >
                        {lang === "de" ? "Absagen" : "Decline"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t("nav.calendar")}</h1>
          <p className="text-neutral-500 mt-1">
            <span className="font-semibold text-neutral-800">{displayName}</span>
            {" · "}
            <span className="font-semibold text-neutral-800">{filteredEvents.length}</span> {lang === "de" ? "anstehende Termine" : "upcoming events"}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <Card className="!p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Type Filter */}
          <div className="flex gap-1">
            {(["all", "training", "match", "event"] as EventTypeFilter[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  typeFilter === type 
                    ? "bg-teal-500 text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {type === "all" ? (lang === "de" ? "Alle" : "All") : getEventTypeLabel(type)}
              </button>
            ))}
          </div>
          
          {/* View Toggle */}
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden sm:ml-auto">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-sm ${
                viewMode === "list" ? "bg-teal-500 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              {t("views.list")}
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 flex items-center gap-1.5 text-sm ${
                viewMode === "calendar" ? "bg-teal-500 text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {t("views.calendar")}
            </button>
          </div>
        </div>
      </Card>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          {/* Week Navigator */}
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
                  <ChevronRight className="w-4 h-4 text-neutral-500 rotate-180" />
                </button>
                <span className="text-sm font-medium text-neutral-700 min-w-[120px] text-center">
                  {calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}
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
                  onClick={() => { setCalendarMonth(new Date()); setSelectedDate(null); }}
                  className="ml-2 text-xs px-2 py-1 text-teal-600 hover:bg-teal-50 rounded"
                >
                  {t("common.today")}
                </button>
              </div>
              
              {selectedDate ? (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs px-2 py-1 bg-teal-500 text-white rounded flex items-center gap-1"
                >
                  {new Date(selectedDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                  <span className="ml-1">✕</span>
                </button>
              ) : (
                <span className="text-xs text-neutral-500">{displayEvents.length} {lang === "de" ? "Termine" : "events"}</span>
              )}
            </div>
            
            {/* Week Strip */}
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
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                return days.map((day, i) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isToday = day.toDateString() === today.toDateString();
                  const dayEvents = filteredEvents.filter(e => e.date === dateStr);
                  const hasEvents = dayEvents.length > 0;
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`flex-1 py-1.5 rounded text-center transition-all ${
                        isSelected 
                          ? "bg-teal-500 text-white" 
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
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
            {displayEvents.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Calendar className="w-12 h-12 text-neutral-200 mx-auto mb-3" />
                <h3 className="text-base font-medium text-neutral-600">
                  {selectedDate 
                    ? (lang === "de" ? "Keine Termine an diesem Tag" : "No events on this day")
                    : (lang === "de" ? "Keine Termine" : "No events")
                  }
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {selectedDate 
                    ? (lang === "de" ? "Wähle einen anderen Tag" : "Select another day")
                    : (lang === "de" ? "Alle Termine werden hier angezeigt" : "Your events will appear here")
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {displayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-11 h-11 bg-teal-500 rounded-lg flex flex-col items-center justify-center text-white">
                        <span className="text-[9px] font-medium leading-none opacity-80">
                          {getMonth(new Date(event.date)).toUpperCase()}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title + Type Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ${getEventTypeColor(event.type)}`}>
                              {event.teamIcon} {getEventTypeLabel(event.type)}
                            </span>
                            <h3 className="font-semibold text-neutral-800 group-hover:text-teal-600 transition-colors truncate">
                              {event.title}
                            </h3>
                          </div>
                          {/* RSVP Status */}
                          {event.rsvp && (
                            <span className={`flex-shrink-0 w-2 h-2 rounded-full ${
                              event.rsvp.status === "confirmed" ? "bg-green-500" :
                              event.rsvp.status === "declined" ? "bg-red-500" :
                              event.rsvp.status === "maybe" ? "bg-violet-500" :
                              "bg-amber-500"
                            }`} title={getRsvpStatusLabel(event.rsvp.status)} />
                          )}
                        </div>
                        
                        {/* Meta Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-neutral-500">
                          <span>
                            {event.isAllDay 
                              ? (lang === "de" ? "Ganztägig" : "All Day")
                              : `${event.startTime} - ${event.endTime}`
                            }
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[180px]">{event.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-neutral-500 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <Card>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600 rotate-180" />
              </button>
              <h2 className="text-lg font-semibold text-neutral-800 min-w-[180px] text-center">
                {calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                className="p-2 hover:bg-neutral-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
            <button
              onClick={() => setCalendarMonth(new Date())}
              className="text-sm px-3 py-1.5 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              {t("common.today")}
            </button>
          </div>
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {[lang === "de" ? "Mo" : "Mon", lang === "de" ? "Di" : "Tue", lang === "de" ? "Mi" : "Wed", lang === "de" ? "Do" : "Thu", lang === "de" ? "Fr" : "Fri", lang === "de" ? "Sa" : "Sat", lang === "de" ? "So" : "Sun"].map((day) => (
              <div key={day} className="text-center text-xs font-medium text-neutral-500 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getCalendarDays().map((day, idx) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const dateStr = day.date.toISOString().split("T")[0];
              const hasEvents = day.events.length > 0;
              
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`min-h-[80px] p-1 border rounded-lg cursor-pointer transition-colors ${
                    day.isCurrentMonth 
                      ? isToday 
                        ? "bg-teal-50 border-teal-200" 
                        : "bg-white border-neutral-200 hover:bg-neutral-50"
                      : "bg-neutral-50 border-neutral-100"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    day.isCurrentMonth 
                      ? isToday 
                        ? "text-teal-700" 
                        : "text-neutral-800"
                      : "text-neutral-400"
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {hasEvents && (
                    <div className="mt-1 space-y-0.5">
                      {day.events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                          className={`text-[10px] px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)} cursor-pointer`}
                        >
                          {event.teamIcon} {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <p className="text-[10px] text-neutral-400 pl-1">
                          +{day.events.length - 2} {lang === "de" ? "mehr" : "more"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Event Detail Modal */}
      {renderEventDetail()}
    </div>
  );
}

// ==========================================
// MEMBER CHATS
// ==========================================
type ChatsTab = "messages" | "requests";

export function MemberChats() {
  const { user, selectedPersons } = useRole();
  const { lang } = useLanguage();

  const resolvedIds = selectedPersons.map(p => p === "me" ? user.id : p);
  const allChats = useMemo(() => getChatsForPersons(resolvedIds), [resolvedIds.join(",")]);

  // My tickets (requests sent by this user)
  const myTickets = useMemo(() =>
    mockTickets.filter(t => t.requesterId === user.id || t.requesterId === "lena_schneider" && user.id === "lena_schneider"),
    [user.id]
  );

  const [activeTab, setActiveTab] = useState<ChatsTab>("messages");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const announcements = allChats.filter(c => c.type === "announcement");
  const groupChats = allChats.filter(c => c.type === "team_group");
  const directChats = allChats.filter(c => c.type === "direct");

  const totalUnread = allChats.reduce((s, c) => s + c.unreadCount, 0);
  const pendingRequests = myTickets.filter(t => t.status === "open" || t.status === "pending").length;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  const chatTypeIcon = (type: Chat["type"]) =>
    type === "announcement" ? <Megaphone className="w-4 h-4" /> :
    type === "direct" ? <User className="w-4 h-4" /> :
    <Users className="w-4 h-4" />;

  const chatBg = (type: Chat["type"]) =>
    type === "announcement" ? "from-amber-400 to-amber-600" :
    type === "direct" ? "from-violet-400 to-violet-600" :
    "from-teal-400 to-teal-600";

  // ── Chat thread view ──────────────────────────────────────────────────────
  if (selectedChat) {
    const messages = getMessagesForChat(selectedChat.id);
    return (
      <div className="flex flex-col h-full" style={{ minHeight: "calc(100vh - 8rem)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setSelectedChat(null)}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-neutral-900 truncate">{selectedChat.name}</p>
            {selectedChat.description && (
              <p className="text-xs text-neutral-500 truncate">{selectedChat.description}</p>
            )}
          </div>
          {selectedChat.settings.parentVisibility && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Eltern sehen mit</span>
          )}
        </div>

        {/* Messages */}
        <Card padding="none" className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <MessageSquare className="w-10 h-10 mb-2" />
              <p className="text-sm">Noch keine Nachrichten</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {messages.map(msg => {
                const isMine = msg.senderId === PERSON_TO_PROFILE[user.id] || msg.senderId === "p11" && user.id === "lena_schneider";
                return (
                  <div key={msg.id} className={`flex gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
                    {msg.senderAvatar ? (
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {msg.senderName[0]}
                      </div>
                    )}
                    <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                      {!isMine && (
                        <span className="text-xs text-neutral-500">{msg.senderName}</span>
                      )}
                      {msg.onBehalfOf && (
                        <span className="text-[10px] text-violet-600">Im Namen von {msg.onBehalfOf.childName}</span>
                      )}
                      <div className={`px-3 py-2 rounded-2xl text-sm ${
                        isMine ? "bg-teal-500 text-white rounded-tr-sm" : "bg-neutral-100 text-neutral-900 rounded-tl-sm"
                      }`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-neutral-400">{formatTime(msg.createdAt)}</span>
                        {msg.reactions && Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span key={emoji} className="text-xs bg-neutral-100 px-1.5 py-0.5 rounded-full">
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Input */}
        {selectedChat.settings.repliesEnabled ? (
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder={lang === "de" ? "Nachricht schreiben…" : "Write a message…"}
              className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              readOnly
            />
            <button className="p-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-colors">
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="mt-3 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-400 text-center">
            {lang === "de" ? "Nur Reaktionen möglich" : "Reactions only"}
          </div>
        )}
      </div>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  const renderChatRow = (chat: Chat) => (
    <button
      key={chat.id}
      onClick={() => setSelectedChat(chat)}
      className="w-full flex items-start gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors text-left"
    >
      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${chatBg(chat.type)} flex items-center justify-center text-white flex-shrink-0`}>
        {chatTypeIcon(chat.type)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-sm truncate ${chat.unreadCount > 0 ? "font-semibold text-neutral-900" : "font-medium text-neutral-700"}`}>
            {chat.name}
          </p>
          <span className="text-[11px] text-neutral-400 flex-shrink-0">
            {formatTime(chat.updatedAt)}
          </span>
        </div>
        {chat.teamName && (
          <p className="text-xs text-neutral-400 mb-0.5">{chat.teamName}</p>
        )}
        <p className="text-sm text-neutral-500 truncate">
          {chat.lastMessage?.content ?? "–"}
        </p>
      </div>
      {chat.unreadCount > 0 && (
        <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-1">
          {chat.unreadCount}
        </span>
      )}
    </button>
  );

  const renderSection = (title: string, icon: React.ReactNode, chats: Chat[]) => {
    if (chats.length === 0) return null;
    return (
      <div>
        <div className="flex items-center gap-2 px-1 mb-1">
          <span className="text-neutral-400">{icon}</span>
          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
        </div>
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {chats.map(renderChatRow)}
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Nachrichten</h1>
        <p className="text-neutral-500 mt-0.5">
          {totalUnread > 0 ? `${totalUnread} ungelesene Nachrichten` : "Alle Nachrichten gelesen"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("messages")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "messages" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Chats
          {totalUnread > 0 && (
            <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "requests" ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          <Inbox className="w-4 h-4" />
          Anfragen
          {pendingRequests > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
              {pendingRequests}
            </span>
          )}
        </button>
      </div>

      {/* Messages tab */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {allChats.length === 0 ? (
            <Card className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-500">Keine Chats vorhanden</p>
              <p className="text-sm text-neutral-400 mt-1">Wähle eine andere Person aus</p>
            </Card>
          ) : (
            <>
              {renderSection("Ankündigungen", <Megaphone className="w-3.5 h-3.5" />, announcements)}
              {renderSection("Gruppen-Chats", <Users className="w-3.5 h-3.5" />, groupChats)}
              {renderSection("Direktnachrichten", <User className="w-3.5 h-3.5" />, directChats)}
            </>
          )}
        </div>
      )}

      {/* Requests tab */}
      {activeTab === "requests" && (
        <div className="space-y-3">
          {myTickets.length === 0 ? (
            <Card className="text-center py-12">
              <Inbox className="w-10 h-10 text-neutral-200 mx-auto mb-3" />
              <p className="text-neutral-500">Keine Anfragen vorhanden</p>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden divide-y divide-neutral-100">
              {myTickets.map(ticket => (
                <div key={ticket.id} className="px-4 py-3.5 flex items-start gap-3 hover:bg-neutral-50 transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    ticket.status === "open" ? "bg-amber-400" :
                    ticket.status === "pending" ? "bg-blue-400" :
                    ticket.status === "resolved" ? "bg-green-400" : "bg-neutral-300"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900 truncate">{ticket.subject}</p>
                      <span className="text-[11px] text-neutral-400 flex-shrink-0">
                        {new Date(ticket.createdAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>
                    {ticket.isOnBehalf && (
                      <p className="text-xs text-violet-600 mt-0.5">Im Namen von {ticket.onBehalfOfName}</p>
                    )}
                    <p className="text-sm text-neutral-500 truncate mt-0.5">{ticket.previewText}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                        ticket.status === "open" ? "bg-amber-100 text-amber-700" :
                        ticket.status === "pending" ? "bg-blue-100 text-blue-700" :
                        ticket.status === "resolved" ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-600"
                      }`}>
                        {ticket.status === "open" && <AlertCircle className="w-3 h-3" />}
                        {ticket.status === "pending" && <Clock className="w-3 h-3" />}
                        {ticket.status === "resolved" && <CheckCircle className="w-3 h-3" />}
                        {ticket.status === "open" ? "Offen" :
                          ticket.status === "pending" ? "In Bearbeitung" :
                          ticket.status === "resolved" ? "Erledigt" : ticket.status}
                      </span>
                      {ticket.unreadCount > 0 && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                          {ticket.unreadCount} neu
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// MEMBER NEWS
// ==========================================
export function MemberNews() {
  const { t, lang } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t("nav.news")}</h1>
        <p className="text-neutral-500">{lang === "de" ? "Aktuelle Vereinsnachrichten" : "Latest club news"}</p>
      </div>

      <div className="grid gap-4">
        {MOCK_CLUB_NEWS.map((news) => (
          <Card key={news.id} hover className="overflow-hidden">
            {news.image && (
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <Badge variant="neutral" size="sm">{news.department}</Badge>
              <h3 className="font-semibold text-neutral-900 mt-2">{news.title}</h3>
              <p className="text-neutral-500 mt-1">{news.excerpt}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-neutral-400">
                <span>{news.date}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> {news.views}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" /> {news.likes}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MEMBER PROFILE
// ==========================================
export function MemberProfile() {
  const { user } = useRole();
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t("nav.profile")}</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex items-center gap-6">
          <img 
            src={user.avatar}
            alt={user.firstName}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-neutral-500">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="teal">{lang === "de" ? "Aktives Mitglied" : "Active Member"}</Badge>
              {user.roles.includes("admin") && <Badge variant="info">Admin</Badge>}
            </div>
          </div>
        </div>
      </Card>

      {/* Memberships */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">{lang === "de" ? "Meine Mitgliedschaften" : "My Memberships"}</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          {getUserMemberships(user.id).map((membership, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
                {membership.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{membership.name}</p>
                <p className="text-sm text-neutral-500">{membership.department}</p>
              </div>
              <Badge variant="teal">{membership.role}</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">{t("memberPortal.quickActions")}</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left">
            <CreditCard className="w-5 h-5 text-neutral-400" />
            <span className="flex-1">{t("memberPortal.memberCard")}</span>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>
          <button className="w-full p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left">
            <QrCode className="w-5 h-5 text-neutral-400" />
            <span className="flex-1">QR-Code</span>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ==========================================
// MEMBER SETTINGS
// ==========================================
export function MemberSettings() {
  const { t, lang, setLang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{t("nav.settings")}</h1>
      </div>

      {/* Language */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">{lang === "de" ? "Sprache" : "Language"}</h3>
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            <button
              onClick={() => setLang("de")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-colors ${
                lang === "de" 
                  ? "border-teal-500 bg-teal-50 text-teal-700" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <Globe className="w-5 h-5 mx-auto mb-1" />
              <span className="font-medium">Deutsch</span>
            </button>
            <button
              onClick={() => setLang("en")}
              className={`flex-1 py-3 px-4 rounded-lg border-2 text-center transition-colors ${
                lang === "en" 
                  ? "border-teal-500 bg-teal-50 text-teal-700" 
                  : "border-neutral-200 hover:border-neutral-300"
              }`}
            >
              <Globe className="w-5 h-5 mx-auto mb-1" />
              <span className="font-medium">English</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">{lang === "de" ? "Benachrichtigungen" : "Notifications"}</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-400" />
              <span>{lang === "de" ? "Push-Benachrichtigungen" : "Push Notifications"}</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-teal-500" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-neutral-400" />
              <span>{lang === "de" ? "E-Mail-Benachrichtigungen" : "Email Notifications"}</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-teal-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}
