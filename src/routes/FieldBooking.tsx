/**
 * FieldBooking – Platzbelegung admin page.
 * Two tabs:
 *   - Felder: field management (list, create, edit, delete)
 *   - Belegung: day-view occupancy calendar per field
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
} from "lucide-react";
import { ZoneGrid } from "../components/fields/ZoneGrid";
import { FieldFormDrawer } from "../components/fields/FieldFormDrawer";
import { mockFields, getBookingsForField, fieldHasFutureBookings } from "../data/mockFields";
import { mockClubEvents } from "../data/mockClubEvents";
import type { Field } from "../types/fields";
import { FIELD_TYPE_ICONS, FIELD_TYPE_LABELS } from "../types/fields";
import type { ClubEvent } from "../types/events";

// ── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0];

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const fmtDay = (iso: string) =>
  new Date(iso).toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const addDays = (iso: string, n: number) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

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

// ── Component ─────────────────────────────────────────────────────────────────

type Tab = "felder" | "belegung";

export function FieldBooking() {
  const [tab, setTab] = useState<Tab>("felder");
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [formField, setFormField] = useState<Field | null | undefined>(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState<Field | null>(null);
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [expandedFields, setExpandedFields] = useState<string[]>([]);
  const [detailEvent, setDetailEvent] = useState<ClubEvent | null>(null);

  // All events (in a real app these would come from state/context)
  const events = mockClubEvents;

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
    () => fields.map(f => ({ field: f, bookings: getBookingsForField(events, f.id, selectedDate) })),
    [fields, events, selectedDate]
  );

  const hasAnyBooking = dayBookings.some(d => d.bookings.length > 0);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Platzbelegung</h1>
          <p className="text-neutral-500 mt-0.5">
            {fields.filter(f => f.isActive).length} aktive Felder · {fields.length} gesamt
          </p>
        </div>
        {tab === "felder" && (
          <button
            onClick={() => setFormField(null)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Feld hinzufügen
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 w-fit">
        {(["felder", "belegung"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              tab === t ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {t === "felder" ? <Home className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {t === "felder" ? "Felder" : "Belegung"}
          </button>
        ))}
      </div>

      {/* ── FELDER TAB ──────────────────────────────────────────────────── */}
      {tab === "felder" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields.map(field => {
            const hasFuture = fieldHasFutureBookings(events, field.id);
            return (
              <div
                key={field.id}
                className={`bg-white rounded-xl border ${field.isActive ? "border-neutral-200" : "border-neutral-100 opacity-60"} p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow`}
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
                  <div className="flex gap-1">
                    <button
                      onClick={() => setFormField(field)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-400 hover:text-neutral-700"
                      title="Bearbeiten"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(field)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-neutral-400 hover:text-red-600"
                      title="Löschen"
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
                    {field.indoorOutdoor === "indoor" ? "🏟️ Halle" : "🌿 Outdoor"}
                  </span>
                  {field.isDivisibleInto6 && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                      6 Zonen
                    </span>
                  )}
                  {!field.isActive && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-neutral-100 border-neutral-200 text-neutral-500">
                      Inaktiv
                    </span>
                  )}
                  {field.sourceType === "imported" && (
                    <span className="text-xs px-2 py-0.5 rounded-full border bg-amber-50 border-amber-200 text-amber-700">
                      Importiert
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
                      <CheckCircle className="w-3.5 h-3.5" /> Hat zukünftige Buchungen
                    </span>
                  ) : (
                    <span className="text-neutral-400">Keine zukünftigen Buchungen</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── BELEGUNG TAB ────────────────────────────────────────────────── */}
      {tab === "belegung" && (
        <div className="space-y-4">
          {/* Date navigation */}
          <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-xl px-4 py-3">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="flex-1 text-center">
              <p className="font-semibold text-neutral-900">{fmtDay(selectedDate)}</p>
              {selectedDate === TODAY && (
                <p className="text-xs text-teal-600 font-medium">Heute</p>
              )}
            </div>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-neutral-600" />
            </button>
            <button
              onClick={() => setSelectedDate(TODAY)}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium px-2 py-1 hover:bg-teal-50 rounded-lg transition-colors"
            >
              Heute
            </button>
          </div>

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
                <p className="text-sm text-neutral-500">Keine Buchungen an diesem Tag.</p>
              </div>
            )}

            {/* Per-field rows */}
            {dayBookings.map(({ field, bookings }) => {
              const isExpanded = expandedFields.includes(field.id);
              const hasBookings = bookings.length > 0;

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
                          <p className="text-[10px] text-neutral-400">{isExpanded ? "▲ Zonen" : "▼ Zonen"}</p>
                        )}
                      </div>
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
                            className={`absolute top-1 bottom-1 rounded border text-[10px] font-medium truncate px-1 ${color} hover:brightness-95 transition-all`}
                            style={{ left: `${start}%`, width: `${width}%` }}
                            title={`${evt.title} · ${evt.startTime}–${evt.endTime}`}
                          >
                            {evt.title}
                          </button>
                        );
                      })}
                      {!hasBookings && (
                        <div className="absolute inset-0 flex items-center justify-start pl-3">
                          <span className="text-[11px] text-neutral-300">Frei</span>
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
                                    className="absolute top-1 bottom-1 rounded bg-teal-100 border border-teal-300 text-[9px] text-teal-800 font-medium truncate px-1 hover:brightness-95 transition-all"
                                    style={{ left: `${start}%`, width: `${width}%` }}
                                    title={evt.title}
                                  >
                                    {evt.title}
                                  </button>
                                );
                              })}
                              {zoneBookings.length === 0 && (
                                <div className="absolute inset-0 flex items-center pl-3">
                                  <span className="text-[10px] text-neutral-200">Frei</span>
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
              <span className="w-3 h-3 rounded bg-blue-200 border border-blue-300" /> Training
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-200 border border-amber-300" /> Spiel
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-violet-200 border border-violet-300" /> Veranstaltung
            </span>
          </div>
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
                  {detailEvent.startTime} – {detailEvent.endTime} Uhr
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
                      ? "Ganzes Feld"
                      : `Zonen: ${detailEvent.bookedZoneIds?.length ?? 0}`}
                  </div>
                )}
              </div>
              <button
                onClick={() => setDetailEvent(null)}
                className="mt-4 w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
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
                    <p className="font-semibold text-neutral-900">Löschen nicht möglich</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      „{deleteTarget.name}" hat noch zukünftige Buchungen. Bitte diese zuerst entfernen.
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
                    <p className="font-semibold text-neutral-900">Feld löschen?</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      „{deleteTarget.name}" wird dauerhaft gelöscht.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Löschen
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
