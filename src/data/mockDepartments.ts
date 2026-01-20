import type { Department } from "../types/domain";

export const mockDepartments: Department[] = [
  // ==========================================
  // DEMO DEPARTMENTS (synced with Member Portal)
  // ==========================================
  {
    id: "dept_football",
    clubId: "club1",
    name: "Fußball",
    kind: "sport",
    isActive: true
  },
  {
    id: "dept_volleyball",
    clubId: "club1",
    name: "Volleyball",
    kind: "sport",
    isActive: true
  },
  {
    id: "dept_fitness",
    clubId: "club1",
    name: "Fitness",
    kind: "sport",
    isActive: true
  },
  
  // ==========================================
  // ADDITIONAL DEPARTMENTS
  // ==========================================
  {
    id: "dept1",
    clubId: "club1",
    name: "Fußball (Alt)",
    kind: "sport",
    isActive: false
  },
  {
    id: "dept2",
    clubId: "club1",
    name: "Handball",
    kind: "sport",
    isActive: true
  },
  {
    id: "dept3",
    clubId: "club1",
    name: "Volleyball (Alt)",
    kind: "sport",
    isActive: false
  },
  {
    id: "dept4",
    clubId: "club1",
    name: "Tennis",
    kind: "sport",
    isActive: false
  },
  {
    id: "dept5",
    clubId: "club1",
    name: "Vorstand",
    kind: "admin",
    isActive: true
  },
  {
    id: "dept6",
    clubId: "club1",
    name: "Verwaltung",
    kind: "admin",
    isActive: true
  }
];
