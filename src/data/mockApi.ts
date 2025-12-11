import { mockClub } from "./mockClub";
import { mockPersons } from "./mockPersons";
import { mockDepartments } from "./mockDepartments";
import { mockContributionPlans, mockContributionAssignments } from "./mockContributions";
import { mockBookings } from "./mockBookings";
import { mockCommittees, mockFunctionaryRoles } from "./mockCommittees";
import { mockClubMemberships } from "./mockMemberships";
import type { 
  Club,
  Person,
  Department,
  ContributionPlan,
  ContributionAssignment,
  Booking,
  Committee,
  FunctionaryRole,
  ClubMembership
} from "../types/domain";

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Club
export const getClub = async (): Promise<Club> => {
  await delay();
  return mockClub;
};

export const updateClub = async (data: Partial<Club>): Promise<Club> => {
  await delay();
  return { ...mockClub, ...data };
};

// Persons
export const getPersons = async (): Promise<Person[]> => {
  await delay();
  return mockPersons;
};

export const getPersonById = async (id: string): Promise<Person | undefined> => {
  await delay();
  return mockPersons.find(p => p.id === id);
};

// Club Memberships
export const getClubMemberships = async (): Promise<ClubMembership[]> => {
  await delay();
  return mockClubMemberships;
};

export const getMembershipById = async (id: string): Promise<ClubMembership | undefined> => {
  await delay();
  return mockClubMemberships.find(m => m.id === id);
};

// Departments
export const getDepartments = async (): Promise<Department[]> => {
  await delay();
  return mockDepartments;
};

export const getDepartmentById = async (id: string): Promise<Department | undefined> => {
  await delay();
  return mockDepartments.find(d => d.id === id);
};

// Contributions
export const getContributionPlans = async (): Promise<ContributionPlan[]> => {
  await delay();
  return mockContributionPlans;
};

export const getContributionPlanById = async (id: string): Promise<ContributionPlan | undefined> => {
  await delay();
  return mockContributionPlans.find(c => c.id === id);
};

// Assignments
export const getContributionAssignments = async (): Promise<ContributionAssignment[]> => {
  await delay();
  return mockContributionAssignments;
};

export const getAssignmentsByMembershipId = async (membershipId: string): Promise<ContributionAssignment[]> => {
  await delay();
  return mockContributionAssignments.filter(a => a.clubMembershipId === membershipId);
};

export const getAssignmentsByPlanId = async (planId: string): Promise<ContributionAssignment[]> => {
  await delay();
  return mockContributionAssignments.filter(a => a.contributionPlanId === planId);
};

// Bookings
export const getBookings = async (): Promise<Booking[]> => {
  await delay();
  return mockBookings;
};

export const getBookingsByMembershipId = async (membershipId: string): Promise<Booking[]> => {
  await delay();
  return mockBookings.filter(b => b.clubMembershipId === membershipId);
};

// Committees
export const getCommittees = async (): Promise<Committee[]> => {
  await delay();
  return mockCommittees;
};

export const getFunctionaryRoles = async (): Promise<FunctionaryRole[]> => {
  await delay();
  return mockFunctionaryRoles;
};

export const getFunctionaryRolesByCommitteeId = async (committeeId: string): Promise<FunctionaryRole[]> => {
  await delay();
  return mockFunctionaryRoles.filter(f => f.committeeId === committeeId);
};
