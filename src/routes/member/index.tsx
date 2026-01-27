/**
 * Member Portal Views
 * 
 * These components render inside AppLayout with the unified navigation.
 * The sidebar automatically shows member-specific menu items when on /member/* routes.
 */

import { useState } from "react";
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
  Bell
} from "lucide-react";
import { Card, Badge, Button } from "../../components/ui";
import { useLanguage } from "../../i18n";
import { useRole } from "../../contexts";

// ==========================================
// MOCK DATA FOR PATRICK
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
}

const MOCK_PATRICK_EVENTS: EnhancedEvent[] = [
  {
    id: "evt_p1",
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
    id: "evt_p2",
    title: "Vorstandssitzung",
    description: "Monatliche Vorstandssitzung. Tagesordnung: Jahresplanung 2026, Finanzbericht.",
    date: "2026-01-29",
    startTime: "18:00",
    endTime: "20:00",
    location: "Vereinsheim - Sitzungszimmer",
    type: "event",
    scope: "club",
    bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
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
    id: "evt_p3",
    title: "Freundschaftsspiel vs. TSV Holzkirchen",
    description: "Auswärtsspiel gegen TSV Holzkirchen. Treffpunkt: 14:00 am Vereinsheim.",
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
    id: "evt_p4",
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
    }
  }
];

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
  const { user } = useRole();
  const navigate = useNavigate();

  const upcomingEvents = MOCK_PATRICK_EVENTS.slice(0, 3);

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
      case "match": return "Spiel";
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
            src={user.avatar}
            alt={user.firstName}
            className="w-16 h-16 rounded-full border-2 border-white/30"
          />
          <div>
            <h1 className="text-2xl font-bold">Hallo, {user.firstName}!</h1>
            <p className="text-teal-100">Willkommen im Mitglieder-Portal</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <Calendar className="w-8 h-8 text-teal-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">{upcomingEvents.length}</p>
          <p className="text-sm text-neutral-500">Termine</p>
        </Card>
        <Card className="text-center">
          <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">3</p>
          <p className="text-sm text-neutral-500">Nachrichten</p>
        </Card>
        <Card className="text-center">
          <Shield className="w-8 h-8 text-violet-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-neutral-900">2</p>
          <p className="text-sm text-neutral-500">Teams</p>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Nächste Termine</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/member/calendar")}>
              Alle anzeigen
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
                  <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
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
export function MemberCalendar() {
  const [selectedDate] = useState<string | null>(null);
  
  const sortedEvents = [...MOCK_PATRICK_EVENTS].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const displayEvents = selectedDate 
    ? sortedEvents.filter(e => e.date === selectedDate)
    : sortedEvents;

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
      case "match": return "Spiel";
      case "event": return "Event";
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Termine</h1>
        <p className="text-neutral-500">{displayEvents.length} anstehende Termine</p>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {displayEvents.map((event) => (
          <Card key={event.id} hover className="overflow-hidden">
            {event.bannerImage && (
              <img 
                src={event.bannerImage} 
                alt={event.title}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-4">
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
                    {event.rsvp && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        event.rsvp.status === "confirmed" ? "bg-green-100 text-green-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {event.rsvp.status === "confirmed" ? "✓ Zugesagt" : "Ausstehend"}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-neutral-900">{event.title}</p>
                  {event.description && (
                    <p className="text-sm text-neutral-500 mt-1 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {event.startTime} {event.endTime && `- ${event.endTime}`}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    )}
                  </div>
                  {event.rsvp && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-neutral-500">
                        {event.rsvp.confirmed}/{event.rsvp.total} Zusagen
                      </span>
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-teal-500 rounded-full"
                          style={{ width: `${(event.rsvp.confirmed / event.rsvp.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// MEMBER CHATS (Placeholder)
// ==========================================
export function MemberChats() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Nachrichten</h1>
        <p className="text-neutral-500">Team-Chats und Direktnachrichten</p>
      </div>
      
      <Card className="p-12 text-center">
        <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <p className="text-neutral-500">Nachrichten-Funktionalität wird hier angezeigt</p>
        <p className="text-sm text-neutral-400 mt-2">
          Team-Ankündigungen, Gruppen-Chats und Direktnachrichten
        </p>
      </Card>
    </div>
  );
}

// ==========================================
// MEMBER NEWS
// ==========================================
export function MemberNews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Neuigkeiten</h1>
        <p className="text-neutral-500">Aktuelle Vereinsnachrichten</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Mein Profil</h1>
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
              <Badge variant="teal">Aktives Mitglied</Badge>
              <Badge variant="info">Admin</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Memberships */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">Meine Mitgliedschaften</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
              ⚽
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Männer Ü40</p>
              <p className="text-sm text-neutral-500">Fußball</p>
            </div>
            <Badge variant="teal">Spieler</Badge>
          </div>
          <div className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-900">Vereinsvorstand</p>
              <p className="text-sm text-neutral-500">Verein</p>
            </div>
            <Badge variant="info">Vorsitzender</Badge>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">Schnellzugriff</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <button className="w-full p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors text-left">
            <CreditCard className="w-5 h-5 text-neutral-400" />
            <span className="flex-1">Mitgliedsausweis</span>
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
  const { lang, setLang } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Einstellungen</h1>
      </div>

      {/* Language */}
      <Card padding="none">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">Sprache</h3>
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
          <h3 className="font-semibold text-neutral-900">Benachrichtigungen</h3>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-neutral-400" />
              <span>Push-Benachrichtigungen</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-teal-500" />
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-neutral-400" />
              <span>E-Mail-Benachrichtigungen</span>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-teal-500" />
          </div>
        </div>
      </Card>
    </div>
  );
}
