import type { Booking } from "../types/domain";

export const mockBookings: Booking[] = [
  // Contribution payments - paid
  {
    id: "b1",
    clubId: "club1",
    clubMembershipId: "cm1",
    contributionAssignmentId: "ca1",
    bookingType: "contribution",
    status: "paid",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-15",
    dueDate: "2024-01-31",
    description: "Jahresbeitrag 2024"
  },
  {
    id: "b2",
    clubId: "club1",
    clubMembershipId: "cm2",
    contributionAssignmentId: "ca2",
    bookingType: "contribution",
    status: "paid",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-20",
    dueDate: "2024-01-31",
    description: "Jahresbeitrag 2024"
  },
  {
    id: "b3",
    clubId: "club1",
    clubMembershipId: "cm3",
    contributionAssignmentId: "ca3",
    bookingType: "contribution",
    status: "open",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-01",
    dueDate: "2024-02-28",
    description: "Jahresbeitrag 2024"
  },
  {
    id: "b4",
    clubId: "club1",
    clubMembershipId: "cm5",
    contributionAssignmentId: "ca5",
    bookingType: "contribution",
    status: "overdue",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-01",
    dueDate: "2024-01-31",
    description: "Jahresbeitrag 2024"
  },
  {
    id: "b5",
    clubId: "club1",
    clubMembershipId: "cm6",
    contributionAssignmentId: "ca6",
    bookingType: "contribution",
    status: "paid",
    amount: 50,
    currency: "EUR",
    bookingDate: "2024-02-01",
    dueDate: "2024-02-28",
    description: "Passiver Beitrag 2024"
  },
  {
    id: "b6",
    clubId: "club1",
    clubMembershipId: "cm7",
    contributionAssignmentId: "ca7",
    bookingType: "contribution",
    status: "paid",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-10",
    dueDate: "2024-01-31",
    description: "Jahresbeitrag 2024"
  },
  {
    id: "b7",
    clubId: "club1",
    clubMembershipId: "cm7",
    contributionAssignmentId: "ca8",
    bookingType: "contribution",
    status: "open",
    amount: 60,
    currency: "EUR",
    bookingDate: "2024-01-01",
    dueDate: "2024-12-31",
    description: "Handball Zusatzbeitrag 2024"
  },
  {
    id: "b8",
    clubId: "club1",
    clubMembershipId: "cm9",
    contributionAssignmentId: "ca9",
    bookingType: "contribution",
    status: "overdue",
    amount: 180,
    currency: "EUR",
    bookingDate: "2024-01-01",
    dueDate: "2024-01-31",
    description: "Jahresbeitrag 2024"
  },
  // Donations
  {
    id: "b9",
    clubId: "club1",
    bookingType: "donation",
    status: "paid",
    amount: 500,
    currency: "EUR",
    bookingDate: "2024-03-15",
    description: "Spende Firma Müller GmbH"
  },
  {
    id: "b10",
    clubId: "club1",
    bookingType: "donation",
    status: "paid",
    amount: 250,
    currency: "EUR",
    bookingDate: "2024-04-01",
    description: "Spende Familie Schmidt"
  },
  // Other income
  {
    id: "b11",
    clubId: "club1",
    bookingType: "other_income",
    status: "paid",
    amount: 1200,
    currency: "EUR",
    bookingDate: "2024-02-20",
    description: "Trikotwerbung Saison 2024"
  },
  {
    id: "b12",
    clubId: "club1",
    bookingType: "other_income",
    status: "paid",
    amount: 450,
    currency: "EUR",
    bookingDate: "2024-03-10",
    description: "Einnahmen Vereinsfest"
  },
  // Expenses
  {
    id: "b13",
    clubId: "club1",
    bookingType: "expense",
    status: "paid",
    amount: -450,
    currency: "EUR",
    bookingDate: "2024-03-01",
    description: "Schiedsrichterkosten März"
  },
  {
    id: "b14",
    clubId: "club1",
    bookingType: "expense",
    status: "paid",
    amount: -800,
    currency: "EUR",
    bookingDate: "2024-02-15",
    description: "Platzpflege Frühjahr"
  },
  {
    id: "b15",
    clubId: "club1",
    clubMembershipId: "cm11",
    contributionAssignmentId: "ca11",
    bookingType: "contribution",
    status: "paid",
    amount: 60,
    currency: "EUR",
    bookingDate: "2024-01-25",
    dueDate: "2024-01-31",
    description: "Kinderbeitrag 2024"
  },
  {
    id: "b16",
    clubId: "club1",
    clubMembershipId: "cm12",
    contributionAssignmentId: "ca12",
    bookingType: "contribution",
    status: "open",
    amount: 60,
    currency: "EUR",
    bookingDate: "2024-03-01",
    dueDate: "2024-03-31",
    description: "Kinderbeitrag 2024"
  },
  {
    id: "b17",
    clubId: "club1",
    bookingType: "expense",
    status: "open",
    amount: -2500,
    currency: "EUR",
    bookingDate: "2024-04-15",
    dueDate: "2024-05-01",
    description: "Neue Trikots Jugendmannschaft"
  },
  {
    id: "b18",
    clubId: "club1",
    bookingType: "expense",
    status: "paid",
    amount: -320,
    currency: "EUR",
    bookingDate: "2024-04-20",
    description: "Trainingsmaterial"
  }
];
