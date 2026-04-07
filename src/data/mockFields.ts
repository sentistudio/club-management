// ==========================================
// Mock Field Data – BV Borussia 09 Dortmund e.V.
// ==========================================

import type { Field, FieldZone, BookingScope, MaintenanceBlock, Venue } from "../types/fields";
import type { ClubEvent } from "../types/events";
export { groupDfbPitchesIntoSpielstaetten, importDfbPitches } from "../utils/dfbImport";
export type { DfbPitch, DfbSpielstaette } from "../utils/dfbImport";

const CLUB_ID = "00ES8GN8N400008VVV0AG08LVUPGND5I";

// ── Helper to build zone objects for any count ───────────────────────────────
const buildZones = (fieldId: string, count: number): FieldZone[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${fieldId}_z${i + 1}`,
    fieldId,
    zoneNumber: i + 1,
    name: `Zone ${i + 1}`,
  }));

// ==========================================
// VENUES (Spielstätten) – grouped by address from DFB data
// ==========================================

export const mockVenues: Venue[] = [
  {
    id: "venue_hohenbuschei",
    clubId: CLUB_ID,
    name: "Fußballpark BVB Hohenbuschei",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    description: "Trainingsgelände des BVB mit 9 Plätzen – Rasen- und Kunstrasenplätze",
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    // Edge case: SIGNAL IDUNA PARK and Stadion Rote Erde share the same
    // address (Strobelallee 50) but are two distinct Spielstätten.
    // The name-prefix algorithm correctly splits them (no common prefix).
    id: "venue_signal_iduna_park",
    clubId: CLUB_ID,
    name: "SIGNAL IDUNA PARK",
    address: "Strobelallee 50, 44139 Dortmund",
    description: "Heimstadion des BVB mit ca. 81.365 Plätzen",
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "venue_rote_erde",
    clubId: CLUB_ID,
    name: "Stadion Rote Erde",
    address: "Strobelallee 50, 44139 Dortmund",
    description: "Historisches Stadion neben dem Signal Iduna Park",
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "venue_brauksweg",
    clubId: CLUB_ID,
    name: "Sportplatz Brauksweg",
    address: "Brauksweg, 44309 Dortmund",
    description: "Kunstrasenplatz Brauksweg",
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "venue_rabenloh",
    clubId: CLUB_ID,
    name: "Sportplatz im Rabenloh",
    address: "Im Rabenloh, 44139 Dortmund",
    description: "Kunstrasenplatz im Rabenloh",
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
];

// ==========================================
// FIELDS (Plätze / Pitches) – imported from DFB
// ==========================================

export const mockFields: Field[] = [
  // ── Fußballpark BVB Hohenbuschei ─────────────────────────────────────────
  {
    id: "00RDTVBKM0000000VTVG0001VUGVU8PO",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 1",
    type: "grass",
    description: "Rasenplatz",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00RDTVBKM0000000VTVG0001VUGVU8PO",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "00SKEVKLJG000000VTVG0001VSUSTTPB",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 2 (Profis)",
    type: "grass",
    description: "Rasenplatz (Profis)",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00SKEVKLJG000000VTVG0001VSUSTTPB",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "02FJ0TJQB0000000VS5489B4VU45R60J",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 3 (Profis)",
    type: "grass",
    description: "Rasenplatz (Profis)",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "02FJ0TJQB0000000VS5489B4VU45R60J",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "00SKF050G8000000VTVG0001VSUSTTPB",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 4 Kunstrasen",
    type: "artificial",
    description: "Kunstrasenplatz",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00SKF050G8000000VTVG0001VSUSTTPB",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "02FJ0UGE80000000VS5489B4VU45R60J",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 5",
    type: "grass",
    description: "Rasenplatz",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "02FJ0UGE80000000VS5489B4VU45R60J",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "01RCGI6EVS000000VS54898DVSK0F3HF",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 6 Kleinfeld",
    type: "small_pitch",
    description: "Kleinfeld – Kunstrasen",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "01RCGI6EVS000000VS54898DVSK0F3HF",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "01RCGK2S5S000000VS54898DVSK0F3HF",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 7 Kleinfeld",
    type: "small_pitch",
    description: "Kleinfeld – Kunstrasen",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "01RCGK2S5S000000VS54898DVSK0F3HF",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "01RCGL2ER8000000VS54898DVSK0F3HF",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 8",
    type: "grass",
    description: "Rasenplatz",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "01RCGL2ER8000000VS54898DVSK0F3HF",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "028CTTQN00000000VS5489B3VT62FKQD",
    clubId: CLUB_ID,
    venueId: "venue_hohenbuschei",
    name: "Fußballpark BVB Hohenbuschei Platz 9",
    type: "artificial",
    description: "Kunstrasenplatz",
    address: "Adi-Preißler-Allee 9, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "028CTTQN00000000VS5489B3VT62FKQD",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },

  // ── Strobelallee – two distinct Spielstätten at the same address ──────────
  // (name-prefix algorithm splits them: "SIGNAL…" ≠ "Stadion…")
  {
    id: "00GR814JLG000000VTVG0001VSQ88KDJ",
    clubId: CLUB_ID,
    venueId: "venue_signal_iduna_park",
    name: "SIGNAL IDUNA PARK",
    type: "grass",
    description: "Heimstadion des BVB – Rasenplatz mit ca. 81.365 Plätzen",
    address: "Strobelallee 50, 44139 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00GR814JLG000000VTVG0001VSQ88KDJ",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
  {
    id: "00KVAR728G000000VTVG0001VSL6B7B3",
    clubId: CLUB_ID,
    venueId: "venue_rote_erde",
    name: "Stadion Rote Erde",
    type: "grass",
    description: "Historisches Stadion neben dem Signal Iduna Park",
    address: "Strobelallee 50, 44139 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00KVAR728G000000VTVG0001VSL6B7B3",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },

  // ── Brauksweg ─────────────────────────────────────────────────────────────
  {
    id: "00R46QV83G000000VTVG0001VTS15VMH",
    clubId: CLUB_ID,
    venueId: "venue_brauksweg",
    name: "Sportplatz Brauksweg",
    type: "artificial",
    description: "Kunstrasenplatz",
    address: "Brauksweg, 44309 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "00R46QV83G000000VTVG0001VTS15VMH",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },

  // ── Im Rabenloh ───────────────────────────────────────────────────────────
  {
    id: "0135M5LMB0000000VV0AG812VUMGC9SR",
    clubId: CLUB_ID,
    venueId: "venue_rabenloh",
    name: "Sportplatz im Rabenloh",
    type: "artificial",
    description: "Kunstrasenplatz",
    address: "Im Rabenloh, 44139 Dortmund",
    indoorOutdoor: "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: "0135M5LMB0000000VV0AG812VUMGC9SR",
    zones: [],
    openingHours: undefined,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
  },
];

// ==========================================
// DEMO HELPER – dates relative to today so demo never goes stale
// ==========================================
const daysFromToday = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

// ==========================================
// MAINTENANCE BLOCKS
// ==========================================

export let mockMaintenanceBlocks: MaintenanceBlock[] = [
  {
    id: "maint_1",
    fieldId: "00RDTVBKM0000000VTVG0001VUGVU8PO",
    date: daysFromToday(6),
    startTime: "08:00",
    endTime: "12:00",
    title: "Rasenpflege",
    note: "Mähen und Neumarkierung der Linien",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "maint_2",
    fieldId: "00SKF050G8000000VTVG0001VSUSTTPB",
    date: daysFromToday(8),
    startTime: "09:00",
    endTime: "11:00",
    title: "Kunstrasen-Inspektion",
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ==========================================
// HELPERS
// ==========================================

export const getFieldById = (id: string): Field | undefined =>
  mockFields.find(f => f.id === id);

export const getVenueById = (id: string): Venue | undefined =>
  mockVenues.find(v => v.id === id);

export const getActiveFields = (): Field[] =>
  mockFields.filter(f => f.isActive);

export const getFieldsByVenue = (venueId: string): Field[] =>
  mockFields.filter(f => f.venueId === venueId);

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
    if (!timesOverlap(startTime, endTime, e.startTime, e.endTime)) return false;

    if (bookingScope === "full_field") {
      return true;
    } else {
      if (e.bookingScope === "full_field") return true;
      if (e.bookingScope === "zones" && e.bookedZoneIds) {
        return bookedZoneIds.some(z => e.bookedZoneIds!.includes(z));
      }
      return false;
    }
  });
};

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

// ==========================================
// DFB IMPORT HELPERS
// ==========================================

/**
 * The preferred grouped JSON structure for DFB Spielstätten import.
 *
 * Grouping rules applied:
 *  1. Address grouping  – pitches with the same street + zipCode are candidates.
 *  2. Name-prefix split – within an address bucket, pitches whose names share
 *     fewer than 2 common words are placed in separate Spielstätten.
 *
 * Edge case: SIGNAL IDUNA PARK and Stadion Rote Erde both sit at
 * "Strobelallee 50, 44139 Dortmund" with identical coordinates, but their
 * names share no common prefix → correctly split into two distinct venues.
 */
export const BVB_DFB_SPIELSTAETTEN_JSON = {
  spielstaetten: [
    {
      name: "Fußballpark BVB Hohenbuschei",
      address: { street: "Adi-Preißler-Allee 9", zipCode: "44309", city: "Dortmund", latitude: 51.5386, longitude: 7.5544 },
      pitches: [
        { id: "00RDTVBKM0000000VTVG0001VUGVU8PO", name: "Fußballpark BVB Hohenbuschei Platz 1", type: "GRASS_PITCH" },
        { id: "00SKEVKLJG000000VTVG0001VSUSTTPB", name: "Fußballpark BVB Hohenbuschei Platz 2 (Profis)", type: "GRASS_PITCH" },
        { id: "02FJ0TJQB0000000VS5489B4VU45R60J", name: "Fußballpark BVB Hohenbuschei Platz 3 (Profis)", type: "GRASS_PITCH" },
        { id: "00SKF050G8000000VTVG0001VSUSTTPB", name: "Fußballpark BVB Hohenbuschei Platz 4 Kunstrasen", type: "ARTIFICIAL_PITCH" },
        { id: "02FJ0UGE80000000VS5489B4VU45R60J", name: "Fußballpark BVB Hohenbuschei Platz 5", type: "GRASS_PITCH" },
        { id: "01RCGI6EVS000000VS54898DVSK0F3HF", name: "Fußballpark BVB Hohenbuschei Platz 6 Kleinfeld", type: "SMALL_PITCH" },
        { id: "01RCGK2S5S000000VS54898DVSK0F3HF", name: "Fußballpark BVB Hohenbuschei Platz 7 Kleinfeld", type: "SMALL_PITCH" },
        { id: "01RCGL2ER8000000VS54898DVSK0F3HF", name: "Fußballpark BVB Hohenbuschei Platz 8", type: "GRASS_PITCH" },
        { id: "028CTTQN00000000VS5489B3VT62FKQD", name: "Fußballpark BVB Hohenbuschei Platz 9", type: "ARTIFICIAL_PITCH" },
      ],
    },
    {
      // "SIGNAL…" and "Stadion…" share no common word prefix → split
      name: "SIGNAL IDUNA PARK",
      address: { street: "Strobelallee 50", zipCode: "44139", city: "Dortmund", latitude: 51.4925, longitude: 7.4519 },
      pitches: [
        { id: "00GR814JLG000000VTVG0001VSQ88KDJ", name: "SIGNAL IDUNA PARK", type: "GRASS_PITCH" },
      ],
    },
    {
      name: "Stadion Rote Erde",
      address: { street: "Strobelallee 50", zipCode: "44139", city: "Dortmund", latitude: 51.4925, longitude: 7.4519 },
      pitches: [
        { id: "00KVAR728G000000VTVG0001VSL6B7B3", name: "Stadion Rote Erde", type: "GRASS_PITCH" },
      ],
    },
    {
      name: "Sportplatz Brauksweg",
      address: { street: "Brauksweg", zipCode: "44309", city: "Dortmund", latitude: 51.5327, longitude: 7.5362 },
      pitches: [
        { id: "00R46QV83G000000VTVG0001VTS15VMH", name: "Sportplatz Brauksweg", type: "ARTIFICIAL_PITCH" },
      ],
    },
    {
      name: "Sportplatz im Rabenloh",
      address: { street: "Im Rabenloh", zipCode: "44139", city: "Dortmund", latitude: 51.4943, longitude: 7.4504 },
      pitches: [
        { id: "0135M5LMB0000000VV0AG812VUMGC9SR", name: "Sportplatz im Rabenloh", type: "ARTIFICIAL_PITCH" },
      ],
    },
  ],
};
