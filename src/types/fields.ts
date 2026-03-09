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
}

export const DEFAULT_FIELD_FORM: FieldFormData = {
  name: "",
  type: "football",
  description: "",
  address: "",
  indoorOutdoor: "outdoor",
  isActive: true,
  isDivisibleInto6: false,
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
