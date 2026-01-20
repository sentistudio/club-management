import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Inbox as InboxIcon, 
  Clock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Paperclip,
  Send,
  X,
  Archive,
  UserCheck,
  Mail,
  FileText,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Save,
  BookTemplate,
  Maximize2,
  Minimize2,
  ArrowLeft,
  Users,
  Eye,
  Search
} from "lucide-react";
import { Button, Badge, Select, Modal, Input } from "../components/ui";
import { SearchInput } from "../components/ui/Input";
import { mockTickets, getTicketMessages, CURRENT_STAFF_ID, CURRENT_STAFF_NAME } from "../data/mockInbox";
import { mockPersons } from "../data/mockPersons";
import { mockTemplates, type MessageTemplate } from "../data/mockTemplates";
import { mockDepartments } from "../data/mockDepartments";
import { mockTeams } from "../data/mockTeams";
import type { TicketStatus, TicketCategory, Ticket, MemberRole } from "../types/inbox";
import { renderMarkdown, formatButtons, insertMarkdown } from "../utils/markdown";

// Status config
const statusConfig: Record<TicketStatus, { label: string; color: string; icon: typeof Clock }> = {
  open: { label: "Offen", color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  pending: { label: "In Bearbeitung", color: "bg-amber-100 text-amber-700", icon: Clock },
  resolved: { label: "Gelöst", color: "bg-green-100 text-green-700", icon: CheckCircle },
  closed: { label: "Geschlossen", color: "bg-neutral-100 text-neutral-600", icon: Archive }
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

const roleConfig: Record<MemberRole, { label: string; color: string }> = {
  active: { label: "Aktiv", color: "bg-green-100 text-green-700" },
  passive: { label: "Passiv", color: "bg-neutral-100 text-neutral-600" },
  admin: { label: "Admin", color: "bg-purple-100 text-purple-700" },
  trainer: { label: "Trainer", color: "bg-blue-100 text-blue-700" },
  volunteer: { label: "Ehrenamt", color: "bg-amber-100 text-amber-700" }
};

// Template categories
const templateCategoryConfig: Record<string, { label: string; color: string }> = {
  general: { label: "Standard", color: "bg-neutral-100 text-neutral-700" },
  fee_question: { label: "Beitragsfragen", color: "bg-emerald-100 text-emerald-700" },
  documents: { label: "Dokumente", color: "bg-blue-100 text-blue-700" },
  membership: { label: "Mitgliedschaft", color: "bg-purple-100 text-purple-700" },
  registration: { label: "Anmeldung", color: "bg-amber-100 text-amber-700" },
  technical: { label: "Technisch", color: "bg-red-100 text-red-700" },
  events: { label: "Veranstaltungen", color: "bg-pink-100 text-pink-700" },
  training: { label: "Training", color: "bg-teal-100 text-teal-700" }
};

type AssignmentFilter = "assigned" | "all" | "unassigned";

export function Inbox() {
  const navigate = useNavigate();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
  const [categoryFilter, setCategoryFilter] = useState<TicketCategory | "">("");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("assigned");
  const [replyText, setReplyText] = useState("");
  
  // Email & Template features
  const [sendEmail, setSendEmail] = useState(true);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [templates, setTemplates] = useState<MessageTemplate[]>(mockTemplates);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [editTemplateName, setEditTemplateName] = useState("");
  const [editTemplateContent, setEditTemplateContent] = useState("");
  const [editTemplateCategory, setEditTemplateCategory] = useState<string>("general");
  
  // New Message modal (supports both single and bulk)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMsgIsBulk, setNewMsgIsBulk] = useState(false);
  const [newMsgRecipient, setNewMsgRecipient] = useState("");
  const [newMsgSubject, setNewMsgSubject] = useState("");
  const [newMsgCategory, setNewMsgCategory] = useState<TicketCategory>("general");
  const [newMsgContent, setNewMsgContent] = useState("");
  const [newMsgSendEmail, setNewMsgSendEmail] = useState(true);
  const [newMsgTemplateDropdown, setNewMsgTemplateDropdown] = useState(false);
  
  // Bulk Message filters (within new message modal)
  const [bulkFilterType, setBulkFilterType] = useState<"all" | "department" | "team" | "role" | "manual">("all");
  const [bulkFilterDepartment, setBulkFilterDepartment] = useState("");
  const [bulkFilterTeam, setBulkFilterTeam] = useState("");
  const [bulkFilterRole, setBulkFilterRole] = useState("");
  const [bulkSelectedMembers, setBulkSelectedMembers] = useState<string[]>([]);
  const [bulkSelectionConfirmed, setBulkSelectionConfirmed] = useState(false);
  const [bulkManualSearch, setBulkManualSearch] = useState("");
  const [showNewMsgPreview, setShowNewMsgPreview] = useState(false);
  
  // Fullscreen/expanded mode
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Templates main view
  const [showTemplatesView, setShowTemplatesView] = useState(false);
  
  // Textarea refs for markdown formatting
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fullscreenTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter tickets based on assignment filter
  const baseTickets = useMemo(() => {
    switch (assignmentFilter) {
      case "assigned":
        return mockTickets.filter(t => t.assignedToId === CURRENT_STAFF_ID);
      case "unassigned":
        return mockTickets.filter(t => !t.assignedToId);
      default:
        return mockTickets;
    }
  }, [assignmentFilter]);

  const filteredTickets = useMemo(() => {
    return baseTickets
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
      .filter(t => !statusFilter || t.status === statusFilter)
      .filter(t => !categoryFilter || t.category === categoryFilter)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [baseTickets, searchTerm, statusFilter, categoryFilter]);

  // Stats for current view
  const stats = useMemo(() => {
    return {
      total: baseTickets.length,
      open: baseTickets.filter(t => t.status === "open").length,
      pending: baseTickets.filter(t => t.status === "pending").length,
      resolved: baseTickets.filter(t => t.status === "resolved").length,
      unread: baseTickets.reduce((sum, t) => sum + t.unreadCount, 0)
    };
  }, [baseTickets]);

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
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
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
    // Find the membership ID for this person
    navigate(`/members/${requesterId}`);
  };

  const statusOptions = Object.entries(statusConfig).map(([value, { label }]) => ({ value, label }));
  const categoryOptions = Object.entries(categoryConfig).map(([value, { label }]) => ({ value, label }));
  
  const assignmentOptions = [
    { value: "assigned", label: "Mir zugewiesen" },
    { value: "all", label: "Alle Tickets" },
    { value: "unassigned", label: "Nicht zugewiesen" }
  ];

  const staffOptions = mockPersons
    .filter(p => ["p1", "p2", "p3"].includes(p.id))
    .map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));

  // Member options for new message
  const memberOptions = mockPersons
    .filter(p => !["p1", "p2", "p3"].includes(p.id)) // Exclude staff
    .map(p => ({ value: p.id, label: `${p.firstName} ${p.lastName}` }));

  const resetNewMessageForm = () => {
    setNewMsgIsBulk(false);
    setNewMsgRecipient("");
    setNewMsgSubject("");
    setNewMsgCategory("general");
    setNewMsgContent("");
    setNewMsgSendEmail(true);
    setShowNewMessageModal(false);
    // Also reset bulk fields
    setBulkFilterType("all");
    setBulkFilterDepartment("");
    setBulkFilterTeam("");
    setBulkFilterRole("");
    setBulkSelectedMembers([]);
    setBulkSelectionConfirmed(false);
    setBulkManualSearch("");
    setShowNewMsgPreview(false);
  };

  // Calculate bulk recipients based on filter
  const bulkRecipients = useMemo(() => {
    const members = mockPersons.filter(p => !["p1", "p2", "p3"].includes(p.id)); // Exclude staff
    
    switch (bulkFilterType) {
      case "all":
        return members;
      case "department":
        if (!bulkFilterDepartment) return [];
        // In a real app, you'd filter by department membership
        return members.filter((_, i) => i % 2 === 0); // Mock filter
      case "team":
        if (!bulkFilterTeam) return [];
        return members.filter((_, i) => i % 3 === 0); // Mock filter
      case "role":
        if (!bulkFilterRole) return [];
        return members.filter((_, i) => i % 2 === 1); // Mock filter
      case "manual":
        return members.filter(m => bulkSelectedMembers.includes(m.id));
      default:
        return [];
    }
  }, [bulkFilterType, bulkFilterDepartment, bulkFilterTeam, bulkFilterRole, bulkSelectedMembers]);

  // Personalize message content
  const personalizeMessage = (content: string, person: typeof mockPersons[0]) => {
    return content
      .replace(/\{\{firstName\}\}/g, person.firstName)
      .replace(/\{\{lastName\}\}/g, person.lastName)
      .replace(/\{\{fullName\}\}/g, `${person.firstName} ${person.lastName}`)
      .replace(/\{\{email\}\}/g, person.email || "");
  };

  // Templates View
  if (showTemplatesView) {
    return (
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowTemplatesView(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Nachrichtenvorlagen</h1>
              <p className="text-neutral-500">Vorlagen erstellen und verwalten</p>
            </div>
          </div>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingTemplate({
                id: "",
                name: "",
                content: "",
                category: "general",
                isDefault: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: CURRENT_STAFF_ID,
                usageCount: 0
              });
              setEditTemplateName("");
              setEditTemplateContent("");
              setEditTemplateCategory("general");
            }}
          >
            Neue Vorlage
          </Button>
        </div>

        {/* Templates Content */}
        <div className="flex-1 flex gap-6 min-h-0">
          {/* Templates List */}
          <div className="flex-1 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-neutral-200 bg-neutral-50">
              <SearchInput
                placeholder="Vorlagen durchsuchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {templates
                .filter(t => !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => b.usageCount - a.usageCount)
                .map((template) => (
                  <div
                    key={template.id}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      editingTemplate?.id === template.id 
                        ? "border-teal-400 bg-teal-50" 
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                    onClick={() => {
                      setEditingTemplate(template);
                      setEditTemplateName(template.name);
                      setEditTemplateContent(template.content);
                      setEditTemplateCategory(template.category || "general");
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-neutral-900">{template.name}</h4>
                          {template.category && templateCategoryConfig[template.category] && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${templateCategoryConfig[template.category].color}`}>
                              {templateCategoryConfig[template.category].label}
                            </span>
                          )}
                          {template.isDefault && (
                            <Badge variant="warning" size="sm">System</Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                          {template.content}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {template.usageCount}× verwendet
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              {templates.filter(t => !searchTerm || t.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <div className="text-center py-12 text-neutral-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>Keine Vorlagen gefunden</p>
                </div>
              )}
            </div>
          </div>

          {/* Template Editor */}
          <div className="w-[500px] flex-shrink-0 bg-white rounded-xl border border-neutral-200 overflow-hidden flex flex-col">
            {editingTemplate ? (
              <>
                <div className="p-4 border-b border-neutral-200 bg-neutral-50">
                  <h3 className="font-semibold text-neutral-900">
                    {editingTemplate.id ? "Vorlage bearbeiten" : "Neue Vorlage"}
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                    <Input
                      value={editTemplateName}
                      onChange={(e) => setEditTemplateName(e.target.value)}
                      placeholder="Vorlagenname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Kategorie</label>
                    <Select
                      options={Object.entries(templateCategoryConfig).map(([value, { label }]) => ({ value, label }))}
                      value={editTemplateCategory}
                      onChange={(e) => setEditTemplateCategory(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Inhalt</label>
                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 mb-2 pb-2 border-b border-neutral-200">
                      {formatButtons.map((btn) => (
                        <button
                          key={btn.label}
                          onClick={() => {
                            // Simple append for template editor
                            setEditTemplateContent(prev => prev + btn.before + btn.placeholder + btn.after);
                          }}
                          className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                          title={btn.label}
                        >
                          {btn.icon === "B" ? <span className="font-bold">B</span> :
                           btn.icon === "I" ? <span className="italic">I</span> :
                           btn.icon}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={editTemplateContent}
                      onChange={(e) => setEditTemplateContent(e.target.value)}
                      placeholder="Nachrichtentext... (Markdown unterstützt)"
                      className="w-full p-3 text-sm border border-neutral-300 rounded-lg resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-mono"
                      rows={12}
                    />
                  </div>
                  {/* Preview */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Vorschau</label>
                    <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 min-h-[100px]">
                      <div className="text-sm text-neutral-700">
                        {renderMarkdown(editTemplateContent) || <span className="text-neutral-400">Vorschau erscheint hier...</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <div>
                    {editingTemplate.id && !editingTemplate.isDefault && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Vorlage wirklich löschen?")) {
                            setTemplates(templates.filter(t => t.id !== editingTemplate.id));
                            setEditingTemplate(null);
                          }
                        }}
                        icon={<Trash2 className="w-4 h-4" />}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Löschen
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingTemplate(null)}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={() => {
                        if (editTemplateName.trim() && editTemplateContent.trim()) {
                          if (editingTemplate.id) {
                            setTemplates(templates.map(t =>
                              t.id === editingTemplate.id
                                ? { ...t, name: editTemplateName.trim(), content: editTemplateContent.trim(), category: editTemplateCategory, updatedAt: new Date().toISOString() }
                                : t
                            ));
                          } else {
                            const newTemplate: MessageTemplate = {
                              id: `tpl_${Date.now()}`,
                              name: editTemplateName.trim(),
                              content: editTemplateContent.trim(),
                              category: editTemplateCategory,
                              isDefault: false,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                              createdBy: CURRENT_STAFF_ID,
                              usageCount: 0
                            };
                            setTemplates([...templates, newTemplate]);
                          }
                          setEditingTemplate(null);
                        }
                      }}
                      disabled={!editTemplateName.trim() || !editTemplateContent.trim()}
                      icon={<Save className="w-4 h-4" />}
                    >
                      {editingTemplate.id ? "Speichern" : "Erstellen"}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-neutral-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                  <p className="font-medium">Vorlage auswählen</p>
                  <p className="text-sm mt-1">oder neue Vorlage erstellen</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Posteingang</h1>
          <p className="text-neutral-500">Mitglieder-Anfragen und Support-Tickets</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <UserCheck className="w-4 h-4" />
            <span>Angemeldet als <strong className="text-neutral-700">{CURRENT_STAFF_NAME}</strong></span>
          </div>
          <Button 
            variant="outline"
            icon={<FileText className="w-4 h-4" />}
            onClick={() => setShowTemplatesView(true)}
          >
            Vorlagen
          </Button>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewMessageModal(true)}
          >
            Neue Nachricht
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <button 
          onClick={() => setStatusFilter("")}
          className={`p-4 rounded-xl border transition-all ${
            !statusFilter ? "bg-teal-50 border-teal-200" : "bg-white border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-100">
              <InboxIcon className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
              <p className="text-sm text-neutral-500">Gesamt</p>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setStatusFilter("open")}
          className={`p-4 rounded-xl border transition-all ${
            statusFilter === "open" ? "bg-blue-50 border-blue-200" : "bg-white border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              <p className="text-sm text-neutral-500">Offen</p>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setStatusFilter("pending")}
          className={`p-4 rounded-xl border transition-all ${
            statusFilter === "pending" ? "bg-amber-50 border-amber-200" : "bg-white border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-neutral-500">In Bearbeitung</p>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setStatusFilter("resolved")}
          className={`p-4 rounded-xl border transition-all ${
            statusFilter === "resolved" ? "bg-green-50 border-green-200" : "bg-white border-neutral-200 hover:border-neutral-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              <p className="text-sm text-neutral-500">Gelöst</p>
            </div>
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-5 min-h-0">
        {/* Ticket List */}
        <div className={`flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden ${
          selectedTicket ? "w-96 flex-shrink-0" : "flex-1"
        }`}>
          {/* Search & Filters */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <SearchInput
                  placeholder="Ticket suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  options={assignmentOptions}
                  value={assignmentFilter}
                  onChange={(e) => setAssignmentFilter(e.target.value as AssignmentFilter)}
                  placeholder="Zuweisung"
                  className="text-sm"
                />
              </div>
              <Select
                options={categoryOptions}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as TicketCategory | "")}
                placeholder="Kategorie"
                className="text-sm"
              />
            </div>
          </div>

          {/* Ticket List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <InboxIcon className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                <p className="font-medium">Keine Tickets gefunden</p>
                <p className="text-sm mt-1">
                  {assignmentFilter === "assigned" 
                    ? "Ihnen sind keine Tickets zugewiesen" 
                    : assignmentFilter === "unassigned"
                      ? "Alle Tickets sind zugewiesen"
                      : "Keine Tickets vorhanden"
                  }
                </p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full p-4 text-left border-b border-neutral-100 hover:bg-neutral-50 transition-colors ${
                    selectedTicket?.id === ticket.id ? "bg-teal-50" : ""
                  } ${ticket.unreadCount > 0 ? "bg-blue-50/50" : ""} ${ticket.isBulkMessage ? "bg-purple-50/30" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar/Icon */}
                    {ticket.isBulkMessage ? (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToMemberProfile(ticket.requesterId);
                        }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-medium text-sm flex-shrink-0 hover:ring-2 hover:ring-teal-300 hover:ring-offset-2 transition-all"
                        title="Profil ansehen"
                      >
                        {ticket.requesterName.split(" ").map(n => n[0]).join("")}
                      </button>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {ticket.isBulkMessage ? (
                            <>
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                Rundschreiben
                              </span>
                              <span className="text-xs text-neutral-500">
                                {ticket.bulkRecipientCount} Empfänger
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-neutral-900 truncate">
                                {ticket.requesterName}
                              </span>
                              {/* On behalf badge */}
                              {ticket.isOnBehalf && ticket.onBehalfOfName && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                                  👥 für {ticket.onBehalfOfName}
                                </span>
                              )}
                              {ticket.requesterDepartment && (
                                <span className="text-xs text-neutral-500 truncate hidden sm:inline">
                                  {ticket.requesterDepartment}
                                </span>
                              )}
                              {ticket.requesterRole && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleConfig[ticket.requesterRole].color} hidden sm:inline-flex`}>
                                  {roleConfig[ticket.requesterRole].label}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500 flex-shrink-0">
                          {formatDate(ticket.updatedAt)}
                        </span>
                      </div>
                      
                      {/* Subject */}
                      <p className={`text-sm truncate mb-1 ${
                        ticket.unreadCount > 0 ? "font-semibold text-neutral-900" : "text-neutral-700"
                      }`}>
                        {ticket.subject}
                      </p>
                      
                      {/* Preview */}
                      <p className="text-xs text-neutral-500 truncate mb-2">
                        {ticket.previewText}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {ticket.isBulkMessage ? (
                          <>
                            <span className="text-xs text-neutral-400">
                              📤 {ticket.bulkFilter}
                            </span>
                            <span className="text-xs text-neutral-400 ml-auto">
                              von {ticket.bulkSentBy}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${statusConfig[ticket.status].color}`}>
                              {statusConfig[ticket.status].label}
                            </span>
                            <span className="text-xs text-neutral-400">
                              {categoryConfig[ticket.category].emoji} {categoryConfig[ticket.category].label}
                            </span>
                            {ticket.assignedToId && assignmentFilter === "all" && (
                              <span className="text-xs text-neutral-400 ml-auto">
                                → {ticket.assignedToName?.split(" ")[0]}
                              </span>
                            )}
                            {!ticket.assignedToId && (
                              <span className="text-xs text-amber-500 ml-auto">
                                Nicht zugewiesen
                              </span>
                            )}
                            {ticket.unreadCount > 0 && (
                              <span className={`${(assignmentFilter === "all" && ticket.assignedToId) || !ticket.assignedToId ? "" : "ml-auto"} w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center`}>
                                {ticket.unreadCount}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Ticket Detail */}
        {selectedTicket && !isExpanded && (
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Compact Ticket Header */}
            <div className={`px-4 py-3 border-b border-neutral-200 ${selectedTicket.isBulkMessage ? "bg-purple-50" : "bg-neutral-50"}`}>
              {/* Row 1: Title + Actions */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-xs text-neutral-400 font-mono flex-shrink-0">{selectedTicket.ticketNumber}</span>
                  {selectedTicket.isBulkMessage && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 flex-shrink-0">
                      Rundschreiben
                    </span>
                  )}
                  <h2 className="font-semibold text-neutral-900 truncate">{selectedTicket.subject}</h2>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button 
                    onClick={() => setIsExpanded(true)}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg"
                    title="Vollbild"
                  >
                    <Maximize2 className="w-4 h-4 text-neutral-400" />
                  </button>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg"
                    title="Schließen"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
              
              {/* Row 2: Bulk info OR Requester + Meta + Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                {selectedTicket.isBulkMessage ? (
                  <>
                    {/* Bulk Message Info */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{selectedTicket.bulkRecipientCount} Empfänger</span>
                      <span className="text-xs text-neutral-400">• {selectedTicket.bulkFilter}</span>
                    </div>
                    
                    <span className="text-neutral-300">|</span>
                    
                    <span className="text-xs text-neutral-500">
                      Gesendet von {selectedTicket.bulkSentBy}
                    </span>
                    
                    <span className="text-xs text-neutral-400">
                      • {formatFullDate(selectedTicket.createdAt)}
                    </span>
                  </>
                ) : (
                  <>
                    {/* Requester - compact */}
                    <button 
                      onClick={() => goToMemberProfile(selectedTicket.requesterId)}
                      className="flex items-center gap-2 hover:bg-neutral-200 rounded-lg px-2 py-1 -ml-2 transition-colors"
                      title="Profil ansehen"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {selectedTicket.requesterName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-medium text-neutral-700">{selectedTicket.requesterName}</span>
                      {/* On behalf badge in header */}
                      {selectedTicket.isOnBehalf && selectedTicket.onBehalfOfName && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                          👥 für {selectedTicket.onBehalfOfName}
                        </span>
                      )}
                      {selectedTicket.requesterRole && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${roleConfig[selectedTicket.requesterRole].color}`}>
                          {roleConfig[selectedTicket.requesterRole].label}
                        </span>
                      )}
                      {selectedTicket.requesterDepartment && (
                        <span className="text-xs text-neutral-400">{selectedTicket.requesterDepartment}</span>
                      )}
                    </button>
                    
                    <span className="text-neutral-300">|</span>
                    
                    {/* Status & Category badges */}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedTicket.status].color}`}>
                      {statusConfig[selectedTicket.status].label}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {categoryConfig[selectedTicket.category].emoji} {categoryConfig[selectedTicket.category].label}
                    </span>
                    
                    {/* Spacer */}
                    <div className="flex-1" />
                    
                    {/* Compact Actions */}
                    <div className="flex items-center gap-2">
                      <select
                        value={selectedTicket.status}
                        onChange={() => {}}
                        className="text-xs border border-neutral-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal-400"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <select
                        value={selectedTicket.assignedToId || ""}
                        onChange={() => {}}
                        className="text-xs border border-neutral-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-teal-400"
                      >
                        <option value="">Zuweisen...</option>
                        {staffOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <button className="p-1 hover:bg-neutral-200 rounded">
                        <MoreVertical className="w-4 h-4 text-neutral-400" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {selectedMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-3 ${message.isInternal ? "opacity-60" : ""}`}
                >
                  {/* Avatar - Clickable for members */}
                  {message.senderType === "member" ? (
                    <button
                      onClick={() => goToMemberProfile(message.senderId)}
                      className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 hover:ring-2 hover:ring-teal-300 hover:ring-offset-2 transition-all"
                      title="Profil ansehen"
                    >
                      {message.senderName.split(" ").map(n => n[0]).join("")}
                    </button>
                  ) : (
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                      message.senderType === "system"
                        ? "bg-neutral-300"
                        : "bg-gradient-to-br from-blue-400 to-blue-600"
                    }`}>
                      {message.senderType === "system" ? "⚙️" : message.senderName.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-900">{message.senderName}</span>
                      {message.senderType === "staff" && (
                        <Badge variant="info" size="sm">Mitarbeiter</Badge>
                      )}
                      {message.isInternal && (
                        <Badge variant="warning" size="sm">Intern</Badge>
                      )}
                      <span className="text-xs text-neutral-500">{formatFullDate(message.createdAt)}</span>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      message.senderType === "member" 
                        ? "bg-neutral-100" 
                        : message.isInternal 
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-blue-50"
                    }`}>
                      <div className="text-sm text-neutral-700">{renderMarkdown(message.content)}</div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          {message.attachments.map((att) => (
                            <a 
                              key={att.id}
                              href={att.fileUrl}
                              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
                            >
                              <Paperclip className="w-4 h-4" />
                              {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Box - hidden for bulk messages */}
            {!selectedTicket.isBulkMessage && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              {/* Template selector */}
              <div className="relative mb-3">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Vorlage verwenden</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showTemplateDropdown && (
                  <div className="absolute left-0 top-full mt-1 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-20 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-neutral-100">
                      <button
                        onClick={() => {
                          setShowTemplateDropdown(false);
                          setShowTemplateManager(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                      >
                        <BookTemplate className="w-4 h-4" />
                        Vorlagen verwalten...
                      </button>
                    </div>
                    <div className="p-2">
                      <p className="text-xs text-neutral-400 px-3 py-1 uppercase font-medium">Häufig verwendet</p>
                      {templates
                        .sort((a, b) => b.usageCount - a.usageCount)
                        .slice(0, 5)
                        .map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setReplyText(template.content);
                              setShowTemplateDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg"
                          >
                            <p className="font-medium text-neutral-900">{template.name}</p>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{template.content.substring(0, 60)}...</p>
                          </button>
                        ))}
                    </div>
                    {templates.length > 5 && (
                      <div className="p-2 border-t border-neutral-100">
                        <p className="text-xs text-neutral-400 px-3 py-1 uppercase font-medium">Alle Vorlagen</p>
                        {templates
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((template) => (
                            <button
                              key={template.id}
                              onClick={() => {
                                setReplyText(template.content);
                                setShowTemplateDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg"
                            >
                              <p className="font-medium text-neutral-900">{template.name}</p>
                              <p className="text-xs text-neutral-500 truncate mt-0.5">{template.content.substring(0, 60)}...</p>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1">
                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-1 mb-2 pb-2 border-b border-neutral-200">
                    {formatButtons.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          if (replyTextareaRef.current) {
                            const newText = insertMarkdown(
                              replyTextareaRef.current,
                              btn.before,
                              btn.after,
                              btn.placeholder
                            );
                            setReplyText(newText);
                            replyTextareaRef.current.focus();
                          }
                        }}
                        className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-200 rounded transition-colors"
                        title={btn.label}
                      >
                        {btn.icon === "B" ? <span className="font-bold">B</span> :
                         btn.icon === "I" ? <span className="italic">I</span> :
                         btn.icon}
                      </button>
                    ))}
                    <span className="text-xs text-neutral-400 ml-auto">Markdown unterstützt</span>
                  </div>
                  <textarea
                    ref={replyTextareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Antwort schreiben... (Markdown unterstützt: **fett**, *kursiv*, - Listen)"
                    className="w-full p-3 text-sm border border-neutral-300 rounded-lg resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-mono"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-neutral-500 hover:bg-neutral-200 rounded-lg">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-teal-500" />
                    Interne Notiz
                  </label>
                  
                  <div className="h-4 w-px bg-neutral-300" />
                  
                  {/* Email Checkbox */}
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                    />
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>Auch als E-Mail senden</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Save as Template */}
                  {replyText.trim().length > 20 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Save className="w-4 h-4" />}
                      onClick={() => setShowSaveTemplateModal(true)}
                    >
                      Als Vorlage speichern
                    </Button>
                  )}
                  
                  <Button icon={<Send className="w-4 h-4" />}>
                    Senden
                  </Button>
                </div>
              </div>
            </div>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen Ticket View */}
      {selectedTicket && isExpanded && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Fullscreen Header */}
          <div className={`px-6 py-4 border-b border-neutral-200 flex items-center gap-4 ${selectedTicket.isBulkMessage ? "bg-purple-50" : "bg-white"}`}>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
              title="Zurück"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-sm text-neutral-400 font-mono">{selectedTicket.ticketNumber}</span>
              {selectedTicket.isBulkMessage && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Rundschreiben
                </span>
              )}
              <h1 className="text-lg font-semibold text-neutral-900 truncate">{selectedTicket.subject}</h1>
              {!selectedTicket.isBulkMessage && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig[selectedTicket.status].color}`}>
                  {statusConfig[selectedTicket.status].label}
                </span>
              )}
            </div>
            
            {/* Bulk Message Info OR Requester */}
            {selectedTicket.isBulkMessage ? (
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900">{selectedTicket.bulkRecipientCount} Empfänger</p>
                  <p className="text-xs text-neutral-500">
                    {selectedTicket.bulkFilter} · gesendet von {selectedTicket.bulkSentBy}
                  </p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => goToMemberProfile(selectedTicket.requesterId)}
                className="flex items-center gap-2 hover:bg-neutral-100 rounded-lg px-3 py-2 transition-colors"
                title="Profil ansehen"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                  {selectedTicket.requesterName.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-neutral-900">{selectedTicket.requesterName}</p>
                  <p className="text-xs text-neutral-500">
                    {selectedTicket.requesterDepartment && `${selectedTicket.requesterDepartment} · `}
                    {selectedTicket.requesterEmail}
                  </p>
                </div>
              </button>
            )}

            <div className="h-8 w-px bg-neutral-200" />
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <select
                value={selectedTicket.status}
                onChange={() => {}}
                className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-teal-400"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={selectedTicket.assignedToId || ""}
                onChange={() => {}}
                className="text-sm border border-neutral-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-teal-400"
              >
                <option value="">Zuweisen...</option>
                {staffOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="h-8 w-px bg-neutral-200" />
            
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
              title="Minimieren"
            >
              <Minimize2 className="w-5 h-5 text-neutral-600" />
            </button>
            <button 
              onClick={() => {
                setIsExpanded(false);
                setSelectedTicket(null);
              }}
              className="p-2 hover:bg-neutral-100 rounded-lg"
              title="Schließen"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Messages Area - Fullscreen */}
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
            <div className="max-w-4xl mx-auto space-y-4">
              {selectedMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex gap-4 ${message.isInternal ? "opacity-60" : ""}`}
                >
                  {message.senderType === "member" ? (
                    <button
                      onClick={() => goToMemberProfile(message.senderId)}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0 hover:ring-2 hover:ring-teal-300 hover:ring-offset-2 transition-all"
                      title="Profil ansehen"
                    >
                      {message.senderName.split(" ").map(n => n[0]).join("")}
                    </button>
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 ${
                      message.senderType === "system"
                        ? "bg-neutral-300"
                        : "bg-gradient-to-br from-blue-400 to-blue-600"
                    }`}>
                      {message.senderType === "system" ? "⚙️" : message.senderName.split(" ").map(n => n[0]).join("")}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-neutral-900">{message.senderName}</span>
                      {message.senderType === "staff" && (
                        <Badge variant="info" size="sm">Mitarbeiter</Badge>
                      )}
                      {message.isInternal && (
                        <Badge variant="warning" size="sm">Intern</Badge>
                      )}
                      <span className="text-xs text-neutral-500">{formatFullDate(message.createdAt)}</span>
                    </div>
                    <div className={`p-4 rounded-xl ${
                      message.senderType === "member" 
                        ? "bg-white border border-neutral-200" 
                        : message.isInternal 
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-blue-50 border border-blue-100"
                    }`}>
                      <div className="text-sm text-neutral-700">{renderMarkdown(message.content)}</div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          {message.attachments.map((att) => (
                            <a 
                              key={att.id}
                              href={att.fileUrl}
                              className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700"
                            >
                              <Paperclip className="w-4 h-4" />
                              {att.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Box - Fullscreen - hidden for bulk messages */}
          {!selectedTicket.isBulkMessage && (
          <div className="border-t border-neutral-200 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              {/* Template selector */}
              <div className="relative mb-3">
                <button
                  onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                  className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Vorlage verwenden</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showTemplateDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {showTemplateDropdown && (
                  <div className="absolute left-0 bottom-full mb-1 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 z-20 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-neutral-100">
                      <button
                        onClick={() => {
                          setShowTemplateDropdown(false);
                          setShowTemplateManager(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 rounded-lg"
                      >
                        <BookTemplate className="w-4 h-4" />
                        Vorlagen verwalten...
                      </button>
                    </div>
                    <div className="p-2">
                      {templates
                        .sort((a, b) => b.usageCount - a.usageCount)
                        .slice(0, 5)
                        .map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setReplyText(template.content);
                              setShowTemplateDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg"
                          >
                            <p className="font-medium text-neutral-900">{template.name}</p>
                            <p className="text-xs text-neutral-500 truncate mt-0.5">{template.content.substring(0, 60)}...</p>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1">
                  {/* Formatting Toolbar - Fullscreen */}
                  <div className="flex items-center gap-1 mb-2 pb-2 border-b border-neutral-200">
                    {formatButtons.map((btn) => (
                      <button
                        key={btn.label}
                        onClick={() => {
                          if (fullscreenTextareaRef.current) {
                            const newText = insertMarkdown(
                              fullscreenTextareaRef.current,
                              btn.before,
                              btn.after,
                              btn.placeholder
                            );
                            setReplyText(newText);
                            fullscreenTextareaRef.current.focus();
                          }
                        }}
                        className="px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                        title={btn.label}
                      >
                        {btn.icon === "B" ? <span className="font-bold">B</span> :
                         btn.icon === "I" ? <span className="italic">I</span> :
                         btn.icon}
                      </button>
                    ))}
                    <span className="text-xs text-neutral-400 ml-auto">Markdown unterstützt</span>
                  </div>
                  <textarea
                    ref={fullscreenTextareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Antwort schreiben... (Markdown unterstützt: **fett**, *kursiv*, - Listen)"
                    className="w-full p-4 text-sm border border-neutral-300 rounded-xl resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-mono"
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input type="checkbox" className="rounded text-teal-500" />
                    Interne Notiz
                  </label>
                  
                  <div className="h-4 w-px bg-neutral-300" />
                  
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={sendEmail}
                      onChange={(e) => setSendEmail(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-300 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
                    />
                    <Mail className="w-4 h-4 text-neutral-400" />
                    <span>Auch als E-Mail senden</span>
                  </label>
                </div>
                
                <div className="flex items-center gap-2">
                  {replyText.trim().length > 20 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Save className="w-4 h-4" />}
                      onClick={() => setShowSaveTemplateModal(true)}
                    >
                      Als Vorlage speichern
                    </Button>
                  )}
                  
                  <Button icon={<Send className="w-4 h-4" />}>
                    Senden
                  </Button>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* Save as Template Modal */}
      <Modal
        isOpen={showSaveTemplateModal}
        onClose={() => {
          setShowSaveTemplateModal(false);
          setNewTemplateName("");
        }}
        title="Als Vorlage speichern"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Vorlagenname
            </label>
            <Input
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="z.B. Begrüßung, Rechnungsinfo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Inhalt (Vorschau)
            </label>
            <div className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600 max-h-40 overflow-y-auto whitespace-pre-wrap">
              {replyText}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveTemplateModal(false);
                setNewTemplateName("");
              }}
            >
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                if (newTemplateName.trim()) {
                  const newTemplate: MessageTemplate = {
                    id: `tpl_${Date.now()}`,
                    name: newTemplateName.trim(),
                    content: replyText,
                    isDefault: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    createdBy: CURRENT_STAFF_ID,
                    usageCount: 0
                  };
                  setTemplates([...templates, newTemplate]);
                  setShowSaveTemplateModal(false);
                  setNewTemplateName("");
                }
              }}
              disabled={!newTemplateName.trim()}
              icon={<Save className="w-4 h-4" />}
            >
              Speichern
            </Button>
          </div>
        </div>
      </Modal>

      {/* Template Manager Modal */}
      <Modal
        isOpen={showTemplateManager}
        onClose={() => {
          setShowTemplateManager(false);
          setEditingTemplate(null);
        }}
        title="Vorlagen verwalten"
        size="lg"
      >
        <div className="space-y-4">
          {/* Add New Template */}
          {!editingTemplate && (
            <Button
              variant="outline"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setEditingTemplate({
                  id: "",
                  name: "",
                  content: "",
                  isDefault: false,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  createdBy: CURRENT_STAFF_ID,
                  usageCount: 0
                });
                setEditTemplateName("");
                setEditTemplateContent("");
              }}
            >
              Neue Vorlage erstellen
            </Button>
          )}
          
          {/* Edit/Create Form */}
          {editingTemplate && (
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-4">
              <h3 className="font-medium text-neutral-900">
                {editingTemplate.id ? "Vorlage bearbeiten" : "Neue Vorlage"}
              </h3>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                <Input
                  value={editTemplateName}
                  onChange={(e) => setEditTemplateName(e.target.value)}
                  placeholder="Vorlagenname"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Inhalt</label>
                <textarea
                  value={editTemplateContent}
                  onChange={(e) => setEditTemplateContent(e.target.value)}
                  placeholder="Nachrichtentext..."
                  className="w-full p-3 text-sm border border-neutral-300 rounded-lg resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                  rows={6}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setEditingTemplate(null)}
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={() => {
                    if (editTemplateName.trim() && editTemplateContent.trim()) {
                      if (editingTemplate.id) {
                        // Update existing
                        setTemplates(templates.map(t =>
                          t.id === editingTemplate.id
                            ? { ...t, name: editTemplateName.trim(), content: editTemplateContent.trim(), updatedAt: new Date().toISOString() }
                            : t
                        ));
                      } else {
                        // Create new
                        const newTemplate: MessageTemplate = {
                          id: `tpl_${Date.now()}`,
                          name: editTemplateName.trim(),
                          content: editTemplateContent.trim(),
                          isDefault: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                          createdBy: CURRENT_STAFF_ID,
                          usageCount: 0
                        };
                        setTemplates([...templates, newTemplate]);
                      }
                      setEditingTemplate(null);
                    }
                  }}
                  disabled={!editTemplateName.trim() || !editTemplateContent.trim()}
                  icon={<Save className="w-4 h-4" />}
                >
                  {editingTemplate.id ? "Aktualisieren" : "Erstellen"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Templates List */}
          {!editingTemplate && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {templates.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                  <p>Keine Vorlagen vorhanden</p>
                </div>
              ) : (
                templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 bg-white border border-neutral-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-neutral-900">{template.name}</h4>
                          {template.isDefault && (
                            <Badge variant="info" size="sm">Standard</Badge>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                          {template.content}
                        </p>
                        <p className="text-xs text-neutral-400 mt-2">
                          {template.usageCount}× verwendet
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTemplate(template);
                            setEditTemplateName(template.name);
                            setEditTemplateContent(template.content);
                          }}
                          className="p-2 text-neutral-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {!template.isDefault && (
                          <button
                            onClick={() => {
                              if (confirm("Vorlage wirklich löschen?")) {
                                setTemplates(templates.filter(t => t.id !== template.id));
                              }
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* Close Button */}
          {!editingTemplate && (
            <div className="flex justify-end pt-2 border-t border-neutral-200">
              <Button
                variant="outline"
                onClick={() => setShowTemplateManager(false)}
              >
                Schließen
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* New Message Modal */}
      <Modal
        isOpen={showNewMessageModal}
        onClose={resetNewMessageForm}
        title="Neue Nachricht"
        size="lg"
      >
        <div className="space-y-4">
          {/* Empfänger */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-neutral-700">
                Empfänger <span className="text-red-500">*</span>
              </label>
            </div>
            
            {/* Show bulk badge when confirmed, or single select when not in bulk mode */}
            {newMsgIsBulk && bulkSelectionConfirmed ? (
              <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">
                  Mehrere ({bulkRecipients.length})
                </span>
                <span className="text-sm text-purple-600">
                  {bulkFilterType === "all" && "Alle Mitglieder"}
                  {bulkFilterType === "department" && `Abteilung: ${mockDepartments.find(d => d.id === bulkFilterDepartment)?.name || ""}`}
                  {bulkFilterType === "team" && `Team: ${mockTeams.find(t => t.id === bulkFilterTeam)?.name || ""}`}
                  {bulkFilterType === "role" && `Rolle: ${roleConfig[bulkFilterRole as keyof typeof roleConfig]?.label || ""}`}
                  {bulkFilterType === "manual" && "Manuelle Auswahl"}
                </span>
                <button
                  onClick={() => {
                    setNewMsgIsBulk(false);
                    setBulkSelectionConfirmed(false);
                    setBulkFilterType("all");
                    setBulkFilterDepartment("");
                    setBulkFilterTeam("");
                    setBulkFilterRole("");
                    setBulkSelectedMembers([]);
                    setBulkManualSearch("");
                  }}
                  className="ml-auto p-1 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-colors"
                  title="Empfänger entfernen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : !newMsgIsBulk ? (
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select
                    options={memberOptions}
                    value={newMsgRecipient}
                    onChange={(e) => setNewMsgRecipient(e.target.value)}
                    placeholder="Mitglied auswählen..."
                  />
                </div>
                <button
                  onClick={() => setNewMsgIsBulk(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors"
                  title="Rundschreiben an mehrere Empfänger"
                >
                  <Users className="w-4 h-4" />
                  <span>Rundschreiben</span>
                </button>
              </div>
            ) : null}
          </div>
          
          {/* Bulk Recipient Selector (shown when clicking Rundschreiben, before confirmation) */}
          {newMsgIsBulk && !bulkSelectionConfirmed && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 space-y-4">
              <h4 className="font-medium text-purple-900 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Empfänger für Rundschreiben auswählen
              </h4>
              
              {/* Filter Type */}
              <div className="grid grid-cols-2 gap-2">
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${bulkFilterType === "all" ? "bg-white border-purple-400 shadow-sm" : "bg-white/50 border-purple-200 hover:border-purple-300"}`}>
                  <input type="radio" name="bulkFilter" checked={bulkFilterType === "all"} onChange={() => setBulkFilterType("all")} className="text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm font-medium">Alle Mitglieder</span>
                </label>
                
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${bulkFilterType === "department" ? "bg-white border-purple-400 shadow-sm" : "bg-white/50 border-purple-200 hover:border-purple-300"}`}>
                  <input type="radio" name="bulkFilter" checked={bulkFilterType === "department"} onChange={() => setBulkFilterType("department")} className="text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm font-medium">Nach Abteilung</span>
                </label>
                
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${bulkFilterType === "team" ? "bg-white border-purple-400 shadow-sm" : "bg-white/50 border-purple-200 hover:border-purple-300"}`}>
                  <input type="radio" name="bulkFilter" checked={bulkFilterType === "team"} onChange={() => setBulkFilterType("team")} className="text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm font-medium">Nach Team</span>
                </label>
                
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${bulkFilterType === "role" ? "bg-white border-purple-400 shadow-sm" : "bg-white/50 border-purple-200 hover:border-purple-300"}`}>
                  <input type="radio" name="bulkFilter" checked={bulkFilterType === "role"} onChange={() => setBulkFilterType("role")} className="text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm font-medium">Nach Rolle</span>
                </label>
                
                <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors col-span-2 ${bulkFilterType === "manual" ? "bg-white border-purple-400 shadow-sm" : "bg-white/50 border-purple-200 hover:border-purple-300"}`}>
                  <input type="radio" name="bulkFilter" checked={bulkFilterType === "manual"} onChange={() => setBulkFilterType("manual")} className="text-purple-500 focus:ring-purple-500" />
                  <span className="text-sm font-medium">Manuell auswählen</span>
                </label>
              </div>
              
              {/* Filter Value Selector */}
              {bulkFilterType === "department" && (
                <Select
                  options={mockDepartments.map(d => ({ value: d.id, label: d.name }))}
                  value={bulkFilterDepartment}
                  onChange={(e) => setBulkFilterDepartment(e.target.value)}
                  placeholder="Abteilung wählen..."
                />
              )}
              {bulkFilterType === "team" && (
                <Select
                  options={mockTeams.map(t => ({ value: t.id, label: t.name }))}
                  value={bulkFilterTeam}
                  onChange={(e) => setBulkFilterTeam(e.target.value)}
                  placeholder="Team wählen..."
                />
              )}
              {bulkFilterType === "role" && (
                <Select
                  options={Object.entries(roleConfig).map(([value, { label }]) => ({ value, label }))}
                  value={bulkFilterRole}
                  onChange={(e) => setBulkFilterRole(e.target.value)}
                  placeholder="Rolle wählen..."
                />
              )}
              {bulkFilterType === "manual" && (
                <div className="space-y-2">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={bulkManualSearch}
                      onChange={(e) => setBulkManualSearch(e.target.value)}
                      placeholder="Mitglieder suchen..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  
                  {/* Members list with checkboxes */}
                  <div className="border border-neutral-200 rounded-lg max-h-48 overflow-y-auto bg-white">
                    {mockPersons
                      .filter(p => !["p1", "p2", "p3"].includes(p.id))
                      .filter(p => 
                        !bulkManualSearch || 
                        `${p.firstName} ${p.lastName}`.toLowerCase().includes(bulkManualSearch.toLowerCase())
                      )
                      .map(person => (
                        <label key={person.id} className="flex items-center gap-2 px-3 py-2 hover:bg-purple-50 cursor-pointer border-b border-neutral-100 last:border-0">
                          <input
                            type="checkbox"
                            checked={bulkSelectedMembers.includes(person.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setBulkSelectedMembers([...bulkSelectedMembers, person.id]);
                              } else {
                                setBulkSelectedMembers(bulkSelectedMembers.filter(id => id !== person.id));
                              }
                            }}
                            className="text-purple-500 focus:ring-purple-500 rounded"
                          />
                          <span className="text-sm text-neutral-700">{person.firstName} {person.lastName}</span>
                        </label>
                      ))}
                    {mockPersons
                      .filter(p => !["p1", "p2", "p3"].includes(p.id))
                      .filter(p => 
                        !bulkManualSearch || 
                        `${p.firstName} ${p.lastName}`.toLowerCase().includes(bulkManualSearch.toLowerCase())
                      ).length === 0 && (
                        <div className="p-4 text-center text-sm text-neutral-500">
                          Keine Mitglieder gefunden
                        </div>
                      )}
                  </div>
                  
                  {bulkSelectedMembers.length > 0 && (
                    <p className="text-xs text-purple-600">
                      {bulkSelectedMembers.length} ausgewählt: {mockPersons.filter(p => bulkSelectedMembers.includes(p.id)).map(p => p.firstName).slice(0, 3).join(", ")}
                      {bulkSelectedMembers.length > 3 && ` +${bulkSelectedMembers.length - 3} weitere`}
                    </p>
                  )}
                </div>
              )}
              
              {/* Confirm Selection */}
              <div className="flex items-center justify-between pt-2 border-t border-purple-200">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {bulkFilterType === "all" && `${mockPersons.filter(p => !["p1", "p2", "p3"].includes(p.id)).length} Empfänger`}
                    {bulkFilterType === "department" && bulkFilterDepartment && `${bulkRecipients.length} Empfänger`}
                    {bulkFilterType === "department" && !bulkFilterDepartment && "Bitte Abteilung wählen"}
                    {bulkFilterType === "team" && bulkFilterTeam && `${bulkRecipients.length} Empfänger`}
                    {bulkFilterType === "team" && !bulkFilterTeam && "Bitte Team wählen"}
                    {bulkFilterType === "role" && bulkFilterRole && `${bulkRecipients.length} Empfänger`}
                    {bulkFilterType === "role" && !bulkFilterRole && "Bitte Rolle wählen"}
                    {bulkFilterType === "manual" && `${bulkSelectedMembers.length} ausgewählt`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setNewMsgIsBulk(false);
                      setBulkFilterType("all");
                      setBulkFilterDepartment("");
                      setBulkFilterTeam("");
                      setBulkFilterRole("");
                      setBulkSelectedMembers([]);
                      setBulkManualSearch("");
                    }}
                  >
                    Abbrechen
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setBulkSelectionConfirmed(true)}
                    disabled={
                      (bulkFilterType === "department" && !bulkFilterDepartment) ||
                      (bulkFilterType === "team" && !bulkFilterTeam) ||
                      (bulkFilterType === "role" && !bulkFilterRole) ||
                      (bulkFilterType === "manual" && bulkSelectedMembers.length === 0)
                    }
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Betreff <span className="text-red-500">*</span>
            </label>
            <Input
              value={newMsgSubject}
              onChange={(e) => setNewMsgSubject(e.target.value)}
              placeholder="Betreff der Nachricht"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Kategorie
            </label>
            {newMsgIsBulk && bulkSelectionConfirmed ? (
              <div className="flex items-center gap-2 p-3 bg-neutral-100 border border-neutral-200 rounded-lg text-sm text-neutral-600">
                <span>📢 Rundschreiben</span>
                <span className="text-neutral-400">(fest zugewiesen)</span>
              </div>
            ) : (
              <Select
                options={categoryOptions}
                value={newMsgCategory}
                onChange={(e) => setNewMsgCategory(e.target.value as TicketCategory)}
              />
            )}
          </div>

          {/* Message Content */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-neutral-700">
                Nachricht <span className="text-red-500">*</span>
              </label>
              
              {/* Template Selector */}
              <div className="relative">
                <button
                  onClick={() => setNewMsgTemplateDropdown(!newMsgTemplateDropdown)}
                  className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-2 py-1 rounded transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Vorlage</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${newMsgTemplateDropdown ? "rotate-180" : ""}`} />
                </button>
                
                {newMsgTemplateDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl shadow-lg border border-neutral-200 z-20 max-h-64 overflow-y-auto">
                    <div className="p-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => {
                            setNewMsgContent(template.content);
                            setNewMsgTemplateDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 rounded-lg"
                        >
                          <p className="font-medium text-neutral-900">{template.name}</p>
                          <p className="text-xs text-neutral-500 truncate mt-0.5">{template.content.substring(0, 50)}...</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Personalization hint (bulk only) */}
            {newMsgIsBulk && bulkSelectionConfirmed && (
              <div className="mb-2 p-2 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-800">
                  <strong>Personalisierung:</strong>{" "}
                  <code className="bg-amber-100 px-1 rounded">{"{{firstName}}"}</code>{" "}
                  <code className="bg-amber-100 px-1 rounded">{"{{lastName}}"}</code>{" "}
                  <code className="bg-amber-100 px-1 rounded">{"{{fullName}}"}</code>
                </p>
              </div>
            )}
            
            {/* Markdown Toolbar */}
            <div className="flex items-center gap-1 mb-2 pb-2 border-b border-neutral-200">
              {formatButtons.map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => setNewMsgContent(prev => prev + btn.before + btn.placeholder + btn.after)}
                  className="px-2 py-1 text-sm text-neutral-600 hover:bg-neutral-100 rounded transition-colors"
                  title={btn.label}
                >
                  {btn.icon}
                </button>
              ))}
              <span className="ml-auto text-xs text-neutral-400">Markdown unterstützt</span>
            </div>
            
            <textarea
              value={newMsgContent}
              onChange={(e) => setNewMsgContent(e.target.value)}
              placeholder={newMsgIsBulk && bulkSelectionConfirmed
                ? "Liebe(r) {{firstName}},\n\nIhre Nachricht hier...\n\nMit freundlichen Grüßen,\nIhr Vereinsteam" 
                : "Ihre Nachricht..."
              }
              className="w-full p-3 text-sm border border-neutral-300 rounded-lg resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 font-mono"
              rows={6}
            />
          </div>

          {/* Preview toggle (bulk only) */}
          {newMsgIsBulk && bulkSelectionConfirmed && (
            <div>
              <button
                onClick={() => setShowNewMsgPreview(!showNewMsgPreview)}
                className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 mb-2"
              >
                <Eye className="w-4 h-4" />
                <span>{showNewMsgPreview ? "Vorschau ausblenden" : "Vorschau anzeigen"}</span>
              </button>
              
              {showNewMsgPreview && newMsgContent.trim() && bulkRecipients.length > 0 && (
                <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-neutral-700">
                      Vorschau für: {bulkRecipients[0].firstName} {bulkRecipients[0].lastName}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-700 bg-white p-3 rounded-lg border border-neutral-200 prose prose-sm max-w-none">
                    {renderMarkdown(personalizeMessage(newMsgContent, bulkRecipients[0]))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email Option */}
          <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={newMsgSendEmail}
              onChange={(e) => setNewMsgSendEmail(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
            />
            <Mail className="w-4 h-4 text-neutral-400" />
            <span>Auch als E-Mail senden</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center pt-4 mt-4 border-t border-neutral-200 justify-between">
          {newMsgIsBulk && bulkSelectionConfirmed && (
            <p className="text-sm text-neutral-500">
              {bulkRecipients.length} Nachrichten{newMsgSendEmail && ` + ${bulkRecipients.length} E-Mails`}
            </p>
          )}
          <div className={`flex gap-3 ${!(newMsgIsBulk && bulkSelectionConfirmed) ? "ml-auto" : ""}`}>
            <Button
              variant="outline"
              onClick={resetNewMessageForm}
            >
              Abbrechen
            </Button>
            <Button
              onClick={() => {
                if (newMsgIsBulk && bulkSelectionConfirmed) {
                  alert(`Rundschreiben wird gesendet an ${bulkRecipients.length} Empfänger!\n\nBetreff: ${newMsgSubject}\n\nE-Mail: ${newMsgSendEmail ? "Ja" : "Nein"}`);
                } else {
                  alert(`Nachricht an ${memberOptions.find(m => m.value === newMsgRecipient)?.label || "Mitglied"} gesendet!\n\nBetreff: ${newMsgSubject}\n\nE-Mail: ${newMsgSendEmail ? "Ja" : "Nein"}`);
                }
                resetNewMessageForm();
              }}
              disabled={
                (newMsgIsBulk && bulkSelectionConfirmed)
                  ? (!newMsgSubject.trim() || !newMsgContent.trim())
                  : (!newMsgRecipient || !newMsgSubject.trim() || !newMsgContent.trim())
              }
              icon={<Send className="w-4 h-4" />}
            >
              {newMsgIsBulk && bulkSelectionConfirmed ? "Rundschreiben senden" : "Nachricht senden"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
