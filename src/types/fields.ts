// ==========================================
// Resource Booking (Platzbelegung) – Types
// ==========================================

export type FieldType =
  | "grass"           // Rasenplatz
  | "artificial"      // Kunstrasenplatz
  | "hard"            // Hartplatz
  | "indoor_pitch"    // Halle
  | "small_pitch"     // Kleinfeld
  | "ricoten"         // Ricotenplatz
  | "hybrid_grass"    // Hybridrasenplatz
  | "beach_soccer"    // Beachsoccer-Platz
  | "sand"            // Sandplatz
  | "concrete"        // Beton
  | "tartan"          // Tartan
  | "pool"            // Schwimmbecken
  | "parquet"         // Parkett
  | "other";

export type IndoorOutdoor = "indoor" | "outdoor";

export type FieldSourceType = "manual" | "imported";

export type BookingScope = "full_field" | "zones";

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface OpeningHoursDay {
  open: boolean;
  from: string; // "HH:mm"
  to: string;   // "HH:mm"
}

export type OpeningHours = Record<WeekdayKey, OpeningHoursDay>;

export interface MaintenanceBlock {
  id: string;
  fieldId: string;
  date: string;      // ISO date "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  title: string;
  note?: string;
  createdAt: string;
}

export const WEEKDAY_KEYS: WeekdayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export const WEEKDAY_LABELS: Record<WeekdayKey, { de: string; short: string }> = {
  mon: { de: "Montag", short: "Mo" },
  tue: { de: "Dienstag", short: "Di" },
  wed: { de: "Mittwoch", short: "Mi" },
  thu: { de: "Donnerstag", short: "Do" },
  fri: { de: "Freitag", short: "Fr" },
  sat: { de: "Samstag", short: "Sa" },
  sun: { de: "Sonntag", short: "So" },
};

export const DEFAULT_OPENING_HOURS: OpeningHours = {
  mon: { open: true,  from: "08:00", to: "22:00" },
  tue: { open: true,  from: "08:00", to: "22:00" },
  wed: { open: true,  from: "08:00", to: "22:00" },
  thu: { open: true,  from: "08:00", to: "22:00" },
  fri: { open: true,  from: "08:00", to: "22:00" },
  sat: { open: true,  from: "09:00", to: "20:00" },
  sun: { open: false, from: "09:00", to: "18:00" },
};

// ==========================================
// Venue – physical location containing resources
// ==========================================
export interface Venue {
  id: string;
  clubId: string;
  name: string;
  address?: string;
  description?: string;
  isActive: boolean;
  sourceType: FieldSourceType;
  externalSource?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// Field Zone – subdivision of a divisible field
// zoneNumber is now a plain number (not a literal union)
// ==========================================
export interface FieldZone {
  id: string;
  fieldId: string;
  zoneNumber: number; // 1…N (N = field.zoneCount)
  name: string;       // default "Zone 1" … "Zone N"
}

// ==========================================
// Field (Resource) – bookable asset within a venue
// ==========================================
export interface Field {
  id: string;
  clubId: string;
  venueId: string;   // parent venue
  name: string;
  type: FieldType;
  customTypeName?: string;
  customTypeEmoji?: string;
  customTypeImage?: string;
  description?: string;
  address?: string;
  indoorOutdoor: IndoorOutdoor;
  isActive: boolean;
  /** Number of zones the field can be split into. null = not divisible. */
  zoneCount: number | null;
  sourceType: FieldSourceType;
  // Present only when zoneCount > 0
  zones: FieldZone[];
  openingHours?: OpeningHours;
  // External integration metadata (Scope 1.1)
  externalSource?: string;
  externalFieldId?: string;
  createdAt: string;
  updatedAt: string;
}

// Convenience computed property
export const fieldIsDivisible = (f: Field): boolean => f.zoneCount !== null && f.zoneCount > 0;

export interface FieldFormData {
  name: string;
  type: FieldType;
  customTypeName: string;
  customTypeEmoji: string;
  customTypeImage: string;
  description: string;
  address: string;
  indoorOutdoor: IndoorOutdoor;
  isActive: boolean;
  venueId: string;
  /** null = not divisible; number = zone count */
  zoneCount: number | null;
  openingHours: OpeningHours;
}

export const DEFAULT_FIELD_FORM: FieldFormData = {
  name: "",
  type: "grass",
  customTypeName: "",
  customTypeEmoji: "",
  customTypeImage: "",
  description: "",
  address: "",
  indoorOutdoor: "outdoor",
  isActive: true,
  venueId: "",
  zoneCount: null,
  openingHours: DEFAULT_OPENING_HOURS,
};

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  grass: "Rasenplatz",
  artificial: "Kunstrasenplatz",
  hard: "Hartplatz",
  indoor_pitch: "Halle",
  small_pitch: "Kleinfeld",
  ricoten: "Ricotenplatz",
  hybrid_grass: "Hybridrasenplatz",
  beach_soccer: "Beachsoccer-Platz",
  sand: "Sandplatz",
  concrete: "Beton",
  tartan: "Tartan",
  pool: "Schwimmbecken",
  parquet: "Parkett",
  other: "Sonstige",
};

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  grass: "🌿",
  artificial: "🟩",
  hard: "🪨",
  indoor_pitch: "🏟️",
  small_pitch: "⬛",
  ricoten: "🔷",
  hybrid_grass: "🌱",
  beach_soccer: "🏖️",
  sand: "🟡",
  concrete: "🏗️",
  tartan: "🏃",
  pool: "💧",
  parquet: "🪵",
  other: "✏️",
};

/** Maps DFB pitch type strings to internal FieldType values */
export const DFB_PITCH_TYPE_MAP: Record<string, FieldType> = {
  GRASS_PITCH: "grass",
  HARD_PITCH: "hard",
  ARTIFICIAL_PITCH: "artificial",
  INDOOR_PITCH: "indoor_pitch",
  SMALL_PITCH: "small_pitch",
  RICOTEN_PITCH: "ricoten",
  HYBRID_GRASS_PITCH: "hybrid_grass",
  BEACH_SOCCER_PITCH: "beach_soccer",
  SAND_PITCH: "sand",
};

/** Returns the display label for a field, respecting custom type names */
export const getFieldTypeLabel = (f: { type: FieldType; customTypeName?: string }): string =>
  f.type === "other" && f.customTypeName ? f.customTypeName : FIELD_TYPE_LABELS[f.type];

/** Returns the display icon for a field, respecting custom type emoji */
export const getFieldTypeIcon = (f: { type: FieldType; customTypeEmoji?: string }): string =>
  f.type === "other" && f.customTypeEmoji ? f.customTypeEmoji : FIELD_TYPE_ICONS[f.type];

/** Preset zone count options for the UI selector */
export const ZONE_COUNT_PRESETS: Array<{ label: string; value: number | null }> = [
  { label: "None", value: null },
  { label: "2 zones", value: 2 },
  { label: "4 zones", value: 4 },
  { label: "6 zones", value: 6 },
  { label: "8 zones", value: 8 },
];
