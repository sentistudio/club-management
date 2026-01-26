// Club Events Management Page
// ==========================================
// Admin view for managing club-wide events

import { useMemo, useState } from "react";
import { 
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3,
  Edit2, Copy, Send, XCircle,
  ChevronLeft, ChevronRight, Users, Clock, MapPin,
  Lock, Globe, RefreshCw, Filter, Sun
} from "lucide-react";
import { Card, Button } from "../components/ui";
import { EventDetailDrawer, EventFormDrawer } from "../components/events";
import { 
  mockClubEvents, 
  ADMIN_USER
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
type CalendarViewMode = "day" | "week" | "month";

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
  const [calendarViewMode, setCalendarViewMode] = useState<CalendarViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Modal state
  const [showFormDrawer, setShowFormDrawer] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [initialDate, setInitialDate] = useState<string | undefined>(undefined);
  

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
  };

  const handleEdit = (event: ClubEvent) => {
    setEditingEvent(event);
    setInitialDate(undefined);
    setShowFormDrawer(true);
    setShowDetailDrawer(false);
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
          Neue Veranstaltung
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

      {/* LIST VIEW - With Week Picker */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {/* Scrollable Week Picker */}
          <div className="bg-white rounded-xl border border-slate-200 p-3">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => {
                  const newDate = new Date(calendarMonth);
                  newDate.setDate(newDate.getDate() - 7);
                  setCalendarMonth(newDate);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-sm font-medium text-slate-600">
                {calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </span>
              <button
                onClick={() => {
                  const newDate = new Date(calendarMonth);
                  newDate.setDate(newDate.getDate() + 7);
                  setCalendarMonth(newDate);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setCalendarMonth(new Date())}
                className="ml-auto text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600"
              >
                Heute
              </button>
            </div>
            
            {/* Week Days - Scrollable */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {(() => {
                // Generate 14 days starting from current week start
                const startOfWeek = new Date(calendarMonth);
                const dayOfWeek = startOfWeek.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startOfWeek.setDate(startOfWeek.getDate() + diff);
                
                const days = [];
                for (let i = 0; i < 14; i++) {
                  const d = new Date(startOfWeek);
                  d.setDate(d.getDate() + i);
                  days.push(d);
                }
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                return days.map((day, i) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isToday = day.toDateString() === today.toDateString();
                  const hasEvents = filteredEvents.some(e => e.date === dateStr);
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`flex-shrink-0 w-12 py-2 rounded-lg text-center transition-all ${
                        isSelected 
                          ? "bg-[#004941] text-white" 
                          : isToday 
                          ? "bg-[#C8F2E0] text-[#004941]" 
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <p className={`text-[10px] uppercase ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                        {day.toLocaleDateString("de-DE", { weekday: "short" })}
                      </p>
                      <p className={`text-lg font-bold ${isSelected ? "text-white" : isToday ? "text-[#004941]" : "text-slate-800"}`}>
                        {day.getDate()}
                      </p>
                      {hasEvents && !isSelected && (
                        <div className="w-1 h-1 bg-[#004941] rounded-full mx-auto mt-0.5" />
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
          
          {/* Events List - Scrollable */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ maxHeight: "calc(100vh - 480px)" }}>
            <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 500px)" }}>
              {(() => {
                // Filter events by selected date if any
                const displayEvents = selectedDate 
                  ? filteredEvents.filter(e => e.date === selectedDate)
                  : filteredEvents;
                  
                if (displayEvents.length === 0) {
                  return (
                    <div className="text-center py-12 px-4">
                      <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-slate-800">
                        {selectedDate ? "Keine Events an diesem Tag" : "Keine Events gefunden"}
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        {selectedDate 
                          ? "Wählen Sie einen anderen Tag oder erstellen Sie ein neues Event"
                          : "Passen Sie Ihre Filter an oder erstellen Sie ein neues Event"
                        }
                      </p>
                      <Button className="mt-4" size="sm" onClick={() => handleOpenCreate(selectedDate || undefined)}>
                        <Plus className="w-4 h-4 mr-1" />
                        Event erstellen
                      </Button>
                    </div>
                  );
                }
                
                {/* Condensed Event Cards - Progressive Disclosure */}
                  <div className="divide-y divide-slate-100">
                    {displayEvents.map(event => (
                      <div
                        key={event.id}
                        className="p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/* Date Badge - Compact */}
                          <div className="flex-shrink-0 w-12 h-12 bg-[#004941] rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-[10px] font-medium leading-none opacity-80">
                              {new Date(event.date).toLocaleDateString("de-DE", { month: "short" }).toUpperCase()}
                            </span>
                            <span className="text-xl font-bold leading-none">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          
                          {/* Content - Essential Info Only */}
                          <div className="flex-1 min-w-0">
                            {/* Title Row */}
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold text-slate-800 truncate">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {getStatusBadge(event.status)}
                              </div>
                            </div>
                            
                            {/* Time & Location - Chunked */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {event.isAllDay ? "Ganztägig" : `${event.startTime} - ${event.endTime}`}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[200px]">{event.location}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {event.resolvedMemberCount || 0}
                              </span>
                            </div>
                          </div>
                          
                          {/* View Details Button - Progressive Disclosure */}
                          <button
                            onClick={() => handleOpenDetail(event)}
                            className="flex-shrink-0 px-3 py-1.5 text-sm text-[#004941] hover:bg-[#C8F2E0] rounded-lg transition-colors font-medium"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
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
                onClick={() => {
                  if (calendarViewMode === "day") {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), calendarMonth.getDate() - 1));
                  } else if (calendarViewMode === "week") {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), calendarMonth.getDate() - 7));
                  } else {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1));
                  }
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <h2 className="text-lg font-semibold text-slate-800 min-w-[200px] text-center">
                {calendarViewMode === "day" 
                  ? calendarMonth.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : calendarViewMode === "week"
                  ? `KW ${Math.ceil((calendarMonth.getDate() - calendarMonth.getDay() + 1) / 7)} - ${calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}`
                  : calendarMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </h2>
              <button
                onClick={() => {
                  if (calendarViewMode === "day") {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), calendarMonth.getDate() + 1));
                  } else if (calendarViewMode === "week") {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), calendarMonth.getDate() + 7));
                  } else {
                    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1));
                  }
                }}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => setCalendarViewMode("day")}
                className={`px-3 py-1.5 ${calendarViewMode === "day" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                Tag
              </button>
              <button
                onClick={() => setCalendarViewMode("week")}
                className={`px-3 py-1.5 ${calendarViewMode === "week" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                Woche
              </button>
              <button
                onClick={() => setCalendarViewMode("month")}
                className={`px-3 py-1.5 ${calendarViewMode === "month" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                Monat
              </button>
            </div>
          </div>

          {/* Calendar Grid - Monthly View */}
          {calendarViewMode === "month" && (
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
          )}
          
          {/* Calendar Grid - Weekly View */}
          {calendarViewMode === "week" && (() => {
            // Get the start of the week (Monday)
            const startOfWeek = new Date(calendarMonth);
            const dayOfWeek = startOfWeek.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            startOfWeek.setDate(startOfWeek.getDate() + diff);
            
            const weekDays = [];
            for (let i = 0; i < 7; i++) {
              const d = new Date(startOfWeek);
              d.setDate(d.getDate() + i);
              const dateStr = d.toISOString().split("T")[0];
              const dayEvents = filteredEvents.filter(e => e.date === dateStr);
              weekDays.push({ date: d, events: dayEvents });
            }
            
            return (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, i) => {
                  const isToday = day.date.toDateString() === new Date().toDateString();
                  const dateStr = day.date.toISOString().split("T")[0];
                  return (
                    <div
                      key={i}
                      onClick={() => handleOpenCreate(dateStr)}
                      className={`min-h-[300px] bg-slate-50 rounded-lg p-2 cursor-pointer hover:bg-[#C8F2E0]/20 ${isToday ? "ring-2 ring-[#004941]" : ""}`}
                    >
                      <div className="text-center mb-2">
                        <p className="text-xs text-slate-500">{day.date.toLocaleDateString("de-DE", { weekday: "short" })}</p>
                        <p className={`text-lg font-bold ${isToday ? "text-[#004941]" : "text-slate-700"}`}>{day.date.getDate()}</p>
                      </div>
                      <div className="space-y-1">
                        {day.events.map(event => {
                          const colors = getStatusColor(event.status);
                          return (
                            <button
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                              className={`w-full text-left p-1.5 rounded text-xs ${colors.bg} ${colors.text} hover:opacity-80`}
                            >
                              <p className="font-medium truncate">{event.title}</p>
                              <p className="opacity-70">{event.isAllDay ? "Ganztägig" : event.startTime}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          
          {/* Calendar Grid - Daily View */}
          {calendarViewMode === "day" && (() => {
            const dateStr = calendarMonth.toISOString().split("T")[0];
            const dayEvents = filteredEvents.filter(e => e.date === dateStr);
            const isToday = calendarMonth.toDateString() === new Date().toDateString();
            
            return (
              <div 
                className="bg-slate-50 rounded-lg p-4 cursor-pointer hover:bg-[#C8F2E0]/10"
                onClick={() => handleOpenCreate(dateStr)}
              >
                <div className={`text-center mb-4 pb-3 border-b border-slate-200 ${isToday ? "text-[#004941]" : ""}`}>
                  <p className="text-sm text-slate-500">{calendarMonth.toLocaleDateString("de-DE", { weekday: "long" })}</p>
                  <p className="text-3xl font-bold">{calendarMonth.getDate()}</p>
                </div>
                
                {dayEvents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>Keine Termine</p>
                    <p className="text-xs mt-1">Klicken zum Erstellen</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {dayEvents
                      .sort((a, b) => (a.isAllDay ? -1 : b.isAllDay ? 1 : a.startTime.localeCompare(b.startTime)))
                      .map(event => {
                        const colors = getStatusColor(event.status);
                        return (
                          <button
                            key={event.id}
                            onClick={(e) => { e.stopPropagation(); handleOpenDetail(event); }}
                            className={`w-full text-left p-3 rounded-lg ${colors.bg} ${colors.text} hover:opacity-80 flex items-center gap-3`}
                          >
                            {event.bannerImage && (
                              <img src={event.bannerImage} alt="" className="w-12 h-12 rounded object-cover" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{event.title}</p>
                              <p className="text-sm opacity-70">
                                {event.isAllDay ? "Ganztägig" : `${event.startTime} - ${event.endTime}`}
                                {event.location && ` · ${event.location}`}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })()}
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
