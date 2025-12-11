import type { ContributionPlan, ContributionAssignment } from "../types/domain";

export const mockContributionPlans: ContributionPlan[] = [
  {
    id: "cp1",
    clubId: "club1",
    name: "Erwachsene Vollmitglied",
    description: "Regulärer Jahresbeitrag für erwachsene Mitglieder",
    amount: 180,
    currency: "EUR",
    interval: "yearly",
    ageMin: 18
  },
  {
    id: "cp2",
    clubId: "club1",
    name: "Jugendliche (14-17)",
    description: "Ermäßigter Beitrag für Jugendliche",
    amount: 90,
    currency: "EUR",
    interval: "yearly",
    ageMin: 14,
    ageMax: 17
  },
  {
    id: "cp3",
    clubId: "club1",
    name: "Kinder (bis 13)",
    description: "Kinderbeitrag",
    amount: 60,
    currency: "EUR",
    interval: "yearly",
    ageMax: 13
  },
  {
    id: "cp4",
    clubId: "club1",
    name: "Familienbeitrag",
    description: "Für Familien mit 2+ Mitgliedern",
    amount: 300,
    currency: "EUR",
    interval: "yearly",
    isFamilyRate: true
  },
  {
    id: "cp5",
    clubId: "club1",
    name: "Passives Mitglied",
    description: "Fördermitgliedschaft ohne aktive Teilnahme",
    amount: 50,
    currency: "EUR",
    interval: "yearly"
  },
  {
    id: "cp6",
    clubId: "club1",
    name: "Ehrenmitglied",
    description: "Beitragsfrei für Ehrenmitglieder",
    amount: 0,
    currency: "EUR",
    interval: "yearly"
  },
  {
    id: "cp7",
    clubId: "club1",
    name: "Handball Zusatzbeitrag",
    description: "Zusätzlicher Beitrag für Handball-Abteilung",
    amount: 5,
    currency: "EUR",
    interval: "monthly",
    departmentId: "dept2"
  },
  {
    id: "cp8",
    clubId: "club1",
    name: "Tennis Zusatzbeitrag",
    description: "Zusätzlicher Beitrag für Tennis-Abteilung",
    amount: 120,
    currency: "EUR",
    interval: "yearly",
    departmentId: "dept4"
  }
];

export const mockContributionAssignments: ContributionAssignment[] = [
  { id: "ca1", clubMembershipId: "cm1", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca2", clubMembershipId: "cm2", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca3", clubMembershipId: "cm3", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca4", clubMembershipId: "cm4", contributionPlanId: "cp6", validFrom: "2000-01-01" },
  { id: "ca5", clubMembershipId: "cm5", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca6", clubMembershipId: "cm6", contributionPlanId: "cp5", validFrom: "2024-01-01" },
  { id: "ca7", clubMembershipId: "cm7", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca8", clubMembershipId: "cm7", contributionPlanId: "cp7", validFrom: "2024-01-01" },
  { id: "ca9", clubMembershipId: "cm9", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca10", clubMembershipId: "cm10", contributionPlanId: "cp5", validFrom: "2024-01-01" },
  { id: "ca11", clubMembershipId: "cm11", contributionPlanId: "cp3", validFrom: "2024-01-01" },
  { id: "ca12", clubMembershipId: "cm12", contributionPlanId: "cp3", validFrom: "2024-01-01" },
  { id: "ca13", clubMembershipId: "cm13", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca14", clubMembershipId: "cm14", contributionPlanId: "cp1", validFrom: "2024-01-01" },
  { id: "ca15", clubMembershipId: "cm15", contributionPlanId: "cp2", validFrom: "2024-01-01" }
];
