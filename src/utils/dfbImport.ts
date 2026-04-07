// ==========================================
// DFB Spielstätten Import Utility
// ==========================================
//
// The DFB feed delivers one record per pitch (Platz), with no explicit
// Spielstätte grouping. We derive Spielstätten in two steps:
//
// Step 1 – Group by address (street + zipCode).
//           Pitches at different addresses are always separate venues.
//
// Step 2 – Sub-group within each address bucket by longest common word
//           prefix (LCP) of the pitch names.
//
//   • LCP ≥ 2 words  → pitches share a venue (e.g. all "Hohenbuschei Platz N")
//   • LCP < 2 words  → each pitch is its own venue
//
//   KNOWN EDGE CASE: Strobelallee 50 hosts both SIGNAL IDUNA PARK and
//   Stadion Rote Erde at the exact same address/coordinates. Their names
//   share no common prefix, so Step 2 correctly splits them into two
//   distinct Spielstätten.

import type { Field, Venue, FieldType } from "../types/fields";
import { DFB_PITCH_TYPE_MAP, DEFAULT_OPENING_HOURS } from "../types/fields";

// ── Raw DFB types ────────────────────────────────────────────────────────────

export interface DfbAddress {
  id?: string;
  street: string;
  zipCode: string;
  city: string;
  latitude?: number;
  longitude?: number;
}

export interface DfbPitch {
  id: string;
  name: string;
  type: string; // DFB enum e.g. "GRASS_PITCH"
  address: DfbAddress;
}

// ── Grouped output ───────────────────────────────────────────────────────────

export interface DfbSpielstaette {
  /** Derived venue name (common prefix or pitch name when standalone) */
  name: string;
  address: DfbAddress;
  pitches: DfbPitch[];
}

// ── Core grouping algorithm ──────────────────────────────────────────────────

/**
 * Returns the longest common word-level prefix shared by all strings.
 * "Fußballpark BVB Hohenbuschei Platz 1" ∩ "Fußballpark BVB Hohenbuschei Platz 2"
 *   → "Fußballpark BVB Hohenbuschei"
 *
 * "SIGNAL IDUNA PARK" ∩ "Stadion Rote Erde"
 *   → "" (first words differ)
 */
function longestCommonWordPrefix(names: string[]): string {
  if (names.length === 0) return "";
  const wordArrays = names.map(n => n.trim().split(/\s+/));
  const first = wordArrays[0];
  let prefixLength = first.length;
  for (let i = 1; i < wordArrays.length; i++) {
    const words = wordArrays[i];
    let match = 0;
    while (match < prefixLength && match < words.length && first[match] === words[match]) {
      match++;
    }
    prefixLength = match;
  }
  return first.slice(0, prefixLength).join(" ");
}

/**
 * Within one address bucket, sub-group pitches by name prefix.
 * Returns an array of pitch arrays – each array becomes one Spielstätte.
 */
function subGroupByNamePrefix(pitches: DfbPitch[]): DfbPitch[][] {
  if (pitches.length === 1) return [pitches];

  const commonPrefix = longestCommonWordPrefix(pitches.map(p => p.name));
  const wordCount = commonPrefix ? commonPrefix.split(/\s+/).length : 0;

  if (wordCount >= 2) {
    // All pitches share a meaningful common prefix → one Spielstätte
    return [pitches];
  }

  // No shared prefix → each pitch is its own Spielstätte
  return pitches.map(p => [p]);
}

/**
 * Derives a human-readable Spielstätte name from a group of pitches.
 * - Single pitch or no common prefix → use the pitch name as-is
 * - Multiple pitches with common prefix → use the prefix
 */
function deriveVenueName(pitches: DfbPitch[]): string {
  if (pitches.length === 1) return pitches[0].name;
  const prefix = longestCommonWordPrefix(pitches.map(p => p.name));
  return prefix || pitches[0].name;
}

/**
 * Main entry point: takes a flat DFB pitch array and returns grouped
 * Spielstätten, applying address grouping + name-prefix sub-grouping.
 */
export function groupDfbPitchesIntoSpielstaetten(pitches: DfbPitch[]): DfbSpielstaette[] {
  // Step 1: Group by street + zipCode (coordinates can differ slightly for the
  // same address across records, so we ignore them for grouping)
  const addressBuckets = new Map<string, DfbPitch[]>();
  for (const pitch of pitches) {
    const key = `${pitch.address.street.toLowerCase().trim()}|${pitch.address.zipCode.trim()}`;
    if (!addressBuckets.has(key)) addressBuckets.set(key, []);
    addressBuckets.get(key)!.push(pitch);
  }

  const spielstaetten: DfbSpielstaette[] = [];

  for (const bucketPitches of addressBuckets.values()) {
    // Step 2: Sub-group by name prefix within the address bucket
    const subGroups = subGroupByNamePrefix(bucketPitches);
    for (const group of subGroups) {
      spielstaetten.push({
        name: deriveVenueName(group),
        address: group[0].address,
        pitches: group,
      });
    }
  }

  return spielstaetten;
}

// ── Conversion to internal types ─────────────────────────────────────────────

function mapDfbType(dfbType: string): FieldType {
  return DFB_PITCH_TYPE_MAP[dfbType] ?? "other";
}

/**
 * Converts a DfbSpielstaette into an internal Venue + Field[] pair.
 */
export function dfbSpielstaetteToInternal(
  spielstaette: DfbSpielstaette,
  clubId: string,
  venueId: string
): { venue: Venue; fields: Field[] } {
  const now = new Date().toISOString();
  const addr = spielstaette.address;

  const venue: Venue = {
    id: venueId,
    clubId,
    name: spielstaette.name,
    address: `${addr.street}, ${addr.zipCode} ${addr.city}`,
    isActive: true,
    sourceType: "imported",
    externalSource: "dfb",
    createdAt: now,
    updatedAt: now,
  };

  const fields: Field[] = spielstaette.pitches.map(pitch => ({
    id: pitch.id,
    clubId,
    venueId,
    name: pitch.name,
    type: mapDfbType(pitch.type),
    address: `${addr.street}, ${addr.zipCode} ${addr.city}`,
    indoorOutdoor: mapDfbType(pitch.type) === "indoor_pitch" ? "indoor" : "outdoor",
    isActive: true,
    zoneCount: null,
    sourceType: "imported",
    externalSource: "dfb",
    externalFieldId: pitch.id,
    zones: [],
    openingHours: DEFAULT_OPENING_HOURS,
    createdAt: now,
    updatedAt: now,
  }));

  return { venue, fields };
}

/**
 * Full pipeline: raw DFB pitch array → internal Venue[] + Field[].
 */
export function importDfbPitches(
  pitches: DfbPitch[],
  clubId: string
): { venues: Venue[]; fields: Field[] } {
  const spielstaetten = groupDfbPitchesIntoSpielstaetten(pitches);
  const venues: Venue[] = [];
  const fields: Field[] = [];

  spielstaetten.forEach((spst, i) => {
    const venueId = `venue_dfb_${i}_${Date.now()}`;
    const { venue, fields: spstFields } = dfbSpielstaetteToInternal(spst, clubId, venueId);
    venues.push(venue);
    fields.push(...spstFields);
  });

  return { venues, fields };
}
