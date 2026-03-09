// ==========================================
// Mock Field Data – Sportfreunde Burkhardsfelden
// ==========================================

import type { Field, FieldZone, BookingScope } from "../types/fields";
import type { ClubEvent } from "../types/events";

// ── Helper to build zone objects ─────────────────────────────────────────────
const buildZones = (fieldId: string): FieldZone[] =>
  ([1, 2, 3, 4, 5, 6] as const).map(n => ({
    id: `${fieldId}_z${n}`,
    fieldId,
    zoneNumber: n,
    name: `Zone ${n}`,
  }));

// ==========================================
// FIELDS
// ==========================================

export const mockFields: Field[] = [
  {
    id: "field_hauptplatz",
    clubId: "club1",
    name: "Hauptplatz",
    type: "football",
    description: "Naturrasenplatz mit Flutlicht, Kapazität 500 Zuschauer",
    address: "Sportanlage Burkhardsfelden, Platz 1",
    indoorOutdoor: "outdoor",
    isActive: true,
    isDivisibleInto6: true,
    sourceType: "manual",
    zones: buildZones("field_hauptplatz"),
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "field_nebenplatz",
    clubId: "club1",
    name: "Nebenplatz",
    type: "football",
    description: "Kunstrasenplatz für Trainings und Jugendspiele",
    address: "Sportanlage Burkhardsfelden, Platz 2",
    indoorOutdoor: "outdoor",
    isActive: true,
    isDivisibleInto6: true,
    sourceType: "manual",
    zones: buildZones("field_nebenplatz"),
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "field_sporthalle",
    clubId: "club1",
    name: "Sporthalle",
    type: "general",
    description: "Dreifachturnhalle für Volleyball, Fitness und Vereinsveranstaltungen",
    address: "Sportanlage Burkhardsfelden, Halle",
    indoorOutdoor: "indoor",
    isActive: true,
    isDivisibleInto6: false,
    sourceType: "manual",
    zones: [],
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "field_trainingswiese",
    clubId: "club1",
    name: "Trainingswiese",
    type: "general",
    description: "Naturrasen-Trainingsgelände für Kleinfeld und Aufwärmen",
    address: "Sportanlage Burkhardsfelden, Wiese",
    indoorOutdoor: "outdoor",
    isActive: true,
    isDivisibleInto6: true,
    sourceType: "manual",
    zones: buildZones("field_trainingswiese"),
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
];

// ==========================================
// HELPERS
// ==========================================

export const getFieldById = (id: string): Field | undefined =>
  mockFields.find(f => f.id === id);

export const getActiveFields = (): Field[] =>
  mockFields.filter(f => f.isActive);

/** Returns all events (from the provided list) booked on a given field, optionally filtered by date. */
export const getBookingsForField = (
  events: ClubEvent[],
  fieldId: string,
  date?: string
): ClubEvent[] =>
  events.filter(
    e => e.fieldId === fieldId && (date ? e.date === date : true)
  );

/** Returns the zone objects for a field by id list. */
export const getZonesById = (field: Field, zoneIds: string[]): FieldZone[] =>
  field.zones.filter(z => zoneIds.includes(z.id));

/**
 * Conflict detection.
 * Returns events that overlap with the proposed booking.
 * Overlap logic:
 *   - full_field booking conflicts with ANY booking on the same field at the same time
 *   - zones booking conflicts with full_field bookings OR zone bookings that share at least one zone
 */
export const checkConflict = (
  events: ClubEvent[],
  fieldId: string,
  bookingScope: BookingScope,
  bookedZoneIds: string[],
  date: string,
  startTime: string,
  endTime: string,
  excludeEventId?: string
): ClubEvent[] => {
  const sameDay = events.filter(
    e =>
      e.fieldId === fieldId &&
      e.date === date &&
      e.id !== excludeEventId
  );

  return sameDay.filter(e => {
    // Time overlap check
    if (!timesOverlap(startTime, endTime, e.startTime, e.endTime)) return false;

    if (bookingScope === "full_field") {
      // Full field conflicts with anything on this field at this time
      return true;
    } else {
      // Zone booking conflicts with full_field bookings or overlapping zones
      if (e.bookingScope === "full_field") return true;
      if (e.bookingScope === "zones" && e.bookedZoneIds) {
        return bookedZoneIds.some(z => e.bookedZoneIds!.includes(z));
      }
      return false;
    }
  });
};

/** Returns true if [startA, endA) and [startB, endB) overlap. Times are "HH:mm" strings. */
const timesOverlap = (
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean => {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const sA = toMinutes(startA);
  const eA = toMinutes(endA);
  const sB = toMinutes(startB);
  const eB = toMinutes(endB);
  return sA < eB && eA > sB;
};

/** True if any future events reference this field. */
export const fieldHasFutureBookings = (
  events: ClubEvent[],
  fieldId: string
): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return events.some(e => e.fieldId === fieldId && e.date >= today);
};

/** True if any future events reference this field with zone bookings. */
export const fieldHasFutureZoneBookings = (
  events: ClubEvent[],
  fieldId: string
): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return events.some(
    e =>
      e.fieldId === fieldId &&
      e.bookingScope === "zones" &&
      e.date >= today
  );
};
