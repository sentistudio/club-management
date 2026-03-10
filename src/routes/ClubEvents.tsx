// Club Events Management Page
// ==========================================
// Admin view for managing club-wide events

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus, Search, Calendar as CalendarIcon, List, Grid3X3,
  Edit2, Copy, Send, XCircle,
  ChevronLeft, ChevronRight, Users, MapPin,
  Lock, RefreshCw, Dumbbell, Trophy as TrophyIcon, PartyPopper, Check, Clock
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
import { useLanguage } from "../i18n";
import { useRole } from "../contexts";

// Maps the viewContext key (from RoleContext) to the member ID used in mockClubEvents audience.memberIds
const PERSONA_MEMBER_ID: Record<string, string> = {
  patrick_steuble: "patrick_steuble",
  lena_schneider: "lena_schneider",
  flurina: "flurina_schneider",
  max: "max_schneider",
};

// Derive a simplified event type for personal view display
function getPersonalEventType(e: ClubEvent): "training" | "match" | "event" {
  if (e.category === "Training") return "training";
  const matchKeywords = ["ligaspiel", "heimspiel", "auswärtsspiel", "spiel", "cup", "turnier"];
  const lower = e.title.toLowerCase();
  if (e.category === "Spiel" || matchKeywords.some(k => lower.includes(k))) return "match";
  return "event";
}

type ViewMode = "list" | "calendar";
type TimeFilter = "upcoming" | "past" | "all";
type CalendarViewMode = "day" | "week" | "month";

