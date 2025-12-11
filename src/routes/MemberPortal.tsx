import { useState, useMemo } from "react";
import { 
  MessageSquare,
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send,
  Paperclip,
  Home,
  User,
  HelpCircle,
  Calendar,
  CreditCard,
  FileText,
  Shield,
  Trophy,
  Settings,
  MapPin,
  Phone,
  Mail,
  Edit,
  Download,
  Users,
  Hash
} from "lucide-react";
import { Button } from "../components/ui";
import { mockTicketForms, getTicketMessages, getMemberTickets } from "../data/mockInbox";
import { getChatMessages, getMemberChats, getUnreadChatsCount, mockChatSettings } from "../data/mockChats";
import type { Ticket, TicketForm, TicketStatus, TicketCategory } from "../types/inbox";
import type { Chat } from "../data/mockChats";

// Current logged-in member (demo purposes)
const CURRENT_MEMBER_ID = "p11";
const CURRENT_MEMBER_NAME = "Tim Jung";
const CURRENT_MEMBER = {
  firstName: "Tim",
  lastName: "Jung",
  email: "tim.jung@example.com",
  phone: "+49 171 1234567",
  address: "Musterstraße 12",
  city: "München",
  postalCode: "80331",
  memberSince: "2022-08-15",
  memberNumber: "M-2022-0456",
  team: "Herren 1. Mannschaft",
  position: "Mittelfeld",
  // New: Department memberships
  memberships: [
    { departmentId: "dept1", departmentName: "Fußball", role: "aktiv" as const },
    { departmentId: "dept2", departmentName: "Fitness", role: "passiv" as const }
  ],
  primaryDepartment: "Fußball",
  memberRole: "aktiv" as const // aktiv, passiv, ehrenmitglied, admin
};

// Mock member data
const MEMBER_TEAM = {
  name: "Herren 1. Mannschaft",
  coach: "Thomas Trainer",
  nextTraining: "2024-03-18T19:00:00",
  trainingDays: ["Dienstag 19:00", "Donnerstag 19:00"],
  location: "Hauptplatz A"
};

const MEMBER_UPCOMING_EVENTS = [
  { id: "1", title: "Training", date: "2024-03-18T19:00:00", location: "Hauptplatz A", type: "training" },
  { id: "2", title: "Ligaspiel vs FC Bayern II", date: "2024-03-23T15:00:00", location: "Allianz Campus", type: "match" },
  { id: "3", title: "Training", date: "2024-03-21T19:00:00", location: "Hauptplatz A", type: "training" },
  { id: "4", title: "Vereinsfest 2024", date: "2024-04-15T14:00:00", location: "Vereinsheim", type: "event" },
];

const MEMBER_PAYMENTS = [
  { id: "1", description: "Mitgliedsbeitrag Q1/2024", amount: 75, status: "paid" as const, date: "2024-01-15", dueDate: undefined },
  { id: "2", description: "Vereinsfestbeitrag", amount: 10, status: "paid" as const, date: "2024-01-15", dueDate: undefined },
  { id: "3", description: "Mitgliedsbeitrag Q2/2024", amount: 75, status: "open" as const, date: undefined, dueDate: "2024-04-01" },
];

const MEMBER_DOCUMENTS = [
  { id: "1", name: "Mitgliedsausweis 2024", type: "pdf", date: "2024-01-01" },
  { id: "2", name: "SEPA-Lastschriftmandat", type: "pdf", date: "2022-08-15" },
  { id: "3", name: "Vereinssatzung", type: "pdf", date: "2023-01-01" },
  { id: "4", name: "Spielordnung", type: "pdf", date: "2023-09-01" },
];

// Status config
const statusConfig: Record<TicketStatus, { label: string; bgColor: string; textColor: string; icon: typeof Clock }> = {
  open: { label: "Offen", bgColor: "bg-blue-500", textColor: "text-blue-600", icon: AlertCircle },
  pending: { label: "In Bearbeitung", bgColor: "bg-amber-500", textColor: "text-amber-600", icon: Clock },
  resolved: { label: "Gelöst", bgColor: "bg-green-500", textColor: "text-green-600", icon: CheckCircle },
  closed: { label: "Geschlossen", bgColor: "bg-neutral-400", textColor: "text-neutral-500", icon: CheckCircle }
};

