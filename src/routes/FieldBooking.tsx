/**
 * FieldBooking – Platzbelegung admin page.
 * Two tabs:
 *   - Belegung: day-view occupancy calendar per field (default)
 *   - Felder: field management (list, create, edit, delete)
 */

import { useState, useMemo } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  AlertCircle,
  LayoutGrid,
  CheckCircle,
  Home,
  XCircle,
  Wrench,
  CalendarDays,
} from "lucide-react";
import { ZoneGrid } from "../components/fields/ZoneGrid";
import { FieldFormDrawer } from "../components/fields/FieldFormDrawer";
import { FieldDetailModal } from "../components/fields/FieldDetailModal";
import { MaintenanceBlockForm } from "../components/fields/MaintenanceBlockForm";
import { CalendarPicker } from "../components/fields/CalendarPicker";
import {
  mockFields,
  getBookingsForField,
  fieldHasFutureBookings,
  mockMaintenanceBlocks,
} from "../data/mockFields";
import { mockClubEvents } from "../data/mockClubEvents";
import type { Field, MaintenanceBlock, WeekdayKey } from "../types/fields";
import { FIELD_TYPE_ICONS, FIELD_TYPE_LABELS } from "../types/fields";
import type { ClubEvent } from "../types/events";
import { useLanguage } from "../i18n";

// ── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

