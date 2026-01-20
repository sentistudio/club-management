import type { Person } from "../types/domain";
import { ALL_DEMO_PERSONAS } from "./mockDemoPersonas";

// Convert demo personas to Person type for club management
const demoPersonsConverted: Person[] = ALL_DEMO_PERSONAS.map(p => ({
  id: p.id,
  organizationId: "org1",
  firstName: p.firstName,
  lastName: p.lastName,
  dateOfBirth: p.birthDate || "1985-01-01",
  email: p.email,
  phone: p.phone
}));

export const mockPersons: Person[] = [
  // Demo personas from member portal (for cohesive demo)
  ...demoPersonsConverted,
  
  // Additional generic members
  {
    id: "p1",
    organizationId: "org1",
    firstName: "Max",
    lastName: "Muster",
    dateOfBirth: "1990-05-10",
    email: "max.muster@example.com",
    phone: "+49 171 1234567"
  },
  {
    id: "p2",
    organizationId: "org1",
    firstName: "Anna",
    lastName: "Schmidt",
    dateOfBirth: "1985-03-22",
    email: "anna.schmidt@example.com",
    phone: "+49 172 9876543"
  },
  {
    id: "p4",
    organizationId: "org1",
    firstName: "Klaus",
    lastName: "Weber",
    dateOfBirth: "1945-07-15",
    email: "klaus.weber@example.com"
  },
  {
    id: "p5",
    organizationId: "org1",
    firstName: "Lisa",
    lastName: "Bauer",
    dateOfBirth: "1995-09-18",
    email: "lisa.bauer@example.com",
    phone: "+49 176 3334455"
  },
  {
    id: "p9",
    organizationId: "org1",
    firstName: "Julia",
    lastName: "Fischer",
    dateOfBirth: "1998-04-28",
    email: "julia.fischer@example.com",
    phone: "+49 177 1112233"
  },
  {
    id: "p10",
    organizationId: "org1",
    firstName: "Hans",
    lastName: "Braun",
    dateOfBirth: "1960-08-20",
    email: "hans.braun@example.com"
  },
  {
    id: "p11_old",
    organizationId: "org1",
    firstName: "Emma",
    lastName: "Wagner",
    dateOfBirth: "2008-02-14",
    email: "emma.wagner@example.com"
  },
  {
    id: "p12_old",
    organizationId: "org1",
    firstName: "Felix",
    lastName: "Zimmermann",
    dateOfBirth: "2010-11-05"
  },
  {
    id: "p13_old",
    organizationId: "org1",
    firstName: "Markus",
    lastName: "Lehmann",
    dateOfBirth: "1992-07-19",
    email: "m.lehmann@example.com",
    phone: "+49 179 4445566"
  },
  {
    id: "p14",
    organizationId: "org1",
    firstName: "Sarah",
    lastName: "Koch",
    dateOfBirth: "1999-01-08",
    email: "sarah.koch@example.com"
  },
  {
    id: "p15",
    organizationId: "org1",
    firstName: "David",
    lastName: "Richter",
    dateOfBirth: "2005-09-23",
    email: "d.richter@example.com"
  }
];

