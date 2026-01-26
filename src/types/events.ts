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
  mode: AudienceMode;
  departmentIds?: string[];
  groupIds?: string[];
  memberIds?: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  
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
  
  // Optional
  category?: string;
  tags?: string[];
}

// For form state
export interface ClubEventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  audienceMode: AudienceMode;
  departmentIds: string[];
  groupIds: string[];
  memberIds: string[];
  visibility: EventVisibility;
  rsvpRequired: boolean;
  rsvpDeadline: string;
  maxParticipants: string;
  recurrenceEnabled: boolean;
  recurrenceFrequency: RecurrenceFrequency;
  recurrenceWeekdays: number[];
  recurrenceUntil: string;
}

export const defaultEventFormData: ClubEventFormData = {
  title: "",
  description: "",
  date: "",
  startTime: "18:00",
  endTime: "20:00",
  location: "",
  audienceMode: "all",
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
  recurrenceUntil: ""
};
