import type { Department } from "../types/domain";

export const mockDepartments: Department[] = [
  // ==========================================
  // ACTIVE SPORT DEPARTMENTS (with teams & members)
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
  // SPORT DEPARTMENTS — no teams yet (empty state)
  // ==========================================
  {
    id: "dept_leichtathletik",
    clubId: "club1",
    name: "Leichtathletik",
    kind: "sport",
    isActive: true
  },
  {
    id: "dept_schwimmen",
    clubId: "club1",
    name: "Schwimmen",
    kind: "sport",
    isActive: false
  },
  {
    id: "dept_handball",
    clubId: "club1",
    name: "Handball",
    kind: "sport",
    isActive: false
  },

  // ==========================================
  // ADMIN DEPARTMENTS
  // ==========================================
  {
    id: "dept_vorstand",
    clubId: "club1",
    name: "Vorstand",
    kind: "admin",
    isActive: true
  },
  {
    id: "dept_verwaltung",
    clubId: "club1",
    name: "Verwaltung",
    kind: "admin",
    isActive: true
  }
];
