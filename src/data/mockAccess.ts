import type { UserAccount, AccessGrant } from "../types/domain";

export const mockUserAccounts: UserAccount[] = [
  {
    id: "ua1",
    personId: "p1",
    authProvider: "local",
    isActive: true,
    createdAt: "2020-01-01",
    lastLoginAt: "2024-04-25"
  },
  {
    id: "ua2",
    personId: "p2",
    authProvider: "google",
    authSub: "google-oauth2|123456789",
    isActive: true,
    createdAt: "2021-03-15",
    lastLoginAt: "2024-04-24"
  },
  {
    id: "ua3",
    personId: "p3",
    authProvider: "local",
    isActive: true,
    createdAt: "2018-06-01",
    lastLoginAt: "2024-04-23"
  },
  {
    id: "ua4",
    personId: "p5",
    authProvider: "local",
    isActive: true,
    createdAt: "2022-02-01",
    lastLoginAt: "2024-04-22"
  },
  {
    id: "ua5",
    personId: "p7",
    authProvider: "google",
    authSub: "google-oauth2|987654321",
    isActive: true,
    createdAt: "2020-05-10",
    lastLoginAt: "2024-04-20"
  }
];

export const mockAccessGrants: AccessGrant[] = [
  // Max Muster - Club Admin + Coach
  {
    id: "ag1",
    userAccountId: "ua1",
    scopeType: "club",
    scopeId: "club1",
    roleKey: "club_admin"
  },
  {
    id: "ag2",
    userAccountId: "ua1",
    scopeType: "team",
    scopeId: "team1",
    roleKey: "player"
  },
  // Anna Schmidt - Assistant Coach
  {
    id: "ag3",
    userAccountId: "ua2",
    scopeType: "team",
    scopeId: "team1",
    roleKey: "assistant"
  },
  {
    id: "ag4",
    userAccountId: "ua2",
    scopeType: "club",
    scopeId: "club1",
    roleKey: "board_member"
  },
  // Thomas Müller - Coach + Treasurer
  {
    id: "ag5",
    userAccountId: "ua3",
    scopeType: "team",
    scopeId: "team1",
    roleKey: "coach"
  },
  {
    id: "ag6",
    userAccountId: "ua3",
    scopeType: "team",
    scopeId: "team6",
    roleKey: "coach"
  },
  {
    id: "ag7",
    userAccountId: "ua3",
    scopeType: "club",
    scopeId: "club1",
    roleKey: "treasurer"
  },
  // Lisa Bauer - Secretary
  {
    id: "ag8",
    userAccountId: "ua4",
    scopeType: "club",
    scopeId: "club1",
    roleKey: "secretary"
  },
  {
    id: "ag9",
    userAccountId: "ua4",
    scopeType: "team",
    scopeId: "team3",
    roleKey: "player"
  },
  // Sandra Hoffmann - Team Manager
  {
    id: "ag10",
    userAccountId: "ua5",
    scopeType: "team",
    scopeId: "team10",
    roleKey: "manager"
  }
];