const fmtDay = (iso: string, lang: "de" | "en") =>
  new Date(iso).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });


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
  const { t, lang, getWeekday } = useLanguage();
  const [showCalPicker, setShowCalPicker] = useState(false);
  const [tab, setTab] = useState<Tab>("belegung");
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [formField, setFormField] = useState<Field | null | undefined>(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [calendarWeek, setCalendarWeek] = useState(new Date());
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [detailEvent, setDetailEvent] = useState<ClubEvent | null>(null);
  const [detailField, setDetailField] = useState<Field | null>(null);
  const [eventOverrides, setEventOverrides] = useState<Record<string, Partial<ClubEvent>>>({});
  const events = useMemo(
    () => mockClubEvents.map(e => eventOverrides[e.id] ? { ...e, ...eventOverrides[e.id] } : e),
    [eventOverrides]
  );
  const [maintenanceBlocks, setMaintenanceBlocks] = useState<MaintenanceBlock[]>(mockMaintenanceBlocks);
  const [maintenanceTarget, setMaintenanceTarget] = useState<{ field: Field } | null>(null);
  const [showUnassigned, setShowUnassigned] = useState(false);
  const [assignFieldMap, setAssignFieldMap] = useState<Record<string, string>>({}); // eventId -> fieldId selection

  const toggleExpand = (fieldId: string) =>
    setExpandedFields(prev =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );

  // ── Felder tab handlers ───────────────────────────────────────────────────

  const handleSaveField = (data: Omit<Field, "id" | "createdAt" | "updatedAt" | "clubId">) => {
    if (formField) {
      // Edit
      setFields(prev =>
        prev.map(f =>
          f.id === formField.id
            ? { ...f, ...data, zones: data.isDivisibleInto6 ? (f.isDivisibleInto6 ? f.zones : buildZones(f.id)) : [], updatedAt: new Date().toISOString() }
            : f
        )
      );
    } else {
      // Create
      const id = `field_${Date.now()}`;
      const zones = data.isDivisibleInto6
        ? ([1, 2, 3, 4, 5, 6] as const).map(n => ({
            id: `${id}_z${n}`,
            fieldId: id,
            zoneNumber: n as 1 | 2 | 3 | 4 | 5 | 6,
            name: `Zone ${n}`,
          }))
        : [];
      setFields(prev => [
        ...prev,
        { ...data, id, clubId: "club1", zones, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
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

  const hasAnyBooking = dayBookings.some(d => d.bookings.length > 0 || d.maintenance.length > 0);

  // Selected date weekday key
  const selectedWeekdayKey: WeekdayKey = JS_DAY_TO_KEY[new Date(selectedDate + "T12:00:00").getDay()];

  // All upcoming unassigned events (no field assigned), sorted by date
  const today = new Date().toISOString().split("T")[0];
  const unassignedEvents = useMemo(
    () =>
      events
        .filter(e => !e.fieldId && e.date >= today && e.status !== "cancelled" && e.status !== "completed")
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),
    [events, today]
  );

  const activeFields = fields.filter(f => f.isActive);

  const handleAssignField = (eventId: string) => {
    const fieldId = assignFieldMap[eventId];
    if (!fieldId) return;
    setEventOverrides(prev => ({
      ...prev,
      [eventId]: { ...prev[eventId], fieldId, bookingScope: "full_field" as const, bookedZoneIds: undefined }
    }));
    setAssignFieldMap(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
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
        <button
          onClick={() => setFormField(null)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("fields.addField")}
        </button>
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
          <div className="bg-white border border-neutral-200 rounded-xl p-3">
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
                  onClick={() => { setCalendarWeek(new Date()); setSelectedDate(TODAY); }}
                  className="ml-2 text-xs px-2 py-1 text-[#004941] hover:bg-[#C8F2E0] rounded"
                >
                  {t("fields.today")}
                </button>
              </div>
              <div className="flex items-center gap-2">
                {/* Unassigned toggle */}
                <button
                  onClick={() => setShowUnassigned(v => !v)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                    showUnassigned
                      ? "bg-violet-100 border-violet-300 text-violet-700"
                      : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  {t("fields.unassignedEvents")}
                  {unassignedEvents.length > 0 && (
                    <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${
                      showUnassigned ? "bg-violet-600 text-white" : "bg-neutral-200 text-neutral-600"
                    }`}>
                      {unassignedEvents.length}
                    </span>
                  )}
                </button>
                {selectedDate !== TODAY ? (
                  <button
                    onClick={() => setSelectedDate(TODAY)}
                    className="text-xs px-2 py-1 bg-[#004941] text-white rounded flex items-center gap-1"
                  >
                    {new Date(selectedDate).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                    <XCircle className="w-3 h-3" />
                  </button>
                ) : (
                  <span className="text-xs text-neutral-500">{fmtDay(selectedDate, lang)}</span>
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
                  const isSelected = selectedDate === dateStr;
                  const hasBookings = events.some(e => e.fieldId && e.date === dateStr);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(dateStr)}
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

          {/* Unassigned events panel */}
          {showUnassigned && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-violet-800 mb-3">{t("fields.unassignedEventsTitle")}</p>
              {unassignedEvents.length === 0 ? (
                <p className="text-sm text-violet-500 italic">{t("fields.noUnassignedEvents")}</p>
              ) : (
                <div className="space-y-2">
                  {unassignedEvents.map(evt => (
                    <div key={evt.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-violet-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{evt.title}</p>
                        <p className="text-xs text-neutral-500">
                          {new Date(evt.date + "T12:00:00").toLocaleDateString(lang === "de" ? "de-DE" : "en-US", { weekday: "short", day: "numeric", month: "short" })}
                          {" · "}{evt.startTime}–{evt.endTime}{lang === "de" ? " Uhr" : ""}
                        </p>
                      </div>
                      <select
                        value={assignFieldMap[evt.id] ?? ""}
                        onChange={e => setAssignFieldMap(prev => ({ ...prev, [evt.id]: e.target.value }))}
                        className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      >
                        <option value="">{t("fields.selectFieldPlaceholder")}</option>
                        {activeFields.map(f => (
                          <option key={f.id} value={f.id}>{f.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignField(evt.id)}
                        disabled={!assignFieldMap[evt.id]}
                        className="text-xs px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        {t("fields.assignField")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timeline header */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
            {/* Hour ruler */}
            <div className="flex border-b border-neutral-200 pl-[160px]">
              {[6, 8, 10, 12, 14, 16, 18, 20, 22].map(h => (
                <div key={h} className="flex-1 text-[10px] text-neutral-400 text-center py-1.5 border-l border-neutral-100 first:border-l-0">
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {!hasAnyBooking && (
              <div className="py-12 text-center">
                <LayoutGrid className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">{t("fields.noBookings")}</p>
              </div>
            )}

            {/* Per-field rows */}
            {dayBookings.map(({ field, bookings, maintenance }) => {
              const isExpanded = expandedFields.includes(field.id);
              const hasBookings = bookings.length > 0 || maintenance.length > 0;

              // Opening hours for this field on this day
              const dayHours = field.isActive ? field.openingHours?.[selectedWeekdayKey] : undefined;
              const isClosed = dayHours ? !dayHours.open : false;
              const openFrom = dayHours?.open ? dayHours.from : null;
              const openTo = dayHours?.open ? dayHours.to : null;

              return (
                <div key={field.id} className="border-b border-neutral-100 last:border-0">
                  {/* Field header row */}
                  <div className="flex items-center">
                    <div
                      className={`w-[160px] flex-shrink-0 px-4 py-3 flex items-center gap-2 ${field.isDivisibleInto6 ? "cursor-pointer hover:bg-neutral-50" : ""}`}
                      onClick={() => field.isDivisibleInto6 && toggleExpand(field.id)}
                    >
                      <span className="text-lg">{FIELD_TYPE_ICONS[field.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{field.name}</p>
                        {field.isDivisibleInto6 && (
                          <p className="text-[10px] text-neutral-400">{isExpanded ? `▲ ${t("fields.expandZones")}` : `▼ ${t("fields.expandZones")}`}</p>
                        )}
                      </div>
                      {/* Maintenance button */}
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
                      {/* Hour grid */}
                      {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((p, i) => (
                        <div
                          key={i}
                          className="absolute top-0 bottom-0 border-l border-neutral-100"
                          style={{ left: `${p}%` }}
                        />
                      ))}

                      {/* Opening hours overlays */}
                      {field.isActive && dayHours && (
                        <>
                          {isClosed ? (
                            /* Full day closed overlay */
                            <div
                              className="absolute top-0 bottom-0 bg-neutral-100/70 flex items-center justify-center z-0"
                              style={{ left: "0%", width: "100%" }}
                            >
                              <span className="text-[10px] text-neutral-400 font-medium">{t("fields.closed")}</span>
                            </div>
                          ) : openFrom && openTo ? (
                            <>
                              {/* Before open: grey overlay */}
                              {timeToPercent(openFrom) > 0 && (
                                <div
                                  className="absolute top-0 bottom-0 bg-neutral-200/50 z-0"
                                  style={{ left: "0%", width: `${timeToPercent(openFrom)}%` }}
                                />
                              )}
                              {/* Open band: teal */}
                              <div
                                className="absolute top-0 bottom-0 bg-teal-50/60 border-l border-r border-teal-200/60 z-0"
                                style={{
                                  left: `${timeToPercent(openFrom)}%`,
                                  width: `${timeToPercent(openTo) - timeToPercent(openFrom)}%`,
                                }}
                              />
                              {/* After close: grey overlay */}
                              {timeToPercent(openTo) < 100 && (
                                <div
                                  className="absolute top-0 bottom-0 bg-neutral-200/50 z-0"
                                  style={{ left: `${timeToPercent(openTo)}%`, width: `${100 - timeToPercent(openTo)}%` }}
                                />
                              )}
                            </>
                          ) : null}
                        </>
                      )}

                      {/* Booking blocks */}
                      {bookings.map(evt => {
                        const start = timeToPercent(evt.startTime);
                        const end = timeToPercent(evt.endTime);
                        const width = Math.max(end - start, 2);
                        const color = EVENT_COLORS[evt.category === "Training" ? "training" : evt.category === "Spiel" ? "match" : "event"] ?? EVENT_COLORS.event;
                        return (
                          <button
                            key={evt.id}
                            onClick={() => setDetailEvent(evt)}
                            className={`absolute top-1 bottom-1 rounded border text-[10px] font-medium truncate px-1 z-10 ${color} hover:brightness-95 transition-all`}
                            style={{ left: `${start}%`, width: `${width}%` }}
                            title={`${evt.title} · ${evt.startTime}–${evt.endTime}`}
                          >
                            {evt.title}
                          </button>
                        );
                      })}

                      {/* Maintenance blocks */}
                      {maintenance.map(block => {
                        const start = timeToPercent(block.startTime);
                        const end = timeToPercent(block.endTime);
                        const width = Math.max(end - start, 2);
                        return (
                          <div
                            key={block.id}
                            className="absolute top-1 bottom-1 rounded border bg-amber-100 border-amber-400 text-amber-900 text-[10px] font-medium truncate px-1 z-10 flex items-center gap-0.5"
                            style={{ left: `${start}%`, width: `${width}%` }}
                            title={`🔧 ${block.title} · ${block.startTime}–${block.endTime}`}
                          >
                            🔧 {block.title}
                          </div>
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
                  {field.isDivisibleInto6 && isExpanded && (
                    <div className="border-t border-neutral-100">
                      {field.zones.map(zone => {
                        const zoneBookings = bookings.filter(e =>
                          e.bookingScope === "full_field" ||
                          (e.bookingScope === "zones" && e.bookedZoneIds?.includes(zone.id))
                        );
                        return (
                          <div key={zone.id} className="flex items-center bg-neutral-50">
                            <div className="w-[160px] flex-shrink-0 px-4 py-2 pl-10">
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

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> {t("fields.training")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" /> {t("fields.match")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-violet-200 border border-violet-300" /> {t("fields.event")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400" /> {t("fields.maintenance")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-teal-50 border border-teal-200" /> {t("fields.openingHours")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-neutral-200" /> {t("fields.closed")}
            </span>
          </div>
        </div>
      )}

      {/* ── FELDER TAB ──────────────────────────────────────────────────── */}
      {tab === "felder" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields.map(field => {
            const hasFuture = fieldHasFutureBookings(events, field.id);
            return (
              <div
                key={field.id}
                className={`bg-white rounded-xl border ${field.isActive ? "border-neutral-200" : "border-neutral-100 opacity-60"} p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow cursor-pointer`}
                onClick={() => setDetailField(field)}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                      {FIELD_TYPE_ICONS[field.type]}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{field.name}</p>
                      <p className="text-sm text-neutral-500">{FIELD_TYPE_LABELS[field.type]}</p>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setFormField(field)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-700"
                      title={t("common.edit")}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(field)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-neutral-400 hover:text-red-600"
                      title={t("common.delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                    field.indoorOutdoor === "indoor"
                      ? "bg-violet-50 border-violet-200 text-violet-700"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    {field.indoorOutdoor === "indoor" ? `🏟️ ${t("fields.indoor")}` : `🌿 ${t("fields.outdoor")}`}
                  </span>
                  {field.isDivisibleInto6 && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                      6 {t("fields.zonesCount")}
                    </span>
                  )}
                  {!field.isActive && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-neutral-100 border-neutral-200 text-neutral-500">
                      {t("fields.inactive")}
                    </span>
                  )}
                  {field.sourceType === "imported" && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 border-amber-200 text-amber-700">
                      {t("fields.imported")}
                    </span>
                  )}
                </div>

                {/* Zone grid preview */}
                {field.isDivisibleInto6 && (
                  <ZoneGrid
                    zones={field.zones}
                    occupiedZones={getBookingsForField(events, field.id, TODAY)
                      .flatMap(e =>
                        e.bookingScope === "full_field"
                          ? field.zones.map(z => ({ zoneId: z.id, label: e.title }))
                          : (e.bookedZoneIds ?? []).map(zId => ({ zoneId: zId, label: e.title }))
                      )}
                    readOnly
                    compact
                  />
                )}

                {/* Description */}
                {field.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2">{field.description}</p>
                )}

                {/* Address */}
                {field.address && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {field.address}
                  </div>
                )}

                {/* Future bookings indicator */}
                <div className="flex items-center gap-1.5 text-xs">
                  {hasFuture ? (
                    <span className="text-teal-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> {t("fields.futureBookings")}
                    </span>
                  ) : (
                    <span className="text-neutral-400">{t("fields.noFutureBookings")}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── EVENT DETAIL POPUP (from Belegung) ──────────────────────────── */}
      {detailEvent && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4"
          onClick={() => setDetailEvent(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {detailEvent.bannerImage && (
              <img src={detailEvent.bannerImage} alt="" className="w-full h-32 object-cover" />
            )}
            <div className="p-5">
              <p className="font-semibold text-neutral-900 text-lg">{detailEvent.title}</p>
              <div className="space-y-2 mt-3 text-sm text-neutral-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  {detailEvent.startTime} – {detailEvent.endTime}{lang === "de" ? " Uhr" : ""}
                </div>
                {detailEvent.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    {detailEvent.location}
                  </div>
                )}
                {detailEvent.bookingScope && (
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-neutral-400" />
                    {detailEvent.bookingScope === "full_field"
                      ? t("fields.fullField")
                      : `${t("fields.zonesCount")}: ${detailEvent.bookedZoneIds?.length ?? 0}`}
                  </div>
                )}
              </div>
              <button
                onClick={() => setDetailEvent(null)}
                className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        </div>
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

// Helper used inside handleSaveField for zone rebuild
function buildZones(fieldId: string) {
  return ([1, 2, 3, 4, 5, 6] as const).map(n => ({
    id: `${fieldId}_z${n}`,
    fieldId,
    zoneNumber: n as 1 | 2 | 3 | 4 | 5 | 6,
    name: `Zone ${n}`,
  }));
}
