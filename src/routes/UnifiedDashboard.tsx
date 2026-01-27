/**
 * UnifiedDashboard - Demo: Role-Based Sections Approach
 * 
 * This dashboard shows both admin and member content in a single view,
 * clearly separated by sections. Perfect for users who are both admins
 * and active members (like Patrick who plays in Männer Ü40 team).
 */

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Clock, 
  TrendingUp,
  Calendar,
  ChevronRight,
  Shield,
  Trophy,
  Bell,
  Inbox,
  CheckCircle,
  AlertCircle,
  MapPin,
  MessageSquare,
  User,
  FileText
} from "lucide-react";
import { Card, Badge, Button } from "../components/ui";
import { mockClubMemberships } from "../data/mockMemberships";
import { mockBookings } from "../data/mockBookings";
import { mockTeams } from "../data/mockTeams";
import { mockPlayerPasses } from "../data/mockDfbnet";
import { mockTickets, CURRENT_STAFF_ID } from "../data/mockInbox";
import { mockClubEvents } from "../data/mockClubEvents";
import { useLanguage } from "../i18n";
import { useRole } from "../contexts";

// Patrick's personal data for member section
const PATRICK_MEMBER_DATA = {
  teams: [
    { name: "Männer Ü40", department: "Fußball", icon: "⚽", role: "Spieler" },
    { name: "Vorstand", department: "Verein", icon: "🛡️", role: "Vorsitzender" }
  ],
  upcomingEvents: [
    {
      id: "pe1",
      title: "Training Männer Ü40",
      date: "2026-01-28",
      time: "19:30 - 21:00",
      location: "Sportplatz Burkhardsfelden",
      type: "training" as const,
      status: "confirmed" as const,
      icon: "⚽"
    },
    {
      id: "pe2",
      title: "Vorstandssitzung",
      date: "2026-01-29",
      time: "18:00 - 20:00",
      location: "Vereinsheim",
      type: "meeting" as const,
      status: "confirmed" as const,
      icon: "🛡️"
    },
    {
      id: "pe3",
      title: "Freundschaftsspiel vs. TSV Holzkirchen",
      date: "2026-02-01",
      time: "15:00",
      location: "Sportplatz Holzkirchen",
      type: "match" as const,
      status: "pending" as const,
      icon: "⚽"
    }
  ],
  unreadMessages: 3,
  openInvoices: 0
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  onClick?: () => void;
}

