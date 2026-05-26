/**
 * Resolves display info for any personId, looking across mockDemoPersonas and mockPeople.
 */
import { ALL_DEMO_PERSONAS, type DemoPersona } from "./mockDemoPersonas";
import { MOCK_PERSONS } from "./mockPeople";
import { FICTIONAL_PLAYERS } from "./mockTeamRoster";

export interface PersonDisplay {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatarUrl?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
}

function personaToDisplay(p: DemoPersona): PersonDisplay {
  return {
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    fullName: `${p.firstName} ${p.lastName}`,
    avatarUrl: p.avatar,
    email: p.email
  };
}

export function getPersonDisplay(personId: string): PersonDisplay {
  // 1. Check demo personas (richest data)
  const persona = ALL_DEMO_PERSONAS.find(p => p.id === personId);
  if (persona) return personaToDisplay(persona);

  // 2. Check mockPeople (admin data)
  const person = MOCK_PERSONS.find(p => p.id === personId);
  if (person) {
    return {
      id: person.id,
      firstName: person.firstName,
      lastName: person.lastName,
      fullName: `${person.firstName} ${person.lastName}`,
      avatarUrl: person.avatarUrl,
      email: person.email,
      dateOfBirth: person.dateOfBirth,
      gender: person.gender
    };
  }

  // 3. Fictional players (roster-only)
  const fictional = FICTIONAL_PLAYERS[personId];
  if (fictional) {
    return {
      id: personId,
      firstName: fictional.firstName,
      lastName: fictional.lastName,
      fullName: `${fictional.firstName} ${fictional.lastName}`,
      avatarUrl: fictional.avatarUrl
    };
  }

  // Fallback
  return {
    id: personId,
    firstName: "Unbekannt",
    lastName: "",
    fullName: "Unbekannter Spieler"
  };
}

export function getPersonInitials(display: PersonDisplay): string {
  return `${display.firstName[0] ?? ""}${display.lastName[0] ?? ""}`.toUpperCase();
}
