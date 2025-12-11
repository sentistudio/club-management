// ========= PLAYER PASS / SPIELERPASS =========

export type PassStatus = "active" | "pending" | "expired" | "blocked" | "transferred";
export type PassType = "youth" | "amateur" | "senior";

export interface PlayerPass {
  id: string;
  personId: string;
  clubId: string;
  passNumber: string;
  passType: PassType;
  status: PassStatus;
  issuedAt: string;
  expiresAt?: string;
  association: string; // BFV, etc.
  photoUrl?: string;
  nationality?: string;
  eligibleFrom?: string;
  transferHistory: PassTransfer[];
}

export interface PassTransfer {
  id: string;
  passId: string;
  fromClubId: string;
  toClubId: string;
  requestedAt: string;
  approvedAt?: string;
  status: "pending" | "approved" | "rejected";
}

// ========= EVENTS / VERANSTALTUNGEN =========

export type EventType = "training" | "match" | "meeting" | "social" | "tournament" | "camp" | "other";
export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface ClubEvent {
  id: string;
  clubId: string;
  teamId?: string;
  departmentId?: string;
  title: string;
  description?: string;
  eventType: EventType;
  status: EventStatus;
  location?: string;
  startsAt: string;
  endsAt: string;
  maxParticipants?: number;
  registrationDeadline?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  personId: string;
  status: "registered" | "waitlist" | "cancelled" | "attended";
  registeredAt: string;
  notes?: string;
}

// ========= DOCUMENTS / DOKUMENTE =========

export type DocumentType = 
  | "contract" 
  | "certificate" 
  | "id_document" 
  | "medical" 
  | "insurance" 
  | "consent" 
  | "other";

export type DocumentStatus = "valid" | "expired" | "pending" | "rejected";

export interface Document {
  id: string;
  clubId: string;
  personId?: string;
  teamId?: string;
  name: string;
  documentType: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  validFrom?: string;
  validUntil?: string;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

// ========= COMMUNICATION / KOMMUNIKATION =========

export type MessageType = "email" | "sms" | "push" | "internal";
export type MessageStatus = "draft" | "scheduled" | "sent" | "failed";

export interface Message {
  id: string;
  clubId: string;
  subject: string;
  body: string;
  messageType: MessageType;
  status: MessageStatus;
  recipientType: "all" | "team" | "department" | "committee" | "custom";
  recipientIds: string[];
  scheduledAt?: string;
  sentAt?: string;
  sentBy: string;
  createdAt: string;
  openRate?: number;
  clickRate?: number;
}

export interface MessageTemplate {
  id: string;
  clubId: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  isActive: boolean;
}

// ========= VOLUNTEERING / EHRENAMT =========

export type VolunteerTaskStatus = "open" | "assigned" | "in_progress" | "completed" | "cancelled";

export interface VolunteerTask {
  id: string;
  clubId: string;
  eventId?: string;
  title: string;
  description?: string;
  requiredVolunteers: number;
  assignedVolunteers: string[];
  status: VolunteerTaskStatus;
  startsAt: string;
  endsAt: string;
  hoursAwarded: number;
  location?: string;
}

export interface VolunteerLog {
  id: string;
  personId: string;
  clubId: string;
  taskId?: string;
  description: string;
  hours: number;
  date: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ========= REPORTS / BERICHTE =========

export interface Report {
  id: string;
  clubId: string;
  name: string;
  reportType: "members" | "finance" | "teams" | "events" | "custom";
  parameters: Record<string, unknown>;
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
}

// ========= FEDERATION / VERBAND =========

export interface FederationReport {
  id: string;
  clubId: string;
  reportType: "annual" | "quarterly" | "member_count" | "youth_report";
  periodStart: string;
  periodEnd: string;
  status: "draft" | "submitted" | "accepted" | "rejected";
  submittedAt?: string;
  dueDate: string;
  data: Record<string, unknown>;
}

// ========= FAMILY RELATIONS =========

export interface FamilyRelation {
  id: string;
  personId: string;
  relatedPersonId: string;
  relationType: "parent" | "child" | "spouse" | "sibling" | "guardian";
  isPrimaryContact: boolean;
}

// ========= TRAINING / TRAINING =========

export interface TrainingSession {
  id: string;
  teamId: string;
  clubId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  location: string;
  coachId: string;
  status: "scheduled" | "completed" | "cancelled";
  attendees: TrainingAttendance[];
  notes?: string;
}

export interface TrainingAttendance {
  id: string;
  sessionId: string;
  personId: string;
  status: "present" | "absent" | "excused" | "late";
  notes?: string;
}

// ========= MATCHES / SPIELE =========

export type MatchType = "league" | "cup" | "friendly" | "tournament";
export type MatchStatus = "scheduled" | "in_progress" | "completed" | "postponed" | "cancelled";

export interface Match {
  id: string;
  teamId: string;
  clubId: string;
  matchType: MatchType;
  status: MatchStatus;
  homeTeam: string;
  awayTeam: string;
  isHome: boolean;
  scheduledAt: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
  referee?: string;
  competition?: string;
  matchday?: number;
  lineup?: MatchLineup[];
}

export interface MatchLineup {
  id: string;
  matchId: string;
  personId: string;
  position: string;
  shirtNumber: number;
  isStarter: boolean;
  minutesPlayed?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCard?: boolean;
}