function StatCard({ title, value, icon, trend, onClick }: StatCardProps) {
  return (
    <Card 
      hover={!!onClick}
      onClick={onClick}
      className="relative"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.isUp ? "text-green-600" : "text-red-600"}`}>
              {trend.isUp ? "↑" : "↓"} {trend.value}% vs. Vormonat
            </p>
          )}
        </div>
        <div className="p-3 bg-teal-50 rounded-xl">
          <span className="text-teal-600">{icon}</span>
        </div>
      </div>
    </Card>
  );
}

export function UnifiedDashboard() {
  const navigate = useNavigate();
  useLanguage(); // For potential future translations
  const { user } = useRole();
  const [expandedSection, setExpandedSection] = useState<"member" | "admin" | "both">("both");

  // Admin stats
  const adminStats = useMemo(() => {
    const totalMembers = mockClubMemberships.length;
    const openBookings = mockBookings.filter(b => b.status === "open" && b.amount > 0);
    const openSum = openBookings.reduce((sum, b) => sum + b.amount, 0);
    const activeTeams = mockTeams.filter(t => t.isActive).length;
    const activePasses = mockPlayerPasses.filter(p => p.status === "active").length;

    return { totalMembers, openSum, activeTeams, activePasses };
  }, []);

  // My open tickets (admin function)
  const myOpenTickets = useMemo(() => {
    return mockTickets.filter(
      t => t.assignedToId === CURRENT_STAFF_ID && (t.status === "open" || t.status === "pending")
    );
  }, []);

  // Upcoming club events (for both views)
  const upcomingClubEvents = useMemo(() => {
    const today = new Date();
    return mockClubEvents
      .filter(e => new Date(`${e.date}T${e.startTime}`) > today && e.status !== "cancelled")
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
      .slice(0, 3);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700";
      case "pending": return "bg-amber-100 text-amber-700";
      case "declined": return "bg-red-100 text-red-700";
      default: return "bg-neutral-100 text-neutral-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Zugesagt";
      case "pending": return "Ausstehend";
      case "declined": return "Abgesagt";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Context */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-violet-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <img 
            src={user.avatar}
            alt={user.firstName}
            className="w-16 h-16 rounded-full border-2 border-white/30"
          />
          <div>
            <h1 className="text-2xl font-bold">Hallo, {user.firstName}!</h1>
            <p className="text-white/80 mt-1">
              Deine kombinierte Übersicht als {user.roles.map(r => r === "admin" ? "Administrator" : "Mitglied").join(" & ")}
            </p>
          </div>
        </div>
        
        {/* Quick Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setExpandedSection("both")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              expandedSection === "both" 
                ? "bg-white text-teal-700" 
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            Beide Ansichten
          </button>
          <button
            onClick={() => setExpandedSection("member")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              expandedSection === "member" 
                ? "bg-white text-violet-700" 
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            👤 Meine Übersicht
          </button>
          <button
            onClick={() => setExpandedSection("admin")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              expandedSection === "admin" 
                ? "bg-white text-teal-700" 
                : "bg-white/20 hover:bg-white/30"
            }`}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* MEMBER SECTION */}
      {(expandedSection === "both" || expandedSection === "member") && (
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <User className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Meine Übersicht</h2>
              <p className="text-sm text-neutral-500">Deine persönlichen Termine, Teams & Nachrichten</p>
            </div>
          </div>

          {/* Member Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-violet-50 to-violet-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-violet-700">{PATRICK_MEMBER_DATA.upcomingEvents.length}</p>
                  <p className="text-sm text-violet-600">Nächste Termine</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{PATRICK_MEMBER_DATA.unreadMessages}</p>
                  <p className="text-sm text-blue-600">Ungelesene Nachrichten</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">{PATRICK_MEMBER_DATA.teams.length}</p>
                  <p className="text-sm text-emerald-600">Meine Teams</p>
                </div>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 rounded-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-700">{PATRICK_MEMBER_DATA.openInvoices}</p>
                  <p className="text-sm text-amber-600">Offene Rechnungen</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Upcoming Events */}
            <Card padding="none">
              <div className="p-5 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-violet-500" />
                    <h3 className="font-semibold text-neutral-900">Meine nächsten Termine</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/member")}>
                    Kalender
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-neutral-100">
                {PATRICK_MEMBER_DATA.upcomingEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 text-center">
                        <div className="bg-violet-500 text-white rounded-t text-[10px] font-medium py-0.5">
                          {new Date(event.date).toLocaleDateString("de-DE", { month: "short" })}
                        </div>
                        <div className="bg-white border border-t-0 border-neutral-200 rounded-b py-1">
                          <p className="text-lg font-bold text-neutral-900">
                            {new Date(event.date).getDate()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{event.icon}</span>
                          <p className="text-sm font-medium text-neutral-900 truncate">{event.title}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* My Teams */}
            <Card padding="none">
              <div className="p-5 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-violet-500" />
                    <h3 className="font-semibold text-neutral-900">Meine Teams & Gruppen</h3>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-neutral-100">
                {PATRICK_MEMBER_DATA.teams.map((team, idx) => (
                  <div 
                    key={idx}
                    className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-2xl">
                        {team.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900">{team.name}</p>
                        <p className="text-sm text-neutral-500">{team.department}</p>
                      </div>
                      <Badge variant="teal" size="sm">{team.role}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Divider between sections */}
      {expandedSection === "both" && (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-neutral-50 px-4 text-sm text-neutral-500">
              Admin-Bereich
            </span>
          </div>
        </div>
      )}

      {/* ADMIN SECTION */}
      {(expandedSection === "both" || expandedSection === "admin") && (
        <div className="space-y-4">
          {/* Section Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Admin-Übersicht</h2>
              <p className="text-sm text-neutral-500">Vereinsverwaltung & Administratorfunktionen</p>
            </div>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Mitglieder"
              value={adminStats.totalMembers}
              icon={<Users className="w-6 h-6" />}
              trend={{ value: 8, isUp: true }}
              onClick={() => navigate("/members")}
            />
            <StatCard
              title="Aktive Teams"
              value={adminStats.activeTeams}
              icon={<Shield className="w-6 h-6" />}
              onClick={() => navigate("/teams")}
            />
            <StatCard
              title="Offene Beiträge"
              value={formatCurrency(adminStats.openSum)}
              icon={<Clock className="w-6 h-6" />}
              onClick={() => navigate("/finance")}
            />
            <StatCard
              title="Spielerpässe"
              value={adminStats.activePasses}
              icon={<TrendingUp className="w-6 h-6" />}
              onClick={() => navigate("/player-passes")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Open Tickets */}
            <Card padding="none">
              <div className="p-5 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-teal-500" />
                    <h3 className="font-semibold text-neutral-900">Offene Tickets</h3>
                    {myOpenTickets.length > 0 && (
                      <Badge variant="teal" size="sm">{myOpenTickets.length}</Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/inbox")}>
                    Posteingang
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              {myOpenTickets.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p>Keine offenen Tickets</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-100">
                  {myOpenTickets.slice(0, 4).map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => navigate("/inbox")}
                      className="w-full p-4 text-left hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          ticket.status === "open" ? "bg-blue-100" : "bg-amber-100"
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${
                            ticket.status === "open" ? "text-blue-600" : "text-amber-600"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-neutral-500">{ticket.requesterName}</p>
                          <Badge 
                            variant={ticket.status === "open" ? "info" : "warning"} 
                            size="sm"
                            className="mt-1"
                          >
                            {ticket.status === "open" ? "Offen" : "In Bearbeitung"}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Upcoming Club Events */}
            <Card padding="none">
              <div className="p-5 border-b border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-500" />
                    <h3 className="font-semibold text-neutral-900">Vereinstermine</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
                    Alle Termine
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-neutral-100">
                {upcomingClubEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => navigate("/events")}
                  >
                    <div className="flex items-start gap-3">
                      {event.bannerImage ? (
                        <img 
                          src={event.bannerImage} 
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-6 h-6 text-teal-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                          <span>{formatDate(event.date)}</span>
                          <span>·</span>
                          <span>{event.startTime}</span>
                          {event.location && (
                            <>
                              <span>·</span>
                              <span className="truncate">{event.location}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={event.status === "published" ? "success" : "neutral"} 
                            size="sm"
                          >
                            {event.status === "published" ? "Veröffentlicht" : "Entwurf"}
                          </Badge>
                          {event.audience.mode !== "all" && (
                            <Badge variant="info" size="sm">
                              {event.audience.mode === "departments" ? "Abteilung" : "Gruppe"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <Card className="bg-gradient-to-r from-neutral-50 to-neutral-100 border-neutral-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Bell className="w-6 h-6 text-neutral-400" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-800">Demo: Unified Dashboard</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Diese Ansicht kombiniert Admin- und Mitglieder-Funktionen in einem Dashboard. 
              Ideal für Vereinsvorstände, die selbst aktiv am Vereinsleben teilnehmen.
            </p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
                Standard-Dashboard
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/member")}>
                Mitglieder-Portal
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
