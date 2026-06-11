/**
 * FieldBooking – Platzbelegung admin page.
 * Two tabs:
 *   - Belegung: day-view occupancy calendar per field (default)
 *   - Felder: field management (list, create, edit, delete)
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { FieldClosedBadge, FieldStatusChip } from "../components/ui/Badge";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  AlertCircle,
  AlertTriangle,
  LayoutGrid,
  CheckCircle,
  Home,
  XCircle,
  Wrench,
  CalendarDays,
  List,
} from "lucide-react";
import { FieldFormDrawer } from "../components/fields/FieldFormDrawer";
import { FieldDetailModal } from "../components/fields/FieldDetailModal";
import { MaintenanceBlockForm } from "../components/fields/MaintenanceBlockForm";
import { CalendarPicker } from "../components/fields/CalendarPicker";
import { EventDetailDrawer } from "../components/events/EventDetailDrawer";
import { EventFormDrawer } from "../components/events/EventFormDrawer";
import {
  mockFields,
  mockVenues,
  getBookingsForField,
  fieldHasFutureBookings,
  mockMaintenanceBlocks,
} from "../data/mockFields";
import { mockClubEvents } from "../data/mockClubEvents";
import type { Field, MaintenanceBlock, WeekdayKey } from "../types/fields";
import { fieldIsDivisible, getFieldTypeLabel, FIELD_TYPE_LABELS } from "../types/fields";
import { getFieldTypeImage } from "../data/fieldTypeImages";
import type { ClubEvent } from "../types/events";
import { useLanguage } from "../i18n";

// ── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];


// Rough pixel offset for timeline (06:00 = 0%, 22:00 = 100%)
const timeToPercent = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  const totalMin = (h - 6) * 60 + m;
  const span = 16 * 60; // 6:00 to 22:00
  return Math.max(0, Math.min(100, (totalMin / span) * 100));
};

const EVENT_COLORS: Record<string, string> = {
  training: "bg-blue-100 border-blue-300 text-blue-800",
  match: "bg-amber-100 border-amber-300 text-amber-800",
  event: "bg-violet-100 border-violet-300 text-violet-800",
};

// Map JS getDay() (0=Sun) to WeekdayKey
const JS_DAY_TO_KEY: WeekdayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = "belegung" | "felder";

export function FieldBooking() {
  const navigate = useNavigate();
  const { t, lang, getWeekday } = useLanguage();
  const [showCalPicker, setShowCalPicker] = useState(false);
  const [tab, setTab] = useState<Tab>("belegung");
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [formField, setFormField] = useState<Field | null | undefined>(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [dateExplicitlySelected, setDateExplicitlySelected] = useState(true);
  const [calendarWeek, setCalendarWeek] = useState(new Date());
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [detailEvent, setDetailEvent] = useState<ClubEvent | null>(null);
  const [editEvent, setEditEvent] = useState<ClubEvent | null>(null);
  const [detailField, setDetailField] = useState<Field | null>(null);
  const [eventOverrides, setEventOverrides] = useState<Record<string, Partial<ClubEvent>>>({});
  const [localEvents, setLocalEvents] = useState<ClubEvent[]>([]);
  const events = useMemo(() => {
    const applyOverride = (e: ClubEvent) => eventOverrides[e.id] ? { ...e, ...eventOverrides[e.id] } : e;
    return [
      ...mockClubEvents.map(applyOverride),
      ...localEvents.map(applyOverride),
    ];
  }, [eventOverrides, localEvents]);
  const [maintenanceBlocks, setMaintenanceBlocks] = useState<MaintenanceBlock[]>(mockMaintenanceBlocks);
  const [maintenanceTarget, setMaintenanceTarget] = useState<{ field: Field } | null>(null);
  const [filterUnassigned, setFilterUnassigned] = useState(false);
  const [assignFieldMap, setAssignFieldMap] = useState<Record<string, string>>({}); // eventId -> fieldId selection
  const [assignConflict, setAssignConflict] = useState<Record<string, string>>({}); // eventId -> conflict message (informational only)
  const [filterVenueId, setFilterVenueId] = useState("");
  const [filterType, setFilterType] = useState("");
  const [colWidth, setColWidth] = useState(180);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const toggleExpand = (fieldId: string) =>
    setExpandedFields(prev =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );

  // ── Felder tab handlers ───────────────────────────────────────────────────

  const handleSaveField = (data: Omit<Field, "id" | "createdAt" | "updatedAt" | "clubId">) => {
    const buildZonesForCount = (fieldId: string, count: number | null) =>
      count !== null && count > 0
        ? Array.from({ length: count }, (_, i) => ({
            id: `${fieldId}_z${i + 1}`,
            fieldId,
            zoneNumber: i + 1,
            name: `Zone ${i + 1}`,
          }))
        : [];

    if (formField) {
      // Edit: rebuild zones only if zoneCount changed
      setFields(prev =>
        prev.map(f =>
          f.id === formField.id
            ? { ...f, ...data, zones: data.zoneCount !== f.zoneCount ? buildZonesForCount(f.id, data.zoneCount) : f.zones, updatedAt: new Date().toISOString() }
            : f
        )
      );
    } else {
      // Create
      const id = `field_${Date.now()}`;
      setFields(prev => [
        ...prev,
        { ...data, id, clubId: "club1", zones: buildZonesForCount(id, data.zoneCount), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ]);
    }
    setFormField(undefined);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setFields(prev => prev.filter(f => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Belegung tab ──────────────────────────────────────────────────────────

  const dayBookings = useMemo(
    () => fields.map(f => ({
      field: f,
      bookings: getBookingsForField(events, f.id, selectedDate),
      maintenance: maintenanceBlocks.filter(b => b.fieldId === f.id && b.date === selectedDate),
    })),
    [fields, events, selectedDate, maintenanceBlocks]
  );

  // Selected date weekday key
  const selectedWeekdayKey: WeekdayKey = JS_DAY_TO_KEY[new Date(selectedDate + "T12:00:00").getDay()];

  const today = new Date().toISOString().split("T")[0];

  const [filterListUnconfirmed, setFilterListUnconfirmed] = useState(false);

  // Venue accordion – collapse state for both tabs
  // Default: collapse imported DFB venues, keep manual ones open
  const [collapsedVenues, setCollapsedVenues] = useState<Set<string>>(
    () => new Set(mockVenues.filter(v => v.sourceType === "imported").map(v => v.id))
  );
  const toggleVenueCollapse = (venueId: string) =>
    setCollapsedVenues(prev => {
      const next = new Set(prev);
      next.has(venueId) ? next.delete(venueId) : next.add(venueId);
      return next;
    });
  const allVenueIds = mockVenues.map(v => v.id);
  const allCollapsed = allVenueIds.every(id => collapsedVenues.has(id));
  const toggleAllVenues = () =>
    setCollapsedVenues(allCollapsed ? new Set() : new Set(allVenueIds));

  // Base event list: selected day's events OR next 10 upcoming
  const listEvents = useMemo(() => {
    if (dateExplicitlySelected) {
      return events
        .filter(e => e.date === selectedDate && e.status !== "cancelled")
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return events
      .filter(e => e.date >= today && e.status !== "cancelled" && e.status !== "completed")
      .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
      .slice(0, 10);
  }, [events, dateExplicitlySelected, selectedDate, today]);

  // Helper: compute effective booking status for a booked event (maintenance blocks override stored status)
  const getEffectiveBookingStatus = (evt: ClubEvent): "confirmed" | "not_confirmed" => {
    if (evt.bookingStatus === "not_confirmed") return "not_confirmed";
    const hasMaintenance = maintenanceBlocks.some(b =>
      b.fieldId === evt.fieldId &&
      b.date === evt.date &&
      b.startTime < evt.endTime &&
      b.endTime > evt.startTime
    );
    return hasMaintenance ? "not_confirmed" : "confirmed";
  };

  // Apply overlay filters (unassigned / not-confirmed)
  const displayEvents = useMemo(() => {
    let result = listEvents;
    if (filterUnassigned) result = result.filter(e => !e.fieldId);
    if (filterListUnconfirmed) result = result.filter(e => e.fieldId && getEffectiveBookingStatus(e) === "not_confirmed");
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listEvents, filterUnassigned, filterListUnconfirmed, maintenanceBlocks]);

  const unassignedCount = useMemo(
    () => listEvents.filter(e => !e.fieldId).length,
    [listEvents]
  );

  const listUnconfirmedCount = useMemo(
    () => listEvents.filter(e => e.fieldId && getEffectiveBookingStatus(e) === "not_confirmed").length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listEvents, maintenanceBlocks]
  );

  const filteredDayBookings = useMemo(
    () => dayBookings.filter(d =>
      (filterVenueId === "" || d.field.venueId === filterVenueId) &&
      (filterType === "" || d.field.type === filterType)
    ),
    [dayBookings, filterVenueId, filterType]
  );

  const groupedBookings = useMemo(() => {
    const groups: Array<{ venue: typeof mockVenues[0]; rows: typeof filteredDayBookings }> = [];
    const seen = new Set<string>();
    for (const d of filteredDayBookings) {
      if (!seen.has(d.field.venueId)) {
        seen.add(d.field.venueId);
        const venue = mockVenues.find(v => v.id === d.field.venueId);
        if (venue) groups.push({ venue, rows: filteredDayBookings.filter(r => r.field.venueId === venue.id) });
      }
    }
    return groups;
  }, [filteredDayBookings]);

  const fieldTypes = useMemo(() => [...new Set(fields.map(f => f.type))], [fields]);

  const activeFields = fields.filter(f => f.isActive);

  const handleAssignField = (eventId: string) => {
    const fieldId = assignFieldMap[eventId];
    if (!fieldId) return;

    const evt = events.find(e => e.id === eventId);
    if (!evt) return;

    // Check for time overlap with existing bookings on this field for that date
    const conflictingEvent = events.find(e =>
      e.id !== eventId &&
      e.fieldId === fieldId &&
      e.date === evt.date &&
      e.status !== "cancelled" &&
      e.startTime < evt.endTime &&
      e.endTime > evt.startTime
    );

    // Also check maintenance blocks
    const conflictingMaintenance = maintenanceBlocks.find(b =>
      b.fieldId === fieldId &&
      b.date === evt.date &&
      b.startTime < evt.endTime &&
      b.endTime > evt.startTime
    );

    const hasConflict = !!(conflictingEvent || conflictingMaintenance);
    const bookingStatus: "confirmed" | "not_confirmed" = hasConflict ? "not_confirmed" : "confirmed";

    if (hasConflict) {
      const msg = conflictingEvent
        ? (lang === "de"
          ? `Konflikt mit "${conflictingEvent.title}" – Buchung als nicht bestätigt gespeichert`
          : `Conflict with "${conflictingEvent.title}" – saved as not confirmed`)
        : (lang === "de"
          ? "Konflikt mit Sperrzeit – Buchung als nicht bestätigt gespeichert"
          : "Conflict with maintenance block – saved as not confirmed");
      setAssignConflict(prev => ({ ...prev, [eventId]: msg }));
    } else {
      setAssignConflict(prev => { const n = { ...prev }; delete n[eventId]; return n; });
    }

    // Always assign — conflict is flagged via bookingStatus, not blocked
    setEventOverrides(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], fieldId, bookingScope: "full_field" as const, bookedZoneIds: undefined, bookingStatus }
    }));
    setAssignFieldMap(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  };

  const handleConfirmBooking = (eventId: string) => {
    setEventOverrides(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], bookingStatus: "confirmed" },
    }));
  };

  const handleConfirmAllUnconfirmed = () => {
    const ids = listEvents
      .filter(e => e.fieldId && getEffectiveBookingStatus(e) === "not_confirmed")
      .map(e => e.id);
    setEventOverrides(prev => {
      const next = { ...prev };
      ids.forEach(id => { next[id] = { ...next[id], bookingStatus: "confirmed" }; });
      return next;
    });
  };

  const handleSaveEvent = (saved: ClubEvent) => {
    const isBase = mockClubEvents.some(e => e.id === saved.id);
    if (isBase) {
      setEventOverrides(prev => ({ ...prev, [saved.id]: saved }));
    } else {
      setLocalEvents(prev =>
        prev.some(e => e.id === saved.id)
          ? prev.map(e => e.id === saved.id ? saved : e)
          : [...prev, saved]
      );
    }
    setEditEvent(null);
    setDetailEvent(null);
  };

  const handleDuplicateEvent = (evt: ClubEvent) => {
    const dup: ClubEvent = { ...evt, id: `local_${Date.now()}`, title: `${evt.title} (Kopie)`, status: "draft" as const, statusHistory: [] };
    setEditEvent(dup);
    setDetailEvent(null);
  };

  const handlePublishEvent = (evt: ClubEvent) => {
    setEventOverrides(prev => ({ ...prev, [evt.id]: { ...prev[evt.id], status: "published" as const } }));
    setDetailEvent(prev => prev ? { ...prev, status: "published" as const } : null);
  };

  const handleCancelEvent = (evt: ClubEvent, _reason: string) => {
    setEventOverrides(prev => ({ ...prev, [evt.id]: { ...prev[evt.id], status: "cancelled" as const } }));
    setDetailEvent(null);
  };

  const handleRemoveBooking = (eventId: string) => {
    setEventOverrides(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], fieldId: undefined, bookingScope: undefined, bookedZoneIds: undefined }
    }));
  };

  const handleRemoveMaintenance = (blockId: string) => {
    setMaintenanceBlocks(prev => prev.filter(b => b.id !== blockId));
  };

  const handleSaveMaintenance = (block: MaintenanceBlock) => {
    setMaintenanceBlocks(prev => [...prev, block]);
    setMaintenanceTarget(null);
  };

  const onResizeStart = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startW.current = colWidth;
    e.preventDefault();
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setColWidth(Math.max(120, Math.min(360, startW.current + e.clientX - startX.current)));
    };
    const onUp = () => { isDragging.current = false; };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{t("fields.title")}</h1>
          <p className="text-neutral-500 mt-0.5">
            {fields.filter(f => f.isActive).length} {t("fields.activeFields")} · {fields.length} {t("fields.total")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 hover:border-neutral-300 text-neutral-600 hover:text-neutral-800 rounded-lg text-sm font-medium transition-colors"
          >
            <MapPin className="w-4 h-4" />
            {lang === "de" ? "Spielstätten" : "Venues"}
          </button>
          <button
            onClick={() => setFormField(null)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("fields.addField")}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 w-fit">
        {(["belegung", "felder"] as Tab[]).map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === tabKey ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tabKey === "felder" ? <Home className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {tabKey === "felder" ? t("fields.fieldsTab") : t("fields.occupancyTab")}
          </button>
        ))}
      </div>

      {/* ── BELEGUNG TAB ────────────────────────────────────────────────── */}
      {tab === "belegung" && (
        <div className="space-y-4">
          {/* Date navigation */}
          <div className="bg-white border border-neutral-200 rounded-[10px] p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { const d = new Date(calendarWeek); d.setDate(d.getDate() - 7); setCalendarWeek(d); }}
                  className="p-1 hover:bg-neutral-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4 text-neutral-500" />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowCalPicker(v => !v)}
                    className={`flex items-center gap-1.5 px-2 py-1 text-sm font-medium rounded transition-colors min-w-[150px] justify-center ${
                      showCalPicker
                        ? "bg-[#004941] text-white"
                        : "text-neutral-700 hover:bg-neutral-100"
                    }`}
                    title={t("fields.jumpToDate")}
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    {calendarWeek.toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "long", year: "numeric" })}
                  </button>
                  {showCalPicker && (
                    <CalendarPicker
                      selectedDate={selectedDate}
                      onSelect={date => {
                        setSelectedDate(date);
                        setCalendarWeek(new Date(date + "T12:00:00"));
                        setDateExplicitlySelected(true);
                      }}
                      onClose={() => setShowCalPicker(false)}
                    />
                  )}
                </div>
                <button
                  onClick={() => { const d = new Date(calendarWeek); d.setDate(d.getDate() + 7); setCalendarWeek(d); }}
                  className="p-1 hover:bg-neutral-100 rounded"
                >
                  <ChevronRight className="w-4 h-4 text-neutral-500" />
                </button>
                <button
                  onClick={() => { setCalendarWeek(new Date()); setSelectedDate(TODAY); setDateExplicitlySelected(true); }}
                  className="ml-2 text-xs px-2 py-1 text-[#004941] hover:bg-[#C8F2E0] rounded"
                >
                  {t("fields.today")}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {dateExplicitlySelected ? (
                  <button
                    onClick={() => setDateExplicitlySelected(false)}
                    className="text-xs px-2 py-1 bg-[#004941] text-white rounded flex items-center gap-1"
                  >
                    {new Date(selectedDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                    <XCircle className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs text-neutral-500">{lang === "de" ? "Nächste Termine" : "Upcoming"}</span>
                )}
              </div>
            </div>
            {/* Week strip */}
            <div className="flex gap-1">
              {(() => {
                const startOfWeek = new Date(calendarWeek);
                const dow = startOfWeek.getDay();
                startOfWeek.setDate(startOfWeek.getDate() + (dow === 0 ? -6 : 1 - dow));
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                return Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(startOfWeek);
                  d.setDate(d.getDate() + i);
                  const dateStr = d.toISOString().split("T")[0];
                  const isToday = d.toDateString() === todayDate.toDateString();
                  const isSelected = selectedDate === dateStr && dateExplicitlySelected;
                  const hasBookings = events.some(e => e.fieldId && e.date === dateStr);
                  return (
                    <button
                      key={i}
                      onClick={() => { if (isSelected) { setDateExplicitlySelected(false); } else { setSelectedDate(dateStr); setDateExplicitlySelected(true); } }}
                      className={`flex-1 py-1.5 rounded text-center transition-all ${
                        isSelected ? "bg-[#004941] text-white" : isToday ? "bg-[#C8F2E0] text-[#004941]" : hasBookings ? "bg-white hover:bg-neutral-100" : "hover:bg-white"
                      }`}
                    >
                      <p className={`text-[10px] uppercase ${isSelected ? "text-white/70" : "text-neutral-400"}`}>
                        {getWeekday(d)}
                      </p>
                      <p className={`text-sm font-bold ${isSelected ? "text-white" : isToday ? "text-[#004941]" : "text-neutral-700"}`}>
                        {d.getDate()}
                      </p>
                      {hasBookings && (
                        <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${isSelected ? "bg-white" : "bg-[#004941]"}`} />
                      )}
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-neutral-500">{lang === "de" ? "Filter:" : "Filter:"}</span>
            <select
              value={filterVenueId}
              onChange={e => setFilterVenueId(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">{lang === "de" ? "Alle Spielstätten" : "All venues"}</option>
              {mockVenues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">{lang === "de" ? "Alle Typen" : "All types"}</option>
              {fieldTypes.map(ftype => (
                <option key={ftype} value={ftype}>{FIELD_TYPE_LABELS[ftype]}</option>
              ))}
            </select>
            {(filterVenueId !== "" || filterType !== "") && (
              <button
                onClick={() => { setFilterVenueId(""); setFilterType(""); }}
                className="flex items-center gap-1 text-xs text-teal-700 hover:text-teal-900"
              >
                <XCircle className="w-3 h-3" />
                {lang === "de" ? "Zurücksetzen" : "Clear"}
              </button>
            )}
            <div className="ml-auto">
              <button
                onClick={toggleAllVenues}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 px-2 py-1 rounded hover:bg-neutral-100 transition-colors"
              >
                <List className="w-3.5 h-3.5" />
                {allCollapsed
                  ? (lang === "de" ? "Alle aufklappen" : "Expand all")
                  : (lang === "de" ? "Alle einklappen" : "Collapse all")}
              </button>
            </div>
          </div>

          {/* Main layout: timetable + optional unassigned sidebar */}
          <div className="flex gap-4 items-start">

            {/* ── Timetable (full width, narrows when unassigned panel is open) ── */}
            <div className="flex-1 min-w-0 space-y-3">

              {/* Timetable grid */}
              <div className="bg-white border-2 border-neutral-200 rounded-[10px] overflow-hidden shadow-sm">
                {/* Column header + hour ruler */}
                <div className="flex border-b-2 border-neutral-200 select-none bg-neutral-50">
                  {/* Field column header with drag-resize handle */}
                  <div
                    className="relative flex-shrink-0 flex items-center px-3 py-2 border-r-2 border-neutral-200"
                    style={{ width: colWidth }}
                  >
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide truncate">
                      {lang === "de" ? "Feld" : "Field"}
                    </span>
                    <div
                      onMouseDown={onResizeStart}
                      className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-center group z-20"
                      title={lang === "de" ? "Breite anpassen" : "Resize column"}
                    >
                      <div className="w-0.5 h-5 bg-neutral-300 rounded-full group-hover:bg-teal-400 transition-colors" />
                    </div>
                  </div>
                  {/* Hour labels — absolutely positioned to match row grid lines at 0,12.5,25,...,100% */}
                  <div className="flex-1 relative h-8">
                    {[6, 8, 10, 12, 14, 16, 18, 20, 22].map((h, i) => (
                      <div
                        key={h}
                        className="absolute top-0 bottom-0 flex flex-col items-start"
                        style={{ left: `${(i / 8) * 100}%` }}
                      >
                        <div className="w-px h-2 bg-neutral-200" />
                        <span className="text-[10px] text-neutral-400 pl-1">{String(h).padStart(2, "0")}:00</span>
                      </div>
                    ))}
                  </div>
                </div>

                {groupedBookings.length === 0 && (
                  <div className="py-12 text-center">
                    <LayoutGrid className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                    <p className="text-sm text-neutral-500">{t("fields.noBookings")}</p>
                  </div>
                )}

                {/* Venue-grouped field rows */}
                {groupedBookings.map(({ venue, rows }) => {
                  const isVenueCollapsed = collapsedVenues.has(venue.id);
                  const venueBookingCount = rows.reduce((n, r) => n + r.bookings.length, 0);
                  return (
                  <div key={venue.id}>
                    {/* Venue header row – clickable accordion */}
                    <button
                      onClick={() => toggleVenueCollapse(venue.id)}
                      className="w-full flex items-center bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-100/80 transition-colors group"
                    >
                      <div
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2"
                        style={{ width: colWidth }}
                      >
                        <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform ${isVenueCollapsed ? "-rotate-90" : ""}`} />
                        <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                        <span className="text-[11px] font-semibold text-neutral-700 truncate">{venue.name}</span>
                        {venue.sourceType === "imported" && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-600 font-medium flex-shrink-0">DFB</span>
                        )}
                      </div>
                      <div className="flex-1 border-l border-neutral-200 flex items-center px-3 gap-2">
                        {isVenueCollapsed && (
                          <span className="text-[10px] text-neutral-400">
                            {rows.length} {lang === "de" ? "Felder" : "fields"}
                            {venueBookingCount > 0 && ` · ${venueBookingCount} ${lang === "de" ? "Buchungen" : "bookings"}`}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Field rows – hidden when venue collapsed */}
                    {!isVenueCollapsed && rows.map(({ field, bookings, maintenance }) => {
                      const isExpanded = expandedFields.includes(field.id);
                      const hasBookings = bookings.length > 0 || maintenance.length > 0;
                      const dayHours = field.isActive ? field.openingHours?.[selectedWeekdayKey] : undefined;
                      const isClosed = dayHours ? !dayHours.open : false;
                      const openFrom = dayHours?.open ? dayHours.from : null;
                      const openTo = dayHours?.open ? dayHours.to : null;

                      return (
                        <div key={field.id} className="border-b border-neutral-100 last:border-0">
                          {/* Field header row */}
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 px-3 py-3 flex items-center gap-2 ${fieldIsDivisible(field) ? "cursor-pointer hover:bg-neutral-50" : ""}`}
                              style={{ width: colWidth }}
                              onClick={() => fieldIsDivisible(field) && toggleExpand(field.id)}
                            >
                              <img src={getFieldTypeImage(field)} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 truncate">{field.name}</p>
                                {fieldIsDivisible(field) && (
                                  <p className="text-[10px] text-neutral-400">{isExpanded ? `▲ ${t("fields.expandZones")}` : `▼ ${t("fields.expandZones")}`}</p>
                                )}
                              </div>
                              <button
                                onClick={e => { e.stopPropagation(); setMaintenanceTarget({ field }); }}
                                className="p-1 rounded hover:bg-amber-50 text-amber-500 hover:text-amber-700 transition-colors flex-shrink-0"
                                title={t("fields.addMaintenanceTitle")}
                              >
                                <Wrench className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {/* Timeline track */}
                            <div className="flex-1 relative h-12 border-l border-neutral-200 overflow-hidden">
                              {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((p, i) => (
                                <div key={i} className="absolute top-0 bottom-0 border-l border-neutral-100" style={{ left: `${p}%` }} />
                              ))}
                              {field.isActive && dayHours && (
                                isClosed ? (
                                  /* Fully closed day – grey overlay */
                                  <div className="absolute top-0 bottom-0 bg-neutral-100/70 flex items-center justify-center z-0" style={{ left: "0%", width: "100%" }}>
                                    <FieldClosedBadge />
                                  </div>
                                ) : openFrom && openTo ? (
                                  /* Has opening hours – grey only outside open window; open window stays transparent so grid shows */
                                  <>
                                    {timeToPercent(openFrom) > 0 && (
                                      <div className="absolute top-0 bottom-0 bg-neutral-200/50 z-0" style={{ left: "0%", width: `${timeToPercent(openFrom)}%` }} />
                                    )}
                                    {timeToPercent(openTo) < 100 && (
                                      <div className="absolute top-0 bottom-0 bg-neutral-200/50 z-0" style={{ left: `${timeToPercent(openTo)}%`, width: `${100 - timeToPercent(openTo)}%` }} />
                                    )}
                                  </>
                                ) : null
                              )}
                              {maintenance.map(block => {
                                const start = timeToPercent(block.startTime);
                                const end = timeToPercent(block.endTime);
                                const width = Math.max(end - start, 2);
                                return (
                                  <div
                                    key={block.id}
                                    className="absolute top-0 bottom-0 bg-red-100/70 border-l border-r border-red-300 z-[1] flex items-end pb-0.5 px-1"
                                    style={{ left: `${start}%`, width: `${width}%` }}
                                    title={`🔧 ${block.title} · ${block.startTime}–${block.endTime}`}
                                  >
                                    <span className="text-[9px] text-red-500 font-medium truncate">🔧 {block.title}</span>
                                  </div>
                                );
                              })}
                              {bookings.map(evt => {
                                const start = timeToPercent(evt.startTime);
                                const end = timeToPercent(evt.endTime);
                                const width = Math.max(end - start, 2);
                                const color = EVENT_COLORS[evt.category === "Training" ? "training" : evt.category === "Spiel" ? "match" : "event"] ?? EVENT_COLORS.event;
                                const isNotConfirmed = getEffectiveBookingStatus(evt) === "not_confirmed";
                                return (
                                  <button
                                    key={evt.id}
                                    onClick={() => setDetailEvent(evt)}
                                    className={`absolute top-1 bottom-1 rounded border text-[10px] font-medium truncate px-1 z-10 ${color} hover:brightness-95 transition-all ${isNotConfirmed ? "ring-1 ring-amber-400" : ""}`}
                                    style={{ left: `${start}%`, width: `${width}%` }}
                                    title={`${evt.title} · ${evt.startTime}–${evt.endTime}${isNotConfirmed ? (lang === "de" ? " · Nicht bestätigt" : " · Not confirmed") : ""}`}
                                  >
                                    {isNotConfirmed && <AlertTriangle className="w-2.5 h-2.5 text-amber-500 inline mr-0.5 flex-shrink-0" />}
                                    {evt.title}
                                  </button>
                                );
                              })}
                              {!hasBookings && !isClosed && (
                                <div className="absolute inset-0 flex items-center justify-start pl-3 z-10">
                                  <span className="text-[11px] text-neutral-300">{t("fields.free")}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Expanded zone rows */}
                          {fieldIsDivisible(field) && isExpanded && (
                            <div className="border-t border-neutral-100">
                              {field.zones.map(zone => {
                                const zoneBookings = bookings.filter(e =>
                                  e.bookingScope === "full_field" ||
                                  (e.bookingScope === "zones" && e.bookedZoneIds?.includes(zone.id))
                                );
                                return (
                                  <div key={zone.id} className="flex items-center bg-neutral-50">
                                    <div
                                      className="flex-shrink-0 py-2"
                                      style={{ width: colWidth, paddingLeft: Math.min(Math.round(colWidth * 0.25), 40) }}
                                    >
                                      <p className="text-xs text-neutral-500">{zone.name}</p>
                                    </div>
                                    <div className="flex-1 relative h-9 border-l border-neutral-200 overflow-hidden">
                                      {zoneBookings.map(evt => {
                                        const start = timeToPercent(evt.startTime);
                                        const end = timeToPercent(evt.endTime);
                                        const width = Math.max(end - start, 2);
                                        return (
                                          <button
                                            key={evt.id}
                                            onClick={() => setDetailEvent(evt)}
                                            className="absolute top-1 bottom-1 rounded bg-teal-100 border border-teal-300 text-[9px] text-teal-800 font-medium truncate px-1 hover:brightness-95 transition-all z-10"
                                            style={{ left: `${start}%`, width: `${width}%` }}
                                            title={evt.title}
                                          >
                                            {evt.title}
                                          </button>
                                        );
                                      })}
                                      {zoneBookings.length === 0 && (
                                        <div className="absolute inset-0 flex items-center pl-3">
                                          <span className="text-[10px] text-neutral-200">{t("fields.free")}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> {t("fields.training")}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" /> {t("fields.match")}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-violet-200 border border-violet-300" /> {t("fields.event")}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-400" /> {t("fields.maintenance")}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-100 border border-blue-300 ring-1 ring-amber-400" /><AlertTriangle className="w-2.5 h-2.5 text-amber-500" /> {lang === "de" ? "Nicht bestätigt" : "Not confirmed"}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded border border-neutral-200" /> {t("fields.openingHours")}</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-neutral-200" /> {t("fields.closed")}</span>
              </div>
            </div>

          </div>

          {/* ── Upcoming / selected-day events list (below timetable) ────── */}
          <div className="bg-white border border-neutral-200 rounded-[10px] overflow-hidden">
            <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-semibold text-neutral-600">
                  {dateExplicitlySelected
                    ? new Date(selectedDate + "T12:00:00").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long" })
                    : lang === "de" ? "Nächste Termine" : "Upcoming events"}
                </p>
                <button
                  onClick={() => { setFilterUnassigned(v => !v); if (filterListUnconfirmed) setFilterListUnconfirmed(false); }}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all ${
                    filterUnassigned
                      ? "bg-violet-100 border-violet-300 text-violet-700"
                      : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                  }`}
                >
                  <AlertCircle className="w-3 h-3" />
                  {lang === "de" ? "Nicht zugewiesen" : "Unassigned"}
                  {unassignedCount > 0 && (
                    <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-bold ${
                      filterUnassigned ? "bg-violet-600 text-white" : "bg-neutral-200 text-neutral-500"
                    }`}>
                      {unassignedCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setFilterListUnconfirmed(v => !v); if (filterUnassigned) setFilterUnassigned(false); }}
                  className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium transition-all ${
                    filterListUnconfirmed
                      ? "bg-amber-100 border-amber-300 text-amber-700"
                      : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  {lang === "de" ? "Nicht bestätigt" : "Not confirmed"}
                  {listUnconfirmedCount > 0 && (
                    <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[9px] font-bold ${
                      filterListUnconfirmed ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-700"
                    }`}>
                      {listUnconfirmedCount}
                    </span>
                  )}
                </button>
              </div>
              <span className="text-[10px] bg-neutral-200 text-neutral-500 px-1.5 py-0.5 rounded-full font-medium">{displayEvents.length}</span>
            </div>

            {/* Option C — Bulk confirm bar */}
            {filterListUnconfirmed && listUnconfirmedCount > 0 && (
              <div className="flex items-center justify-between px-4 py-2 bg-amber-50 border-b border-amber-100">
                <p className="text-[11px] text-amber-700">
                  {listUnconfirmedCount} {lang === "de" ? "Buchung(en) mit Konflikt" : "booking(s) with conflict"}
                </p>
                <button
                  onClick={handleConfirmAllUnconfirmed}
                  className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {lang === "de" ? "Alle bestätigen" : "Confirm all"}
                </button>
              </div>
            )}

            {displayEvents.length === 0 ? (
              <div className="py-6 text-center">
                <CalendarDays className="w-6 h-6 text-neutral-200 mx-auto mb-1" />
                <p className="text-xs text-neutral-400">
                  {filterUnassigned
                    ? (lang === "de" ? "Alle Termine zugewiesen" : "All events assigned")
                    : filterListUnconfirmed
                      ? (lang === "de" ? "Keine Konflikte" : "No conflicts")
                      : (lang === "de" ? "Keine Termine" : "No events")}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {displayEvents.map(evt => {
                  const color = EVENT_COLORS[evt.category === "Training" ? "training" : evt.category === "Spiel" ? "match" : "event"] ?? EVENT_COLORS.event;
                  const evtField = fields.find(f => f.id === evt.fieldId);
                  const evtVenue = evtField ? mockVenues.find(v => v.id === evtField.venueId) : null;
                  const locationLabel = evtField
                    ? [evtVenue?.name, evtField.name].filter(Boolean).join(" · ")
                    : evt.location || null;
                  const isUnassigned = !evt.fieldId;
                  const isNotConfirmed = !!evt.fieldId && getEffectiveBookingStatus(evt) === "not_confirmed";

                  if (filterUnassigned && isUnassigned) {
                    // Inline assign card
                    return (
                      <div key={evt.id} className="flex items-center gap-3 px-4 py-3 bg-white">
                        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex flex-col items-center justify-center">
                          <span className="text-[8px] text-violet-400 font-medium leading-none">
                            {new Date(evt.date + "T12:00:00").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short" }).toUpperCase()}
                          </span>
                          <span className="text-sm font-bold text-violet-700 leading-none">
                            {new Date(evt.date + "T12:00:00").getDate()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-xs font-medium text-neutral-900 truncate">{evt.title}</p>
                            <span className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-medium ${color}`}>
                              {evt.category ?? "—"}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-500">{evt.date} · {evt.startTime}–{evt.endTime}</p>
                          {assignConflict[evt.id] && (
                            <p className="text-[10px] text-amber-700 flex items-center gap-1 mt-0.5">
                              <AlertTriangle className="w-2.5 h-2.5 flex-shrink-0 text-amber-500" />
                              {assignConflict[evt.id]}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <select
                            value={assignFieldMap[evt.id] ?? ""}
                            onChange={e => {
                              setAssignFieldMap(prev => ({ ...prev, [evt.id]: e.target.value }));
                              setAssignConflict(prev => { const n = { ...prev }; delete n[evt.id]; return n; });
                            }}
                            className="text-xs px-2 py-1.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500 bg-white max-w-[160px]"
                          >
                            <option value="">{lang === "de" ? "Ressource wählen…" : "Select resource…"}</option>
                            {activeFields.map(f => (
                              <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleAssignField(evt.id)}
                            disabled={!assignFieldMap[evt.id]}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-colors"
                          >
                            {lang === "de" ? "Zuweisen" : "Assign"}
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={evt.id}
                      onClick={() => setDetailEvent(evt)}
                      className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                        isUnassigned
                          ? "bg-violet-50/40 hover:bg-violet-50/70"
                          : isNotConfirmed
                            ? "bg-amber-50/40 hover:bg-amber-50/70"
                            : "bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex flex-col items-center justify-center ${
                        isUnassigned
                          ? "bg-violet-100 border border-violet-200"
                          : isNotConfirmed
                            ? "bg-amber-100 border border-amber-200"
                            : "bg-neutral-100"
                      }`}>
                        <span className={`text-[8px] font-medium leading-none ${
                          isUnassigned ? "text-violet-400" : isNotConfirmed ? "text-amber-500" : "text-neutral-400"
                        }`}>
                          {new Date(evt.date + "T12:00:00").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { month: "short" }).toUpperCase()}
                        </span>
                        <span className={`text-sm font-bold leading-none ${
                          isUnassigned ? "text-violet-700" : isNotConfirmed ? "text-amber-700" : "text-neutral-800"
                        }`}>
                          {new Date(evt.date + "T12:00:00").getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-neutral-900 truncate">{evt.title}</p>
                        <p className="text-[10px] text-neutral-500 truncate">
                          {evt.startTime}–{evt.endTime}
                          {locationLabel ? ` · ${locationLabel}` : ""}
                        </p>
                        {isUnassigned && (
                          <FieldStatusChip label={lang === "de" ? "Keine Ressource" : "No resource"} color="violet" />
                        )}
                        {isNotConfirmed && (
                          <FieldStatusChip label={lang === "de" ? "Nicht bestätigt" : "Not confirmed"} color="amber" />
                        )}
                      </div>
                      <span className={`flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded border font-medium ${color}`}>
                        {evt.category ?? "—"}
                      </span>
                      {/* Option A — inline confirm button */}
                      {isNotConfirmed && (
                        <button
                          onClick={e => { e.stopPropagation(); handleConfirmBooking(evt.id); }}
                          title={lang === "de" ? "Buchung bestätigen" : "Confirm booking"}
                          className="flex-shrink-0 p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── FELDER TAB ──────────────────────────────────────────────────── */}
      {tab === "felder" && (
        <div className="bg-white border border-neutral-200 rounded-[10px] overflow-hidden">
          {mockVenues.map((venue, venueIdx) => {
            const venueFields = fields.filter(f => f.venueId === venue.id);
            if (venueFields.length === 0) return null;
            const isCollapsed = collapsedVenues.has(venue.id);
            const activeCount = venueFields.filter(f => f.isActive).length;
            return (
              <div key={venue.id} className={venueIdx > 0 ? "border-t border-neutral-200" : ""}>
                {/* Venue accordion header */}
                <button
                  onClick={() => toggleVenueCollapse(venue.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100/80 transition-colors text-left group"
                >
                  <ChevronDown className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-neutral-800 flex-1 truncate">{venue.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {venue.sourceType === "imported" && venue.externalSource === "dfb" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">DFB</span>
                    )}
                    <span className="text-[10px] text-neutral-400">{activeCount}/{venueFields.length} {lang === "de" ? "aktiv" : "active"}</span>
                  </div>
                </button>

                {/* Field list rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-neutral-100">
                    {venueFields.map(field => {
                      const hasFuture = fieldHasFutureBookings(events, field.id);
                      const todayBookings = getBookingsForField(events, field.id, TODAY);
                      return (
                        <div
                          key={field.id}
                          className={`flex items-center gap-3 px-4 py-2.5 hover:bg-neutral-50 transition-colors cursor-pointer ${!field.isActive ? "opacity-50" : ""}`}
                          onClick={() => setDetailField(field)}
                        >
                          {/* Type image */}
                          <img src={getFieldTypeImage(field)} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />

                          {/* Name + type */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">{field.name}</p>
                            <p className="text-xs text-neutral-400">{getFieldTypeLabel(field)}</p>
                          </div>

                          {/* Badges */}
                          <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                            {fieldIsDivisible(field) && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                {field.zoneCount} {lang === "de" ? "Zonen" : "zones"}
                              </span>
                            )}
                            {field.sourceType === "imported" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                {t("fields.imported")}
                              </span>
                            )}
                            {!field.isActive && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
                                {t("fields.inactive")}
                              </span>
                            )}
                          </div>

                          {/* Booking status */}
                          <div className="hidden md:block flex-shrink-0 w-28 text-right">
                            {hasFuture ? (
                              <span className="text-[10px] text-teal-600 flex items-center gap-1 justify-end">
                                <CheckCircle className="w-3 h-3" />
                                {lang === "de" ? "Buchungen" : "Bookings"}
                              </span>
                            ) : todayBookings.length > 0 ? (
                              <span className="text-[10px] text-blue-600">{lang === "de" ? "Heute belegt" : "Booked today"}</span>
                            ) : (
                              <span className="text-[10px] text-neutral-300">{t("fields.noFutureBookings")}</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => setFormField(field)}
                              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-700"
                              title={t("common.edit")}
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(field)}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-neutral-400 hover:text-red-600"
                              title={t("common.delete")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── EVENT DETAIL DRAWER ──────────────────────────────────────── */}
      {detailEvent && (
        <EventDetailDrawer
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onEdit={evt => { setEditEvent(evt); setDetailEvent(null); }}
          onDuplicate={handleDuplicateEvent}
          onPublish={handlePublishEvent}
          onCancel={handleCancelEvent}
          onConfirm={() => { handleConfirmBooking(detailEvent.id); setDetailEvent(null); }}
        />
      )}

      {/* ── EVENT EDIT FORM ──────────────────────────────────────────── */}
      {editEvent !== null && (
        <EventFormDrawer
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSave={handleSaveEvent}
        />
      )}

      {/* ── FIELD DETAIL MODAL ───────────────────────────────────────────── */}
      {detailField && (
        <FieldDetailModal
          field={detailField}
          events={events}
          maintenanceBlocks={maintenanceBlocks}
          onClose={() => setDetailField(null)}
          onRemoveBooking={handleRemoveBooking}
          onRemoveMaintenance={handleRemoveMaintenance}
        />
      )}

      {/* ── MAINTENANCE BLOCK FORM ───────────────────────────────────────── */}
      {maintenanceTarget && (
        <MaintenanceBlockForm
          field={maintenanceTarget.field}
          selectedDate={selectedDate}
          onClose={() => setMaintenanceTarget(null)}
          onSave={handleSaveMaintenance}
        />
      )}

      {/* ── FIELD FORM DRAWER ────────────────────────────────────────────── */}
      {formField !== undefined && (
        <FieldFormDrawer
          field={formField}
          onClose={() => setFormField(undefined)}
          onSave={handleSaveField}
        />
      )}

      {/* ── DELETE CONFIRMATION ───────────────────────────────────────────── */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            {fieldHasFutureBookings(events, deleteTarget.id) ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{t("fields.deleteBlocked")}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      „{deleteTarget.name}" {t("fields.deleteBlockedDesc")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
                >
                  OK
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{t("fields.deleteConfirm")}</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      „{deleteTarget.name}" – {t("fields.deleteDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    {t("common.cancel")}
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

