/**
 * People Context - State Management
 * 
 * Provides centralized state management for:
 * - Persons (members + contacts)
 * - Memberships
 * - Guardian Links
 * - Registration Intents
 * - Invites
 * - Registration Forms
 * 
 * Data is persisted to localStorage for demo purposes.
 */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type {
  Person,
  Membership,
  GuardianLink,
  RegistrationIntent,
  Invite,
  RegistrationForm,
  CreatePersonData,
  CreateMembershipData,
  CreateGuardianLinkData,
  CreateInviteData,
  CreateRegistrationFormData,
  PersonWithDetails
} from "../types/people";
import {
  MOCK_PERSONS,
  MOCK_MEMBERSHIPS,
  MOCK_GUARDIAN_LINKS,
  MOCK_REGISTRATION_INTENTS,
  MOCK_INVITES,
  MOCK_REGISTRATION_FORMS,
  MOCK_ORG,
  MOCK_DEPARTMENTS,
  MOCK_TEAMS_PEOPLE,
  DEFAULT_GUARDIAN_PERMISSIONS,
  generateId
} from "../data/mockPeople";

// ==========================================
// CONTEXT TYPES
// ==========================================
interface PeopleState {
  persons: Person[];
  memberships: Membership[];
  guardianLinks: GuardianLink[];
  intents: RegistrationIntent[];
  invites: Invite[];
  forms: RegistrationForm[];
}

interface PeopleContextType extends PeopleState {
  // Organization data
  org: typeof MOCK_ORG;
  departments: typeof MOCK_DEPARTMENTS;
  teams: typeof MOCK_TEAMS_PEOPLE;
  
