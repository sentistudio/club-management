// Club Event Types
// ==========================================

export type AudienceMode = "all" | "departments" | "groups" | "manual";
export type EventVisibility = "private" | "public";
export type EventStatus = "draft" | "published" | "completed" | "cancelled";
export type RecurrenceFrequency = "daily" | "weekly" | "biweekly" | "monthly";

export interface RecurrencePattern {
  enabled: boolean;
  frequency: RecurrenceFrequency;
  weekdays?: number[]; // 0=Sun, 1=Mon, etc. (for weekly)
  until?: string; // ISO date
}

export interface StatusHistoryEntry {
  status: EventStatus;
  timestamp: string;
  userId: string;
  userName: string;
  reason?: string;
}

export interface RSVPStats {
  invited: number;
  confirmed: number;
  declined: number;
  pending: number;
  waitlist: number;
}

export interface AudienceConfig {
  mode: AudienceMode; // kept for backward compat with existing events
  isClubWide?: boolean;
  departmentIds?: string[];
  groupIds?: string[];
  memberIds?: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  description?: string;
  date: string;        // start date YYYY-MM-DD
  endDate?: string;    // end date for multi-day events; if absent = same as date
  isAllDay?: boolean;
  startTime: string;   // applies to start date
  endTime: string;     // applies to end date (or same date if single-day)
  location?: string;
  bannerImage?: string;
  
  // Audience
  audience: AudienceConfig;
  resolvedMemberCount?: number;
  
  // Visibility
  visibility: EventVisibility;
  
  // RSVP
  rsvpRequired: boolean;
  rsvpDeadline?: string;
  maxParticipants?: number;
  rsvpStats?: RSVPStats;
  
  // Recurrence
  recurrence?: RecurrencePattern;
  parentEventId?: string;
  
  // Status
  status: EventStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Metadata
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  
  // Field booking (Platzbelegung)
  fieldId?: string;
  bookingScope?: "full_field" | "zones";
  bookedZoneIds?: string[]; // zone ids when bookingScope === "zones"
  bookingStatus?: "confirmed" | "not_confirmed"; // set when fieldId is present; "not_confirmed" if conflict exists at save time

  // Optional
  category?: string;
  tags?: string[];
}

// For form state
export interface ClubEventFormData {
  title: string;
  description: string;
  date: string;     // start date
  endDate: string;  // end date (empty = same as date)
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  location: string;
  bannerImage: string;
  // Audience — multi-source, combinable
  isClubWide: boolean;      // true = invite everyone, overrides all below
  departmentIds: string[];  // additive
  groupIds: string[];       // additive
  memberIds: string[];      // additive individual picks
  visibility: EventVisibility;
  rsvpRequired: boolean;
  rsvpDeadline: string;
  maxParticipants: string;
  recurrenceEnabled: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  recurrenceWeekdays: number[];
  recurrenceUntil: string;
  // Field booking
  fieldId: string;
  bookingScope: "full_field" | "zones";
  bookedZoneIds: string[];
}

export const defaultEventFormData: ClubEventFormData = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  isAllDay: false,
  startTime: "18:00",
  endTime: "20:00",
  location: "",
  bannerImage: "",
  isClubWide: false,
  departmentIds: [],
  groupIds: [],
  memberIds: [],
  visibility: "private",
  rsvpRequired: true,
  rsvpDeadline: "",
  maxParticipants: "",
  recurrenceEnabled: false,
  recurrenceFrequency: "weekly",
  recurrenceWeekdays: [],
  recurrenceUntil: "",
  fieldId: "",
  bookingScope: "full_field",
  bookedZoneIds: [],
};

// Default banner images
export const DEFAULT_BANNERS = [
  { id: "meeting", url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop", label: "Versammlung" },
  { id: "celebration", url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop", label: "Fest" },
  { id: "workshop", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop", label: "Workshop" },
  { id: "sports", url: "https://images.unsplash.com/photo-1461896836934- voices-fb84391f?w=800&h=400&fit=crop", label: "Sport" },
  { id: "outdoor", url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=400&fit=crop", label: "Outdoor" },
  { id: "family", url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=400&fit=crop", label: "Familie" },
  { id: "carnival", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop", label: "Karneval" },
  { id: "christmas", url: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=400&fit=crop", label: "Weihnachten" }
];
