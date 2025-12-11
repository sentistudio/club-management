import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Clock, 
  TrendingUp,
  Calendar,
  IdCard,
  ChevronRight,
  Shield,
  Trophy,
  FileText,
  Bell,
  Inbox,
  CheckCircle,
  AlertCircle,
  X,
  Check
} from "lucide-react";
import { Card, CardHeader, Badge, Button } from "../components/ui";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import { mockBookings } from "../data/mockBookings";
import { mockTeams } from "../data/mockTeams";
import { 
  mockMatches, 
  mockEvents, 
  mockPlayerPasses
} from "../data/mockDfbnet";
import { mockNotifications, mockTickets, CURRENT_STAFF_ID } from "../data/mockInbox";
import type { Notification } from "../data/mockInbox";

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

export function Dashboard() {
  const navigate = useNavigate();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowNotificationsModal(false);
      }
    }
    if (showNotificationsModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotificationsModal]);

  const stats = useMemo(() => {
    const totalMembers = mockClubMemberships.length;
    const activeMembers = mockClubMemberships.filter(m => m.status === "active").length;
    const openBookings = mockBookings.filter(b => b.status === "open" && b.amount > 0);
    const overdueBookings = mockBookings.filter(b => b.status === "overdue" && b.amount > 0);
    
    const openSum = openBookings.reduce((sum, b) => sum + b.amount, 0);
    const overdueSum = overdueBookings.reduce((sum, b) => sum + b.amount, 0);
    
    const totalIncome = mockBookings
      .filter(b => b.status === "paid" && b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);

    const activeTeams = mockTeams.filter(t => t.isActive).length;
    const activePasses = mockPlayerPasses.filter(p => p.status === "active").length;

    return { 
      totalMembers, 
      activeMembers, 
      openSum, 
      overdueSum, 
      totalIncome, 
      activeTeams,
      activePasses
    };
  }, []);

  const upcomingMatches = useMemo(() => {
    return mockMatches
      .filter(m => new Date(m.scheduledAt) > new Date() && m.status !== "cancelled")
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 4);
  }, []);

  const upcomingEvents = useMemo(() => {
    return mockEvents
      .filter(e => new Date(e.startsAt) > new Date() && e.status !== "cancelled")
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
      .slice(0, 4);
  }, []);

  const recentBookings = useMemo(() => {
    return [...mockBookings]
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      .slice(0, 5);
  }, []);

  // My open tickets
  const myOpenTickets = useMemo(() => {
    return mockTickets.filter(
      t => t.assignedToId === CURRENT_STAFF_ID && (t.status === "open" || t.status === "pending")
    );
  }, []);

  const unreadNotifications = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const toggleNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    if (days === 1) return "Gestern";
    return formatDate(dateString);
  };

  const getMemberName = (membershipId?: string) => {
    if (!membershipId) return null;
    const membership = mockClubMemberships.find(m => m.id === membershipId);
    if (!membership) return null;
    const person = mockPersons.find(p => p.id === membership.personId);
    return person ? `${person.firstName} ${person.lastName}` : null;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Willkommen zurück!</h1>
        <p className="text-teal-100 mt-1">Hier ist Ihre Vereinsübersicht für heute.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mitglieder"
          value={stats.totalMembers}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 8, isUp: true }}
          onClick={() => navigate("/members")}
        />
        <StatCard
          title="Aktive Teams"
          value={stats.activeTeams}
          icon={<Shield className="w-6 h-6" />}
          onClick={() => navigate("/teams")}
        />
        <StatCard
          title="Offene Beiträge"
          value={formatCurrency(stats.openSum)}
          icon={<Clock className="w-6 h-6" />}
          onClick={() => navigate("/finance")}
        />
        <StatCard
          title="Spielerpässe"
          value={stats.activePasses}
          icon={<IdCard className="w-6 h-6" />}
          onClick={() => navigate("/player-passes")}
        />
      </div>

      {/* Notifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Notifications Card */}
        <Card padding="none" className="lg:col-span-1 relative">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-neutral-900">Systemmeldungen</h3>
                {unreadNotifications > 0 && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowNotificationsModal(true)}
              >
                Alle
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {notifications.slice(0, 4).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 hover:bg-neutral-50 transition-colors ${
                  !notif.isRead ? "bg-blue-50/50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    notif.type === "ticket_assigned" 
                      ? "bg-teal-100 text-teal-600"
                      : notif.type === "ticket_reply"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {notif.type === "ticket_assigned" && <Inbox className="w-4 h-4" />}
                    {notif.type === "ticket_reply" && <CheckCircle className="w-4 h-4" />}
                    {notif.type === "system" && <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notif.isRead ? "font-semibold text-neutral-900" : "text-neutral-700"}`}>
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{notif.message}</p>
                    <p className="text-xs text-neutral-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* My Open Tickets */}
        <Card padding="none" className="lg:col-span-2">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-neutral-900">Meine offenen Tickets</h3>
                {myOpenTickets.length > 0 && (
                  <Badge variant="teal" size="sm">{myOpenTickets.length}</Badge>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/inbox")}
              >
                Posteingang öffnen
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
                  className={`w-full p-4 text-left hover:bg-neutral-50 transition-colors ${
                    ticket.unreadCount > 0 ? "bg-blue-50/50" : ""
                  }`}
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
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium text-neutral-900 truncate ${
                          ticket.unreadCount > 0 ? "font-semibold" : ""
                        }`}>
                          {ticket.subject}
                        </p>
                        {ticket.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                            {ticket.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500">{ticket.requesterName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={ticket.status === "open" ? "info" : "warning"} 
                          size="sm"
                        >
                          {ticket.status === "open" ? "Offen" : "In Bearbeitung"}
                        </Badge>
                        <span className="text-xs text-neutral-400">
                          {formatRelativeTime(ticket.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div 
            ref={modalRef}
            className="w-full max-w-md bg-white rounded-xl shadow-xl border border-neutral-200 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
              <h3 className="font-semibold text-neutral-900">Systemmeldungen</h3>
              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="p-1 hover:bg-neutral-200 rounded-lg"
              >
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-neutral-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                  <p>Keine Systemmeldungen</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-neutral-100 last:border-0 ${
                      !notif.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg flex-shrink-0 ${
                        notif.type === "ticket_assigned" 
                          ? "bg-teal-100 text-teal-600"
                          : notif.type === "ticket_reply"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-neutral-100 text-neutral-600"
                      }`}>
                        {notif.type === "ticket_assigned" && <Inbox className="w-4 h-4" />}
                        {notif.type === "ticket_reply" && <CheckCircle className="w-4 h-4" />}
                        {notif.type === "system" && <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm ${!notif.isRead ? "font-semibold text-neutral-900" : "text-neutral-700"}`}>
                            {notif.title}
                          </p>
                          <button
                            onClick={() => toggleNotificationRead(notif.id)}
                            className={`p-1 rounded hover:bg-neutral-100 ${
                              notif.isRead ? "text-neutral-400" : "text-teal-500"
                            }`}
                            title={notif.isRead ? "Als ungelesen markieren" : "Als gelesen markieren"}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-neutral-500">{notif.message}</p>
                        <p className="text-xs text-neutral-400 mt-1">{formatRelativeTime(notif.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
              <button 
                onClick={markAllAsRead}
                className="w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700"
              >
                Alle als gelesen markieren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Matches */}
        <Card padding="none">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-neutral-900">Nächste Spiele</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/matches")}
              >
                Alle ansehen
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {upcomingMatches.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                Keine anstehenden Spiele
              </div>
            ) : (
              upcomingMatches.map((match) => (
                <div 
                  key={match.id} 
                  className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors"
                  onClick={() => navigate("/matches")}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={match.matchType === "league" ? "teal" : "warning"} size="sm">
                      {match.matchType === "league" ? "Liga" : match.matchType === "cup" ? "Pokal" : "Freundschaft"}
                    </Badge>
                    <span className="text-xs text-neutral-500">
                      {formatDate(match.scheduledAt)} · {formatTime(match.scheduledAt)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    {match.homeTeam} vs {match.awayTeam}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{match.location}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card padding="none">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-neutral-900">Termine</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/events")}
              >
                Alle ansehen
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {upcomingEvents.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                Keine anstehenden Termine
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="p-4 hover:bg-neutral-50 cursor-pointer transition-colors flex items-start gap-3"
                  onClick={() => navigate("/events")}
                >
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className="bg-teal-500 text-white rounded-t text-[10px] font-medium py-0.5">
                      {new Date(event.startsAt).toLocaleDateString("de-DE", { month: "short" })}
                    </div>
                    <div className="bg-white border border-t-0 border-neutral-200 rounded-b py-1">
                      <p className="text-lg font-bold text-neutral-900">
                        {new Date(event.startsAt).getDate()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{event.title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {formatTime(event.startsAt)} · {event.location}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card padding="none" className="lg:col-span-2">
          <div className="p-5 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-neutral-900">Letzte Buchungen</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/finance")}
              >
                Alle ansehen
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentBookings.map((booking) => {
              const memberName = getMemberName(booking.clubMembershipId);
              
              return (
                <div 
                  key={booking.id} 
                  className="px-5 py-3 hover:bg-neutral-50 cursor-pointer transition-colors flex items-center justify-between"
                  onClick={() => navigate("/finance")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      booking.amount > 0 
                        ? "bg-green-50 text-green-600" 
                        : "bg-red-50 text-red-600"
                    }`}>
                      <TrendingUp className={`w-5 h-5 ${booking.amount < 0 ? "rotate-180" : ""}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {booking.description}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {memberName || "Verein"} · {formatDate(booking.bookingDate)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    booking.amount > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {booking.amount > 0 ? "+" : ""}{formatCurrency(booking.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Membership Structure */}
      <Card>
        <CardHeader title="Mitgliederstruktur" subtitle="Verteilung nach Status" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(["active", "pending", "suspended", "cancelled"] as const).map((status) => {
            const count = mockClubMemberships.filter(m => m.status === status).length;
            const percentage = Math.round((count / stats.totalMembers) * 100);
            const config = {
              active: { name: "Aktiv", color: "bg-teal-500", bgLight: "bg-teal-50" },
              pending: { name: "Ausstehend", color: "bg-amber-500", bgLight: "bg-amber-50" },
              suspended: { name: "Gesperrt", color: "bg-red-500", bgLight: "bg-red-50" },
              cancelled: { name: "Gekündigt", color: "bg-neutral-400", bgLight: "bg-neutral-50" }
            };
            
            return (
              <div key={status} className={`p-4 rounded-xl ${config[status].bgLight}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-600">{config[status].name}</span>
                  <span className="text-xl font-bold text-neutral-900">{count}</span>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${config[status].color} rounded-full`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">{percentage}%</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