const categoryConfig: Record<TicketCategory, { label: string; emoji: string; description: string }> = {
  fee_question: { label: "Beitragsfrage", emoji: "💰", description: "Fragen zu Rechnungen und Zahlungen" },
  membership: { label: "Mitgliedschaft", emoji: "👤", description: "Änderungen an Ihrer Mitgliedschaft" },
  documents: { label: "Dokumente", emoji: "📄", description: "Dokumente einreichen oder anfordern" },
  registration: { label: "Anmeldung", emoji: "📝", description: "Anmeldung zu Events und Kursen" },
  technical: { label: "Technisch", emoji: "🔧", description: "Technische Probleme melden" },
  general: { label: "Allgemein", emoji: "💬", description: "Allgemeine Anfragen" },
  complaint: { label: "Beschwerde", emoji: "⚠️", description: "Beschwerden einreichen" },
  suggestion: { label: "Vorschlag", emoji: "💡", description: "Verbesserungsvorschläge" }
};

const roleConfig = {
  aktiv: { label: "Aktiv", color: "bg-green-100 text-green-700" },
  passiv: { label: "Passiv", color: "bg-neutral-100 text-neutral-600" },
  ehrenmitglied: { label: "Ehrenmitglied", color: "bg-amber-100 text-amber-700" },
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700" }
};

type View = "home" | "nachrichten" | "tickets" | "ticket-detail" | "new-ticket" | "form" | "chats" | "chat-detail" | "team" | "schedule" | "payments" | "documents" | "profile";
type NachrichtenTab = "anfragen" | "chats";