  // Person operations
  addPerson: (data: CreatePersonData) => Person;
  updatePerson: (id: string, data: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPersonById: (id: string) => Person | undefined;
  getPersonWithDetails: (id: string) => PersonWithDetails | undefined;
  getMembers: () => Person[];
  getContacts: () => Person[];
  
  // Membership operations
  addMembership: (data: CreateMembershipData) => Membership;
  updateMembership: (id: string, data: Partial<Membership>) => void;
  deleteMembership: (id: string) => void;
  getMembershipsByPerson: (personId: string) => Membership[];
  getMembershipsByTeam: (teamId: string) => Membership[];
  
  // Guardian link operations
  addGuardianLink: (data: CreateGuardianLinkData) => GuardianLink;
  updateGuardianLink: (id: string, data: Partial<GuardianLink>) => void;
  deleteGuardianLink: (id: string) => void;
  getGuardiansByChild: (childId: string) => Array<{ guardian: Person; link: GuardianLink }>;
  getChildrenByGuardian: (guardianId: string) => Array<{ child: Person; link: GuardianLink }>;
  
  // Intent operations
  createIntent: (data: Partial<RegistrationIntent>) => RegistrationIntent;
  updateIntent: (id: string, data: Partial<RegistrationIntent>) => void;
  getIntentById: (id: string) => RegistrationIntent | undefined;
  
  // Invite operations
  sendInvite: (data: CreateInviteData) => { intent: RegistrationIntent; invite: Invite };
  updateInvite: (id: string, data: Partial<Invite>) => void;
  getInvitesByPerson: (personId: string) => Invite[];
  getInviteByIntent: (intentId: string) => Invite | undefined;
  
  // Form operations
  addForm: (data: CreateRegistrationFormData) => RegistrationForm;
  updateForm: (id: string, data: Partial<RegistrationForm>) => void;
  deleteForm: (id: string) => void;
  getFormById: (id: string) => RegistrationForm | undefined;
  
  // Registration flow
  completeRegistration: (intentId: string, personData: CreatePersonData, guardianData?: CreatePersonData) => void;
  
  // Utility
  resetToMockData: () => void;
}

const STORAGE_KEY = "club_people_data";

// ==========================================
// CONTEXT
// ==========================================
const PeopleContext = createContext<PeopleContextType | undefined>(undefined);

// ==========================================
// PROVIDER
// ==========================================
export function PeopleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PeopleState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to mock data
      }
    }
    return {
      persons: MOCK_PERSONS,
      memberships: MOCK_MEMBERSHIPS,
      guardianLinks: MOCK_GUARDIAN_LINKS,
      intents: MOCK_REGISTRATION_INTENTS,
      invites: MOCK_INVITES,
      forms: MOCK_REGISTRATION_FORMS
    };
  });

  // Persist to localStorage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // ==========================================
  // PERSON OPERATIONS
  // ==========================================
  const addPerson = useCallback((data: CreatePersonData): Person => {
    const now = new Date().toISOString();
    const person: Person = {
      id: generateId("person"),
      ...data,
      status: "active",
      hasClaimedIdentity: false,
      createdAt: now,
      updatedAt: now
    };
    setState(prev => ({ ...prev, persons: [...prev.persons, person] }));
    return person;
  }, []);

  const updatePerson = useCallback((id: string, data: Partial<Person>) => {
    setState(prev => ({
      ...prev,
      persons: prev.persons.map(p => 
        p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
      )
    }));
  }, []);

  const deletePerson = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      persons: prev.persons.filter(p => p.id !== id),
      memberships: prev.memberships.filter(m => m.personId !== id),
      guardianLinks: prev.guardianLinks.filter(gl => 
        gl.guardianPersonId !== id && gl.childPersonId !== id
      )
    }));
  }, []);

  const getPersonById = useCallback((id: string): Person | undefined => {
    return state.persons.find(p => p.id === id);
  }, [state.persons]);

  const getPersonWithDetails = useCallback((id: string): PersonWithDetails | undefined => {
    const person = state.persons.find(p => p.id === id);
    if (!person) return undefined;
    
    const memberships = state.memberships.filter(m => m.personId === id);
    const guardianLinks = state.guardianLinks.filter(gl => gl.guardianPersonId === id);
    const childLinks = state.guardianLinks.filter(gl => gl.childPersonId === id);
    
    // Get invites for this person
    const personIntents = state.intents.filter(i => 
      i.createdPersonId === id || i.prefill.email === person.email
    );
    const intentIds = personIntents.map(i => i.id);
    const pendingInvites = state.invites.filter(inv => 
      intentIds.includes(inv.intentId) && inv.status !== "accepted"
    );

    return {
      ...person,
      memberships,
      guardianLinks,
      childLinks,
      pendingInvites
    };
  }, [state]);

  const getMembers = useCallback((): Person[] => {
    return state.persons.filter(p => p.kind === "member");
  }, [state.persons]);

  const getContacts = useCallback((): Person[] => {
    return state.persons.filter(p => p.kind === "contact");
  }, [state.persons]);

  // ==========================================
  // MEMBERSHIP OPERATIONS
  // ==========================================
  const addMembership = useCallback((data: CreateMembershipData): Membership => {
    const membership: Membership = {
      id: generateId("mem"),
      ...data,
      status: data.status || "pending",
      joinedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, memberships: [...prev.memberships, membership] }));
    return membership;
  }, []);

  const updateMembership = useCallback((id: string, data: Partial<Membership>) => {
    setState(prev => ({
      ...prev,
      memberships: prev.memberships.map(m => m.id === id ? { ...m, ...data } : m)
    }));
  }, []);

  const deleteMembership = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      memberships: prev.memberships.filter(m => m.id !== id)
    }));
  }, []);

  const getMembershipsByPerson = useCallback((personId: string): Membership[] => {
    return state.memberships.filter(m => m.personId === personId);
  }, [state.memberships]);

  const getMembershipsByTeam = useCallback((teamId: string): Membership[] => {
    return state.memberships.filter(m => m.teamId === teamId);
  }, [state.memberships]);

  // ==========================================
  // GUARDIAN LINK OPERATIONS
  // ==========================================
  const addGuardianLink = useCallback((data: CreateGuardianLinkData): GuardianLink => {
    const link: GuardianLink = {
      id: generateId("gl"),
      guardianPersonId: data.guardianPersonId,
      childPersonId: data.childPersonId,
      status: "pending_verification",
      permissions: { ...DEFAULT_GUARDIAN_PERMISSIONS, ...data.permissions },
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, guardianLinks: [...prev.guardianLinks, link] }));
    return link;
  }, []);

  const updateGuardianLink = useCallback((id: string, data: Partial<GuardianLink>) => {
    setState(prev => ({
      ...prev,
      guardianLinks: prev.guardianLinks.map(gl => gl.id === id ? { ...gl, ...data } : gl)
    }));
  }, []);

  const deleteGuardianLink = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      guardianLinks: prev.guardianLinks.filter(gl => gl.id !== id)
    }));
  }, []);

  const getGuardiansByChild = useCallback((childId: string) => {
    return state.guardianLinks
      .filter(gl => gl.childPersonId === childId)
      .map(link => ({
        guardian: state.persons.find(p => p.id === link.guardianPersonId)!,
        link
      }))
      .filter(item => item.guardian);
  }, [state]);

  const getChildrenByGuardian = useCallback((guardianId: string) => {
    return state.guardianLinks
      .filter(gl => gl.guardianPersonId === guardianId)
      .map(link => ({
        child: state.persons.find(p => p.id === link.childPersonId)!,
        link
      }))
      .filter(item => item.child);
  }, [state]);

  // ==========================================
  // INTENT OPERATIONS
  // ==========================================
  const createIntent = useCallback((data: Partial<RegistrationIntent>): RegistrationIntent => {
    const now = new Date().toISOString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry
    
    const intent: RegistrationIntent = {
      id: generateId("intent"),
      type: data.type || "invite",
      orgId: data.orgId || MOCK_ORG.id,
      departmentId: data.departmentId,
      teamId: data.teamId,
      formId: data.formId,
      target: data.target || "self",
      requestedRole: data.requestedRole || "player",
      prefill: data.prefill || {},
      approvalPolicy: data.approvalPolicy || "auto",
      paymentPolicy: data.paymentPolicy || "none",
      status: "created",
      createdAt: now,
      updatedAt: now,
      expiresAt: expiresAt.toISOString()
    };
    setState(prev => ({ ...prev, intents: [...prev.intents, intent] }));
    return intent;
  }, []);

  const updateIntent = useCallback((id: string, data: Partial<RegistrationIntent>) => {
    setState(prev => ({
      ...prev,
      intents: prev.intents.map(i => 
        i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i
      )
    }));
  }, []);

  const getIntentById = useCallback((id: string): RegistrationIntent | undefined => {
    return state.intents.find(i => i.id === id);
  }, [state.intents]);

  // ==========================================
  // INVITE OPERATIONS
  // ==========================================
  const sendInvite = useCallback((data: CreateInviteData): { intent: RegistrationIntent; invite: Invite } => {
    // Get or create person
    let person = state.persons.find(p => p.id === data.personId);
    if (!person) {
      throw new Error("Person not found");
    }

    // Create intent
    const intent = createIntent({
      type: "invite",
      orgId: data.orgId,
      departmentId: data.departmentId,
      teamId: data.teamId,
      target: data.target,
      requestedRole: data.role,
      prefill: {
        email: person.email,
        firstName: person.firstName,
        lastName: person.lastName,
        childPersonId: data.childPersonId
      },
      approvalPolicy: "auto",
      paymentPolicy: "none"
    });

    // Create invite
    const invite: Invite = {
      id: generateId("inv"),
      intentId: intent.id,
      channel: person.email ? "email" : "link",
      sentTo: person.email || "link",
      sentAt: new Date().toISOString(),
      status: "sent",
      claimUrl: `/join/claim/${intent.id}`
    };

    // Update intent status
    updateIntent(intent.id, { 
      status: "sent",
      createdPersonId: person.id 
    });

    setState(prev => ({ ...prev, invites: [...prev.invites, invite] }));
    return { intent, invite };
  }, [state.persons, createIntent, updateIntent]);

  const updateInvite = useCallback((id: string, data: Partial<Invite>) => {
    setState(prev => ({
      ...prev,
      invites: prev.invites.map(i => i.id === id ? { ...i, ...data } : i)
    }));
  }, []);

  const getInvitesByPerson = useCallback((personId: string): Invite[] => {
    const person = state.persons.find(p => p.id === personId);
    if (!person) return [];
    
    const personIntents = state.intents.filter(i => 
      i.createdPersonId === personId || i.prefill.email === person.email
    );
    const intentIds = personIntents.map(i => i.id);
    return state.invites.filter(inv => intentIds.includes(inv.intentId));
  }, [state]);

  const getInviteByIntent = useCallback((intentId: string): Invite | undefined => {
    return state.invites.find(i => i.intentId === intentId);
  }, [state.invites]);

  // ==========================================
  // FORM OPERATIONS
  // ==========================================
  const addForm = useCallback((data: CreateRegistrationFormData): RegistrationForm => {
    const now = new Date().toISOString();
    const form: RegistrationForm = {
      id: generateId("form"),
      ...data,
      minAgeForGuardian: 18,
      isPublished: false,
      createdAt: now,
      updatedAt: now
    };
    setState(prev => ({ ...prev, forms: [...prev.forms, form] }));
    return form;
  }, []);

  const updateForm = useCallback((id: string, data: Partial<RegistrationForm>) => {
    setState(prev => ({
      ...prev,
      forms: prev.forms.map(f => 
        f.id === id ? { ...f, ...data, updatedAt: new Date().toISOString() } : f
      )
    }));
  }, []);

  const deleteForm = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      forms: prev.forms.filter(f => f.id !== id)
    }));
  }, []);

  const getFormById = useCallback((id: string): RegistrationForm | undefined => {
    return state.forms.find(f => f.id === id);
  }, [state.forms]);

  // ==========================================
  // REGISTRATION FLOW
  // ==========================================
  const completeRegistration = useCallback((
    intentId: string, 
    personData: CreatePersonData,
    guardianData?: CreatePersonData
  ) => {
    const intent = state.intents.find(i => i.id === intentId);
    if (!intent) return;

    const now = new Date().toISOString();
    let createdPersonId: string | undefined;
    let createdMembershipId: string | undefined;
    let createdGuardianLinkId: string | undefined;

    // Create person (child or self)
    const person = addPerson(personData);
    createdPersonId = person.id;

    // Create membership
    const membership = addMembership({
      personId: person.id,
      orgId: intent.orgId,
      departmentId: intent.departmentId,
      teamId: intent.teamId,
      role: intent.requestedRole,
      status: intent.approvalPolicy === "auto" ? "active" : "pending"
    });
    createdMembershipId = membership.id;

    // If guardian data provided, create guardian and link
    if (guardianData && intent.target === "child") {
      const guardian = addPerson({ ...guardianData, kind: "contact" });
      const link = addGuardianLink({
        guardianPersonId: guardian.id,
        childPersonId: person.id
      });
      createdGuardianLinkId = link.id;

      // Create guardian membership
      addMembership({
        personId: guardian.id,
        orgId: intent.orgId,
        role: "guardian_contact",
        status: "active"
      });
    }

    // Update intent
    updateIntent(intentId, {
      status: "completed",
      createdPersonId,
      createdMembershipId,
      createdGuardianLinkId,
      completedAt: now
    });

    // Update invite if exists
    const invite = state.invites.find(i => i.intentId === intentId);
    if (invite) {
      updateInvite(invite.id, { status: "accepted", acceptedAt: now });
    }
  }, [state, addPerson, addMembership, addGuardianLink, updateIntent, updateInvite]);

  // ==========================================
  // UTILITY
  // ==========================================
  const resetToMockData = useCallback(() => {
    setState({
      persons: MOCK_PERSONS,
      memberships: MOCK_MEMBERSHIPS,
      guardianLinks: MOCK_GUARDIAN_LINKS,
      intents: MOCK_REGISTRATION_INTENTS,
      invites: MOCK_INVITES,
      forms: MOCK_REGISTRATION_FORMS
    });
  }, []);

  // ==========================================
  // CONTEXT VALUE
  // ==========================================
  const value: PeopleContextType = {
    ...state,
    org: MOCK_ORG,
    departments: MOCK_DEPARTMENTS,
    teams: MOCK_TEAMS_PEOPLE,
    addPerson,
    updatePerson,
    deletePerson,
    getPersonById,
    getPersonWithDetails,
    getMembers,
    getContacts,
    addMembership,
    updateMembership,
    deleteMembership,
    getMembershipsByPerson,
    getMembershipsByTeam,
    addGuardianLink,
    updateGuardianLink,
    deleteGuardianLink,
    getGuardiansByChild,
    getChildrenByGuardian,
    createIntent,
    updateIntent,
    getIntentById,
    sendInvite,
    updateInvite,
    getInvitesByPerson,
    getInviteByIntent,
    addForm,
    updateForm,
    deleteForm,
    getFormById,
    completeRegistration,
    resetToMockData
  };

  return (
    <PeopleContext.Provider value={value}>
      {children}
    </PeopleContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================
export function usePeople() {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error("usePeople must be used within a PeopleProvider");
  }
  return context;
}