export function ClubEvents() {
  // i18n
  const { t, lang, getMonth, getWeekday } = useLanguage();

  // Context: who are we viewing for?
  const { user } = useRole();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewContext = searchParams.get("person") || "verein";
  const setViewContext = (person: string) => {
    if (person === "verein") {
      setSearchParams({});
    } else {
      setSearchParams({ person });
    }
  };
  const isPersonalView = viewContext !== "verein";
  const personalLabel =
    viewContext === "me"
      ? `${user.firstName} ${user.lastName}`
      : user.linkedChildren?.find(c => c.id === viewContext)?.firstName ?? viewContext;

  // State
  const [newEvents, setNewEvents] = useState<ClubEvent[]>([]);
  const [eventOverrides, setEventOverrides] = useState<Record<string, Partial<ClubEvent>>>({});
  const events = useMemo(
    () => [
      ...mockClubEvents.map(e => eventOverrides[e.id] ? { ...e, ...eventOverrides[e.id] } : e),
      ...newEvents,
    ],
    [eventOverrides, newEvents]
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter] = useState<TimeFilter>("upcoming");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [visibilityFilter, setVisibilityFilter] = useState<EventVisibility | "">("");
  const [audienceFilter] = useState<AudienceMode | "">("");
  const [departmentFilter] = useState("");
  const [groupFilter] = useState("");
  
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
    setEventOverrides(prev => ({
      ...prev,
      [event.id]: {
        ...prev[event.id],
        status: "published" as EventStatus,
        statusHistory: [...event.statusHistory, createStatusHistoryEntry("published", ADMIN_USER.id, ADMIN_USER.name)],
        updatedAt: new Date().toISOString()
      }
    }));
    setShowDetailDrawer(false);
  };

  const handleCancel = (event: ClubEvent, reason: string) => {
    setEventOverrides(prev => ({
      ...prev,
      [event.id]: {
        ...prev[event.id],
        status: "cancelled" as EventStatus,
        statusHistory: [...event.statusHistory, createStatusHistoryEntry("cancelled", ADMIN_USER.id, ADMIN_USER.name, reason)],
        updatedAt: new Date().toISOString()
      }
    }));
    setShowDetailDrawer(false);
  };

  const handleSaveEvent = (event: ClubEvent, _isDraft: boolean) => {
    const existingIndex = events.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      // Update existing
      setEventOverrides(prev => ({ ...prev, [event.id]: event }));
    } else {
      // Add new
      setNewEvents(prev => [...prev, event]);
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

  // Personal events: filter eventsWithComputedStatus by persona member ID
  const personalEventsKey = viewContext === "me" ? user.id : viewContext;
  const personaMemberId = PERSONA_MEMBER_ID[personalEventsKey] ?? personalEventsKey;
  const currentPersonalEvents = useMemo(() =>
    eventsWithComputedStatus
      .filter(e => {
        if (e.status === "cancelled") return false;
        const eventEnd = new Date(`${e.date}T${e.endTime}`);
        if (eventEnd < now) return false;
        if (e.audience.mode === "all") return true;
        if (e.audience.mode === "manual" && e.audience.memberIds?.includes(personaMemberId)) return true;
        return false;
      })
      .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime()),
    [eventsWithComputedStatus, personaMemberId, now]
  );

  return (
    <div className="space-y-4">
      {/* Header with Stats Summary */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">{t("nav.clubEvents")}</h1>
          {!isPersonalView && (
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="text-slate-500">
                <span className="font-semibold text-slate-800">{stats.total}</span> {t("events.total")}
              </span>
              <span className="text-[#004941]">
                <span className="font-semibold">{stats.upcoming}</span> {t("events.upcoming")}
              </span>
              <span className="text-slate-500">
                <span className="font-semibold text-slate-600">{stats.draft}</span> {t("events.drafts")}
              </span>
            </div>
          )}
        </div>
        {!isPersonalView && (
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenCreate()}>
            {t("events.newEvent")}
          </Button>
        )}
      </div>

      {/* ── Context filter pills ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setViewContext("verein")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            viewContext === "verein"
              ? "bg-[#004941] text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          Vereinstermine
        </button>
        <button
          onClick={() => setViewContext("me")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            viewContext === "me"
              ? "bg-[#004941] text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          <img src={user.avatar} alt={user.firstName} className="w-4 h-4 rounded-full object-cover" />
          {user.firstName}
        </button>
        {user.linkedChildren?.map(child => (
          <button
            key={child.id}
            onClick={() => setViewContext(child.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              viewContext === child.id
                ? "bg-[#004941] text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {child.avatar && (
              <img src={child.avatar} alt={child.firstName} className="w-4 h-4 rounded-full object-cover" />
            )}
            {child.firstName}
          </button>
        ))}
      </div>

      {/* ── Personal / child events view ── */}
      {isPersonalView && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(viewContext === "me" ? user.avatar : user.linkedChildren?.find(c => c.id === viewContext)?.avatar) && (
                <img
                  src={viewContext === "me" ? user.avatar : user.linkedChildren?.find(c => c.id === viewContext)?.avatar}
                  alt={personalLabel}
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <div>
                <span className="font-semibold text-slate-800 text-sm">{personalLabel}</span>
                <span className="text-slate-500 text-sm ml-2">· {currentPersonalEvents.length} bevorstehende Termine</span>
              </div>
            </div>
          </div>

          {currentPersonalEvents.length === 0 ? (
            <div className="text-center py-16 px-4">
              <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500">Keine bevorstehenden Termine</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {currentPersonalEvents.map(event => {
                const eventType = getPersonalEventType(event);
                const typeIcon =
                  eventType === "training" ? <Dumbbell className="w-4 h-4" /> :
                  eventType === "match" ? <TrophyIcon className="w-4 h-4" /> :
                  <PartyPopper className="w-4 h-4" />;
                const typeColor =
                  eventType === "training" ? "bg-blue-50 text-blue-600" :
                  eventType === "match" ? "bg-teal-50 text-teal-600" :
                  "bg-amber-50 text-amber-600";
                const rsvpStatus: "confirmed" | "pending" = event.rsvpRequired ? "pending" : "confirmed";
                const rsvpConfig = {
                  confirmed: { label: "Zugesagt", color: "bg-green-100 text-green-700", icon: <Check className="w-3 h-3" /> },
                  declined: { label: "Abgesagt", color: "bg-red-100 text-red-700", icon: null },
                  pending: { label: "Ausstehend", color: "bg-neutral-100 text-neutral-500", icon: <Clock className="w-3 h-3" /> },
                };
                const rsvp = rsvpConfig[rsvpStatus];

                return (
                  <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Date badge */}
                      <div className="flex-shrink-0 w-11 h-11 bg-[#004941] rounded-lg flex flex-col items-center justify-center text-white">
                        <span className="text-[9px] font-medium leading-none opacity-80">
                          {new Date(event.date).toLocaleDateString("de-DE", { month: "short" }).toUpperCase()}
                        </span>
                        <span className="text-lg font-bold leading-none">
                          {new Date(event.date).getDate()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-slate-800 truncate">{event.title}</h3>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${typeColor}`}>
                            {typeIcon}
                            {eventType === "training" ? "Training" : eventType === "match" ? "Spiel" : "Veranstaltung"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                          <span>{event.startTime} – {event.endTime}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />{event.location}
                          </span>
                          <span className="text-xs text-slate-400">{event.category ?? ""}</span>
                        </div>
                      </div>

                      {/* RSVP badge */}
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${rsvp.color}`}>
                        {rsvp.icon}{rsvp.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Admin events view (only when on Vereinstermine) ── */}
      {!isPersonalView && (<>

      {/* Unified Toolbar */}
      <Card className="!p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`${t("common.search")}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] focus:border-transparent"
            />
          </div>
          
          {/* Compact Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | "")}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="">{t("events.allStatus")}</option>
              <option value="draft">{t("events.draft")}</option>
              <option value="published">{t("events.published")}</option>
              <option value="cancelled">{t("events.cancelled")}</option>
            </select>
            
            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as EventVisibility | "")}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] bg-white"
            >
              <option value="">{t("events.visibility")}</option>
              <option value="public">{t("events.public")}</option>
              <option value="private">{t("events.private")}</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-slate-200 rounded-lg overflow-hidden ml-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm ${
                  viewMode === "list" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <List className="w-4 h-4" />
                {t("views.list")}
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm ${
                  viewMode === "calendar" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                {t("views.calendar")}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Integrated Week Navigator */}
          <div className="border-b border-slate-200 p-3 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const newDate = new Date(calendarMonth);
                    newDate.setDate(newDate.getDate() - 7);
                    setCalendarMonth(newDate);
                  }}
                  className="p-1 hover:bg-white rounded"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-500" />
                </button>
                <span className="text-sm font-medium text-slate-700 min-w-[120px] text-center">
                  {calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}
                </span>
                <button
                  onClick={() => {
                    const newDate = new Date(calendarMonth);
                    newDate.setDate(newDate.getDate() + 7);
                    setCalendarMonth(newDate);
                  }}
                  className="p-1 hover:bg-white rounded"
                >
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => { setCalendarMonth(new Date()); setSelectedDate(null); }}
                  className="ml-2 text-xs px-2 py-1 text-[#004941] hover:bg-[#C8F2E0] rounded"
                >
                  {t("common.today")}
                </button>
              </div>
              
              {selectedDate ? (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="text-xs px-2 py-1 bg-[#004941] text-white rounded flex items-center gap-1"
                >
                  {new Date(selectedDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                  <XCircle className="w-3 h-3" />
                </button>
              ) : (
                <span className="text-xs text-slate-500">{filteredEvents.length} {t("nav.events")}</span>
              )}
            </div>
            
            {/* Compact Week Strip */}
            <div className="flex gap-1">
              {(() => {
                const startOfWeek = new Date(calendarMonth);
                const dayOfWeek = startOfWeek.getDay();
                const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                startOfWeek.setDate(startOfWeek.getDate() + diff);
                
                const days = [];
                for (let i = 0; i < 7; i++) {
                  const d = new Date(startOfWeek);
                  d.setDate(d.getDate() + i);
                  days.push(d);
                }
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                return days.map((day, i) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const isToday = day.toDateString() === today.toDateString();
                  const dayEvents = filteredEvents.filter(e => e.date === dateStr);
                  const hasEvents = dayEvents.length > 0;
                  const isSelected = selectedDate === dateStr;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                      className={`flex-1 py-1.5 rounded text-center transition-all ${
                        isSelected 
                          ? "bg-[#004941] text-white" 
                          : isToday 
                          ? "bg-[#C8F2E0] text-[#004941]" 
                          : hasEvents
                          ? "bg-white hover:bg-slate-100"
                          : "hover:bg-white"
                      }`}
                    >
                      <p className={`text-[10px] uppercase ${isSelected ? "text-white/70" : "text-slate-400"}`}>
                        {getWeekday(day)}
                      </p>
                      <p className={`text-sm font-bold ${isSelected ? "text-white" : isToday ? "text-[#004941]" : "text-slate-700"}`}>
                        {day.getDate()}
                      </p>
                      {hasEvents && (
                        <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${isSelected ? "bg-white" : "bg-[#004941]"}`} />
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
          
          {/* Events List */}
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 340px)" }}>
            {(() => {
              const displayEvents = selectedDate 
                ? filteredEvents.filter(e => e.date === selectedDate)
                : filteredEvents;
                
              if (displayEvents.length === 0) {
                return (
                  <div className="text-center py-16 px-4">
                    <CalendarIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-slate-600">
                      {selectedDate ? t("events.noEventsOnDay") : t("events.noEvents")}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 mb-4">
                      {selectedDate 
                        ? "Wählen Sie einen anderen Tag"
                        : "Erstellen Sie Ihr erstes Event"
                      }
                    </p>
                    <Button size="sm" onClick={() => handleOpenCreate(selectedDate || undefined)}>
                      <Plus className="w-4 h-4 mr-1" />
                      Event erstellen
                    </Button>
                  </div>
                );
              }
              
              return (
                <div className="divide-y divide-slate-100">
                    {/* Compact Event Rows */}
                    {displayEvents.map(event => (
                      <div
                        key={event.id}
                        onClick={() => handleOpenDetail(event)}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          {/* Date Badge */}
                          <div className="flex-shrink-0 w-11 h-11 bg-[#004941] rounded-lg flex flex-col items-center justify-center text-white">
                            <span className="text-[9px] font-medium leading-none opacity-80">
                              {getMonth(new Date(event.date)).toUpperCase()}
                            </span>
                            <span className="text-lg font-bold leading-none">
                              {new Date(event.date).getDate()}
                            </span>
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title + Status Row */}
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-slate-800 group-hover:text-[#004941] transition-colors truncate">
                                {event.title}
                              </h3>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                {getStatusBadge(event.status)}
                                {event.visibility === "private" && <Lock className="w-3.5 h-3.5 text-slate-400" />}
                                {event.recurrence?.enabled && <RefreshCw className="w-3.5 h-3.5 text-[#004941]" />}
                              </div>
                            </div>
                            
                            {/* Meta Row */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                              <span>
                                {event.isAllDay ? t("common.allDay") : `${event.startTime} - ${event.endTime}`}
                              </span>
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span className="truncate max-w-[180px]">{event.location}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" />
                                {event.resolvedMemberCount || 0}
                              </span>
                              {event.rsvpRequired && event.rsvpStats && event.rsvpStats.invited > 0 && (
                                <span className="text-xs text-slate-400">
                                  {event.rsvpStats.confirmed}/{event.rsvpStats.invited} {t("common.confirmed")}
                                </span>
                              )}
                            </div>
                            
                            {/* Description Preview */}
                            {event.description && (
                              <p className="text-sm text-slate-400 mt-1 line-clamp-1">{event.description}</p>
                            )}
                          </div>
                          
                          {/* Quick Actions - On Hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEdit(event); }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
                              title={t("common.edit")}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicate(event); }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded"
                              title={t("events.duplicate")}
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            {event.status === "draft" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); handlePublish(event); }}
                                className="p-1.5 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-100 rounded"
                                title={t("events.publish")}
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
                  ? calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : calendarViewMode === "week"
                  ? `${lang === "de" ? "KW" : "W"} ${Math.ceil((calendarMonth.getDate() - calendarMonth.getDay() + 1) / 7)} - ${calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}`
                  : calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}
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
                {t("views.day")}
              </button>
              <button
                onClick={() => setCalendarViewMode("week")}
                className={`px-3 py-1.5 ${calendarViewMode === "week" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {t("views.week")}
              </button>
              <button
                onClick={() => setCalendarViewMode("month")}
                className={`px-3 py-1.5 ${calendarViewMode === "month" ? "bg-[#004941] text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}
              >
                {t("views.month")}
              </button>
            </div>
          </div>

          {/* Calendar Grid - Monthly View */}
          {calendarViewMode === "month" && (
          <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-lg overflow-hidden">
            {/* Weekday Headers */}
            {[t("weekdays.mon"), t("weekdays.tue"), t("weekdays.wed"), t("weekdays.thu"), t("weekdays.fri"), t("weekdays.sat"), t("weekdays.sun")].map(day => (
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
                        <p className="text-xs text-slate-500">{getWeekday(day.date)}</p>
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
                              <p className="opacity-70">{event.isAllDay ? t("common.allDay") : event.startTime}</p>
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
                  <p className="text-sm text-slate-500">{calendarMonth.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "long" })}</p>
                  <p className="text-3xl font-bold">{calendarMonth.getDate()}</p>
                </div>
                
                {dayEvents.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <CalendarIcon className="w-8 h-8 mx-auto mb-2" />
                    <p>{t("events.noEvents")}</p>
                    <p className="text-xs mt-1">{lang === "de" ? "Klicken zum Erstellen" : "Click to create"}</p>
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
                                {event.isAllDay ? t("common.allDay") : `${event.startTime} - ${event.endTime}`}
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
      </>)}

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
