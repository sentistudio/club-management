import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Inbox as InboxIcon, 
  Clock,
  CheckCircle,
  AlertCircle,
  Paperclip,
  Send,
  X,
  Archive,
  Plus,
  Lock,
  File,
  Download,
  Image,
  Search,
  ChevronDown
} from "lucide-react";
import { Button, Select, Modal, Input } from "../../components/ui";
import { mockTickets, getTicketMessages } from "../../data/mockInbox";
import { mockPersons } from "../../data/mockPersons";
import type { TicketStatus, TicketCategory, Ticket, MemberRole } from "../../types/inbox";

// DFB Brand Colors
const COLORS = {
  primary: "#004941", // DFB Dunkelgrün
  primaryLight: "#00806a",
  mint: "#C8F2E0", // DFB Mintgrün
  mintLight: "#e8f8f3"
};

// Status config - simplified to 3 statuses
const statusConfig: Record<TicketStatus, { label: string; color: string; bgColor: string; textColor: string; icon: typeof Clock }> = {
  open: { label: "Offen", color: "bg-blue-100 text-blue-700", bgColor: "#dbeafe", textColor: "#1447e6", icon: AlertCircle },
  pending: { label: "In Bearbeitung", color: "bg-amber-100 text-amber-700", bgColor: "#fef3c6", textColor: "#bb4d00", icon: Clock },
  resolved: { label: "Gelöst", color: "bg-green-100 text-green-700", bgColor: "#dcfce7", textColor: "#008236", icon: CheckCircle },
  closed: { label: "Geschlossen", color: "bg-neutral-100 text-neutral-600", bgColor: "#f5f5f5", textColor: "#525252", icon: Archive }
};

const categoryConfig: Record<TicketCategory, { label: string; emoji: string }> = {
  fee_question: { label: "Beitragsfrage", emoji: "💰" },
  membership: { label: "Mitgliedschaft", emoji: "👤" },
  documents: { label: "Dokumente", emoji: "📄" },
  registration: { label: "Anmeldung", emoji: "📝" },
  technical: { label: "Technisch", emoji: "🔧" },
  general: { label: "Allgemein", emoji: "💬" },
  complaint: { label: "Beschwerde", emoji: "⚠️" },
  suggestion: { label: "Vorschlag", emoji: "💡" },
  absence: { label: "Abwesenheit", emoji: "🏖️" },
  equipment: { label: "Ausrüstung", emoji: "👕" },
  organization: { label: "Organisation", emoji: "📋" },
  report: { label: "Meldung", emoji: "🚨" }
};

const roleConfig: Record<MemberRole, { label: string; bgColor: string; textColor: string }> = {
  active: { label: "Aktiv", bgColor: "#dcfce7", textColor: "#008236" },
  passive: { label: "Passiv", bgColor: "#f5f5f5", textColor: "#525252" },
  admin: { label: "Admin", bgColor: "#ede9fe", textColor: "#7008e7" },
  trainer: { label: "Trainer", bgColor: "#dbeafe", textColor: "#1447e6" },
  volunteer: { label: "Ehrenamt", bgColor: "#fef3c6", textColor: "#bb4d00" }
};


// Mock attachment type
interface Attachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "doc" | "other";
  size: string;
  url: string;
}

