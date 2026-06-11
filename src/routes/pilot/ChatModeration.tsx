import { useState, useMemo } from "react";
import { 
  Shield, 
  Eye, 
  Lock, 
  Users,
  MessageSquare,
  Megaphone,
  AlertTriangle,
  Download,
  FileText,
  UserPlus,
  Flag,
  Clock,
  Send,
  CheckCircle,
  X,
  ChevronRight,
  ChevronDown,
  Plus,
  Settings,
  ToggleLeft,
  ToggleRight,
  Folder,
  UserCog
} from "lucide-react";
import { Button, Card } from "../../components/ui";
import { SearchInput } from "../../components/ui/Input";
import { 
  mockChats, 
  mockChatMessages, 
  mockChatReports,
  REPORT_CATEGORIES
} from "../../data/mockChats";
import type { ChatMessage, ChatType } from "../../data/mockChats";

// ==========================================
// TYPES & INTERFACES
// ==========================================

type TabType = "teams" | "reported" | "special" | "audits";
type ChatTypeConfig = "announcement" | "group" | "direct";

interface TeamChatConfig {
  id: string;
  teamId: string;
  teamName: string;
  departmentName?: string;
  teamType: "youth" | "adult";
  isYouthTeam: boolean;
  // Chat type toggles
  announcementEnabled: boolean;
  groupEnabled: boolean;
  directEnabled: boolean;
  // Minor protection
  minorProtectionEnabled: boolean;  // If true, DMs are blocked for minors
  // Chat IDs (auto-created when team is created)
  announcementChatId?: string;
  groupChatId?: string;
  // Stats
  memberCount: number;
  minorCount: number;
  coachCount: number;
  parentCount: number;
}

interface SpecialChat {
  id: string;
  name: string;
  type: "parent_only" | "coaches_only" | "custom";
  chatType: ChatTypeConfig;
  teamId?: string;
  teamName?: string;
  moderators?: string[];
  memberCount: number;
  createdAt: string;
  createdBy: string;
}

interface AuditRequest {
  id: string;
  chatId: string;
  chatName: string;
  chatType: ChatType;
  requestedBy: string;
  requestedAt: string;
  reason: string;
  status: "pending" | "approved" | "denied";
  approvedBy?: string;
  approvedAt?: string;
  expiresAt?: string;
}

// ==========================================
// MOCK DATA
// ==========================================

// Team chat configurations (derived from teams)
const mockTeamConfigs: TeamChatConfig[] = [
  {
    id: "config_fitness",
    teamId: "team_fitness",
    teamName: "Fitness – Morgengruppe",
    departmentName: "Fitness",
    teamType: "adult",
    isYouthTeam: false,
    announcementEnabled: true,
    groupEnabled: true,
    directEnabled: true,
    minorProtectionEnabled: false,
    announcementChatId: "announce_fitness",
    groupChatId: "team_fitness",
    memberCount: 12,
    minorCount: 0,
    coachCount: 1,
    parentCount: 0
  },
  {
    id: "config_ue40",
    teamId: "team_ue40",
    teamName: "Frauen Ü40",
    departmentName: "Fußball",
    teamType: "adult",
    isYouthTeam: false,
    announcementEnabled: true,
    groupEnabled: true,
    directEnabled: true,
    minorProtectionEnabled: false,
    announcementChatId: "announce_ue40",
    groupChatId: "team_frauen_ue40",
    memberCount: 18,
    minorCount: 0,
    coachCount: 1,
    parentCount: 0
  },
  {
    id: "config_vb_u16",
    teamId: "team_vb_u16",
    teamName: "Volleyball U16 Mädchen",
    departmentName: "Volleyball",
    teamType: "youth",
    isYouthTeam: true,
    announcementEnabled: true,
    groupEnabled: true,
    directEnabled: false,  // DMs disabled for youth team
    minorProtectionEnabled: true,
    announcementChatId: "announce_vb_u16",
    groupChatId: "team_vb_u16",
    memberCount: 14,
    minorCount: 12,
    coachCount: 1,
    parentCount: 10
  },
  {
    id: "config_fb_u12",
    teamId: "team_fb_u12",
    teamName: "Fußball U12",
    departmentName: "Fußball",
    teamType: "youth",
    isYouthTeam: true,
    announcementEnabled: true,
    groupEnabled: true,
    directEnabled: false,  // DMs disabled for youth team
    minorProtectionEnabled: true,
    announcementChatId: "announce_fb_u12",
    groupChatId: "team_fb_u12",
    memberCount: 16,
    minorCount: 14,
    coachCount: 2,
    parentCount: 12
  }
];

