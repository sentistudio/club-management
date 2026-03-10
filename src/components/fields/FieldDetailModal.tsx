/**
 * FieldDetailModal – detail view for a single field.
 * Shows Info tab (field details + opening hours) and Buchungen tab (future bookings).
 */

import { useState } from "react";
import { X, Trash2, RefreshCw, Wrench, MapPin } from "lucide-react";
import type { Field, MaintenanceBlock } from "../../types/fields";
import {
  FIELD_TYPE_ICONS,
  FIELD_TYPE_LABELS,
  WEEKDAY_KEYS,
  WEEKDAY_LABELS,
} from "../../types/fields";
import type { ClubEvent } from "../../types/events";
import { ZoneGrid } from "./ZoneGrid";

interface FieldDetailModalProps {
  field: Field;
  events: ClubEvent[];
  maintenanceBlocks: MaintenanceBlock[];
  onClose: () => void;
  onRemoveBooking: (eventId: string) => void;
  onRemoveMaintenance: (blockId: string) => void;
}

type DetailTab = "info" | "buchungen";

const TODAY = new Date().toISOString().split("T")[0];

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function FieldDetailModal({
  field,
  events,
  maintenanceBlocks,
  onClose,
  onRemoveBooking,
  onRemoveMaintenance,
}: FieldDetailModalProps) {
  const [tab, setTab] = useState<DetailTab>("info");

  // ── Compute future bookings (events) ────────────────────────────────────────
  // Deduplicate recurring series: show each series only at its earliest future occurrence
  const futureEvents: ClubEvent[] = (() => {
    const fieldEvents = events.filter(e => e.fieldId === field.id && e.date >= TODAY);
    const seen = new Set<string>();
    const result: ClubEvent[] = [];
    // Sort by date ascending so earliest comes first
    const sorted = [...fieldEvents].sort((a, b) => a.date.localeCompare(b.date));
    for (const evt of sorted) {
      // For recurring events, deduplicate by parentEventId or own id
      const seriesKey = evt.recurrence?.enabled
        ? (evt.parentEventId ?? evt.id)
        : evt.id;
      if (!seen.has(seriesKey)) {
        seen.add(seriesKey);
        result.push(evt);
      }
    }
    return result;
  })();

  // ── Future maintenance blocks ────────────────────────────────────────────────
  const futureMaintenance = maintenanceBlocks
    .filter(b => b.fieldId === field.id && b.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date));

  // ── Combined sorted list for Buchungen tab ───────────────────────────────────
  type BookingItem =
    | { kind: "event"; evt: ClubEvent }
    | { kind: "maintenance"; block: MaintenanceBlock };

  const allBookings: BookingItem[] = [
    ...futureEvents.map(evt => ({ kind: "event" as const, evt })),
    ...futureMaintenance.map(block => ({ kind: "maintenance" as const, block })),
  ].sort((a, b) => {
    const dateA = a.kind === "event" ? a.evt.date : a.block.date;
    const dateB = b.kind === "event" ? b.evt.date : b.block.date;
    return dateA.localeCompare(dateB);
  });

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[88vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-xl">
              {FIELD_TYPE_ICONS[field.type]}
            </div>
            <div>
              <p className="font-semibold text-neutral-900">{field.name}</p>
              <p className="text-xs text-neutral-500">{FIELD_TYPE_LABELS[field.type]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 px-6 pt-3 border-b border-neutral-100">
          {(["info", "buchungen"] as DetailTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all border-b-2 -mb-px ${
                tab === t
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t === "info" ? "Details" : "Buchungen"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* ── INFO TAB ──────────────────────────────────────────────────── */}
          {tab === "info" && (
            <div className="space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  field.indoorOutdoor === "indoor"
                    ? "bg-violet-50 border-violet-200 text-violet-700"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }`}>
                  {field.indoorOutdoor === "indoor" ? "🏟️ Halle" : "🌿 Outdoor"}
                </span>
                {field.isDivisibleInto6 && (
                  <span className="text-xs px-2 py-1 rounded-full border bg-blue-50 border-blue-200 text-blue-700">
                    6 Zonen
                  </span>
                )}
                <span className={`text-xs px-2 py-1 rounded-full border ${
                  field.isActive
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-neutral-100 border-neutral-200 text-neutral-500"
                }`}>
                  {field.isActive ? "✓ Aktiv" : "Inaktiv"}
                </span>
              </div>

              {/* Description */}
              {field.description && (
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">Beschreibung</p>
                  <p className="text-sm text-neutral-700">{field.description}</p>
                </div>
              )}

              {/* Address */}
              {field.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-neutral-600">{field.address}</p>
                </div>
              )}

              {/* Opening Hours */}
              {field.openingHours && (
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Öffnungszeiten</p>
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {WEEKDAY_KEYS.map((day, idx) => {
                          const d = field.openingHours![day];
                          return (
                            <tr
                              key={day}
                              className={`border-b border-neutral-100 last:border-0 ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
                            >
                              <td className="px-3 py-2 w-20 text-xs font-medium text-neutral-600">
                                {WEEKDAY_LABELS[day].de}
                              </td>
                              <td className="px-3 py-2 text-xs">
                                {d.open ? (
                                  <span className="text-neutral-700">{d.from} – {d.to} Uhr</span>
                                ) : (
                                  <span className="text-neutral-400 italic">Geschlossen</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Zone Grid */}
              {field.isDivisibleInto6 && (
                <div>
                  <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">Zonen-Vorschau</p>
                  <ZoneGrid
                    zones={field.zones}
                    occupiedZones={[]}
                    readOnly
                    compact
                  />
                </div>
              )}
            </div>
          )}

          {/* ── BUCHUNGEN TAB ─────────────────────────────────────────────── */}
          {tab === "buchungen" && (
            <div className="space-y-2">
              {allBookings.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-neutral-400">Keine zukünftigen Buchungen.</p>
                </div>
              ) : (
                allBookings.map(item => {
                  if (item.kind === "event") {
                    const evt = item.evt;
                    const isRecurring = evt.recurrence?.enabled === true;
                    return (
                      <div
                        key={evt.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-neutral-900 truncate">{evt.title}</p>
                            {isRecurring && (
                              <span title="Wiederkehrend">
                                <RefreshCw className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {fmtDate(evt.date)} · {evt.startTime}–{evt.endTime} Uhr
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveBooking(evt.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-neutral-400 hover:text-red-600 flex-shrink-0"
                          title="Feldzuweisung entfernen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  } else {
                    const block = item.block;
                    return (
                      <div
                        key={block.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        <Wrench className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-amber-900 truncate">{block.title}</p>
                          <p className="text-xs text-amber-700 mt-0.5">
                            {fmtDate(block.date)} · {block.startTime}–{block.endTime} Uhr
                          </p>
                          {block.note && (
                            <p className="text-xs text-amber-600 mt-0.5 truncate">{block.note}</p>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveMaintenance(block.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-amber-500 hover:text-red-600 flex-shrink-0"
                          title="Sperre löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
