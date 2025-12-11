import type { ClubMembership, DepartmentMembership, TeamRole } from "../types/domain";

export const mockClubMemberships: ClubMembership[] = [
  {
    id: "cm1",
    personId: "p1",
    clubId: "club1",
    membershipNumber: "1001",
    membershipType: "active",
    status: "active",
    startsAt: "2010-08-01"
  },
  {
    id: "cm2",
    personId: "p2",
    clubId: "club1",
    membershipNumber: "1002",
    membershipType: "active",
    status: "active",
    startsAt: "2015-01-15"
  },
  {
    id: "cm3",
    personId: "p3",
    clubId: "club1",
    membershipNumber: "1003",
    membershipType: "staff",
    status: "active",
    startsAt: "2005-06-01"
  },
  {
    id: "cm4",
    personId: "p4",
    clubId: "club1",
    membershipNumber: "1004",
    membershipType: "honorary",
    status: "active",
    startsAt: "1970-03-01"
  },
  {
    id: "cm5",
    personId: "p5",
    clubId: "club1",
    membershipNumber: "1005",
    membershipType: "active",
    status: "active",
    startsAt: "2018-02-01"
  },
  {
    id: "cm6",
    personId: "p6",
    clubId: "club1",
    membershipNumber: "1006",
    membershipType: "passive",
    status: "active",
    startsAt: "2012-09-01"
  },
  {
    id: "cm7",
    personId: "p7",
    clubId: "club1",
    membershipNumber: "1007",
    membershipType: "active",
    status: "active",
    startsAt: "2016-04-15"
  },
  {
    id: "cm8",
    personId: "p8",
    clubId: "club1",
    membershipNumber: "1008",
    membershipType: "active",
    status: "cancelled",
    startsAt: "2008-01-01",
    endsAt: "2023-12-31"
  },
  {
    id: "cm9",
    personId: "p9",
    clubId: "club1",
    membershipNumber: "1009",
    membershipType: "active",
    status: "active",
    startsAt: "2020-07-01"
  },
  {
    id: "cm10",
    personId: "p10",
    clubId: "club1",
    membershipNumber: "1010",
    membershipType: "passive",
    status: "suspended",
    startsAt: "1995-05-01"
  },
  {
    id: "cm11",
    personId: "p11",
    clubId: "club1",
    membershipNumber: "1011",
    membershipType: "active",
    status: "active",
    startsAt: "2022-01-15"
  },
  {
    id: "cm12",
    personId: "p12",
    clubId: "club1",
    membershipNumber: "1012",
    membershipType: "active",
    status: "active",
    startsAt: "2023-03-01"
  },
  {
    id: "cm13",
    personId: "p13",
    clubId: "club1",
    membershipNumber: "1013",
    membershipType: "active",
    status: "pending",
    startsAt: "2024-01-01"
  },
  {
    id: "cm14",
    personId: "p14",
    clubId: "club1",
    membershipNumber: "1014",
    membershipType: "active",
    status: "active",
    startsAt: "2021-09-01"
  },
  {
    id: "cm15",
    personId: "p15",
    clubId: "club1",
    membershipNumber: "1015",
    membershipType: "active",
    status: "active",
    startsAt: "2022-08-01"
  }
];

export const mockDepartmentMemberships: DepartmentMembership[] = [
  // Football department members
  { id: "dm1", clubMembershipId: "cm1", departmentId: "dept1", role: "member", startsAt: "2010-08-01" },
  { id: "dm2", clubMembershipId: "cm2", departmentId: "dept1", role: "staff", startsAt: "2020-01-01" },
  { id: "dm3", clubMembershipId: "cm3", departmentId: "dept1", role: "staff", startsAt: "2005-06-01" },
  { id: "dm4", clubMembershipId: "cm5", departmentId: "dept1", role: "member", startsAt: "2018-02-01" },
  { id: "dm5", clubMembershipId: "cm9", departmentId: "dept1", role: "member", startsAt: "2020-07-01" },
  { id: "dm6", clubMembershipId: "cm11", departmentId: "dept1", role: "member", startsAt: "2022-01-15" },
  { id: "dm7", clubMembershipId: "cm12", departmentId: "dept1", role: "member", startsAt: "2023-03-01" },
  { id: "dm8", clubMembershipId: "cm14", departmentId: "dept1", role: "member", startsAt: "2021-09-01" },
  { id: "dm9", clubMembershipId: "cm15", departmentId: "dept1", role: "member", startsAt: "2022-08-01" },
  
  // Handball department members
  { id: "dm10", clubMembershipId: "cm7", departmentId: "dept2", role: "member", startsAt: "2016-04-15" },
  { id: "dm11", clubMembershipId: "cm9", departmentId: "dept2", role: "member", startsAt: "2021-01-01" },
  
  // Volleyball department members
  { id: "dm12", clubMembershipId: "cm9", departmentId: "dept3", role: "member", startsAt: "2020-07-01" },
  
  // Vorstand (admin)
  { id: "dm13", clubMembershipId: "cm1", departmentId: "dept5", role: "board", startsAt: "2022-03-15" },
  { id: "dm14", clubMembershipId: "cm2", departmentId: "dept5", role: "board", startsAt: "2022-03-15" },
  { id: "dm15", clubMembershipId: "cm3", departmentId: "dept5", role: "board", startsAt: "2022-03-15" }
];

export const mockTeamRoles: TeamRole[] = [
  // 1. Herren players
  { id: "tr1", clubMembershipId: "cm1", teamId: "team1", roleKey: "player", shirtNumber: 10, startsAt: "2020-07-01" },
  { id: "tr2", clubMembershipId: "cm13", teamId: "team1", roleKey: "player", shirtNumber: 7, startsAt: "2024-01-01" },
  
  // 1. Herren staff
  { id: "tr3", clubMembershipId: "cm3", teamId: "team1", roleKey: "coach", startsAt: "2020-07-01" },
  { id: "tr4", clubMembershipId: "cm2", teamId: "team1", roleKey: "assistant", startsAt: "2022-01-01" },
  
  // 1. Damen
  { id: "tr5", clubMembershipId: "cm5", teamId: "team3", roleKey: "player", shirtNumber: 9, startsAt: "2018-02-01" },
  { id: "tr6", clubMembershipId: "cm9", teamId: "team3", roleKey: "player", shirtNumber: 11, startsAt: "2020-07-01" },
  { id: "tr7", clubMembershipId: "cm14", teamId: "team3", roleKey: "player", shirtNumber: 5, startsAt: "2021-09-01" },
  
  // U15 Junioren
  { id: "tr8", clubMembershipId: "cm15", teamId: "team6", roleKey: "player", shirtNumber: 8, startsAt: "2022-08-01" },
  { id: "tr9", clubMembershipId: "cm3", teamId: "team6", roleKey: "coach", startsAt: "2022-07-01" },
  
  // U13 Mixed
  { id: "tr10", clubMembershipId: "cm11", teamId: "team7", roleKey: "player", shirtNumber: 14, startsAt: "2022-01-15" },
  { id: "tr11", clubMembershipId: "cm12", teamId: "team7", roleKey: "player", shirtNumber: 6, startsAt: "2023-03-01" },
  
  // Handball
  { id: "tr12", clubMembershipId: "cm7", teamId: "team10", roleKey: "player", shirtNumber: 3, startsAt: "2016-04-15" },
  { id: "tr13", clubMembershipId: "cm7", teamId: "team10", roleKey: "manager", startsAt: "2020-01-01" },
  
  // Volleyball
  { id: "tr14", clubMembershipId: "cm9", teamId: "team11", roleKey: "player", startsAt: "2020-07-01" }
];

