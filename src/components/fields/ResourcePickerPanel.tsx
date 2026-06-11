/**
 * ResourcePickerPanel – rich resource picker for EventFormDrawer.
 *
 * Shows:
 *  - Availability toggle: "All" vs "Available only"
 *  - Venues as section headers with MapPin
 *  - Field cards with type images, conflict badge, zone count
 *  - When a field is selected: scope toggle (full resource | zones) + ZoneGrid
 *  - Conflict warning (amber, non-blocking)
 */

import { useMemo, useState } from "react";
import { MapPin, AlertTriangle, LayoutGrid, CheckCircle2 } from "lucide-react";
import { ZoneGrid } from "./ZoneGrid";
import { getActiveFields, checkConflict, mockVenues } from "../../data/mockFields";
import { mockClubEvents } from "../../data/mockClubEvents";
import { getFieldTypeImage } from "../../data/fieldTypeImages";
import { fieldIsDivisible } from "../../types/fields";
import type { BookingScope } from "../../types/fields";
import { useLanguage } from "../../i18n";

interface ResourcePickerPanelProps {
  eventType?: string;
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

export function ResourcePickerPanel({
  eventType,
  fieldId,
  bookingScope,
  bookedZoneIds,
  date,
  startTime,
  endTime,
  excludeEventId,
  onChange,
}: ResourcePickerPanelProps) {
  const { t, lang } = useLanguage();
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const allFields = getActiveFields();
  const isMatch = eventType === "match";
  const selectedField = allFields.find(f => f.id === fieldId) ?? null;
  const hasDivisibleZones = selectedField ? fieldIsDivisible(selectedField) : false;

  // Per-field availability check
  const fieldAvailability = useMemo(() => {
    if (!date || !startTime || !endTime) return {} as Record<string, boolean>;
    const result: Record<string, boolean> = {};
    for (const f of allFields) {
      const conflicts = checkConflict(
        mockClubEvents,
        f.id,
        "full_field",
        [],
        date,
        startTime,
        endTime,
        excludeEventId
      );
      result[f.id] = conflicts.length === 0;
    }
    return result;
  }, [allFields, date, startTime, endTime, excludeEventId]);

  // Conflict detail for selected field
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

  // Occupied zones for zone grid (filtered by time overlap)
  const occupiedZones = useMemo(() => {
    if (!hasDivisibleZones || !selectedField || !date || !startTime || !endTime) return [];
    const overlappingEvents = mockClubEvents.filter(
      e => e.fieldId === fieldId && e.date === date && e.id !== excludeEventId &&
           e.startTime < endTime && e.endTime > startTime
    );
    const result: { zoneId: string; label: string }[] = [];
    for (const e of overlappingEvents) {
      if (e.bookingScope === "full_field") {
        selectedField.zones.forEach(z => result.push({ zoneId: z.id, label: e.title }));
      } else if (e.bookingScope === "zones" && e.bookedZoneIds) {
        e.bookedZoneIds.forEach(zId => result.push({ zoneId: zId, label: e.title }));
      }
    }
    return result;
  }, [fieldId, date, startTime, endTime, excludeEventId, selectedField, hasDivisibleZones]);

  // Per-field occupied zone count in the requested time window (for partial availability display)
  const fieldZoneOccupancy = useMemo(() => {
    if (!date || !startTime || !endTime) return {} as Record<string, number>;
    const result: Record<string, number> = {};
    for (const f of allFields) {
      if (!f.zoneCount || !f.zones.length) continue;
      const overlap = mockClubEvents.filter(
        e => e.fieldId === f.id && e.date === date && e.id !== excludeEventId &&
             e.startTime < endTime && e.endTime > startTime
      );
      const occupiedSet = new Set<string>();
      for (const e of overlap) {
        if (e.bookingScope === "full_field") {
          f.zones.forEach(z => occupiedSet.add(z.id));
        } else if (e.bookingScope === "zones" && e.bookedZoneIds) {
          e.bookedZoneIds.forEach(zId => occupiedSet.add(zId));
        }
      }
      result[f.id] = occupiedSet.size;
    }
    return result;
  }, [allFields, date, startTime, endTime, excludeEventId]);

  // Group fields by venue, filtering by availability if toggle is on
  const venueGroups = useMemo(() => {
    return mockVenues
      .map(venue => {
        let venueFields = allFields.filter(f => f.venueId === venue.id);
        if (showAvailableOnly) {
          venueFields = venueFields.filter(f => fieldAvailability[f.id]);
        }
        return { venue, fields: venueFields };
      })
      .filter(g => g.fields.length > 0);
  }, [allFields, showAvailableOnly, fieldAvailability]);

  const availableCount = allFields.filter(f => fieldAvailability[f.id]).length;

  return (
    <div className="space-y-3">
      {/* Availability toggle */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">
          {availableCount}/{allFields.length} {lang === "de" ? "verfügbar" : "available"}
        </span>
        <div className="flex gap-0.5 bg-neutral-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setShowAvailableOnly(false)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              !showAvailableOnly ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {lang === "de" ? "Alle" : "All"}
          </button>
          <button
            type="button"
            onClick={() => setShowAvailableOnly(true)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              showAvailableOnly
                ? "bg-white shadow-sm text-teal-700"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {lang === "de" ? "Verfügbar" : "Available"}
          </button>
        </div>
      </div>

      {/* Venue groups */}
      {venueGroups.length === 0 ? (
        <p className="text-xs text-neutral-400 text-center py-4">
          {lang === "de" ? "Keine verfügbaren Ressourcen für diesen Zeitraum" : "No available resources for this time slot"}
        </p>
      ) : (
        <div className="space-y-3">
          {venueGroups.map(({ venue, fields }) => (
            <div key={venue.id}>
              {/* Venue header */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3 h-3 text-neutral-400 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">{venue.name}</span>
              </div>

              {/* Field cards */}
              <div className="grid grid-cols-2 gap-2">
                {fields.map(field => {
                  const isSelected = field.id === fieldId;
                  const isAvailable = fieldAvailability[field.id] ?? true;
                  const totalZones = field.zoneCount ?? 0;
                  const occupiedZoneCount = totalZones > 0 ? (fieldZoneOccupancy[field.id] ?? 0) : 0;
                  const isFullyBooked = !isAvailable || (totalZones > 0 && occupiedZoneCount >= totalZones);
                  const isPartiallyBooked = !isFullyBooked && totalZones > 0 && occupiedZoneCount > 0;
                  return (
                    <button
                      key={field.id}
                      type="button"
                      onClick={() => onChange({
                        fieldId: isSelected ? "" : field.id,
                        bookingScope: "full_field",
                        bookedZoneIds: [],
                      })}
                      className={`flex items-center gap-2.5 p-2.5 rounded-[10px] border-2 text-left transition-all ${
                        isSelected
                          ? "border-teal-500 bg-teal-50"
                          : isFullyBooked
                            ? "border-neutral-200 bg-neutral-50/50 opacity-70 hover:border-neutral-300"
                            : "border-neutral-200 bg-white hover:border-teal-300 hover:bg-teal-50/30"
                      }`}
                    >
                      <img
                        src={getFieldTypeImage(field)}
                        alt={field.type}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isSelected ? "text-teal-800" : "text-neutral-800"}`}>
                          {field.name}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {field.zoneCount && (
                            <span className="flex items-center gap-0.5 text-[10px] text-neutral-400">
                              <LayoutGrid className="w-2.5 h-2.5" />
                              {field.zoneCount} {lang === "de" ? "Zonen" : "zones"}
                            </span>
                          )}
                          {isFullyBooked && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {lang === "de" ? "Belegt" : "Busy"}
                            </span>
                          )}
                          {isPartiallyBooked && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-600">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              {occupiedZoneCount}/{totalZones} {lang === "de" ? "belegt" : "busy"}
                            </span>
                          )}
                          {!isFullyBooked && !isPartiallyBooked && (
                            <span className="flex items-center gap-0.5 text-[10px] text-teal-600">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {lang === "de" ? "Frei" : "Free"}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zone selection (shown when a divisible field is selected and not a match) */}
      {selectedField && hasDivisibleZones && !isMatch && (
        <div className="space-y-2 pt-1 border-t border-neutral-100">
          {/* Scope toggle */}
          <div className="flex gap-1 bg-neutral-100 rounded-lg p-0.5 w-fit">
            <button
              type="button"
              onClick={() => onChange({ bookingScope: "full_field", bookedZoneIds: [] })}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                bookingScope === "full_field"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {t("fields.fullFieldScope")}
            </button>
            <button
              type="button"
              onClick={() => onChange({ bookingScope: "zones" })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                bookingScope === "zones"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
              {t("fields.selectZones")}
            </button>
          </div>

          {/* Zone grid – interactive when scope = zones */}
          {bookingScope === "zones" ? (
            <div>
              <p className="text-[11px] text-neutral-500 mb-1.5">{t("fields.zonesHint")}</p>
              <ZoneGrid
                zones={selectedField.zones}
                selectedZones={bookedZoneIds}
                occupiedZones={occupiedZones}
                onChange={ids => onChange({ bookedZoneIds: ids })}
              />
              {bookedZoneIds.length === 0 && (
                <p className="text-[11px] text-amber-600 mt-1">{t("fields.minOneZone")}</p>
              )}
            </div>
          ) : (
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

      {/* Match: always full resource */}
      {selectedField && isMatch && (
        <p className="text-xs text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200">
          {t("fields.matchFullFieldInfo")}
        </p>
      )}

      {/* Conflict warning */}
      {conflicts.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-800">
              {lang === "de" ? "Konflikt – Buchung wird als nicht bestätigt gespeichert" : "Conflict – booking will be saved as not confirmed"}
            </p>
            <ul className="text-[11px] text-amber-700 mt-0.5 space-y-0.5">
              {conflicts.map(c => (
                <li key={c.id}>
                  „{c.title}" – {c.startTime}–{c.endTime}{lang === "de" ? " Uhr" : ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
