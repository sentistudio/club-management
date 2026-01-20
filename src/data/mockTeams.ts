import type { Team } from "../types/domain";

export const mockTeams: Team[] = [
  // ==========================================
  // DEMO TEAMS (synced with Member Portal)
  // ==========================================
  
  // Football U12 - Max, Noah, Sophie play here, Lena/Daniel/Peter are parents
  {
    id: "team_u12",
    clubId: "club1",
    departmentId: "dept_football",
    name: "Fußball U12",
    ageGroup: "U11",
    gender: "mixed",
    isActive: true
  },
  
  // Volleyball U16 - Flurina, Anna play here, Petra is parent
  {
    id: "team_volleyball_u16",
    clubId: "club1",
    departmentId: "dept_volleyball",
    name: "Volleyball U16 Mädchen",
    ageGroup: "U17",
    gender: "w",
    isActive: true
  },
  
  // Frauen Ü40 - Lena plays here
  {
    id: "team_frauen_ue40",
    clubId: "club1",
    departmentId: "dept_football",
    name: "Frauen Ü40",
    ageGroup: "Senior",
    gender: "w",
    isActive: true
  },
  
  // Fitness Morgengruppe - Lena participates here
  {
    id: "team_fitness",
    clubId: "club1",
    departmentId: "dept_fitness",
    name: "Fitness – Morgengruppe",
    ageGroup: "Senior",
    gender: "mixed",
    isActive: true
  },
  
  // ==========================================
  // ADDITIONAL TEAMS
  // ==========================================
  
  // Football teams
  {
    id: "team1",
    clubId: "club1",
    departmentId: "dept1",
    name: "1. Herren",
    ageGroup: "Senior",
    gender: "m",
    isActive: true
  },
  {
    id: "team2",
    clubId: "club1",
    departmentId: "dept1",
    name: "2. Herren",
    ageGroup: "Senior",
    gender: "m",
    isActive: true
  },
  {
    id: "team3",
    clubId: "club1",
    departmentId: "dept1",
    name: "1. Damen",
    ageGroup: "Senior",
    gender: "w",
    isActive: true
  },
  {
    id: "team4",
    clubId: "club1",
    departmentId: "dept1",
    name: "U19 Junioren",
    ageGroup: "U19",
    gender: "m",
    isActive: true
  },
  {
    id: "team5",
    clubId: "club1",
    departmentId: "dept1",
    name: "U17 Junioren",
    ageGroup: "U17",
    gender: "m",
    isActive: true
  },
  {
    id: "team6",
    clubId: "club1",
    departmentId: "dept1",
    name: "U15 Junioren",
    ageGroup: "U15",
    gender: "m",
    isActive: true
  },
  {
    id: "team7",
    clubId: "club1",
    departmentId: "dept1",
    name: "U13 Mixed",
    ageGroup: "U13",
    gender: "mixed",
    isActive: true
  },
  {
    id: "team8",
    clubId: "club1",
    departmentId: "dept1",
    name: "U11 Mixed",
    ageGroup: "U11",
    gender: "mixed",
    isActive: true
  },
  // Handball teams
  {
    id: "team9",
    clubId: "club1",
    departmentId: "dept2",
    name: "Herren Handball",
    ageGroup: "Senior",
    gender: "m",
    isActive: true
  },
  {
    id: "team10",
    clubId: "club1",
    departmentId: "dept2",
    name: "Damen Handball",
    ageGroup: "Senior",
    gender: "w",
    isActive: true
  },
  // Volleyball
  {
    id: "team11",
    clubId: "club1",
    departmentId: "dept3",
    name: "Mixed Volleyball",
    ageGroup: "Senior",
    gender: "mixed",
    isActive: true
  }
];

