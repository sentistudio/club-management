// Club Events Management Page
// ==========================================
// Admin view for managing club-wide events

import { useMemo, useState } from "react";
import { 
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3,
  MoreHorizontal, Eye, Edit2, Copy, Send, XCircle,
  ChevronLeft, ChevronRight, Users, Clock, MapPin,
  Lock, Globe, RefreshCw, Filter
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
  
  // Drawer state
  const [showFormDrawer, setShowFormDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  
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
  const handleOpenCreate = () => {
    setEditingEvent(null);
    setShowFormDrawer(true);
  };

  const handleOpenDetail = (event: ClubEvent) => {
    setSelectedEvent(event);
    setShowDetailDrawer(true);
    setOpenMenuId(null);
  };

  const handleEdit = (event: ClubEvent) => {
    setEditingEvent(event);
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
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
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

      {/* Filters & View Toggle */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Events suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
            </div>
          </div>
          
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-2">
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

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="text-center py-12">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800">Keine Events gefunden</h3>
              <p className="text-slate-500 mt-1">Passen Sie Ihre Filter an oder erstellen Sie ein neues Event</p>
              <Button className="mt-4" onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Neues Event
              </Button>
            </Card>
          ) : (
            filteredEvents.map(event => (
              <Card 
                key={event.id}
                className="hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => handleOpenDetail(event)}
              >
                <div className="flex items-start gap-4">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 w-14 text-center">
                    <div className="bg-[#004941] text-white rounded-t-lg py-1 text-xs font-medium">
                      {new Date(event.date).toLocaleDateString("de-DE", { month: "short" })}
                    </div>
                    <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg py-2">
                      <p className="text-2xl font-bold text-slate-800">
                        {new Date(event.date).getDate()}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {getStatusBadge(event.status)}
                          <span className="text-slate-400">
                            {event.visibility === "public" ? (
                              <Globe className="w-4 h-4 inline" />
                            ) : (
                              <Lock className="w-4 h-4 inline" />
                            )}
                          </span>
                          {event.recurrence?.enabled && (
                            <span className="text-[#004941]">
                              <RefreshCw className="w-4 h-4 inline" />
                            </span>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-semibold text-slate-800 group-hover:text-[#004941] transition-colors">
                          {event.title}
                        </h3>
                        
                        {/* Audience Chip */}
                        <p className="text-sm text-slate-500">{getAudienceDescription(event)}</p>
                      </div>
                      
                      {/* Quick Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === event.id ? null : event.id);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-5 h-5 text-slate-500" />
                        </button>
                        
                        {openMenuId === event.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="w-4 h-4" />
                                Anzeigen
                              </button>
                              {(event.status === "draft" || event.status === "published") && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  Bearbeiten
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDuplicate(event); }}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                              >
                                <Copy className="w-4 h-4" />
                                Duplizieren
                              </button>
                              {event.status === "draft" && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handlePublish(event); }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
                                >
                                  <Send className="w-4 h-4" />
                                  Veröffentlichen
                                </button>
                              )}
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
                                    Absagen
                                  </button>
                                </>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Meta Row */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
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
                      {event.rsvpRequired && event.rsvpStats && (
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-600">{event.rsvpStats.confirmed} ✓</span>
                          <span className="text-red-500">{event.rsvpStats.declined} ✗</span>
                          <span className="text-amber-500">{event.rsvpStats.pending} ⏳</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
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
              return (
                <div
                  key={i}
                  className={`bg-white min-h-[100px] p-2 ${
                    !day.isCurrentMonth ? "bg-slate-50" : ""
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
                          onClick={() => handleOpenDetail(event)}
                          className={`w-full text-left px-1.5 py-0.5 rounded text-xs truncate ${colors.bg} ${colors.text} hover:opacity-80`}
                        >
                          {event.startTime} {event.title}
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

      {/* Event Form Drawer */}
      {showFormDrawer && (
        <EventFormDrawer
          event={editingEvent}
          onClose={() => { setShowFormDrawer(false); setEditingEvent(null); }}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}
