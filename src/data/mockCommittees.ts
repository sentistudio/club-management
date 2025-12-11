import type { Committee, FunctionaryRole, RoleDefinition } from "../types/domain";

export const mockRoleDefinitions: RoleDefinition[] = [
  { id: "rd1", key: "org_admin", scopeLevel: "organization", displayName: "Organisations-Administrator" },
  { id: "rd2", key: "club_admin", scopeLevel: "club", displayName: "Vereins-Administrator" },
  { id: "rd3", key: "coach", scopeLevel: "team", displayName: "Trainer" },
  { id: "rd4", key: "assistant", scopeLevel: "team", displayName: "Co-Trainer" },
  { id: "rd5", key: "manager", scopeLevel: "team", displayName: "Teammanager" },
  { id: "rd6", key: "player", scopeLevel: "team", displayName: "Spieler" },
  { id: "rd7", key: "parent", scopeLevel: "team", displayName: "Elternteil" },
  { id: "rd8", key: "treasurer", scopeLevel: "club", displayName: "Kassenwart" },
  { id: "rd9", key: "secretary", scopeLevel: "club", displayName: "Schriftführer" },
  { id: "rd10", key: "board_member", scopeLevel: "club", displayName: "Vorstandsmitglied" },
  { id: "rd11", key: "1_vorsitzender", scopeLevel: "club", displayName: "1. Vorsitzender" },
  { id: "rd12", key: "2_vorsitzender", scopeLevel: "club", displayName: "2. Vorsitzender" },
  { id: "rd13", key: "jugendleiter", scopeLevel: "department", displayName: "Jugendleiter" }
];

export const mockCommittees: Committee[] = [
  {
    id: "com1",
    clubId: "club1",
    departmentId: "dept5",
    name: "Vorstand",
    isActive: true
  },
  {
    id: "com2",
    clubId: "club1",
    departmentId: "dept1",
    name: "Jugendausschuss",
    isActive: true
  },
  {
    id: "com3",
    clubId: "club1",
    name: "Sportausschuss",
    isActive: true
  },
  {
    id: "com4",
    clubId: "club1",
    name: "Festausschuss",
    isActive: true
  },
  {
    id: "com5",
    clubId: "club1",
    name: "Schiedsgericht",
    isActive: false
  }
];

export const mockFunctionaryRoles: FunctionaryRole[] = [
  // Vorstand
  {
    id: "fr1",
    clubMembershipId: "cm1",
    committeeId: "com1",
    roleKey: "1_vorsitzender",
    startsAt: "2022-03-15"
  },
  {
    id: "fr2",
    clubMembershipId: "cm2",
    committeeId: "com1",
    roleKey: "2_vorsitzender",
    startsAt: "2022-03-15"
  },
  {
    id: "fr3",
    clubMembershipId: "cm3",
    committeeId: "com1",
    roleKey: "treasurer",
    startsAt: "2022-03-15"
  },
  {
    id: "fr4",
    clubMembershipId: "cm5",
    committeeId: "com1",
    roleKey: "secretary",
    startsAt: "2022-03-15"
  },
  // Jugendausschuss
  {
    id: "fr5",
    clubMembershipId: "cm3",
    committeeId: "com2",
    roleKey: "jugendleiter",
    startsAt: "2020-01-01"
  },
  {
    id: "fr6",
    clubMembershipId: "cm2",
    committeeId: "com2",
    roleKey: "board_member",
    startsAt: "2021-06-01"
  },
  // Sportausschuss
  {
    id: "fr7",
    clubMembershipId: "cm1",
    committeeId: "com3",
    roleKey: "board_member",
    startsAt: "2023-01-01"
  },
  {
    id: "fr8",
    clubMembershipId: "cm7",
    committeeId: "com3",
    roleKey: "board_member",
    startsAt: "2023-01-01"
  },
  // Festausschuss
  {
    id: "fr9",
    clubMembershipId: "cm9",
    committeeId: "com4",
    roleKey: "board_member",
    startsAt: "2023-06-01"
  },
  {
    id: "fr10",
    clubMembershipId: "cm6",
    committeeId: "com4",
    roleKey: "board_member",
    startsAt: "2023-06-01"
  }
];
