/**
 * Mock People Data
 * 
 * Seed data for the people management system:
 * - 2 adult players (Patrick, Lena)
 * - 4 minors: Max, Flurina (with guardian Lena), Tim (guardian pending), Anna (NO guardian!)
 * - 2 guardians as contacts (Markus, Sandra Weber)
 * - Guardian links: Lena→Max (active), Lena→Flurina (active), Markus→Tim (pending)
 * - Anna has NO guardian link - demo case for minor protection features
 * - Teams: U12, U15
 * - Various memberships with active/pending status
 */

import type {
  Person,
  Membership,
  GuardianLink,
  RegistrationIntent,
  Invite,
  RegistrationForm,
  GuardianPermissions
} from "../types/people";

// ==========================================
// ORGANIZATION DATA (matches existing mockClub)
// ==========================================
export const MOCK_ORG = {
  id: "00ES8GN8N400008VVV0AG08LVUPGND5I",
  name: "BV BORUSSIA 09 DORTMUND E.V."
};

export const MOCK_DEPARTMENTS = [
  { id: "dept_fussball", name: "Fußball", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I" },
  { id: "dept_fitness", name: "Fitness", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I" },
  { id: "dept_turnen", name: "Turnen", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I" }
];

export const MOCK_TEAMS_PEOPLE = [
  { id: "team_u12", name: "U12 Junioren", departmentId: "dept_fussball" },
  { id: "team_u15", name: "U15 Junioren", departmentId: "dept_fussball" },
  { id: "team_herren1", name: "Herren 1. Mannschaft", departmentId: "dept_fussball" },
  { id: "team_damen", name: "Damen", departmentId: "dept_fussball" },
  { id: "team_frauen_ue40", name: "Frauen Ü40", departmentId: "dept_fussball" },
  { id: "team_volleyball_u16", name: "Volleyball U16 Mädchen", departmentId: "dept_volleyball" },
  { id: "team_fitness", name: "Fitness – Morgengruppe", departmentId: "dept_fitness" }
];

export const MOCK_DEPARTMENTS_EXTRA = [
  { id: "dept_volleyball", name: "Volleyball", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I" }
];

// ==========================================
// DEFAULT GUARDIAN PERMISSIONS
// ==========================================
export const DEFAULT_GUARDIAN_PERMISSIONS: GuardianPermissions = {
  manageRsvp: true,
  viewComms: true,
  payFees: true,
  editProfile: false
};

// ==========================================
// PERSONS
// ==========================================
export const MOCK_PERSONS: Person[] = [
  // Adult Players
  {
    id: "person_patrick",
    firstName: "Patrick",
    lastName: "Steuble",
    email: "patrick.steuble@example.com",
    phone: "+49 170 1234567",
    dateOfBirth: "1985-03-15",
    gender: "male",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2020-01-15T10:00:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "person_lena",
    firstName: "Lena",
    lastName: "Schneider",
    email: "lena.schneider@example.com",
    phone: "+49 171 9876543",
    dateOfBirth: "1988-07-22",
    gender: "female",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2021-03-10T09:00:00Z",
    updatedAt: "2024-01-08T11:20:00Z"
  },
  // Minor Players
  {
    id: "person_max",
    firstName: "Max",
    lastName: "Schneider",
    email: undefined,
    phone: undefined,
    dateOfBirth: "2012-05-10",
    gender: "male",
    status: "active",
    kind: "member",
    // Boy playing soccer - matches mobile app
    avatarUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: false,
    createdAt: "2022-08-01T10:00:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },
  {
    id: "person_flurina",
    firstName: "Flurina",
    lastName: "Schneider",
    dateOfBirth: "2014-11-03",
    gender: "female",
    status: "active",
    kind: "member",
    // Girl with blonde hair - matches mobile app
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    // Flurina has her own minor account active (linked to guardian Lena)
    hasClaimedIdentity: true,
    createdAt: "2023-02-15T10:00:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },
  // Anna - Minor WITHOUT Guardian (same team as Flurina)
  // This is a demo case: minor player with no parent/guardian link established
  // Anna registered herself but has LIMITED VIEW in mobile app due to no guardian link
  {
    id: "person_anna",
    firstName: "Anna",
    lastName: "Berger",
    email: undefined,
    phone: undefined,
    dateOfBirth: "2011-09-15",
    gender: "female",
    status: "active",
    kind: "member",
    // Young girl - matches mobile app
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    // Anna registered but has LIMITED view (no guardian link = restricted features)
    hasClaimedIdentity: true,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  },
  {
    id: "person_tim",
    firstName: "Tim",
    lastName: "Weber",
    dateOfBirth: "2013-08-20",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z"
  },
  // Additional adult player
  {
    id: "person_fabio",
    firstName: "Fabio",
    lastName: "Senti",
    email: "fabio.senti@example.com",
    phone: "+49 175 9998877",
    dateOfBirth: "1990-02-14",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z"
  },
  // Guardians (Contacts)
  {
    id: "person_markus",
    firstName: "Markus",
    lastName: "Weber",
    email: "markus.weber@example.com",
    phone: "+49 172 5551234",
    dateOfBirth: "1980-12-05",
    gender: "male",
    status: "active",
    kind: "contact",
    hasClaimedIdentity: true,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z"
  },
  {
    id: "person_sandra",
    firstName: "Sandra",
    lastName: "Weber",
    email: "sandra.weber@example.com",
    phone: "+49 173 5559876",
    dateOfBirth: "1982-04-18",
    gender: "female",
    status: "active",
    kind: "contact",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-02T10:00:00Z"
  },
  // Additional contact (volunteer)
  {
    id: "person_klaus",
    firstName: "Klaus",
    lastName: "Trainer",
    email: "klaus.trainer@example.com",
    phone: "+49 174 1112233",
    dateOfBirth: "1975-06-30",
    gender: "male",
    status: "active",
    kind: "contact",
    hasClaimedIdentity: true,
    createdAt: "2022-01-15T10:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  },

  // ==========================================
  // COACHES (from team roster)
  // ==========================================
  {
    id: "coach_marco",
    firstName: "Marco",
    lastName: "Weber",
    email: "marco.weber@sfb.de",
    phone: "+49 170 1234567",
    dateOfBirth: "1985-06-15",
    gender: "male",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2018-03-15T10:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "coach_katja",
    firstName: "Katja",
    lastName: "Müller",
    email: "katja.mueller@sfb.de",
    phone: "+49 171 2345678",
    dateOfBirth: "1988-09-20",
    gender: "female",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2019-06-01T10:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  },
  {
    id: "thomas_mueller",
    firstName: "Thomas",
    lastName: "Müller",
    email: "thomas.mueller@sfb.de",
    phone: "+49 177 8901234",
    dateOfBirth: "1975-03-10",
    gender: "male",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2015-01-01T10:00:00Z",
    updatedAt: "2024-01-10T09:00:00Z"
  },
  // ==========================================
  // DEMO PLAYER PERSONAS (U12)
  // ==========================================
  // Note: patrick_steuble = person_patrick, max_schneider = person_max (already above)
  {
    id: "noah_hoffmann",
    firstName: "Noah",
    lastName: "Hoffmann",
    dateOfBirth: "2013-11-15",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-02-20T10:00:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },
  {
    id: "sophie_klein",
    firstName: "Sophie",
    lastName: "Klein",
    dateOfBirth: "2014-03-22",
    gender: "female",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: false,
    createdAt: "2022-08-01T10:00:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },

  // ==========================================
  // DEMO PLAYER PERSONAS (Volleyball U16)
  // ==========================================
  // Note: flurina_schneider = person_flurina (already above)
  {
    id: "anna_bauer",
    firstName: "Anna",
    lastName: "Bauer",
    email: "anna.bauer@example.com",
    dateOfBirth: "2009-11-08",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: true,
    createdAt: "2022-06-15T10:00:00Z",
    updatedAt: "2024-01-05T16:00:00Z"
  },

  // ==========================================
  // FICTIONAL U12 PLAYERS
  // ==========================================
  {
    id: "player_u12_luca",
    firstName: "Luca",
    lastName: "Braun",
    dateOfBirth: "2014-02-18",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_u12_ben",
    firstName: "Ben",
    lastName: "Richter",
    dateOfBirth: "2014-06-07",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_u12_finn",
    firstName: "Finn",
    lastName: "Hartmann",
    dateOfBirth: "2013-12-03",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_u12_leo",
    firstName: "Leo",
    lastName: "Zimmermann",
    dateOfBirth: "2015-01-25",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_u12_kai",
    firstName: "Kai",
    lastName: "Neumann",
    dateOfBirth: "2014-09-14",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_u12_paul",
    firstName: "Paul",
    lastName: "Werner",
    dateOfBirth: "2013-10-30",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2023-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },

  // ==========================================
  // FICTIONAL 1. HERREN PLAYERS
  // ==========================================
  {
    id: "player_h1_mario",
    firstName: "Mario",
    lastName: "Bauer",
    dateOfBirth: "1995-04-12",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_stefan",
    firstName: "Stefan",
    lastName: "Krause",
    dateOfBirth: "1992-08-25",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_michael",
    firstName: "Michael",
    lastName: "Fuchs",
    dateOfBirth: "1998-03-05",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_jan",
    firstName: "Jan",
    lastName: "Schröder",
    dateOfBirth: "2001-11-18",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_felix",
    firstName: "Felix",
    lastName: "Vogel",
    dateOfBirth: "1999-07-22",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_tobias",
    firstName: "Tobias",
    lastName: "Lang",
    dateOfBirth: "1993-02-14",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_lukas",
    firstName: "Lukas",
    lastName: "Weiß",
    dateOfBirth: "2003-05-09",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_david",
    firstName: "David",
    lastName: "Schwarz",
    dateOfBirth: "1997-09-30",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_simon",
    firstName: "Simon",
    lastName: "König",
    dateOfBirth: "2000-01-15",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_h1_oliver",
    firstName: "Oliver",
    lastName: "Meyer",
    dateOfBirth: "1990-06-28",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },

  // ==========================================
  // FICTIONAL VOLLEYBALL PLAYERS
  // ==========================================
  {
    id: "player_vb_mia",
    firstName: "Mia",
    lastName: "Fischer",
    dateOfBirth: "2011-03-15",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_vb_lea",
    firstName: "Lea",
    lastName: "Schulz",
    dateOfBirth: "2010-08-22",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "player_vb_nora",
    firstName: "Nora",
    lastName: "Wagner",
    dateOfBirth: "2012-01-07",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },

  // ==========================================
  // CHAT PARTICIPANTS (linked from mockChats.ts)
  // ==========================================
  {
    id: "bernd",
    firstName: "Bernd",
    lastName: "Hoffmann",
    email: "bernd.hoffmann@sfb.de",
    phone: "+49 176 3334455",
    dateOfBirth: "1975-04-12",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: true,
    createdAt: "2019-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "sandra",
    firstName: "Sandra",
    lastName: "Fischer",
    email: "sandra.fischer@sfb.de",
    phone: "+49 177 6667788",
    dateOfBirth: "1982-09-25",
    gender: "female",
    status: "active",
    kind: "member",
    avatarUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=100&h=100&fit=crop&crop=face",
    hasClaimedIdentity: true,
    createdAt: "2020-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "claudia",
    firstName: "Claudia",
    lastName: "Weber",
    email: "claudia.weber@example.com",
    phone: "+49 178 1112233",
    dateOfBirth: "1979-06-18",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: true,
    createdAt: "2021-07-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "petra",
    firstName: "Petra",
    lastName: "Müller",
    email: "petra.mueller@example.com",
    phone: "+49 179 4445566",
    dateOfBirth: "1981-03-07",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: true,
    createdAt: "2021-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "andrea",
    firstName: "Andrea",
    lastName: "Meier",
    email: "andrea.meier@example.com",
    phone: "+49 163 7778899",
    dateOfBirth: "1983-11-30",
    gender: "female",
    status: "active",
    kind: "contact",
    hasClaimedIdentity: true,
    createdAt: "2022-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "thomas",
    firstName: "Thomas",
    lastName: "Bauer",
    email: "thomas.bauer@example.com",
    phone: "+49 162 9990011",
    dateOfBirth: "1980-08-14",
    gender: "male",
    status: "active",
    kind: "contact",
    hasClaimedIdentity: false,
    createdAt: "2022-08-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "emma",
    firstName: "Emma",
    lastName: "Meier",
    dateOfBirth: "2011-05-22",
    gender: "female",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-09-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  },
  {
    id: "leon",
    firstName: "Leon",
    lastName: "Bauer",
    dateOfBirth: "2012-02-17",
    gender: "male",
    status: "active",
    kind: "member",
    hasClaimedIdentity: false,
    createdAt: "2022-08-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z"
  }
];

// ==========================================
// MEMBERSHIPS
// ==========================================
export const MOCK_MEMBERSHIPS: Membership[] = [
  // Patrick - Admin & Player
  {
    id: "mem_patrick_admin",
    personId: "person_patrick",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    role: "admin",
    status: "active",
    joinedAt: "2020-01-15T10:00:00Z"
  },
  {
    id: "mem_patrick_player",
    personId: "person_patrick",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_herren1",
    role: "player",
    status: "active",
    joinedAt: "2020-01-15T10:00:00Z"
  },
  // Lena - Player & Guardian
  {
    id: "mem_lena_player",
    personId: "person_lena",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_damen",
    role: "player",
    status: "active",
    joinedAt: "2021-03-10T09:00:00Z"
  },
  {
    id: "mem_lena_guardian",
    personId: "person_lena",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    role: "guardian_contact",
    status: "active",
    joinedAt: "2022-08-01T10:00:00Z"
  },
  // Max - U12 Player
  {
    id: "mem_max_player",
    personId: "person_max",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "player",
    status: "active",
    joinedAt: "2022-08-01T10:00:00Z"
  },
  // Flurina - U12 Player
  {
    id: "mem_flurina_player",
    personId: "person_flurina",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "player",
    status: "active",
    joinedAt: "2023-02-15T10:00:00Z"
  },
  // Anna - U12 Player (NO GUARDIAN LINK!)
  // This demonstrates a minor member without any parent/guardian established
  {
    id: "mem_anna_player",
    personId: "person_anna",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "player",
    status: "active",
    joinedAt: "2023-06-01T10:00:00Z"
  },
  // Tim - U15 Player (pending)
  {
    id: "mem_tim_player",
    personId: "person_tim",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u15",
    role: "player",
    status: "pending",
    joinedAt: "2023-09-01T10:00:00Z"
  },
  // Markus - Guardian contact
  {
    id: "mem_markus_guardian",
    personId: "person_markus",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    role: "guardian_contact",
    status: "active",
    joinedAt: "2023-09-01T10:00:00Z"
  },
  // Klaus - Coach
  {
    id: "mem_klaus_coach",
    personId: "person_klaus",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "coach",
    status: "active",
    joinedAt: "2022-01-15T10:00:00Z"
  },
  // Fabio - Club membership only (NO department/team yet = inactive)
  // This demonstrates a member who has club membership but hasn't been assigned to a department
  {
    id: "mem_fabio_club",
    personId: "person_fabio",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    role: "player",
    status: "active",
    joinedAt: "2024-01-05T10:00:00Z"
  },

  // ==========================================
  // COACHES
  // ==========================================
  {
    id: "mem_marco_coach",
    personId: "coach_marco",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "coach",
    status: "active",
    joinedAt: "2018-03-15T10:00:00Z"
  },
  {
    id: "mem_katja_coach",
    personId: "coach_katja",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_volleyball",
    teamId: "team_volleyball_u16",
    role: "coach",
    status: "active",
    joinedAt: "2019-06-01T10:00:00Z"
  },
  {
    id: "mem_thomas_coach",
    personId: "thomas_mueller",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_herren1",
    role: "coach",
    status: "active",
    joinedAt: "2015-01-01T10:00:00Z"
  },
  {
    id: "mem_thomas_admin",
    personId: "thomas_mueller",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    role: "admin",
    status: "active",
    joinedAt: "2015-01-01T10:00:00Z"
  },
  // ==========================================
  // DEMO PLAYER PERSONAS
  // ==========================================
  // Note: memberships for patrick_steuble, max_schneider, flurina_schneider
  //       are already covered by mem_patrick_player, mem_max_player, mem_flurina_player above
  {
    id: "mem_noah_hoffmann",
    personId: "noah_hoffmann",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "player",
    status: "active",
    joinedAt: "2023-02-20T10:00:00Z"
  },
  {
    id: "mem_sophie_klein",
    personId: "sophie_klein",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    role: "player",
    status: "active",
    joinedAt: "2022-08-01T10:00:00Z"
  },
  {
    id: "mem_anna_bauer",
    personId: "anna_bauer",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_volleyball",
    teamId: "team_volleyball_u16",
    role: "player",
    status: "active",
    joinedAt: "2022-06-15T10:00:00Z"
  },

  // ==========================================
  // FICTIONAL U12 PLAYERS
  // ==========================================
  { id: "mem_u12_luca", personId: "player_u12_luca", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },
  { id: "mem_u12_ben", personId: "player_u12_ben", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },
  { id: "mem_u12_finn", personId: "player_u12_finn", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },
  { id: "mem_u12_leo", personId: "player_u12_leo", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },
  { id: "mem_u12_kai", personId: "player_u12_kai", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },
  { id: "mem_u12_paul", personId: "player_u12_paul", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2023-09-01T10:00:00Z" },

  // ==========================================
  // FICTIONAL 1. HERREN PLAYERS
  // ==========================================
  { id: "mem_h1_mario", personId: "player_h1_mario", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_stefan", personId: "player_h1_stefan", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_michael", personId: "player_h1_michael", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_jan", personId: "player_h1_jan", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_felix", personId: "player_h1_felix", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_tobias", personId: "player_h1_tobias", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_lukas", personId: "player_h1_lukas", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_david", personId: "player_h1_david", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_simon", personId: "player_h1_simon", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },
  { id: "mem_h1_oliver", personId: "player_h1_oliver", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_herren1", role: "player", status: "active", joinedAt: "2022-07-01T10:00:00Z" },

  // ==========================================
  // FICTIONAL VOLLEYBALL PLAYERS
  // ==========================================
  { id: "mem_vb_mia", personId: "player_vb_mia", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_volleyball", teamId: "team_volleyball_u16", role: "player", status: "active", joinedAt: "2022-09-01T10:00:00Z" },
  { id: "mem_vb_lea", personId: "player_vb_lea", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_volleyball", teamId: "team_volleyball_u16", role: "player", status: "active", joinedAt: "2022-09-01T10:00:00Z" },
  { id: "mem_vb_nora", personId: "player_vb_nora", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_volleyball", teamId: "team_volleyball_u16", role: "player", status: "active", joinedAt: "2022-09-01T10:00:00Z" },

  // ==========================================
  // CHAT PARTICIPANTS
  // ==========================================
  { id: "mem_bernd_trainer", personId: "bernd", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_frauen_ue40", role: "coach", status: "active", joinedAt: "2019-07-01T10:00:00Z" },
  { id: "mem_sandra_trainer", personId: "sandra", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fitness", teamId: "team_fitness", role: "coach", status: "active", joinedAt: "2020-01-01T10:00:00Z" },
  { id: "mem_claudia_player", personId: "claudia", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_frauen_ue40", role: "player", status: "active", joinedAt: "2021-07-01T10:00:00Z" },
  { id: "mem_petra_player", personId: "petra", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fitness", teamId: "team_fitness", role: "player", status: "active", joinedAt: "2021-01-01T10:00:00Z" },
  { id: "mem_andrea_contact", personId: "andrea", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", role: "guardian_contact", status: "active", joinedAt: "2022-09-01T10:00:00Z" },
  { id: "mem_thomas_contact", personId: "thomas", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", role: "guardian_contact", status: "active", joinedAt: "2022-08-01T10:00:00Z" },
  { id: "mem_emma_player", personId: "emma", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_volleyball", teamId: "team_volleyball_u16", role: "player", status: "active", joinedAt: "2022-09-01T10:00:00Z" },
  { id: "mem_leon_player", personId: "leon", orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I", departmentId: "dept_fussball", teamId: "team_u12", role: "player", status: "active", joinedAt: "2022-08-01T10:00:00Z" }
];

// ==========================================
// GUARDIAN LINKS
// ==========================================
export const MOCK_GUARDIAN_LINKS: GuardianLink[] = [
  // Lena is guardian of Max (active)
  {
    id: "gl_lena_max",
    guardianPersonId: "person_lena",
    childPersonId: "person_max",
    status: "active",
    permissions: {
      manageRsvp: true,
      viewComms: true,
      payFees: true,
      editProfile: true
    },
    verifiedAt: "2022-08-05T10:00:00Z",
    createdAt: "2022-08-01T10:00:00Z"
  },
  // Lena is guardian of Flurina (active)
  {
    id: "gl_lena_flurina",
    guardianPersonId: "person_lena",
    childPersonId: "person_flurina",
    status: "active",
    permissions: {
      manageRsvp: true,
      viewComms: true,
      payFees: true,
      editProfile: true
    },
    verifiedAt: "2023-02-20T10:00:00Z",
    createdAt: "2023-02-15T10:00:00Z"
  },
  // Markus is guardian of Tim (pending verification)
  {
    id: "gl_markus_tim",
    guardianPersonId: "person_markus",
    childPersonId: "person_tim",
    status: "pending_verification",
    permissions: {
      manageRsvp: true,
      viewComms: true,
      payFees: true,
      editProfile: false
    },
    createdAt: "2023-09-01T10:00:00Z"
  },
  // Sandra is guardian of Tim (pending verification)
  {
    id: "gl_sandra_tim",
    guardianPersonId: "person_sandra",
    childPersonId: "person_tim",
    status: "pending_verification",
    permissions: {
      manageRsvp: true,
      viewComms: false,
      payFees: false,
      editProfile: false
    },
    createdAt: "2023-09-05T10:00:00Z"
  }
];

// ==========================================
// REGISTRATION INTENTS
// ==========================================
export const MOCK_REGISTRATION_INTENTS: RegistrationIntent[] = [
  // Tim's registration (pending admin review)
  {
    id: "intent_tim",
    type: "public_registration",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u15",
    target: "child",
    requestedRole: "player",
    prefill: {
      firstName: "Tim",
      lastName: "Weber"
    },
    approvalPolicy: "admin_review",
    paymentPolicy: "none",
    status: "completed",
    createdPersonId: "person_tim",
    createdMembershipId: "mem_tim_player",
    createdGuardianLinkId: "gl_markus_tim",
    createdAt: "2023-09-01T08:00:00Z",
    updatedAt: "2023-09-01T10:00:00Z",
    completedAt: "2023-09-01T10:00:00Z"
  },
  // Sandra invite (sent but not claimed)
  {
    id: "intent_sandra",
    type: "invite",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    target: "child",
    requestedRole: "guardian_contact",
    prefill: {
      email: "sandra.weber@example.com",
      firstName: "Sandra",
      lastName: "Weber",
      childPersonId: "person_tim"
    },
    approvalPolicy: "auto",
    paymentPolicy: "none",
    status: "sent",
    createdPersonId: "person_sandra",
    createdAt: "2023-09-05T10:00:00Z",
    updatedAt: "2023-09-05T10:00:00Z",
    expiresAt: "2024-03-05T10:00:00Z"
  }
];

// ==========================================
// INVITES
// ==========================================
export const MOCK_INVITES: Invite[] = [
  {
    id: "inv_sandra",
    intentId: "intent_sandra",
    channel: "email",
    sentTo: "sandra.weber@example.com",
    sentAt: "2023-09-05T10:00:00Z",
    status: "sent",
    claimUrl: "/join/claim/inv_sandra"
  }
];

// ==========================================
// REGISTRATION FORMS
// ==========================================
export const MOCK_REGISTRATION_FORMS: RegistrationForm[] = [
  {
    id: "form_u12_player",
    name: "U12 Junioren Anmeldung",
    description: "Anmeldeformular für neue Spieler der U12 Mannschaft",
    orgId: "00ES8GN8N400008VVV0AG08LVUPGND5I",
    departmentId: "dept_fussball",
    teamId: "team_u12",
    allowedTargets: ["self", "child"],
    allowedRoles: ["player"],
    approvalPolicy: "admin_review",
    paymentPolicy: "none",
    guardianRequiredUnderAge: true,
    minAgeForGuardian: 18,
    questions: [
      {
        id: "q1",
        type: "text",
        label: "Frühere Vereine",
        helpText: "Bitte geben Sie alle bisherigen Vereine an",
        required: false,
        scope: "player"
      },
      {
        id: "q2",
        type: "single_choice",
        label: "Bevorzugte Position",
        required: true,
        scope: "player",
        options: ["Torwart", "Verteidiger", "Mittelfeld", "Stürmer"]
      },
      {
        id: "q3",
        type: "checkbox",
        label: "Ich habe die Vereinssatzung gelesen und akzeptiere diese",
        required: true,
        scope: "guardian"
      }
    ],
    isPublished: true,
    publicUrl: "/join/public/form_u12_player",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-15T10:00:00Z"
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function isMinor(person: Person): boolean {
  if (!person.dateOfBirth) return false;
  const birthDate = new Date(person.dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 < 18;
  }
  return age < 18;
}

export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getFullName(person: Person): string {
  return `${person.firstName} ${person.lastName}`;
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    player: "Spieler",
    coach: "Trainer",
    admin: "Administrator",
    guardian_contact: "Erziehungsberechtigter",
    volunteer: "Helfer"
  };
  return labels[role] || role;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: "Aktiv",
    pending: "Ausstehend",
    blocked: "Gesperrt",
    expired: "Abgelaufen",
    inactive: "Inaktiv",
    pending_verification: "Verifizierung ausstehend",
    revoked: "Widerrufen"
  };
  return labels[status] || status;
}

export function getIntentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    created: "Erstellt",
    sent: "Gesendet",
    claimed: "Beansprucht",
    completed: "Abgeschlossen",
    expired: "Abgelaufen",
    cancelled: "Abgebrochen"
  };
  return labels[status] || status;
}

export function getInviteStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    sent: "Gesendet",
    opened: "Geöffnet",
    accepted: "Angenommen",
    expired: "Abgelaufen"
  };
  return labels[status] || status;
}