export function MemberPortal() {
  const [view, setView] = useState<View>("home");
  const [nachrichtenTab, setNachrichtenTab] = useState<NachrichtenTab>("chats");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedForm, setSelectedForm] = useState<TicketForm | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(CURRENT_MEMBER.memberships[0]?.departmentId || "");
  const [replyText, setReplyText] = useState("");
  const [chatMessage, setChatMessage] = useState("");

  // Get member's tickets
  const memberTickets = useMemo(() => {
    return getMemberTickets(CURRENT_MEMBER_ID)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);

  // Get member's chats
  const memberChats = useMemo(() => {
    return getMemberChats(CURRENT_MEMBER_ID)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, []);

  const ticketStats = useMemo(() => ({
    total: memberTickets.length,
    open: memberTickets.filter(t => t.status === "open" || t.status === "pending").length,
    unread: memberTickets.reduce((sum, t) => sum + t.unreadCount, 0)
  }), [memberTickets]);

  const chatStats = useMemo(() => ({
    total: memberChats.length,
    unread: getUnreadChatsCount(CURRENT_MEMBER_ID)
  }), [memberChats]);

  const totalUnread = ticketStats.unread + chatStats.unread;

  const selectedMessages = useMemo(() => {
    if (!selectedTicket) return [];
    return getTicketMessages(selectedTicket.id).filter(m => !m.isInternal);
  }, [selectedTicket]);

  const selectedChatMessages = useMemo(() => {
    if (!selectedChat) return [];
    return getChatMessages(selectedChat.id);
  }, [selectedChat]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Gestern";
    } else if (days < 7) {
      return date.toLocaleDateString("de-DE", { weekday: "long" });
    }
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      weekday: "short",
      day: "2-digit",
      month: "long",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(amount);
  };

  const openTicketDetail = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setView("ticket-detail");
  };

  const openChatDetail = (chat: Chat) => {
    setSelectedChat(chat);
    setView("chat-detail");
  };

  const openForm = (form: TicketForm) => {
    setSelectedForm(form);
    setView("form");
  };

  const goBack = () => {
    if (view === "ticket-detail") {
      setSelectedTicket(null);
      setView("nachrichten");
    } else if (view === "chat-detail") {
      setSelectedChat(null);
      setView("nachrichten");
    } else if (view === "form") {
      setSelectedForm(null);
      setView("new-ticket");
    } else if (view === "new-ticket" || view === "tickets" || view === "chats") {
      setView("nachrichten");
    } else {
      setView("home");
    }
  };

  // ============ RENDER VIEWS ============

  // Home View
  const renderHome = () => (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-teal-100 text-sm mb-1">Hallo,</p>
            <h1 className="text-2xl font-bold">{CURRENT_MEMBER_NAME}</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-teal-100 text-sm">{CURRENT_MEMBER.primaryDepartment}</span>
              <span className="text-teal-200">•</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                CURRENT_MEMBER.memberRole === "aktiv" ? "bg-white/20 text-white" :
                CURRENT_MEMBER.memberRole === "passiv" ? "bg-white/10 text-teal-100" :
                "bg-amber-400/20 text-amber-100"
              }`}>
                {roleConfig[CURRENT_MEMBER.memberRole].label}
              </span>
            </div>
          </div>
          <button 
            onClick={() => setView("profile")}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold"
          >
            {CURRENT_MEMBER.firstName[0]}{CURRENT_MEMBER.lastName[0]}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => setView("schedule")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-600" />
              </div>
              <span className="text-xs text-neutral-600">Termine</span>
            </button>
            <button 
              onClick={() => setView("team")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-neutral-600">Mein Team</span>
            </button>
            <button 
              onClick={() => setView("payments")}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-neutral-600">Beiträge</span>
            </button>
            <button 
              onClick={() => setView("nachrichten")}
              className="relative flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs text-neutral-600">Nachrichten</span>
              {totalUnread > 0 && (
                <span className="absolute top-0 right-2 w-5 h-5 bg-teal-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  {totalUnread}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Department Memberships */}
      {CURRENT_MEMBER.memberships.length > 1 && (
        <div className="px-5 mt-5">
          <h2 className="text-sm font-medium text-neutral-500 mb-2">Meine Abteilungen</h2>
          <div className="flex gap-2">
            {CURRENT_MEMBER.memberships.map((m) => (
              <div 
                key={m.departmentId}
                className="bg-white rounded-lg px-3 py-2 shadow-sm border border-neutral-200"
              >
                <p className="font-medium text-neutral-900 text-sm">{m.departmentName}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded ${roleConfig[m.role].color}`}>
                  {roleConfig[m.role].label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Event Banner */}
      <div className="px-5 mt-5">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-xs font-medium uppercase tracking-wide">Nächster Termin</p>
          <p className="font-semibold mt-1">{MEMBER_UPCOMING_EVENTS[0].title}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-blue-100">
            <Clock className="w-4 h-4" />
            <span>{formatFullDate(MEMBER_UPCOMING_EVENTS[0].date)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-blue-100">
            <MapPin className="w-4 h-4" />
            <span>{MEMBER_UPCOMING_EVENTS[0].location}</span>
          </div>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-neutral-900">Kommende Termine</h2>
          <button 
            onClick={() => setView("schedule")}
            className="text-sm text-teal-600 font-medium"
          >
            Alle →
          </button>
        </div>
        <div className="space-y-3">
          {MEMBER_UPCOMING_EVENTS.slice(0, 3).map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  event.type === "training" ? "bg-teal-100 text-teal-600" :
                  event.type === "match" ? "bg-red-100 text-red-600" :
                  "bg-purple-100 text-purple-600"
                }`}>
                  {event.type === "training" && <Shield className="w-5 h-5" />}
                  {event.type === "match" && <Trophy className="w-5 h-5" />}
                  {event.type === "event" && <Calendar className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{event.title}</p>
                  <p className="text-sm text-neutral-500">{formatFullDate(event.date)}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{event.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More Options */}
      <div className="px-5 mt-6 pb-24">
        <h2 className="text-lg font-semibold text-neutral-900 mb-3">Weitere Optionen</h2>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <button 
            onClick={() => setView("documents")}
            className="w-full flex items-center gap-4 p-4 border-b border-neutral-100"
          >
            <FileText className="w-5 h-5 text-neutral-400" />
            <span className="flex-1 text-left font-medium text-neutral-700">Dokumente</span>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>
          <button 
            onClick={() => setView("profile")}
            className="w-full flex items-center gap-4 p-4 border-b border-neutral-100"
          >
            <User className="w-5 h-5 text-neutral-400" />
            <span className="flex-1 text-left font-medium text-neutral-700">Mein Profil</span>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>
          <button 
            onClick={() => setView("new-ticket")}
            className="w-full flex items-center gap-4 p-4"
          >
            <HelpCircle className="w-5 h-5 text-neutral-400" />
            <span className="flex-1 text-left font-medium text-neutral-700">Hilfe & Kontakt</span>
            <ChevronRight className="w-5 h-5 text-neutral-300" />
          </button>
        </div>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Nachrichten View (with tabs for Anfragen and Chats)
  const renderNachrichten = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-neutral-200 z-10">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">Nachrichten</h1>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-5 gap-1">
          <button
            onClick={() => setNachrichtenTab("anfragen")}
            className={`flex-1 py-3 text-sm font-medium text-center relative ${
              nachrichtenTab === "anfragen" ? "text-teal-600" : "text-neutral-500"
            }`}
          >
            Anfragen
            {ticketStats.unread > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-teal-500 text-white rounded-full">
                {ticketStats.unread}
              </span>
            )}
            {nachrichtenTab === "anfragen" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
            )}
          </button>
          {mockChatSettings.enabled && (
            <button
              onClick={() => setNachrichtenTab("chats")}
              className={`flex-1 py-3 text-sm font-medium text-center relative ${
                nachrichtenTab === "chats" ? "text-teal-600" : "text-neutral-500"
              }`}
            >
              Chats
              {chatStats.unread > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-teal-500 text-white rounded-full">
                  {chatStats.unread}
                </span>
              )}
              {nachrichtenTab === "chats" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {nachrichtenTab === "anfragen" ? (
          // Anfragen List
          <>
            {memberTickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Keine Anfragen vorhanden</p>
                <Button 
                  className="mt-4"
                  onClick={() => setView("new-ticket")}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Neue Anfrage stellen
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {memberTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => openTicketDetail(ticket)}
                    className="w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        ticket.status === "open" ? "bg-blue-100" :
                        ticket.status === "pending" ? "bg-amber-100" :
                        "bg-green-100"
                      }`}>
                        {(() => {
                          const Icon = statusConfig[ticket.status].icon;
                          return <Icon className={`w-5 h-5 ${statusConfig[ticket.status].textColor}`} />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium text-neutral-900">{ticket.subject}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{ticket.ticketNumber}</p>
                          </div>
                          {ticket.unreadCount > 0 && (
                            <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                              {ticket.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 truncate mt-2">{ticket.previewText}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ticket.status === "open" ? "bg-blue-100 text-blue-700" :
                            ticket.status === "pending" ? "bg-amber-100 text-amber-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {statusConfig[ticket.status].label}
                          </span>
                          <span className="text-xs text-neutral-400">{formatDate(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          // Chats List - Grouped by Department
          <>
            {!mockChatSettings.enabled ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Chats sind nicht aktiviert</p>
              </div>
            ) : memberChats.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500">Keine Chats vorhanden</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Group chats by department */}
                {(() => {
                  // Group chats: first show group chats, then direct chats
                  const groupChats = memberChats.filter(c => c.type === "group");
                  const directChats = memberChats.filter(c => c.type === "direct");
                  
                  // Group group chats by department
                  const groupedByDept: Record<string, Chat[]> = {};
                  groupChats.forEach(chat => {
                    const dept = chat.departmentName || "Allgemein";
                    if (!groupedByDept[dept]) groupedByDept[dept] = [];
                    groupedByDept[dept].push(chat);
                  });

                  return (
                    <>
                      {/* Team Chats by Department */}
                      {Object.entries(groupedByDept).map(([deptName, chats]) => (
                        <div key={deptName}>
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-teal-500" />
                            <h3 className="text-sm font-semibold text-neutral-700">{deptName}</h3>
                          </div>
                          <div className="space-y-2">
                            {chats.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => openChatDetail(chat)}
                                className={`w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left hover:shadow-md transition-shadow ${
                                  chat.unreadCount > 0 ? "border-l-4 border-l-teal-500" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                                    <Users className="w-5 h-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <p className={`font-medium ${chat.unreadCount > 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                                          {chat.name}
                                        </p>
                                        <Hash className="w-3.5 h-3.5 text-neutral-400" />
                                      </div>
                                      <span className="text-xs text-neutral-400">
                                        {chat.lastMessage && formatDate(chat.lastMessage.createdAt)}
                                      </span>
                                    </div>
                                    {chat.lastMessage && (
                                      <p className={`text-sm truncate mt-1 ${
                                        chat.unreadCount > 0 ? "font-medium text-neutral-700" : "text-neutral-500"
                                      }`}>
                                        <span className="text-neutral-400">{chat.lastMessage.senderName.split(" ")[0]}: </span>
                                        {chat.lastMessage.content}
                                      </p>
                                    )}
                                    {chat.unreadCount > 0 && (
                                      <span className="inline-flex mt-2 w-5 h-5 rounded-full bg-teal-500 text-white text-xs items-center justify-center">
                                        {chat.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}

                      {/* Direct Messages */}
                      {directChats.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-teal-500" />
                            <h3 className="text-sm font-semibold text-neutral-700">Direktnachrichten</h3>
                          </div>
                          <div className="space-y-2">
                            {directChats.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => openChatDetail(chat)}
                                className={`w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left hover:shadow-md transition-shadow ${
                                  chat.unreadCount > 0 ? "border-l-4 border-l-teal-500" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0">
                                    <span className="text-sm font-medium">
                                      {chat.name.split(" ").map(n => n[0]).join("")}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <p className={`font-medium ${chat.unreadCount > 0 ? "text-neutral-900" : "text-neutral-700"}`}>
                                          {chat.name}
                                        </p>
                                        {chat.departmentName && (
                                          <span className="text-xs text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                                            {chat.departmentName}
                                          </span>
                                        )}
                                      </div>
                                      <span className="text-xs text-neutral-400">
                                        {chat.lastMessage && formatDate(chat.lastMessage.createdAt)}
                                      </span>
                                    </div>
                                    {chat.lastMessage && (
                                      <p className={`text-sm truncate mt-1 ${
                                        chat.unreadCount > 0 ? "font-medium text-neutral-700" : "text-neutral-500"
                                      }`}>
                                        {chat.lastMessage.content}
                                      </p>
                                    )}
                                    {chat.unreadCount > 0 && (
                                      <span className="inline-flex mt-2 w-5 h-5 rounded-full bg-teal-500 text-white text-xs items-center justify-center">
                                        {chat.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB for new ticket/chat */}
      <button
        onClick={() => setView("new-ticket")}
        className="fixed right-5 bottom-24 w-14 h-14 rounded-full bg-teal-500 text-white shadow-lg flex items-center justify-center hover:bg-teal-600 transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {renderBottomNav()}
    </div>
  );

  // Chat Detail View
  const renderChatDetail = () => {
    if (!selectedChat) return null;

    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              selectedChat.type === "group" 
                ? "bg-gradient-to-br from-purple-400 to-purple-600" 
                : "bg-gradient-to-br from-teal-400 to-teal-600"
            } text-white`}>
              {selectedChat.type === "group" ? (
                <Users className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">
                  {selectedChat.name.split(" ").map(n => n[0]).join("")}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-neutral-900 truncate">{selectedChat.name}</p>
                {selectedChat.departmentName && (
                  <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">
                    {selectedChat.departmentName}
                  </span>
                )}
              </div>
              {selectedChat.type === "group" && (
                <p className="text-xs text-neutral-500">{selectedChat.participants.length} Teilnehmer</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedChatMessages.map((message) => {
            const isMe = message.senderId === CURRENT_MEMBER_ID;
            return (
              <div 
                key={message.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%]`}>
                  {!isMe && selectedChat.type === "group" && (
                    <p className="text-xs text-neutral-500 mb-1 ml-1">{message.senderName}</p>
                  )}
                  <div className={`rounded-2xl p-3 ${
                    isMe 
                      ? "bg-teal-500 text-white rounded-br-md" 
                      : "bg-white border border-neutral-200 rounded-bl-md"
                  }`}>
                    <p className={`text-sm ${isMe ? "text-white" : "text-neutral-700"}`}>
                      {message.content}
                    </p>
                  </div>
                  <p className={`text-xs text-neutral-400 mt-1 ${isMe ? "text-right" : ""}`}>
                    {formatDate(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Nachricht schreiben..."
                className="w-full px-4 py-3 text-sm bg-neutral-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={1}
              />
            </div>
            <button 
              className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50"
              disabled={!chatMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Team View
  const renderTeam = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Mein Team</h1>
        </div>
      </div>

      <div className="p-5">
        {/* Team Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 text-white mb-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{MEMBER_TEAM.name}</h2>
              <p className="text-teal-100">Trainer: {MEMBER_TEAM.coach}</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-sm text-teal-100 mb-1">Deine Position</p>
            <p className="font-semibold">{CURRENT_MEMBER.position}</p>
          </div>
        </div>

        {/* Training Times */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 mb-5">
          <h3 className="font-semibold text-neutral-900 mb-3">Trainingszeiten</h3>
          <div className="space-y-3">
            {MEMBER_TEAM.trainingDays.map((day, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{day}</p>
                  <p className="text-sm text-neutral-500">{MEMBER_TEAM.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Coach */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-3">Trainer kontaktieren</h3>
          <button 
            onClick={() => setView("new-ticket")}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 text-white py-3 rounded-xl font-medium"
          >
            <MessageSquare className="w-5 h-5" />
            Nachricht senden
          </button>
        </div>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Schedule View
  const renderSchedule = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Termine</h1>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {MEMBER_UPCOMING_EVENTS.map((event) => (
          <div 
            key={event.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-neutral-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 text-center">
                <div className={`rounded-t text-[10px] font-medium py-0.5 ${
                  event.type === "match" ? "bg-red-500 text-white" :
                  event.type === "training" ? "bg-teal-500 text-white" :
                  "bg-purple-500 text-white"
                }`}>
                  {new Date(event.date).toLocaleDateString("de-DE", { month: "short" })}
                </div>
                <div className="bg-white border border-t-0 border-neutral-200 rounded-b py-1">
                  <p className="text-xl font-bold text-neutral-900">
                    {new Date(event.date).getDate()}
                  </p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  event.type === "match" ? "bg-red-100 text-red-700" :
                  event.type === "training" ? "bg-teal-100 text-teal-700" :
                  "bg-purple-100 text-purple-700"
                }`}>
                  {event.type === "match" ? "Spiel" : event.type === "training" ? "Training" : "Event"}
                </span>
                <p className="font-semibold text-neutral-900 mt-2">{event.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-neutral-500">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {renderBottomNav()}
    </div>
  );

  // Payments View
  const renderPayments = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Beiträge & Zahlungen</h1>
        </div>
      </div>

      <div className="p-5">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-sm text-green-600">Bezahlt</p>
            <p className="text-xl font-bold text-green-700">
              {formatCurrency(MEMBER_PAYMENTS.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0))}
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4">
            <p className="text-sm text-amber-600">Offen</p>
            <p className="text-xl font-bold text-amber-700">
              {formatCurrency(MEMBER_PAYMENTS.filter(p => p.status === "open").reduce((sum, p) => sum + p.amount, 0))}
            </p>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100">
            <h3 className="font-semibold text-neutral-900">Transaktionen</h3>
          </div>
          <div className="divide-y divide-neutral-100">
            {MEMBER_PAYMENTS.map((payment) => (
              <div key={payment.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    payment.status === "paid" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {payment.status === "paid" ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{payment.description}</p>
                    <p className="text-sm text-neutral-500">
                      {payment.status === "paid" 
                        ? `Bezahlt am ${payment.date ? new Date(payment.date).toLocaleDateString("de-DE") : "-"}`
                        : `Fällig am ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString("de-DE") : "-"}`
                      }
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${payment.status === "paid" ? "text-green-600" : "text-amber-600"}`}>
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Question */}
        <button 
          onClick={() => setView("new-ticket")}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 py-3 rounded-xl font-medium"
        >
          <HelpCircle className="w-5 h-5" />
          Frage zu Zahlungen?
        </button>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Documents View
  const renderDocuments = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Dokumente</h1>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="divide-y divide-neutral-100">
            {MEMBER_DOCUMENTS.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{doc.name}</p>
                    <p className="text-sm text-neutral-500">{new Date(doc.date).toLocaleDateString("de-DE")}</p>
                  </div>
                </div>
                <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Request Document */}
        <button 
          onClick={() => setView("new-ticket")}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-teal-500 text-white py-3 rounded-xl font-medium"
        >
          <Plus className="w-5 h-5" />
          Dokument anfordern
        </button>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Profile View
  const renderProfile = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Mein Profil</h1>
        </div>
      </div>

      <div className="p-5">
        {/* Avatar & Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-3xl font-bold mb-3">
            {CURRENT_MEMBER.firstName[0]}{CURRENT_MEMBER.lastName[0]}
          </div>
          <h2 className="text-xl font-bold text-neutral-900">{CURRENT_MEMBER.firstName} {CURRENT_MEMBER.lastName}</h2>
          <p className="text-neutral-500">{CURRENT_MEMBER.primaryDepartment}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
              {CURRENT_MEMBER.memberNumber}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleConfig[CURRENT_MEMBER.memberRole].color}`}>
              {roleConfig[CURRENT_MEMBER.memberRole].label}
            </span>
          </div>
        </div>

        {/* Department Memberships */}
        {CURRENT_MEMBER.memberships.length > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 mb-5">
            <h3 className="font-semibold text-neutral-900 mb-3">Abteilungen</h3>
            <div className="space-y-3">
              {CURRENT_MEMBER.memberships.map((m) => (
                <div key={m.departmentId} className="flex items-center justify-between">
                  <span className="text-neutral-700">{m.departmentName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${roleConfig[m.role].color}`}>
                    {roleConfig[m.role].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-neutral-900">Kontaktdaten</h3>
            <button className="text-teal-600 text-sm font-medium flex items-center gap-1">
              <Edit className="w-4 h-4" />
              Ändern
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-700">{CURRENT_MEMBER.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-neutral-400" />
              <span className="text-neutral-700">{CURRENT_MEMBER.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="text-neutral-700">{CURRENT_MEMBER.address}</p>
                <p className="text-neutral-700">{CURRENT_MEMBER.postalCode} {CURRENT_MEMBER.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Info */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-4">Mitgliedschaft</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-500">Mitglied seit</span>
              <span className="text-neutral-900 font-medium">
                {new Date(CURRENT_MEMBER.memberSince).toLocaleDateString("de-DE")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Status</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">Aktiv</span>
            </div>
          </div>
        </div>

        {/* Change Request */}
        <button 
          onClick={() => setView("new-ticket")}
          className="w-full mt-5 flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 py-3 rounded-xl font-medium"
        >
          <Settings className="w-5 h-5" />
          Änderung beantragen
        </button>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Tickets List View (legacy - now part of Nachrichten)
  const renderTicketsList = () => renderNachrichten();

  // Ticket Detail View
  const renderTicketDetail = () => {
    if (!selectedTicket) return null;

    return (
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 truncate">{selectedTicket.subject}</p>
              <p className="text-xs text-neutral-500">{selectedTicket.ticketNumber}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              selectedTicket.status === "open" ? "bg-blue-100 text-blue-700" :
              selectedTicket.status === "pending" ? "bg-amber-100 text-amber-700" :
              "bg-green-100 text-green-700"
            }`}>
              {statusConfig[selectedTicket.status].label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selectedMessages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.senderType === "member" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${message.senderType === "member" ? "order-1" : ""}`}>
                <div className={`rounded-2xl p-4 ${
                  message.senderType === "member" 
                    ? "bg-teal-500 text-white rounded-br-md" 
                    : "bg-white border border-neutral-200 rounded-bl-md"
                }`}>
                  {message.senderType !== "member" && (
                    <p className="text-xs font-medium text-teal-600 mb-1">{message.senderName}</p>
                  )}
                  <p className={`text-sm whitespace-pre-wrap ${
                    message.senderType === "member" ? "text-white" : "text-neutral-700"
                  }`}>
                    {message.content}
                  </p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className={`mt-2 pt-2 border-t ${
                      message.senderType === "member" ? "border-teal-400" : "border-neutral-200"
                    }`}>
                      {message.attachments.map((att) => (
                        <a 
                          key={att.id}
                          href={att.fileUrl}
                          className={`flex items-center gap-2 text-sm ${
                            message.senderType === "member" ? "text-teal-100" : "text-teal-600"
                          }`}
                        >
                          <Paperclip className="w-4 h-4" />
                          {att.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <p className={`text-xs text-neutral-400 mt-1 ${
                  message.senderType === "member" ? "text-right" : ""
                }`}>
                  {formatDate(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {selectedTicket.status !== "closed" && selectedTicket.status !== "resolved" && (
          <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4">
            <div className="flex items-end gap-3">
              <button className="p-2 text-neutral-400 hover:text-neutral-600">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nachricht schreiben..."
                  className="w-full px-4 py-3 text-sm bg-neutral-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                  rows={1}
                />
              </div>
              <button 
                className="p-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors disabled:opacity-50"
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

  // New Ticket View
  const renderNewTicket = () => (
    <div className="min-h-screen bg-neutral-100 pb-20">
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Neue Anfrage</h1>
        </div>
      </div>

      <div className="p-5">
        {/* Department Selection (if multiple) */}
        {CURRENT_MEMBER.memberships.length > 1 && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Abteilung auswählen
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CURRENT_MEMBER.memberships.map((m) => (
                <button
                  key={m.departmentId}
                  onClick={() => setSelectedDepartment(m.departmentId)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedDepartment === m.departmentId
                      ? "border-teal-500 bg-teal-50"
                      : "border-neutral-200 bg-white"
                  }`}
                >
                  <p className={`font-medium ${
                    selectedDepartment === m.departmentId ? "text-teal-700" : "text-neutral-700"
                  }`}>
                    {m.departmentName}
                  </p>
                  <span className={`text-xs ${roleConfig[m.role].color} px-1.5 py-0.5 rounded`}>
                    {roleConfig[m.role].label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-neutral-600 mb-4">Wählen Sie eine Kategorie für Ihre Anfrage:</p>
        <div className="space-y-3">
          {mockTicketForms.filter(f => f.isActive).map((form) => (
            <button
              key={form.id}
              onClick={() => openForm(form)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-neutral-200 text-left hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                {categoryConfig[form.category]?.emoji || "📝"}
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">{form.name}</p>
                <p className="text-sm text-neutral-500">{form.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300" />
            </button>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-6 bg-teal-50 rounded-xl p-4 border border-teal-100">
          <h3 className="font-semibold text-teal-800 mb-2">Direkter Kontakt</h3>
          <p className="text-sm text-teal-700 mb-3">
            Mo-Fr von 9-17 Uhr erreichbar
          </p>
          <div className="space-y-2">
            <a href="tel:+498912345678" className="flex items-center gap-2 text-teal-700">
              <Phone className="w-4 h-4" />
              <span>089 / 123 456 78</span>
            </a>
            <a href="mailto:info@verein.de" className="flex items-center gap-2 text-teal-700">
              <Mail className="w-4 h-4" />
              <span>info@verein.de</span>
            </a>
          </div>
        </div>
      </div>

      {renderBottomNav()}
    </div>
  );

  // Form View
  const renderForm = () => {
    if (!selectedForm) return null;

    const selectedDept = CURRENT_MEMBER.memberships.find(m => m.departmentId === selectedDepartment);

    return (
      <div className="min-h-screen bg-neutral-100 pb-20">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-5 py-4 z-10">
          <div className="flex items-center gap-3">
            <button onClick={goBack} className="p-2 -ml-2 hover:bg-neutral-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <h1 className="text-lg font-semibold text-neutral-900">{selectedForm.name}</h1>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
            {/* Show selected department */}
            {CURRENT_MEMBER.memberships.length > 1 && selectedDept && (
              <div className="mb-4 pb-4 border-b border-neutral-100">
                <p className="text-xs text-neutral-500 mb-1">Abteilung</p>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{selectedDept.departmentName}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${roleConfig[selectedDept.role].color}`}>
                    {roleConfig[selectedDept.role].label}
                  </span>
                </div>
              </div>
            )}

            <p className="text-sm text-neutral-600 mb-5">{selectedForm.description}</p>
            
            <form className="space-y-4">
              {selectedForm.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-xl resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                      rows={4}
                    />
                  ) : field.type === "select" ? (
                    <select
                      required={field.required}
                      className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 bg-white"
                    >
                      <option value="">Bitte wählen...</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "file" ? (
                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center">
                      <Paperclip className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                      <p className="text-sm text-neutral-500">Datei hochladen oder hierher ziehen</p>
                      <input type="file" className="hidden" />
                      <button type="button" className="mt-2 text-sm text-teal-600 font-medium">
                        Datei auswählen
                      </button>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                    />
                  )}
                </div>
              ))}

              <Button className="w-full mt-6" icon={<Send className="w-4 h-4" />}>
                Anfrage absenden
              </Button>
            </form>
          </div>
        </div>

        {renderBottomNav()}
      </div>
    );
  };

  // Bottom Navigation
  const renderBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-2 z-20">
      <div className="flex items-center justify-around">
        <button 
          onClick={() => setView("home")}
          className={`flex flex-col items-center py-2 px-4 ${view === "home" ? "text-teal-600" : "text-neutral-400"}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Start</span>
        </button>
        <button 
          onClick={() => setView("schedule")}
          className={`flex flex-col items-center py-2 px-4 ${view === "schedule" ? "text-teal-600" : "text-neutral-400"}`}
        >
          <Calendar className="w-6 h-6" />
          <span className="text-xs mt-1">Termine</span>
        </button>
        <button 
          onClick={() => setView("nachrichten")}
          className={`flex flex-col items-center py-2 px-4 relative ${
            view === "nachrichten" || view === "tickets" || view === "ticket-detail" || view === "chats" || view === "chat-detail" 
              ? "text-teal-600" 
              : "text-neutral-400"
          }`}
        >
          <MessageSquare className="w-6 h-6" />
          <span className="text-xs mt-1">Nachrichten</span>
          {totalUnread > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
        <button 
          onClick={() => setView("profile")}
          className={`flex flex-col items-center py-2 px-4 ${view === "profile" ? "text-teal-600" : "text-neutral-400"}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profil</span>
        </button>
      </div>
    </div>
  );

  // Render current view
  switch (view) {
    case "nachrichten":
      return renderNachrichten();
    case "tickets":
      return renderTicketsList();
    case "ticket-detail":
      return renderTicketDetail();
    case "new-ticket":
      return renderNewTicket();
    case "form":
      return renderForm();
    case "chats":
      return renderNachrichten();
    case "chat-detail":
      return renderChatDetail();
    case "team":
      return renderTeam();
    case "schedule":
      return renderSchedule();
    case "payments":
      return renderPayments();
    case "documents":
      return renderDocuments();
    case "profile":
      return renderProfile();
    default:
      return renderHome();
  }
}
