// ==========================================
// Field Booking (Platzbelegung) – Types
// ==========================================

export type FieldType =
  | "football"
  | "volleyball"
  | "fitness"
  | "tennis"
  | "swimming"
  | "general";

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

export interface FieldZone {
  id: string;
  fieldId: string;
  zoneNumber: 1 | 2 | 3 | 4 | 5 | 6;
  name: string; // default "Zone 1" … "Zone 6"
}

export interface Field {
  id: string;
  clubId: string;
  name: string;
  type: FieldType;
  description?: string;
  address?: string;
  indoorOutdoor: IndoorOutdoor;
  isActive: boolean;
  isDivisibleInto6: boolean;
  sourceType: FieldSourceType;
  // Only present when isDivisibleInto6 === true
  zones: FieldZone[];
  openingHours?: OpeningHours;
  // External integration metadata (Scope 1.1)
  externalSource?: string;      // e.g. "fussball.de"
  externalFieldId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FieldFormData {
  name: string;
  type: FieldType;
  description: string;
  address: string;
  indoorOutdoor: IndoorOutdoor;
  isActive: boolean;
  isDivisibleInto6: boolean;
  openingHours: OpeningHours;
}

export const DEFAULT_FIELD_FORM: FieldFormData = {
  name: "",
  type: "football",
  description: "",
  address: "",
  indoorOutdoor: "outdoor",
  isActive: true,
  isDivisibleInto6: false,
  openingHours: DEFAULT_OPENING_HOURS,
};

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  football: "Fußball",
  volleyball: "Volleyball",
  fitness: "Fitness",
  tennis: "Tennis",
  swimming: "Schwimmen",
  general: "Allgemein",
};

export const FIELD_TYPE_ICONS: Record<FieldType, string> = {
  football: "⚽",
  volleyball: "🏐",
  fitness: "💪",
  tennis: "🎾",
  swimming: "🏊",
  general: "🏟️",
};
