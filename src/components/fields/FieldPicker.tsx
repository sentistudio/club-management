/**
 * FieldPicker – embedded in EventFormDrawer.
 * Shows:
 *  - Field dropdown (active fields only)
 *  - If field is divisible: scope toggle (full_field | zones) + ZoneGrid
 *  - If event type is "match": full_field locked, no zone selection
 *  - Inline conflict warning
 */

import { useMemo } from "react";
import { AlertCircle, LayoutGrid, X } from "lucide-react";
import { ZoneGrid } from "./ZoneGrid";
import { getActiveFields, checkConflict } from "../../data/mockFields";
import { mockClubEvents } from "../../data/mockClubEvents";
import type { BookingScope } from "../../types/fields";
import { FIELD_TYPE_ICONS } from "../../types/fields";

interface FieldPickerProps {
  eventType?: string;   // "training" | "match" | "event" from the form
  fieldId: string;
  bookingScope: BookingScope;
  bookedZoneIds: string[];
  date: string;
  startTime: string;
  endTime: string;
  excludeEventId?: string;
  onChange: (patch: {
    fieldId?: string;
    bookingScope?: BookingScope;
    bookedZoneIds?: string[];
  }) => void;
}

export function FieldPicker({
  eventType,
  fieldId,
  bookingScope,
  bookedZoneIds,
  date,
  startTime,
  endTime,
  excludeEventId,
  onChange,
}: FieldPickerProps) {
  const fields = getActiveFields();
  const selectedField = fields.find(f => f.id === fieldId) ?? null;
  const isMatch = eventType === "match";

  // Conflict detection
  const conflicts = useMemo(() => {
    if (!fieldId || !date || !startTime || !endTime) return [];
    return checkConflict(
      mockClubEvents,
      fieldId,
      isMatch ? "full_field" : bookingScope,
      bookedZoneIds,
      date,
      startTime,
      endTime,
      excludeEventId
    );
  }, [fieldId, bookingScope, bookedZoneIds, date, startTime, endTime, excludeEventId, isMatch]);

  // Occupied zones (from other events on this field/day)
  const occupiedZones = useMemo(() => {
    if (!selectedField?.isDivisibleInto6 || !date) return [];
    const dayEvents = mockClubEvents.filter(
      e => e.fieldId === fieldId && e.date === date && e.id !== excludeEventId
    );
    const result: { zoneId: string; label: string }[] = [];
    for (const e of dayEvents) {
      if (e.bookingScope === "full_field") {
        selectedField.zones.forEach(z => result.push({ zoneId: z.id, label: e.title }));
      } else if (e.bookingScope === "zones" && e.bookedZoneIds) {
        e.bookedZoneIds.forEach(zId => result.push({ zoneId: zId, label: e.title }));
      }
    }
    return result;
  }, [fieldId, date, excludeEventId, selectedField]);

  return (
    <div className="space-y-3">
      {/* Field dropdown */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          Feld / Anlage
        </label>
        <div className="flex gap-2">
          <select
            value={fieldId}
            onChange={e => {
              onChange({ fieldId: e.target.value, bookingScope: "full_field", bookedZoneIds: [] });
            }}
            className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          >
            <option value="">– Kein Feld –</option>
            {fields.map(f => (
              <option key={f.id} value={f.id}>
                {FIELD_TYPE_ICONS[f.type]} {f.name}
                {f.isDivisibleInto6 ? " (6 Zonen)" : ""}
                {f.indoorOutdoor === "indoor" ? " · Halle" : ""}
              </option>
            ))}
          </select>
          {fieldId && (
            <button
              type="button"
              onClick={() => onChange({ fieldId: "", bookingScope: "full_field", bookedZoneIds: [] })}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              title="Feld entfernen"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scope + Zone selection (only for divisible fields and non-match events) */}
      {selectedField?.isDivisibleInto6 && !isMatch && (
        <div className="space-y-2">
          {/* Scope toggle */}
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-0.5 w-fit">
            <button
              type="button"
              onClick={() => onChange({ bookingScope: "full_field", bookedZoneIds: [] })}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                bookingScope === "full_field"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              Ganzes Feld
            </button>
            <button
              type="button"
              onClick={() => onChange({ bookingScope: "zones" })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                bookingScope === "zones"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Zonen wählen
            </button>
          </div>

          {/* Zone grid */}
          {bookingScope === "zones" && (
            <div>
              <p className="text-xs text-neutral-500 mb-1.5">
                Zonen auswählen (amber = bereits belegt):
              </p>
              <ZoneGrid
                zones={selectedField.zones}
                selectedZones={bookedZoneIds}
                occupiedZones={occupiedZones}
                onChange={ids => onChange({ bookedZoneIds: ids })}
              />
              {bookedZoneIds.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">Mindestens eine Zone auswählen.</p>
              )}
            </div>
          )}

          {/* Full field mode: show zone grid as fully selected */}
          {bookingScope === "full_field" && (
            <ZoneGrid
              zones={selectedField.zones}
              occupiedZones={occupiedZones}
              fullField
              readOnly
              compact
            />
          )}
        </div>
      )}

      {/* Match: always full field, show info */}
      {selectedField && isMatch && (
        <p className="text-xs text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200">
          Spiele buchen immer das <strong>gesamte Feld</strong>.
        </p>
      )}

      {/* Conflict warning */}
      {conflicts.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Buchungskonflikt</p>
            <ul className="text-xs text-red-600 mt-0.5 space-y-0.5">
              {conflicts.map(c => (
                <li key={c.id}>
                  „{c.title}" – {c.startTime}–{c.endTime} Uhr
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