// Special chats (parent groups, coach groups, custom)
const mockSpecialChats: SpecialChat[] = [
  {
    id: "special_eltern_vb",
    name: "Elterngruppe Volleyball U16",
    type: "parent_only",
    chatType: "group",
    teamId: "team_vb_u16",
    teamName: "Volleyball U16 Mädchen",
    memberCount: 10,
    createdAt: "2024-03-01T00:00:00",
    createdBy: "Patrick Steuble"
  },
  {
    id: "special_eltern_fb",
    name: "Elterngruppe Fußball U12",
    type: "parent_only",
    chatType: "group",
    teamId: "team_fb_u12",
    teamName: "Fußball U12",
    memberCount: 12,
    createdAt: "2024-03-01T00:00:00",
    createdBy: "Patrick Steuble"
  },
  {
    id: "special_coaches",
    name: "Trainer-Austausch",
    type: "coaches_only",
    chatType: "group",
    memberCount: 8,
    createdAt: "2024-01-15T00:00:00",
    createdBy: "Patrick Steuble"
  },
  {
    id: "special_vorstand",
    name: "Vorstand Ankündigungen",
    type: "custom",
    chatType: "announcement",
    moderators: ["Patrick Steuble", "Erika Maier"],
    memberCount: 156,
    createdAt: "2024-01-01T00:00:00",
    createdBy: "Patrick Steuble"
  }
];

// Audit requests for all chat types
const mockAuditRequests: AuditRequest[] = [
  {
    id: "audit_1",
    chatId: "team_vb_u16",
    chatName: "Volleyball U16 Mädchen",
    chatType: "team_group",
    requestedBy: "Patrick Steuble",
    requestedAt: "2026-01-14T10:30:00",
    reason: "Meldung eingegangen: Mobbing-Vorwurf im Team-Chat",
    status: "approved",
    approvedBy: "Vereinsvorstand",
    approvedAt: "2026-01-14T11:00:00",
    expiresAt: "2026-01-21T11:00:00"
  },
  {
    id: "audit_2",
    chatId: "dm_katja_flurina",
    chatName: "Trainerin Katja ↔ Flurina",
    chatType: "direct",
    requestedBy: "System",
    requestedAt: "2026-01-11T09:00:00",
    reason: "Automatische Überprüfung: Ungewöhnliches Nachrichtenmuster erkannt",
    status: "pending"
  },
  {
    id: "audit_3",
    chatId: "announce_fitness",
    chatName: "Fitness Ankündigungen",
    chatType: "announcement",
    requestedBy: "Patrick Steuble",
    requestedAt: "2026-01-10T14:00:00",
    reason: "Compliance-Prüfung: Quartalsaudit",
    status: "approved",
    approvedBy: "Vereinsvorstand",
    approvedAt: "2026-01-10T15:00:00",
    expiresAt: "2026-01-17T15:00:00"
  }
];

// ==========================================
// COMPONENT
// ==========================================

