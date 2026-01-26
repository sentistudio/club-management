// Club Events Management Page
// ==========================================
// Admin view for managing club-wide events

import { useMemo, useState } from "react";
import { 
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3,
  MoreHorizontal, Eye, Edit2, Copy, Send, XCircle,
  ChevronLeft, ChevronRight, Users, Clock, MapPin,
  Lock, Globe, RefreshCw, Filter, Sun
} from "lucide-react";
import { Card, Button } from "../components/ui";
import { EventDetailDrawer, EventFormDrawer } from "../components/events";
import { 
  mockClubEvents, 
  ADMIN_USER,
  getAudienceDescription
} from "../data/mockClubEvents";
import type { ClubEvent, EventStatus, EventVisibility, AudienceMode } from "../types/events";
import { 
  computeEventStatus, 
  getStatusLabel, 
  getStatusColor,
  createStatusHistoryEntry
} from "../utils/eventUtils";

type ViewMode = "list" | "calendar";
type TimeFilter = "upcoming" | "past" | "all";

export function ClubEvents() {
  // State
  const [events, setEvents] = useState<ClubEvent[]>(mockClubEvents);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("upcoming");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [visibilityFilter, setVisibilityFilter] = useState<EventVisibility | "">("");
  const [audienceFilter, setAudienceFilter] = useState<AudienceMode | "">("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  
  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  
  // Modal state
  const [showFormDrawer, setShowFormDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
  
  // Dropdown menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Compute actual statuses (mark completed if past)
  const now = new Date();
  const eventsWithComputedStatus = useMemo(() => {
    return events.map(e => ({
      ...e,
      status: computeEventStatus(e, now)
    }));
  }, [events, now]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return eventsWithComputedStatus
      .filter(e => {
        // Time filter
        const eventDate = new Date(`${e.date}T${e.endTime}`);
        if (timeFilter === "upcoming" && eventDate < now) return false;
        if (timeFilter === "past" && eventDate >= now) return false;
        
        // Search
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!e.title.toLowerCase().includes(term) && 
              !e.description?.toLowerCase().includes(term) &&
              !e.location?.toLowerCase().includes(term)) {
            return false;
          }
        }
        
        // Status filter
        if (statusFilter && e.status !== statusFilter) return false;
        
        // Visibility filter
        if (visibilityFilter && e.visibility !== visibilityFilter) return false;
        
        // Audience mode filter
        if (audienceFilter && e.audience.mode !== audienceFilter) return false;
        
        // Department filter
        if (departmentFilter && e.audience.mode === "departments") {
          if (!e.audience.departmentIds?.includes(departmentFilter)) return false;
        }
        
        // Group filter
        if (groupFilter && e.audience.mode === "groups") {
          if (!e.audience.groupIds?.includes(groupFilter)) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return timeFilter === "past" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
      });
  }, [eventsWithComputedStatus, searchTerm, timeFilter, statusFilter, visibilityFilter, audienceFilter, departmentFilter, groupFilter, now]);

  // Stats
  const stats = useMemo(() => {
    const all = eventsWithComputedStatus;
    return {
      total: all.length,
      upcoming: all.filter(e => new Date(`${e.date}T${e.endTime}`) >= now && e.status !== "cancelled").length,
      draft: all.filter(e => e.status === "draft").length,
      published: all.filter(e => e.status === "published").length,
      cancelled: all.filter(e => e.status === "cancelled").length
    };
  }, [eventsWithComputedStatus, now]);

  // Calendar helpers
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday start
    
    const days: { date: Date; isCurrentMonth: boolean; events: ClubEvent[] }[] = [];
    
    // Previous month padding
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split("T")[0];
      const dayEvents = filteredEvents.filter(e => e.date === dateStr);
      days.push({ date, isCurrentMonth: true, events: dayEvents });
    }
    
    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, events: [] });
    }
    
    return days;
  };

  // Handlers
  const handleOpenCreate = (date?: string) => {
    setEditingEvent(null);
    setInitialDate(date);
    setShowFormDrawer(true);
  };

  const handleOpenDetail = (event: ClubEvent) => {
    setSelectedEvent(event);
    setShowDetailDrawer(true);
    setOpenMenuId(null);
  };

  const handleEdit = (event: ClubEvent) => {
    setEditingEvent(event);
    setInitialDate(undefined);
    setShowFormDrawer(true);
    setShowDetailDrawer(false);
    setOpenMenuId(null);
  };

  const handleDuplicate = (event: ClubEvent) => {
    const duplicated: ClubEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${event.title} (Kopie)`,
      status: "draft",
      statusHistory: [createStatusHistoryEntry("draft", ADMIN_USER.id, ADMIN_USER.name)],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rsvpStats: {
        invited: event.resolvedMemberCount || 0,
        confirmed: 0,
        declined: 0,
        pending: event.resolvedMemberCount || 0,
        waitlist: 0
      }
    };
    setEditingEvent(duplicated);
    setShowFormDrawer(true);
    setShowDetailDrawer(false);
    setOpenMenuId(null);
  };

  const handlePublish = (event: ClubEvent) => {
    const updated = events.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          status: "published" as EventStatus,
          statusHistory: [...e.statusHistory, createStatusHistoryEntry("published", ADMIN_USER.id, ADMIN_USER.name)],
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    });
    setEvents(updated);
    setShowDetailDrawer(false);
    setOpenMenuId(null);
  };

  const handleCancel = (event: ClubEvent, reason: string) => {
    const updated = events.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          status: "cancelled" as EventStatus,
          statusHistory: [...e.statusHistory, createStatusHistoryEntry("cancelled", ADMIN_USER.id, ADMIN_USER.name, reason)],
          updatedAt: new Date().toISOString()
        };
      }
      return e;
    });
    setEvents(updated);
    setShowDetailDrawer(false);
    setOpenMenuId(null);
  };

  const handleSaveEvent = (event: ClubEvent, _isDraft: boolean) => {
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      // Update existing
      const updated = [...events];
      updated[existingIndex] = event;
      setEvents(updated);
    } else {
      // Add new
      setEvents([...events, event]);
    }
    setShowFormDrawer(false);
    setEditingEvent(null);
  };

  const getStatusBadge = (status: EventStatus) => {
    const colors = getStatusColor(status);
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
        {getStatusLabel(status)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vereinstermine</h1>
          <p className="text-slate-500 mt-1">Club-Events, Versammlungen und Veranstaltungen verwalten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenCreate()}>
          Neues Event
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTimeFilter("all")}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <CalendarIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Gesamt</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setTimeFilter("upcoming"); setStatusFilter(""); }}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C8F2E0]">
              <CalendarIcon className="w-5 h-5 text-[#004941]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#004941]">{stats.upcoming}</p>
              <p className="text-sm text-slate-500">Anstehend</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("draft")}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Edit2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-600">{stats.draft}</p>
              <p className="text-sm text-slate-500">Entwürfe</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("published")}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Send className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.published}</p>
              <p className="text-sm text-slate-500">Veröffentlicht</p>
            </div>
          </div>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter("cancelled")}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              <p className="text-sm text-slate-500">Abgesagt</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        {/* Search - Full Width on Top */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Events suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-lg border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#004941] focus:border-transparent"
          />
        </div>
        
        {/* Filters & View Toggle Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2 flex-1">
            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="upcoming">Anstehend</option>
              <option value="past">Vergangen</option>
              <option value="all">Alle</option>
            </select>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | "")}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="">Alle Status</option>
              <option value="draft">Entwurf</option>
              <option value="published">Veröffentlicht</option>
              <option value="completed">Abgeschlossen</option>
              <option value="cancelled">Abgesagt</option>
            </select>
            
            {/* Visibility Filter */}
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as EventVisibility | "")}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="">Alle Sichtbarkeit</option>
              <option value="public">🌐 Öffentlich</option>
              <option value="private">🔒 Privat</option>
            </select>
            
            {/* Audience Mode Filter */}
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value as AudienceMode | "")}
              className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="">Alle Zielgruppen</option>
              <option value="all">Alle Mitglieder</option>
              <option value="departments">Abteilungen</option>
              <option value="groups">Gruppen</option>
              <option value="manual">Manuell</option>
            </select>
          </div>
          
          {/* View Toggle */}
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2.5 flex items-center gap-2 ${
                viewMode === "list" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Liste</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2.5 flex items-center gap-2 ${
                viewMode === "calendar" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="hidden sm:inline">Kalender</span>
            </button>
          </div>
        </div>
        
        {/* Active filters display */}
        {(statusFilter || visibilityFilter || audienceFilter || departmentFilter || groupFilter) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Filter:</span>
            {statusFilter && (
              <button
                onClick={() => setStatusFilter("")}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {getStatusLabel(statusFilter)}
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
            {visibilityFilter && (
              <button
                onClick={() => setVisibilityFilter("")}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {visibilityFilter === "public" ? "Öffentlich" : "Privat"}
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
            {audienceFilter && (
              <button
                onClick={() => setAudienceFilter("")}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded text-sm hover:bg-slate-200"
              >
                {audienceFilter === "all" ? "Alle Mitglieder" : 
                 audienceFilter === "departments" ? "Abteilungen" :
                 audienceFilter === "groups" ? "Gruppen" : "Manuell"}
                <XCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                setStatusFilter("");
                setVisibilityFilter("");
                setAudienceFilter("");
                setDepartmentFilter("");
                setGroupFilter("");
              }}
              className="text-sm text-[#004941] hover:underline ml-2"
            >
              Alle zurücksetzen
            </button>
          </div>
        )}
      </Card>

      {/* LIST VIEW - Timeline Style */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {filteredEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">Keine Events gefunden</h3>
              <p className="text-slate-500 mt-1">Passen Sie Ihre Filter an oder erstellen Sie ein neues Event</p>
              <Button className="mt-4" onClick={() => handleOpenCreate()}>
                <Plus className="w-4 h-4 mr-2" />
                Neues Event
              </Button>
            </Card>
          ) : (
            (() => {
              // Group events by time sections
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              const weekEnd = new Date(today);
              weekEnd.setDate(weekEnd.getDate() + 7);
              const monthEnd = new Date(today);
              monthEnd.setMonth(monthEnd.getMonth() + 1);
              
              type SectionKey = "today" | "tomorrow" | "thisWeek" | "thisMonth" | "later" | "past";
              
              const sections: { key: SectionKey; label: string; icon: React.ReactNode; bgColor: string; events: ClubEvent[] }[] = [
                { key: "today", label: "Heute", icon: <Sun className="w-5 h-5" />, bgColor: "bg-amber-500", events: [] },
                { key: "tomorrow", label: "Morgen", icon: <CalendarIcon className="w-5 h-5" />, bgColor: "bg-orange-400", events: [] },
                { key: "thisWeek", label: "Diese Woche", icon: <CalendarIcon className="w-5 h-5" />, bgColor: "bg-[#004941]", events: [] },
                { key: "thisMonth", label: "Diesen Monat", icon: <CalendarIcon className="w-5 h-5" />, bgColor: "bg-slate-500", events: [] },
                { key: "later", label: "Später", icon: <CalendarIcon className="w-5 h-5" />, bgColor: "bg-slate-400", events: [] },
                { key: "past", label: "Vergangen", icon: <Clock className="w-5 h-5" />, bgColor: "bg-slate-300", events: [] }
              ];
              
              filteredEvents.forEach(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);
                
                if (eventDate < today) {
                  sections.find(s => s.key === "past")!.events.push(event);
                } else if (eventDate.getTime() === today.getTime()) {
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
              
              return sections
                .filter(section => section.events.length > 0)
                .map(section => (
                  <div key={section.key} className="space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${section.bgColor} text-white`}>
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">{section.label}</h2>
                        <p className="text-sm text-slate-500">{section.events.length} {section.events.length === 1 ? "Event" : "Events"}</p>
                      </div>
                    </div>
                    
                    {/* Timeline Events */}
                    <div className="relative pl-6 ml-4 border-l-2 border-slate-200 space-y-4">
                      {section.events.map(event => (
                        <div key={event.id} className="relative">
                          {/* Timeline dot */}
                          <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white ${
                            event.status === "cancelled" ? "bg-red-400" :
                            event.status === "draft" ? "bg-slate-400" :
                            event.status === "completed" ? "bg-slate-300" :
                            "bg-[#004941]"
                          }`} />
                          
                          {/* Event Card */}
                          <div
                            onClick={() => handleOpenDetail(event)}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                          >
                            {/* Banner Image */}
                            {event.bannerImage && (
                              <div className="h-32 w-full overflow-hidden">
                                <img 
                                  src={event.bannerImage} 
                                  alt="" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            
                            <div className="p-4">
                              {/* Top Row: Date + Badges */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium text-[#004941]">
                                    {new Date(event.date).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })}
                                  </span>
                                  {event.isAllDay ? (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                      Ganztägig
                                    </span>
                                  ) : (
                                    <span className="text-slate-500">{event.startTime} - {event.endTime}</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(event.status)}
                                  <span className="text-slate-400">
                                    {event.visibility === "public" ? (
                                      <Globe className="w-4 h-4" />
                                    ) : (
                                      <Lock className="w-4 h-4" />
                                    )}
                                  </span>
                                  {event.recurrence?.enabled && (
                                    <span className="text-[#004941]">
                                      <RefreshCw className="w-4 h-4" />
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Title & Description */}
                              <h3 className="font-semibold text-lg text-slate-800 group-hover:text-[#004941] transition-colors">
                                {event.title}
                              </h3>
                              {event.description && (
                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                              )}
                              
                              {/* Meta Info */}
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                                {event.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{event.resolvedMemberCount || 0} eingeladen</span>
                                </div>
                              </div>
                              
                              {/* RSVP Stats Bar */}
                              {event.rsvpRequired && event.rsvpStats && event.rsvpStats.invited > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-100">
                                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                                    <span>Rückmeldungen</span>
                                    <span>
                                      {event.rsvpStats.confirmed + event.rsvpStats.declined} / {event.rsvpStats.invited}
                                    </span>
                                  </div>
                                  <div className="flex h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-emerald-500" 
                                      style={{ width: `${(event.rsvpStats.confirmed / event.rsvpStats.invited) * 100}%` }}
                                    />
                                    <div 
                                      className="bg-red-400" 
                                      style={{ width: `${(event.rsvpStats.declined / event.rsvpStats.invited) * 100}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-4 mt-1.5 text-xs">
                                    <span className="text-emerald-600">✓ {event.rsvpStats.confirmed} Zusagen</span>
                                    <span className="text-red-500">✗ {event.rsvpStats.declined} Absagen</span>
                                    <span className="text-amber-500">⏳ {event.rsvpStats.pending} offen</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Quick Actions */}
                              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  Bearbeiten
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDuplicate(event); }}
                                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  Kopieren
                                </button>
                                {event.status === "draft" && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handlePublish(event); }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors ml-auto"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    Veröffentlichen
                                  </button>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === event.id ? null : event.id);
                                  }}
                                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
                                >
                                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                                </button>
                                
                                {openMenuId === event.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-10" 
                                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                                    />
                                    <div className="absolute right-4 bottom-16 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                      >
                                        <Eye className="w-4 h-4" />
                                        Details anzeigen
                                      </button>
                                      {(event.status === "draft" || event.status === "published") && (
                                        <>
                                          <hr className="my-1 border-slate-200" />
                                          <button
                                            onClick={(e) => { 
                                              e.stopPropagation(); 
                                              setSelectedEvent(event);
                                              setShowDetailDrawer(true);
                                              setOpenMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                          >
                                            <XCircle className="w-4 h-4" />
                                            Event absagen
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
            })()
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <Card>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">
              {calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
            </h2>
            <button
              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
            {/* Weekday Headers */}
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(day => (
              <div key={day} className="bg-slate-50 p-2 text-center text-sm font-medium text-slate-600">
                {day}
              </div>
            ))}
            
            {/* Calendar Days */}
            {getCalendarDays().map((day, i) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const dateStr = day.date.toISOString().split("T")[0];
              return (
                <div
                  key={i}
                  onClick={() => day.isCurrentMonth && handleOpenCreate(dateStr)}
                  className={`bg-white min-h-[100px] p-2 cursor-pointer transition-colors hover:bg-[#C8F2E0]/20 ${
                    !day.isCurrentMonth ? "bg-slate-50 cursor-default hover:bg-slate-50" : ""
                  }`}
                >
                  <p className={`text-sm font-medium mb-1 ${
                    !day.isCurrentMonth ? "text-slate-400" :
                    isToday ? "w-6 h-6 bg-[#004941] text-white rounded-full flex items-center justify-center" :
                    "text-slate-700"
                  }`}>
                    {day.date.getDate()}
                  </p>
                  <div className="space-y-1">
                    {day.events.slice(0, 3).map(event => {
                      const colors = getStatusColor(event.status);
                      return (
                        <button
                          key={event.id}
                          onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.text} hover:opacity-80`}
                        >
                          {event.isAllDay ? "⏰ " : `${event.startTime} `}{event.title}
                        </button>
                      );
                    })}
                    {day.events.length > 3 && (
                      <p className="text-xs text-slate-500 px-1">
                        +{day.events.length - 3} weitere
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Event Detail Drawer */}
      {showDetailDrawer && selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          onClose={() => { setShowDetailDrawer(false); setSelectedEvent(null); }}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onPublish={handlePublish}
          onCancel={handleCancel}
        />
      )}

      {/* Event Form Modal */}
      {showFormDrawer && (
        <EventFormDrawer
          event={editingEvent}
          initialDate={initialDate}
          onClose={() => { setShowFormDrawer(false); setEditingEvent(null); setInitialDate(undefined); }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
