/**
 * People Management Types
 * 
 * Data model for unified people management including:
 * - Person (members and contacts)
 * - Membership (roles within org/department/team)
 * - GuardianLink (parent-child relationships)
 * - RegistrationIntent (invite/registration workflow)
 * - Invite (delivery mechanism)
 * - RegistrationForm (configurable join flows)
 */

// ==========================================
// PERSON
// ==========================================
export type PersonKind = "member" | "contact";
export type PersonStatus = "active" | "inactive";
export type Gender = "male" | "female" | "other" | "not_specified";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string; // ISO date
  gender?: Gender;
  status: PersonStatus;
  kind: PersonKind;
  avatarUrl?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
  // Computed/denormalized for display
  hasClaimedIdentity?: boolean; // true if user has logged in
}

// ==========================================
// MEMBERSHIP
// ==========================================
export type MembershipRole = "player" | "coach" | "admin" | "guardian_contact" | "volunteer";
export type MembershipStatus = "active" | "pending" | "blocked" | "expired";

export interface Membership {
  id: string;
  personId: string;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  role: MembershipRole;
  status: MembershipStatus;
  joinedAt: string;
  expiresAt?: string;
  notes?: string;
}

// ==========================================
// GUARDIAN LINK
// ==========================================
export type GuardianLinkStatus = "active" | "pending_verification" | "revoked";

export interface GuardianPermissions {
  manageRsvp: boolean;
  viewComms: boolean;
  payFees: boolean;
  editProfile: boolean;
}

export interface GuardianLink {
  id: string;
  guardianPersonId: string;
  childPersonId: string;
  status: GuardianLinkStatus;
  permissions: GuardianPermissions;
  verifiedAt?: string;
  createdAt: string;
}

// ==========================================
// REGISTRATION INTENT
// ==========================================
export type IntentType = "invite" | "public_registration" | "admin_created";
export type IntentTarget = "self" | "child" | "household";
export type IntentStatus = "created" | "sent" | "claimed" | "completed" | "expired" | "cancelled";
export type ApprovalPolicy = "auto" | "admin_review";
export type PaymentPolicy = "none" | "optional" | "required";

export interface IntentPrefill {
  email?: string;
  firstName?: string;
  lastName?: string;
  childPersonId?: string; // For guardian invites
  phone?: string;
}

export interface RegistrationIntent {
  id: string;
  type: IntentType;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  formId?: string; // Reference to RegistrationForm if from public flow
  target: IntentTarget;
  requestedRole: MembershipRole;
  prefill: IntentPrefill;
  approvalPolicy: ApprovalPolicy;
  paymentPolicy: PaymentPolicy;
  status: IntentStatus;
  // Results after completion
  createdPersonId?: string;
  createdMembershipId?: string;
  createdGuardianLinkId?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  expiresAt?: string;
}

// ==========================================
// INVITE
// ==========================================
export type InviteChannel = "email" | "link";
export type InviteStatus = "sent" | "opened" | "accepted" | "expired";

export interface Invite {
  id: string;
  intentId: string;
  channel: InviteChannel;
  sentTo: string; // email or "link"
  sentAt: string;
  status: InviteStatus;
  claimUrl: string;
  openedAt?: string;
  acceptedAt?: string;
}

// ==========================================
// REGISTRATION FORM
// ==========================================
export type QuestionType = "text" | "single_choice" | "multi_choice" | "date" | "upload" | "checkbox";
export type QuestionScope = "player" | "guardian" | "both";

export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  helpText?: string;
  required: boolean;
  scope: QuestionScope;
  options?: string[]; // For single/multi choice
}

export interface RegistrationForm {
  id: string;
  name: string;
  description?: string;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  allowedTargets: IntentTarget[]; // Multiple targets allowed
  allowedRoles: MembershipRole[];
  approvalPolicy: ApprovalPolicy;
  paymentPolicy: PaymentPolicy;
  guardianRequiredUnderAge: boolean;
  minAgeForGuardian: number; // Default 18
  questions: FormQuestion[];
  isPublished: boolean;
  publicUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// HELPER TYPES
// ==========================================
export interface PersonWithDetails extends Person {
  memberships: Membership[];
  guardianLinks: GuardianLink[]; // As guardian
  childLinks: GuardianLink[]; // As child
  pendingInvites: Invite[];
}

export interface ContactWithLinks extends Person {
  linkedChildren: Array<{
    child: Person;
    link: GuardianLink;
  }>;
}

// ==========================================
// FORM DATA TYPES
// ==========================================
export interface CreatePersonData {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: Gender;
  kind: PersonKind;
}

export interface CreateMembershipData {
  personId: string;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  role: MembershipRole;
  status?: MembershipStatus;
}

export interface CreateGuardianLinkData {
  guardianPersonId: string;
  childPersonId: string;
  permissions?: Partial<GuardianPermissions>;
}

export interface CreateInviteData {
  personId: string;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  role: MembershipRole;
  target: IntentTarget;
  childPersonId?: string; // For guardian invites
}

export interface CreateRegistrationFormData {
  name: string;
  description?: string;
  orgId: string;
  departmentId?: string;
  teamId?: string;
  allowedTargets: IntentTarget[];
  allowedRoles: MembershipRole[];
  approvalPolicy: ApprovalPolicy;
  paymentPolicy: PaymentPolicy;
  guardianRequiredUnderAge: boolean;
  questions: FormQuestion[];
}