export function ChatModeration() {
  const [activeTab, setActiveTab] = useState<TabType>("teams");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState<{ chatId: string; chatName: string; chatType: ChatType } | null>(null);
  const [auditReason, setAuditReason] = useState("");
  const [showCreateSpecialChat, setShowCreateSpecialChat] = useState(false);

  // Stats
  const stats = useMemo(() => ({
    totalTeams: mockTeamConfigs.length,
    youthTeams: mockTeamConfigs.filter(t => t.isYouthTeam).length,
    pendingReports: mockChatReports.filter(r => r.status === "pending" || r.status === "reviewing").length,
    pendingAudits: mockAuditRequests.filter(r => r.status === "pending").length,
    specialChats: mockSpecialChats.length
  }), []);

  // Get messages for a chat (reserved for future log view)
  const _getMessagesForChat = (chatId: string): ChatMessage[] => {
    return mockChatMessages.filter(m => m.chatId === chatId);
  };
  void _getMessagesForChat;

  // Check if audit is approved for a chat (reserved for future log access)
  const _getApprovedAudit = (chatId: string): AuditRequest | undefined => {
    return mockAuditRequests.find(
      r => r.chatId === chatId && r.status === "approved" && 
      new Date(r.expiresAt || "") > new Date()
    );
  };
  void _getApprovedAudit;

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `vor ${diffMins}m`;
    if (diffHours < 24) return `vor ${diffHours}h`;
    if (diffDays < 7) return `vor ${diffDays}d`;
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  // Render chat type badge
  const renderTypeBadge = (type: ChatTypeConfig | ChatType) => {
    const config: Record<string, { label: string; bg: string; text: string; icon: typeof Megaphone }> = {
      announcement: { label: "Info", bg: "#FEF3C7", text: "#92400E", icon: Megaphone },
      team_group: { label: "Gruppe", bg: "#D1FAE5", text: "#065F46", icon: Users },
      group: { label: "Gruppe", bg: "#D1FAE5", text: "#065F46", icon: Users },
      direct: { label: "DM", bg: "#DBEAFE", text: "#1E40AF", icon: MessageSquare }
    };
    const c = config[type] || config.group;
    const Icon = c.icon;
    return (
      <span 
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
        style={{ backgroundColor: c.bg, color: c.text }}
      >
        <Icon className="w-3 h-3" />
        {c.label}
      </span>
    );
  };

  // ==========================================
  // TAB: TEAMS
  // ==========================================
  const renderTeamsTab = () => {
    const filteredTeams = mockTeamConfigs.filter(team =>
      !searchTerm || team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-4">
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-[10px] flex items-start gap-3">
          <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Team-basierte Chat-Verwaltung</p>
            <p className="text-xs text-blue-600 mt-1">
              Chats werden automatisch erstellt wenn ein Team angelegt wird. Hier können Sie Chat-Typen aktivieren/deaktivieren, 
              Jugendschutz-Regeln festlegen und Logs anfordern.
            </p>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-3">
          {filteredTeams.map(team => {
            const isExpanded = expandedTeam === team.id;
            const pendingReport = mockChatReports.find(r => 
              (r.chatId === team.announcementChatId || r.chatId === team.groupChatId) && 
              r.status === "pending"
            );

            return (
              <Card key={team.id} className="overflow-hidden">
                {/* Team Header */}
                <button
                  onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${
                    team.isYouthTeam ? 'bg-pink-100' : 'bg-emerald-100'
                  }`}>
                    {team.isYouthTeam ? (
                      <Shield className="w-5 h-5 text-pink-600" />
                    ) : (
                      <Users className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{team.teamName}</span>
                      {pendingReport && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 flex items-center gap-1">
                          <Flag className="w-3 h-3" /> Meldung
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{team.departmentName}</span>
                      <span>•</span>
                      <span>{team.memberCount} Mitglieder</span>
                      {team.isYouthTeam && (
                        <>
                          <span>•</span>
                          <span className="text-pink-600">{team.minorCount} Minderjährige</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Status Indicators */}
                  <div className="flex items-center gap-2">
                    {team.announcementEnabled && (
                      <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center" title="Info aktiv">
                        <Megaphone className="w-3 h-3 text-amber-600" />
                      </span>
                    )}
                    {team.groupEnabled && (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center" title="Gruppe aktiv">
                        <Users className="w-3 h-3 text-emerald-600" />
                      </span>
                    )}
                    {team.directEnabled && (
                      <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center" title="DMs aktiv">
                        <MessageSquare className="w-3 h-3 text-blue-600" />
                      </span>
                    )}
                    {team.minorProtectionEnabled && (
                      <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center" title="Jugendschutz aktiv">
                        <Shield className="w-3 h-3 text-pink-600" />
                      </span>
                    )}
                  </div>

                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50">
                    {/* Chat Type Toggles */}
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Chat-Typen</p>
                      
                      {/* Announcement */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <Megaphone className="w-4 h-4 text-amber-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Ankündigungen</p>
                            <p className="text-xs text-slate-500">Nur Trainer können posten</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {team.announcementEnabled ? (
                            <ToggleRight className="w-8 h-8 text-emerald-500 cursor-pointer" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-slate-300 cursor-pointer" />
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            icon={<FileText className="w-3 h-3" />}
                            onClick={() => setShowAuditModal({
                              chatId: team.announcementChatId || "",
                              chatName: `${team.teamName} - Ankündigungen`,
                              chatType: "announcement"
                            })}
                          >
                            Log
                          </Button>
                        </div>
                      </div>

                      {/* Group */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Team-Gruppe</p>
                            <p className="text-xs text-slate-500">Alle Mitglieder können schreiben</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {team.groupEnabled ? (
                            <ToggleRight className="w-8 h-8 text-emerald-500 cursor-pointer" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-slate-300 cursor-pointer" />
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            icon={<FileText className="w-3 h-3" />}
                            onClick={() => setShowAuditModal({
                              chatId: team.groupChatId || "",
                              chatName: `${team.teamName} - Gruppe`,
                              chatType: "team_group"
                            })}
                          >
                            Log
                          </Button>
                        </div>
                      </div>

                      {/* Direct Messages */}
                      <div className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                        team.isYouthTeam && !team.directEnabled ? 'border-pink-200' : 'border-slate-200'
                      }`}>
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-slate-700">Direktnachrichten</p>
                            <p className="text-xs text-slate-500">
                              {team.isYouthTeam && !team.directEnabled 
                                ? "Deaktiviert (Jugendschutz)" 
                                : "Private Chats zwischen Mitgliedern"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {team.directEnabled ? (
                            <ToggleRight className="w-8 h-8 text-emerald-500 cursor-pointer" />
                          ) : (
                            <ToggleLeft className="w-8 h-8 text-slate-300 cursor-pointer" />
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            icon={<FileText className="w-3 h-3" />}
                            onClick={() => setShowAuditModal({
                              chatId: `dm_${team.teamId}`,
                              chatName: `${team.teamName} - Direktnachrichten`,
                              chatType: "direct"
                            })}
                          >
                            Log
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Minor Protection - Always enabled for youth teams, cannot be disabled */}
                    {team.isYouthTeam && (
                      <div className="px-4 py-3 border-t border-slate-200">
                        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-pink-600" />
                            <div>
                              <p className="text-sm font-semibold text-pink-800">Jugendschutz-Modus</p>
                              <p className="text-xs text-pink-600">
                                DMs zwischen Coach und Minderjährigen nur mit Eltern-CC
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4 text-pink-400" />
                            <span className="text-xs text-pink-600 font-medium">Immer aktiv</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending Report */}
                    {pendingReport && (
                      <div className="px-4 py-3 border-t border-slate-200">
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Flag className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-semibold text-orange-800 text-sm">🚨 Meldung ausstehend</p>
                              <p className="text-xs text-orange-600 mt-1">
                                {REPORT_CATEGORIES.find(c => c.value === pendingReport.category)?.label}: {pendingReport.description.substring(0, 80)}...
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="primary" icon={<Eye className="w-3 h-3" />}>
                                  Anzeigen
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // ==========================================
  // TAB: REPORTED
  // ==========================================
  const renderReportedTab = () => {
    const pendingReports = mockChatReports.filter(r => r.status === "pending" || r.status === "reviewing");
    const resolvedReports = mockChatReports.filter(r => r.status === "resolved" || r.status === "dismissed");

    return (
      <div className="space-y-4">
        {/* Pending Reports */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4 text-orange-500" />
            Ausstehende Meldungen ({pendingReports.length})
          </h3>
          
          {pendingReports.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
              <p className="text-slate-600">Keine ausstehenden Meldungen</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingReports.map(report => (
                <Card key={report.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Flag className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                            {REPORT_CATEGORIES.find(c => c.value === report.category)?.label}
                          </span>
                          <p className="font-semibold text-slate-800 mt-1">
                            Chat: {mockChats.find(c => c.id === report.chatId)?.name || report.chatId}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400">{formatRelativeDate(report.createdAt)}</span>
                      </div>
                      
                      {report.reportedMessageContent && (
                        <div className="mt-2 p-2 bg-slate-100 rounded-lg">
                          <p className="text-xs text-slate-500">Gemeldete Nachricht:</p>
                          <p className="text-sm text-slate-700 italic">"{report.reportedMessageContent}"</p>
                          <p className="text-xs text-slate-400 mt-1">— {report.reportedUserName}</p>
                        </div>
                      )}
                      
                      <p className="text-sm text-slate-600 mt-2">{report.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Gemeldet von: {report.reporterName}</p>
                      
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="primary" icon={<CheckCircle className="w-3 h-3" />}>
                          Bearbeiten
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          icon={<FileText className="w-3 h-3" />}
                          onClick={() => setShowAuditModal({
                            chatId: report.chatId,
                            chatName: mockChats.find(c => c.id === report.chatId)?.name || "",
                            chatType: mockChats.find(c => c.id === report.chatId)?.type || "team_group"
                          })}
                        >
                          Log anfordern
                        </Button>
                        <Button size="sm" variant="ghost" icon={<X className="w-3 h-3" />}>
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Resolved Reports */}
        {resolvedReports.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" />
              Erledigte Meldungen ({resolvedReports.length})
            </h3>
            <p className="text-xs text-slate-400">Keine erledigten Meldungen in diesem Zeitraum</p>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // TAB: SPECIAL CHATS
  // ==========================================
  const renderSpecialTab = () => {
    return (
      <div className="space-y-4">
        {/* Create Button */}
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowCreateSpecialChat(true)}
          >
            Neuer Spezial-Chat
          </Button>
        </div>

        {/* Special Chats by Type */}
        <div className="space-y-6">
          {/* Parent Groups */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              Elterngruppen
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {mockSpecialChats.filter(c => c.type === "parent_only").map(chat => (
                <Card key={chat.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{chat.name}</p>
                      <p className="text-xs text-slate-500">{chat.teamName}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{chat.memberCount} Eltern</span>
                        <span>•</span>
                        <span>{renderTypeBadge(chat.chatType)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      icon={<FileText className="w-3 h-3" />}
                      onClick={() => setShowAuditModal({
                        chatId: chat.id,
                        chatName: chat.name,
                        chatType: "team_group"
                      })}
                    >
                      Log
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Coach Groups */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <UserCog className="w-4 h-4 text-blue-500" />
              Trainer-Gruppen
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {mockSpecialChats.filter(c => c.type === "coaches_only").map(chat => (
                <Card key={chat.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <UserCog className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{chat.name}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{chat.memberCount} Trainer</span>
                        <span>•</span>
                        <span>{renderTypeBadge(chat.chatType)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      icon={<FileText className="w-3 h-3" />}
                      onClick={() => setShowAuditModal({
                        chatId: chat.id,
                        chatName: chat.name,
                        chatType: "team_group"
                      })}
                    >
                      Log
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Chats */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-purple-500" />
              Manuelle Chats
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {mockSpecialChats.filter(c => c.type === "custom").map(chat => (
                <Card key={chat.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-purple-100 flex items-center justify-center flex-shrink-0">
                      {chat.chatType === "announcement" ? (
                        <Megaphone className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Users className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{chat.name}</p>
                      {chat.moderators && (
                        <p className="text-xs text-slate-500">Moderatoren: {chat.moderators.join(", ")}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        <span>{chat.memberCount} Mitglieder</span>
                        <span>•</span>
                        <span>{renderTypeBadge(chat.chatType)}</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      icon={<FileText className="w-3 h-3" />}
                      onClick={() => setShowAuditModal({
                        chatId: chat.id,
                        chatName: chat.name,
                        chatType: chat.chatType === "announcement" ? "announcement" : "team_group"
                      })}
                    >
                      Log
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // TAB: AUDITS
  // ==========================================
  const renderAuditsTab = () => {
    const pendingAudits = mockAuditRequests.filter(a => a.status === "pending");
    const approvedAudits = mockAuditRequests.filter(a => a.status === "approved");

    return (
      <div className="space-y-6">
        {/* Info */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-[10px] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Datenschutz-Hinweis</p>
            <p className="text-xs text-amber-600 mt-1">
              Chat-Logs werden standardmäßig nicht angezeigt. Ein Audit-Antrag mit dokumentierter Begründung 
              ist erforderlich und wird vom Vereinsvorstand genehmigt. Genehmigte Audits laufen nach 7 Tagen ab.
            </p>
          </div>
        </div>

        {/* Pending Audits */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Ausstehende Audits ({pendingAudits.length})
          </h3>
          
          {pendingAudits.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-slate-500">Keine ausstehenden Audit-Anträge</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingAudits.map(audit => (
                <Card key={audit.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{audit.chatName}</p>
                        {renderTypeBadge(audit.chatType)}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{audit.reason}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Angefragt von {audit.requestedBy} • {formatRelativeDate(audit.requestedAt)}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="primary" icon={<CheckCircle className="w-3 h-3" />}>
                          Genehmigen
                        </Button>
                        <Button size="sm" variant="ghost" icon={<X className="w-3 h-3" />}>
                          Ablehnen
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Approved Audits */}
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            Genehmigte Audits ({approvedAudits.length})
          </h3>
          
          <div className="space-y-3">
            {approvedAudits.map(audit => {
              const isExpired = audit.expiresAt && new Date(audit.expiresAt) < new Date();
              
              return (
                <Card key={audit.id} className={`p-4 ${isExpired ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                      isExpired ? 'bg-slate-100' : 'bg-emerald-100'
                    }`}>
                      {isExpired ? (
                        <Lock className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-800">{audit.chatName}</p>
                        {renderTypeBadge(audit.chatType)}
                        {isExpired && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                            Abgelaufen
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{audit.reason}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Genehmigt von {audit.approvedBy} • Läuft ab: {formatDate(audit.expiresAt || "")}
                      </p>
                      {!isExpired && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="primary" icon={<Eye className="w-3 h-3" />}>
                            Log anzeigen
                          </Button>
                          <Button size="sm" variant="outline" icon={<Download className="w-3 h-3" />}>
                            Exportieren
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // AUDIT REQUEST MODAL
  // ==========================================
  const renderAuditModal = () => {
    if (!showAuditModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#004941]" />
              Chat-Log anfordern
            </h3>
            <button 
              onClick={() => { setShowAuditModal(null); setAuditReason(""); }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Datenschutz-Hinweis</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Der Zugriff auf Chat-Logs erfordert eine dokumentierte Begründung und wird vom Vereinsvorstand genehmigt.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Chat</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600">{showAuditModal.chatName}</p>
                {renderTypeBadge(showAuditModal.chatType)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">
                Begründung *
              </label>
              <textarea
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] focus:border-transparent"
                rows={4}
                placeholder="z.B. Elternbeschwerde, Meldung überprüfen, Compliance-Audit..."
              />
            </div>
          </div>
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
            <Button variant="outline" onClick={() => { setShowAuditModal(null); setAuditReason(""); }}>
              Abbrechen
            </Button>
            <Button 
              variant="primary"
              disabled={!auditReason.trim()}
              icon={<Send className="w-4 h-4" />}
              onClick={() => {
                console.log("Audit request submitted:", { ...showAuditModal, reason: auditReason });
                setShowAuditModal(null);
                setAuditReason("");
              }}
            >
              Antrag senden
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // ==========================================
  // CREATE SPECIAL CHAT MODAL
  // ==========================================
  const renderCreateSpecialChatModal = () => {
    if (!showCreateSpecialChat) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#004941]" />
              Neuer Spezial-Chat
            </h3>
            <button 
              onClick={() => setShowCreateSpecialChat(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* Chat Type Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Art des Chats *</label>
              <div className="grid grid-cols-3 gap-2">
                <button className="p-3 rounded-[10px] border-2 border-purple-500 bg-purple-50 text-center">
                  <Megaphone className="w-6 h-6 mx-auto text-purple-600" />
                  <p className="text-xs font-medium text-purple-800 mt-1">Ankündigung</p>
                </button>
                <button className="p-3 rounded-[10px] border border-slate-200 bg-white text-center hover:border-slate-300">
                  <Users className="w-6 h-6 mx-auto text-slate-400" />
                  <p className="text-xs font-medium text-slate-600 mt-1">Gruppe</p>
                </button>
                <button className="p-3 rounded-[10px] border border-slate-200 bg-white text-center hover:border-slate-300">
                  <MessageSquare className="w-6 h-6 mx-auto text-slate-400" />
                  <p className="text-xs font-medium text-slate-600 mt-1">DM</p>
                </button>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] focus:border-transparent"
                placeholder="z.B. Vorstand Ankündigungen"
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Vorlage (optional)</label>
              <div className="space-y-2">
                <button className="w-full p-3 rounded-[10px] border border-slate-200 bg-white text-left hover:border-slate-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Elterngruppe für Team</p>
                    <p className="text-xs text-slate-500">Automatisch alle Eltern eines Teams</p>
                  </div>
                </button>
                <button className="w-full p-3 rounded-[10px] border border-slate-200 bg-white text-left hover:border-slate-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <UserCog className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Nur Trainer</p>
                    <p className="text-xs text-slate-500">Alle Trainer des Vereins</p>
                  </div>
                </button>
                <button className="w-full p-3 rounded-[10px] border border-slate-200 bg-white text-left hover:border-slate-300 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <UserPlus className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Manuell auswählen</p>
                    <p className="text-xs text-slate-500">Mitglieder einzeln hinzufügen</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Moderators (for announcements) */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Moderatoren (können posten) *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#004941] focus:border-transparent"
                placeholder="Mitglieder suchen..."
              />
              <p className="text-xs text-slate-500 mt-1">Bei Ankündigungen: Nur Moderatoren können Nachrichten senden</p>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateSpecialChat(false)}>
              Abbrechen
            </Button>
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Chat erstellen
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  // ==========================================
  // MAIN RENDER
  // ==========================================
  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Modals */}
      {renderAuditModal()}
      {renderCreateSpecialChatModal()}
      
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-6 h-6 text-[#004941]" />
              Chat-Verwaltung
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {stats.totalTeams} Teams • {stats.pendingReports > 0 && `${stats.pendingReports} Meldungen • `}{stats.pendingAudits > 0 && `${stats.pendingAudits} Audits ausstehend`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-[10px]">
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "teams" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users className="w-4 h-4" />
            Teams
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-600">
              {stats.totalTeams}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("reported")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "reported" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Flag className="w-4 h-4" />
            Meldungen
            {stats.pendingReports > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-orange-500 text-white">
                {stats.pendingReports}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("special")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "special" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Folder className="w-4 h-4" />
            Spezial
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-600">
              {stats.specialChats}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("audits")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "audits" 
                ? "bg-white text-slate-800 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4 h-4" />
            Audits
            {stats.pendingAudits > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white">
                {stats.pendingAudits}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search - only for teams tab */}
      {activeTab === "teams" && (
        <div className="flex-shrink-0 mb-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Team suchen..."
            className="max-w-md"
          />
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "teams" && renderTeamsTab()}
        {activeTab === "reported" && renderReportedTab()}
        {activeTab === "special" && renderSpecialTab()}
        {activeTab === "audits" && renderAuditsTab()}
      </div>
    </div>
  );
}
