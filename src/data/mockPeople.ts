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
  id: "org_sfb",
  name: "Sportfreunde Burkhardsfelden"
};

export const MOCK_DEPARTMENTS = [
  { id: "dept_fussball", name: "Fußball", orgId: "org_sfb" },
  { id: "dept_fitness", name: "Fitness", orgId: "org_sfb" },
  { id: "dept_turnen", name: "Turnen", orgId: "org_sfb" }
];

export const MOCK_TEAMS_PEOPLE = [
  { id: "team_u12", name: "U12 Junioren", departmentId: "dept_fussball" },
  { id: "team_u15", name: "U15 Junioren", departmentId: "dept_fussball" },
  { id: "team_herren1", name: "Herren 1. Mannschaft", departmentId: "dept_fussball" },
  { id: "team_damen", name: "Damen", departmentId: "dept_fussball" }
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
    orgId: "org_sfb",
    role: "admin",
    status: "active",
    joinedAt: "2020-01-15T10:00:00Z"
  },
  {
    id: "mem_patrick_player",
    personId: "person_patrick",
    orgId: "org_sfb",
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
    orgId: "org_sfb",
    departmentId: "dept_fussball",
    teamId: "team_damen",
    role: "player",
    status: "active",
    joinedAt: "2021-03-10T09:00:00Z"
  },
  {
    id: "mem_lena_guardian",
    personId: "person_lena",
    orgId: "org_sfb",
    role: "guardian_contact",
    status: "active",
    joinedAt: "2022-08-01T10:00:00Z"
  },
  // Max - U12 Player
  {
    id: "mem_max_player",
    personId: "person_max",
    orgId: "org_sfb",
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
    orgId: "org_sfb",
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
    orgId: "org_sfb",
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
    orgId: "org_sfb",
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
    orgId: "org_sfb",
    role: "guardian_contact",
    status: "active",
    joinedAt: "2023-09-01T10:00:00Z"
  },
  // Klaus - Coach
  {
    id: "mem_klaus_coach",
    personId: "person_klaus",
    orgId: "org_sfb",
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
    orgId: "org_sfb",
    // No departmentId or teamId = member is "inactive" until assigned
    role: "player",
    status: "active",
    joinedAt: "2024-01-05T10:00:00Z"
  }
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
    orgId: "org_sfb",
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
    orgId: "org_sfb",
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
    orgId: "org_sfb",
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
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
