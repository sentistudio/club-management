// Event Utilities for Club Event Management
// ==========================================

// ==========================================
// TYPES
// ==========================================

export type AudienceMode = "all" | "departments" | "groups" | "manual";
export type EventVisibility = "private" | "public";
export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export interface RecurrencePattern {
  enabled: boolean;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  weekdays?: number[]; // 0=Sun, 1=Mon, etc. (for weekly)
  until?: string; // ISO date
}

export interface StatusHistoryEntry {
  status: EventStatus;
  timestamp: string;
  userId: string;
  userName: string;
  reason?: string; // For cancellation
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

export interface ClubEventFull {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  
  // Audience
  audience: AudienceConfig;
  resolvedMemberCount?: number;
  
  // Visibility
  visibility: EventVisibility;
  
  // RSVP
  rsvpRequired: boolean;
  rsvpDeadline?: string; // ISO datetime
  maxParticipants?: number;
  rsvpStats?: RSVPStats;
  
  // Recurrence
  recurrence?: RecurrencePattern;
  parentEventId?: string; // For recurring instances
  
  // Status
  status: EventStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Metadata
  createdAt: string;
  createdBy: string;
  createdByName: string;
  updatedAt: string;
  
  // Optional categorization
  category?: string;
  tags?: string[];
}

// ==========================================
// RESOLVE AUDIENCE
// ==========================================

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  departmentIds?: string[];
  groupIds?: string[];
}

interface Department {
  id: string;
  name: string;
  memberIds?: string[];
}

interface Group {
  id: string;
  name: string;
  memberIds: string[];
}

export function resolveAudience(
  audience: AudienceConfig,
  members: Member[],
  departments: Department[],
  groups: Group[]
): string[] {
  const memberIds = new Set<string>();

  switch (audience.mode) {
    case "all":
      // All club members
      members.forEach(m => memberIds.add(m.id));
      break;

    case "departments":
      // Members in selected departments
      if (audience.departmentIds && audience.departmentIds.length > 0) {
        members.forEach(m => {
          if (m.departmentIds?.some(dId => audience.departmentIds!.includes(dId))) {
            memberIds.add(m.id);
          }
        });
        // Also check department memberIds if available
        departments
          .filter(d => audience.departmentIds!.includes(d.id))
          .forEach(d => {
            d.memberIds?.forEach(mId => memberIds.add(mId));
          });
      }
      break;

    case "groups":
      // Members in selected custom groups
      if (audience.groupIds && audience.groupIds.length > 0) {
        groups
          .filter(g => audience.groupIds!.includes(g.id))
          .forEach(g => {
            g.memberIds.forEach(mId => memberIds.add(mId));
          });
      }
      break;

    case "manual":
      // Manually selected members
      if (audience.memberIds) {
        audience.memberIds.forEach(mId => memberIds.add(mId));
      }
      break;
  }

  return Array.from(memberIds);
}

// ==========================================
// RECURRENCE PREVIEW
// ==========================================

export interface OccurrencePreview {
  date: string; // ISO date
  startTime: string;
  endTime: string;
  label: string; // e.g., "Fr, 24. Jan 2026"
}

export function getOccurrencePreview(
  recurrence: RecurrencePattern,
  startDate: string,
  startTime: string,
  endTime: string,
  count: number = 5
): OccurrencePreview[] {
  if (!recurrence.enabled) return [];

  const occurrences: OccurrencePreview[] = [];
  const start = new Date(startDate);
  const untilDate = recurrence.until ? new Date(recurrence.until) : null;

  let currentDate = new Date(start);
  let iterations = 0;
  const maxIterations = 365; // Safety limit

  while (occurrences.length < count && iterations < maxIterations) {
    iterations++;

    // Check if we've passed the until date
    if (untilDate && currentDate > untilDate) break;

    // For weekly with specific weekdays
    if (recurrence.frequency === "weekly" && recurrence.weekdays && recurrence.weekdays.length > 0) {
      if (recurrence.weekdays.includes(currentDate.getDay())) {
        occurrences.push({
          date: currentDate.toISOString().split("T")[0],
          startTime,
          endTime,
          label: formatDateLabel(currentDate)
        });
      }
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    } else {
      // For other patterns, add the occurrence
      occurrences.push({
        date: currentDate.toISOString().split("T")[0],
        startTime,
        endTime,
        label: formatDateLabel(currentDate)
      });

      // Move to next occurrence based on frequency
      switch (recurrence.frequency) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "biweekly":
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }
  }

  return occurrences;
}

function formatDateLabel(date: Date): string {
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  return `${weekdays[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ==========================================
// COMPUTE EVENT STATUS
// ==========================================

export function computeEventStatus(event: ClubEventFull, now: Date = new Date()): EventStatus {
  // Cancelled stays cancelled
  if (event.status === "cancelled") return "cancelled";
  
  // Draft stays draft until explicitly published
  if (event.status === "draft") return "draft";
  
  // Check if published event has ended
  if (event.status === "published") {
    const eventEnd = new Date(`${event.date}T${event.endTime}`);
    if (now > eventEnd) {
      return "completed";
    }
  }
  
  return event.status;
}

// ==========================================
// HELPERS
// ==========================================

export function getAudienceModeLabel(mode: AudienceMode): string {
  switch (mode) {
    case "all": return "Alle Mitglieder";
    case "departments": return "Abteilungen";
    case "groups": return "Gruppen";
    case "manual": return "Manuell";
  }
}

export function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case "draft": return "Entwurf";
    case "published": return "Veröffentlicht";
    case "completed": return "Abgeschlossen";
    case "cancelled": return "Abgesagt";
  }
}

export function getStatusColor(status: EventStatus): { bg: string; text: string } {
  switch (status) {
    case "draft": return { bg: "bg-slate-100", text: "text-slate-600" };
    case "published": return { bg: "bg-emerald-100", text: "text-emerald-700" };
    case "completed": return { bg: "bg-blue-100", text: "text-blue-700" };
    case "cancelled": return { bg: "bg-red-100", text: "text-red-700" };
  }
}

export function getVisibilityLabel(visibility: EventVisibility): string {
  return visibility === "public" ? "Öffentlich" : "Privat";
}

export function getVisibilityIcon(visibility: EventVisibility): string {
  return visibility === "public" ? "🌐" : "🔒";
}

export function formatTime(time: string): string {
  return time; // Already in HH:mm format
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short"
  });
}

export function formatDateTime(dateStr: string, time: string): string {
  const date = new Date(dateStr);
  return `${date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} um ${time} Uhr`;
}

// Generate unique ID
export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create status history entry
export function createStatusHistoryEntry(
  status: EventStatus,
  userId: string,
  userName: string,
  reason?: string
): StatusHistoryEntry {
  return {
    status,
    timestamp: new Date().toISOString(),
    userId,
    userName,
    reason
  };
}
