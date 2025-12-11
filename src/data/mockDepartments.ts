import type { Department } from "../types/domain";

export const mockDepartments: Department[] = [
  {
    id: "dept1",
    clubId: "club1",
    name: "Fußball",
    kind: "sport",
    isActive: true
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
    name: "Volleyball",
    kind: "sport",
    isActive: true
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
