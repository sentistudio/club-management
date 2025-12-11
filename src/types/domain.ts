// ========= CORE STRUCTURE =========

export interface Organization {
  id: string;
  name: string;
  type: "club-group" | "federation" | "academy";
}

export interface Club {
  id: string;
  organizationId: string;
  name: string;
  shortName: string;
  association: string;
  city: string;
  country: string;
}

export type DepartmentKind = "sport" | "admin";

export interface Department {
  id: string;
  clubId: string;
  name: string;
  kind: DepartmentKind;
  isActive: boolean;
}

export type AgeGroup = "U7" | "U9" | "U11" | "U13" | "U15" | "U17" | "U19" | "U21" | "Senior";
export type Gender = "m" | "w" | "mixed";

export interface Team {
  id: string;
  clubId: string;
  departmentId?: string;
  name: string;
  ageGroup?: AgeGroup;
  gender?: Gender;
  isActive: boolean;
}

// ========= IDENTITY & ACCESS =========

export interface Person {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
}

export type AuthProvider = "local" | "google" | "sso";

export interface UserAccount {
  id: string;
  personId: string;
  authProvider: AuthProvider;
  authSub?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type ScopeType = "organization" | "club" | "team";
export type RoleKey = 
  | "org_admin" 
  | "club_admin" 
  | "coach" 
  | "assistant" 
  | "manager" 
  | "parent" 
  | "player"
  | "treasurer"
  | "secretary"
  | "board_member";

export interface AccessGrant {
  id: string;
  userAccountId: string;
  scopeType: ScopeType;
  scopeId: string;
  roleKey: RoleKey;
}

// ========= MEMBERSHIP =========

export type MembershipType = "active" | "passive" | "honorary" | "staff";
export type MembershipStatus = "pending" | "active" | "suspended" | "cancelled";

export interface ClubMembership {
  id: string;
  personId: string;
  clubId: string;
  membershipNumber: string;
  membershipType: MembershipType;
  status: MembershipStatus;
  startsAt: string;
  endsAt?: string;
}

export type DepartmentRole = "member" | "staff" | "board";

export interface DepartmentMembership {
  id: string;
  clubMembershipId: string;
  departmentId: string;
  role: DepartmentRole;
  startsAt: string;
  endsAt?: string;
}

export type TeamRoleKey = "player" | "coach" | "assistant" | "manager";

export interface TeamRole {
  id: string;
  clubMembershipId: string;
  teamId: string;
  roleKey: TeamRoleKey;
  shirtNumber?: number;
  startsAt: string;
  endsAt?: string;
}

// ========= ROLE & GOVERNANCE =========

export type ScopeLevel = "organization" | "club" | "team" | "department";

export interface RoleDefinition {
  id: string;
  key: string;
  scopeLevel: ScopeLevel;
  displayName: string;
}

export interface Committee {
  id: string;
  clubId: string;
  departmentId?: string;
  name: string;
  isActive: boolean;
}

export interface FunctionaryRole {
  id: string;
  clubMembershipId: string;
  committeeId: string;
  roleKey: string;
  startsAt: string;
  endsAt?: string;
}

// ========= CONTRIBUTIONS & FINANCE =========

export type ContributionInterval = "yearly" | "half-yearly" | "quarterly" | "monthly" | "one-time";

export interface ContributionPlan {
  id: string;
  clubId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: ContributionInterval;
  ageMin?: number;
  ageMax?: number;
  isFamilyRate?: boolean;
  departmentId?: string;
}

export interface ContributionAssignment {
  id: string;
  clubMembershipId: string;
  contributionPlanId: string;
  validFrom: string;
  validTo?: string;
}

export type PaymentMethodType = "sepa" | "credit_card" | "paypal";

export interface PaymentMethod {
  id: string;
  clubMembershipId: string;
  type: PaymentMethodType;
  maskedDetails: string;
  isDefault: boolean;
}

export interface SepaMandate {
  id: string;
  paymentMethodId: string;
  iban: string;
  bic?: string;
  mandateReference: string;
  signedAt: string;
  validFrom: string;
  validTo?: string;
}

export type BookingType = "contribution" | "donation" | "other_income" | "expense";
export type BookingStatus = "open" | "paid" | "overdue" | "cancelled";

export interface Booking {
  id: string;
  clubId: string;
  clubMembershipId?: string;
  contributionAssignmentId?: string;
  bookingType: BookingType;
  status: BookingStatus;
  amount: number;
  currency: string;
  bookingDate: string;
  dueDate?: string;
  description?: string;
}