export function PilotInbox() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "">("");
  const [replyText, setReplyText] = useState("");
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMsgRecipient, setNewMsgRecipient] = useState("");
  const [newMsgSubject, setNewMsgSubject] = useState("");
  const [newMsgCategory, setNewMsgCategory] = useState<TicketCategory>("general");
  const [newMsgContent, setNewMsgContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTickets = useMemo(() => {
    return mockTickets
      .filter(t => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
          t.subject.toLowerCase().includes(search) ||
          t.requesterName.toLowerCase().includes(search) ||
          t.ticketNumber.toLowerCase().includes(search) ||
          t.requesterDepartment?.toLowerCase().includes(search)
        );
      })
      .filter(t => statusFilter === "all" || t.status === statusFilter)
      .filter(t => !categoryFilter || t.category === categoryFilter)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [searchTerm, statusFilter, categoryFilter]);

  // Stats for current view
  const stats = useMemo(() => {
    return {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === "open").length,
      pending: mockTickets.filter(t => t.status === "pending").length,
      resolved: mockTickets.filter(t => t.status === "resolved").length,
      unread: mockTickets.reduce((sum, t) => sum + t.unreadCount, 0)
    };
  }, []);

  const selectedMessages = useMemo(() => {
    if (!selectedTicket) return [];
    return getTicketMessages(selectedTicket.id);
  }, [selectedTicket]);

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
      return date.toLocaleDateString("de-DE", { weekday: "short" });
    }
    return date.toLocaleDateString("de-DE", { day: "numeric", month: "short" }).replace(".", "");
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const goToMemberProfile = (requesterId: string) => {
    navigate(`/members/${requesterId}`);
  };

  const statusOptions = [
    { value: "open", label: "Offen" },
    { value: "pending", label: "In Bearbeitung" },
    { value: "resolved", label: "Erledigt" }
  ];
  
  const categoryOptions = Object.entries(categoryConfig).map(([value, { label }]) => ({ value, label }));

  const memberOptions = mockPersons
    .filter(p => !["p1", "p2", "p3"].includes(p.id))
    .map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const resetNewMessageForm = () => {
    setNewMsgRecipient("");
    setNewMsgSubject("");
    setNewMsgCategory("general");
    setNewMsgContent("");
    setAttachments([]);
    setShowNewMessageModal(false);
  };

  // Mock attachments for messages
  const getMockAttachments = (messageId: string): Attachment[] => {
    if (messageId === "msg_1_1") {
      return [
        { id: "att1", name: "Rechnung_Januar.pdf", type: "pdf", size: "245 KB", url: "#" }
      ];
    }
    if (messageId === "msg_2_1") {
      return [
        { id: "att2", name: "Passfoto.jpg", type: "image", size: "1.2 MB", url: "#" },
        { id: "att3", name: "Ausweiskopie.pdf", type: "pdf", size: "890 KB", url: "#" }
      ];
    }
    return [];
  };

  const getAttachmentIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image": return Image;
      case "pdf": return File;
      default: return File;
    }
  };

  // Stat card component
  const StatCard = ({ 
    value, 
    label, 
    icon: Icon, 
    isSelected, 
    onClick,
    iconBgColor,
    valueColor
  }: { 
    value: number; 
    label: string; 
    icon: typeof InboxIcon;
    isSelected?: boolean;
    onClick?: () => void;
    iconBgColor: string;
    valueColor?: string;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 p-4 rounded-2xl border transition-all text-left ${
        isSelected 
          ? "bg-[#e8f8f3] border-[#9be5c9]" 
          : "bg-white border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="w-5 h-5" style={{ color: valueColor || "#171717" }} />
        </div>
        <div>
          <div className="text-2xl font-bold" style={{ color: valueColor || "#171717" }}>
            {value}
          </div>
          <div className="text-sm text-neutral-500">{label}</div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col" style={{ backgroundColor: "#f5f5f5" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Posteingang</h1>
          <p className="text-neutral-500">Mitglieder-Anfragen und Support-Tickets</p>
        </div>
        <Button 
          onClick={() => setShowNewMessageModal(true)}
          className="rounded-full px-6"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Neue Nachricht
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-4 mb-5">
        <StatCard 
          value={stats.total} 
          label="Gesamt" 
          icon={InboxIcon}
          isSelected={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
          iconBgColor="#f5f5f5"
        />
        <StatCard 
          value={stats.open} 
          label="Offen" 
          icon={AlertCircle}
          isSelected={statusFilter === "open"}
          onClick={() => setStatusFilter("open")}
          iconBgColor="#dbeafe"
          valueColor="#155dfc"
        />
        <StatCard 
          value={stats.pending} 
          label="In Bearbeitung" 
          icon={Clock}
          isSelected={statusFilter === "pending"}
          onClick={() => setStatusFilter("pending")}
          iconBgColor="#fef3c6"
          valueColor="#e17100"
        />
        <StatCard 
          value={stats.resolved} 
          label="Gelöst" 
          icon={CheckCircle}
          isSelected={statusFilter === "resolved"}
          onClick={() => setStatusFilter("resolved")}
          iconBgColor="#dcfce7"
          valueColor="#00a63e"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Ticket List Card */}
        <div className={`flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden ${
          selectedTicket ? "w-[480px] flex-shrink-0" : "flex-1"
        }`}>
          {/* Search & Filters */}
          <div className="p-4 border-b border-neutral-200 flex gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[42px] pl-10 pr-4 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-400 text-sm"
              />
            </div>
            {/* Category Filter */}
            <div className="flex-1 relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | "")}
                className="w-full h-[42px] px-4 pr-10 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-400 text-sm appearance-none bg-white"
              >
                <option value="">Alle Kategorien</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
            {/* Status Filter */}
            <div className="flex-1 relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
                className="w-full h-[42px] px-4 pr-10 rounded-xl border border-neutral-300 focus:outline-none focus:border-neutral-400 text-sm appearance-none bg-white"
              >
                <option value="all">Alle Status</option>
                <option value="open">Offen</option>
                <option value="pending">In Bearbeitung</option>
                <option value="resolved">Gelöst</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <InboxIcon className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="text-neutral-500 mb-1">Keine Nachrichten gefunden</p>
              <p className="text-sm text-neutral-400">Versuchen Sie andere Filter</p>
            </div>
          ) : (
            <div>
              {filteredTickets.map((ticket) => {
                const hasUnread = ticket.unreadCount > 0;
                const isSelected = selectedTicket?.id === ticket.id;
                
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`w-full px-4 py-4 text-left border-b border-neutral-100 transition-colors ${
                      isSelected ? "bg-blue-50/50" : hasUnread ? "bg-blue-50/50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToMemberProfile(ticket.requesterId);
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-normal text-sm hover:opacity-90 transition-opacity"
                        style={{ 
                          background: `linear-gradient(135deg, #3fc99b 0%, ${COLORS.primary} 100%)`
                        }}
                      >
                        {ticket.requesterName.split(" ").map(n => n[0]).join("")}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Top row: Name, badges, date */}
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0 flex-wrap">
                            <span className="font-normal text-base text-neutral-900">
                              {ticket.requesterName}
                            </span>
                            {/* Delegate badge */}
                            {ticket.isOnBehalf && ticket.onBehalfOfName && (
                              <span 
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: "#ede9fe", color: "#7008e7" }}
                              >
                                👥 für {ticket.onBehalfOfName}
                              </span>
                            )}
                            {/* Department */}
                            <span className="text-xs text-neutral-500">
                              {ticket.requesterDepartment}
                            </span>
                            {/* Role badge */}
                            {ticket.requesterRole && (
                              <span 
                                className="text-[10px] px-1.5 py-0.5 rounded-full"
                                style={{ 
                                  backgroundColor: roleConfig[ticket.requesterRole].bgColor,
                                  color: roleConfig[ticket.requesterRole].textColor
                                }}
                              >
                                {roleConfig[ticket.requesterRole].label}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-neutral-500 flex-shrink-0">
                            {formatDate(ticket.updatedAt)}
                          </span>
                        </div>

                        {/* Subject */}
                        <p className={`text-sm mb-1 ${hasUnread ? "font-bold text-neutral-900" : "text-neutral-600"}`}>
                          {ticket.subject}
                        </p>
                        
                        {/* Preview */}
                        <p className="text-xs text-neutral-500 mb-2 line-clamp-1">
                          {ticket.previewText || "Keine Vorschau verfügbar"}
                        </p>
                        
                        {/* Bottom row: Status, category, unread */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {/* Status badge */}
                            <span 
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{ 
                                backgroundColor: statusConfig[ticket.status].bgColor,
                                color: statusConfig[ticket.status].textColor
                              }}
                            >
                              {statusConfig[ticket.status].label}
                            </span>
                            {/* Category */}
                            <span className="text-xs text-neutral-400">
                              {categoryConfig[ticket.category]?.emoji} {categoryConfig[ticket.category]?.label}
                            </span>
                          </div>
                          {/* Unread count */}
                          {hasUnread && (
                            <span 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs"
                              style={{ backgroundColor: COLORS.primaryLight }}
                            >
                              {ticket.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          </div>
        </div>

        {/* Ticket Detail Card */}
        {selectedTicket && (
          <div className="flex-1 flex flex-col bg-white rounded-2xl border border-neutral-200 overflow-hidden">
            {/* Detail Header */}
            <div className="flex-shrink-0 bg-neutral-50 border-b border-neutral-200 px-6 py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => goToMemberProfile(selectedTicket.requesterId)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ 
                      background: `linear-gradient(135deg, #3fc99b 0%, ${COLORS.primary} 100%)`
                    }}
                  >
                    {selectedTicket.requesterName.split(" ").map(n => n[0]).join("")}
                  </button>
                  <div>
                    <button
                      onClick={() => goToMemberProfile(selectedTicket.requesterId)}
                      className="font-semibold text-neutral-900 transition-colors hover:text-[#004941]"
                    >
                      {selectedTicket.requesterName}
                    </button>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-neutral-500">{selectedTicket.requesterDepartment}</span>
                      {selectedTicket.requesterRole && (
                        <>
                          <span className="text-neutral-300">•</span>
                          <span 
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{ 
                              backgroundColor: roleConfig[selectedTicket.requesterRole].bgColor,
                              color: roleConfig[selectedTicket.requesterRole].textColor
                            }}
                          >
                            {roleConfig[selectedTicket.requesterRole].label}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{selectedTicket.ticketNumber}</p>
                  </div>
                </div>
                {/* Status Dropdown */}
                <Select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    console.log("Status changed to:", e.target.value);
                  }}
                  options={statusOptions}
                  className="w-40"
                />
              </div>
              <div className="mt-3">
                <h2 className="text-lg font-medium text-neutral-900">{selectedTicket.subject}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-neutral-500">
                    {categoryConfig[selectedTicket.category]?.emoji} {categoryConfig[selectedTicket.category]?.label}
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm text-neutral-500">
                    Erstellt: {formatFullDate(selectedTicket.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {selectedMessages.map((message) => {
                  const isStaff = message.senderId.startsWith("p") && ["p1", "p2", "p3"].includes(message.senderId);
                  const isPrivate = message.isInternal;
                  const messageAttachments = getMockAttachments(message.id);

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isStaff ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-2xl rounded-2xl px-4 py-3 ${
                          isPrivate 
                            ? "bg-amber-50 border border-amber-200" 
                            : isStaff 
                              ? "text-white" 
                              : "bg-white border border-neutral-200"
                        }`}
                        style={isStaff && !isPrivate ? { backgroundColor: COLORS.primary } : {}}
                      >
                        {/* Private note indicator */}
                        {isPrivate && (
                          <div className="flex items-center gap-1.5 text-amber-700 text-xs font-medium mb-2">
                            <Lock className="w-3 h-3" />
                            Interne Notiz
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            isPrivate ? "text-amber-900" : isStaff ? "text-white" : "text-neutral-900"
                          }`}>
                            {message.senderName}
                          </span>
                          <span className={`text-xs ${
                            isPrivate ? "text-amber-600" : isStaff ? "text-white/60" : "text-neutral-400"
                          }`}>
                            {formatFullDate(message.createdAt)}
                          </span>
                        </div>
                        <p className={`text-sm whitespace-pre-wrap ${
                          isPrivate ? "text-amber-800" : isStaff ? "text-white" : "text-neutral-700"
                        }`}>
                          {message.content}
                        </p>

                        {/* Attachments */}
                        {messageAttachments.length > 0 && (
                          <div className={`mt-3 pt-3 border-t ${
                            isPrivate ? "border-amber-200" : isStaff ? "border-white/20" : "border-neutral-100"
                          }`}>
                            <div className="space-y-2">
                              {messageAttachments.map((att) => {
                                const AttIcon = getAttachmentIcon(att.type);
                                return (
                                  <div
                                    key={att.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                      isStaff ? "bg-white/10" : "bg-neutral-50"
                                    }`}
                                  >
                                    <AttIcon className={`w-4 h-4 ${isStaff ? "text-white/80" : "text-neutral-500"}`} />
                                    <span className={`text-sm flex-1 truncate ${
                                      isStaff ? "text-white" : "text-neutral-700"
                                    }`}>
                                      {att.name}
                                    </span>
                                    <span className={`text-xs ${isStaff ? "text-white/60" : "text-neutral-400"}`}>
                                      {att.size}
                                    </span>
                                    <button className={`p-1 rounded hover:bg-black/10 ${
                                      isStaff ? "text-white" : "text-neutral-500"
                                    }`}>
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Reply Box */}
            <div className="flex-shrink-0 bg-white border-t border-neutral-200 px-6 py-4">
              {/* Private Note Toggle */}
              <div className="flex items-center gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivateNote}
                    onChange={(e) => setIsPrivateNote(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-amber-500 focus:ring-amber-500"
                  />
                  <Lock className={`w-4 h-4 ${isPrivateNote ? "text-amber-600" : "text-neutral-400"}`} />
                  <span className={`text-sm ${isPrivateNote ? "text-amber-700 font-medium" : "text-neutral-600"}`}>
                    Interne Notiz (nur für Admins sichtbar)
                  </span>
                </label>
              </div>

              <div className={`flex items-end gap-3 p-3 rounded-xl border-2 transition-colors ${
                isPrivateNote ? "bg-amber-50 border-amber-200" : "bg-neutral-50 border-neutral-200"
              }`}>
                {/* Attachment Button */}
                <div className="flex-shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
                    title="Anhang hinzufügen"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                </div>

                {/* Text Area */}
                <div className="flex-1">
                  {attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-neutral-200">
                          <File className="w-3 h-3 text-neutral-500" />
                          <span className="text-xs text-neutral-700 max-w-24 truncate">{file.name}</span>
                          <button
                            onClick={() => removeAttachment(idx)}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isPrivateNote ? "Interne Notiz schreiben..." : "Nachricht schreiben..."}
                    rows={3}
                    className="w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-neutral-900 placeholder-neutral-400"
                  />
                </div>

                {/* Send Button */}
                <button
                  disabled={!replyText.trim()}
                  onClick={() => {
                    console.log("Send:", { replyText, isPrivateNote, attachments });
                    setReplyText("");
                    setIsPrivateNote(false);
                    setAttachments([]);
                  }}
                  className="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  style={{ 
                    backgroundColor: isPrivateNote ? "#F59E0B" : COLORS.primary 
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessageModal}
        onClose={resetNewMessageForm}
        title="Neue Nachricht"
        size="lg"
      >
        <div className="space-y-4">
          {/* Recipient */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Empfänger</label>
            <Select
              value={newMsgRecipient}
              onChange={(e) => setNewMsgRecipient(e.target.value)}
              options={[{ value: "", label: "Mitglied auswählen..." }, ...memberOptions]}
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Kategorie</label>
            <Select
              value={newMsgCategory}
              onChange={(e) => setNewMsgCategory(e.target.value as TicketCategory)}
              options={categoryOptions}
              className="w-full"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Betreff</label>
            <Input
              value={newMsgSubject}
              onChange={(e) => setNewMsgSubject(e.target.value)}
              placeholder="Betreff eingeben..."
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nachricht</label>
            <textarea
              value={newMsgContent}
              onChange={(e) => setNewMsgContent(e.target.value)}
              placeholder="Ihre Nachricht..."
              rows={6}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ ["--tw-ring-color" as string]: COLORS.primary }}
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Anhänge</label>
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded border border-neutral-200">
                  <File className="w-3 h-3 text-neutral-500" />
                  <span className="text-xs text-neutral-700 max-w-32 truncate">{file.name}</span>
                  <button
                    onClick={() => removeAttachment(idx)}
                    className="text-neutral-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-sm hover:opacity-80"
                style={{ color: COLORS.primary }}
              >
                <Paperclip className="w-4 h-4" />
                Anhang hinzufügen
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
            <Button variant="secondary" onClick={resetNewMessageForm}>
              Abbrechen
            </Button>
            <Button
              disabled={!newMsgRecipient || !newMsgSubject || !newMsgContent}
              onClick={() => {
                console.log("Send new message:", { newMsgRecipient, newMsgSubject, newMsgCategory, newMsgContent, attachments });
                resetNewMessageForm();
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Senden
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
