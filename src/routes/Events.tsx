import { useMemo, useState } from "react";
import { 
  Plus, Calendar, MapPin, Users, Clock, ChevronRight, Search,
  X, Check, Edit2, Trash2, Eye, Shield, RefreshCw, UserPlus
} from "lucide-react";
import { Card, Button, Select, Badge, Input } from "../components/ui";
import { mockEvents, mockEventRegistrations } from "../data/mockDfbnet";
import { mockTeams } from "../data/mockTeams";
// Note: mockDepartments removed - department scope is a future extension
import { mockPersons } from "../data/mockPersons";
import type { EventType, EventStatus } from "../types/dfbnet";

// Event scope types - Simplified to Team and Club only
// Note: "department" and "organization" are future extensions of the unified model
type EventScope = "team" | "club";

// Role-based visibility options (who can see within selected members)
type RoleVisibility = "all" | "players" | "parents" | "coaches" | "board";

// Calendar visibility (public = club calendar, private = only selected members)
type CalendarVisibility = "public" | "private";

// Selected member with source tracking
interface SelectedMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  source: "team" | "club" | "manual";
  sourceId?: string;
  sourceName?: string;
}

// Enhanced event interface
interface EnhancedEventForm {
  title: string;
  scope: EventScope;
  eventType: string; // "general" for club, "training"|"match"|"friendly" for team
  teamIds: string[];
  roleVisibility: RoleVisibility[];
  calendarVisibility: CalendarVisibility;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  maxParticipants?: number;
  rsvpRequired: boolean;
  rsvpDeadline?: string;
  isRecurring: boolean;
  recurringPattern?: string;
  selectedMembers: SelectedMember[];
  excludedMemberIds: string[];
  manuallyAddedMemberIds: string[];
}

// Event types - Simplified for Pilot/MVP
// Team events: training, match, friendly
// Club events: general only (for pilot/MVP)
// Note: Event types can trigger follow-up tasks (e.g., training → upload session plans, match → add referee info)

// These are available for future use when event types need to be selectable in the modal
// const teamEventTypes = [
//   { id: "training", label: "Training", icon: "🏃" },
//   { id: "match", label: "Spiel", icon: "🏆" },
//   { id: "friendly", label: "Freundschaftsspiel", icon: "🤝" }
// ];

// const clubEventTypes = [
//   { id: "general", label: "Allgemein", icon: "📅" }
// ];

// Simplified event type config - Only 4 types for Pilot/MVP
// Legacy types (meeting, social, camp, tournament) are mapped to 'general'
const eventTypeConfig: Record<string, { label: string; color: string; icon: string }> = {
  // Club events
  general: { label: "Allgemein", color: "bg-slate-100 text-slate-700", icon: "📅" },
  // Team events
  training: { label: "Training", color: "bg-sky-100 text-sky-700", icon: "🏃" },
  match: { label: "Spiel", color: "bg-emerald-100 text-emerald-700", icon: "🏆" },
  friendly: { label: "Freundschaftsspiel", color: "bg-teal-100 text-teal-700", icon: "🤝" },
  // Legacy types - mapped to general for backward compatibility
  meeting: { label: "Versammlung", color: "bg-slate-100 text-slate-700", icon: "📋" },
  social: { label: "Social Event", color: "bg-purple-100 text-purple-700", icon: "🎉" },
  camp: { label: "Camp", color: "bg-orange-100 text-orange-700", icon: "⛺" },
  tournament: { label: "Turnier", color: "bg-amber-100 text-amber-700", icon: "🏅" },
  other: { label: "Sonstiges", color: "bg-gray-100 text-gray-700", icon: "📌" }
};

// Safe event type accessor with fallback to 'general'
const getEventTypeConfig = (eventType: string) => eventTypeConfig[eventType] || eventTypeConfig.general;

const eventStatusConfig: Record<EventStatus, { label: string; variant: "success" | "warning" | "danger" | "neutral" }> = {
  draft: { label: "Entwurf", variant: "neutral" },
  published: { label: "Veröffentlicht", variant: "success" },
  cancelled: { label: "Abgesagt", variant: "danger" },
  completed: { label: "Abgeschlossen", variant: "neutral" }
};

// Simplified scope config - Team and Club only for Pilot/MVP
// Note: "department" included for backward compatibility with existing mock data
const scopeConfig: Record<string, { label: string; icon: string; color: string; description: string }> = {
  team: { label: "Team-Termin", icon: "⚽", color: "bg-emerald-100 text-emerald-700 border-emerald-200", description: "Training, Spiele, Freundschaftsspiele" },
  club: { label: "Vereins-Termin", icon: "🏟️", color: "bg-sky-100 text-sky-700 border-sky-200", description: "Allgemeine Vereinstermine" },
  department: { label: "Vereins-Termin", icon: "🏟️", color: "bg-sky-100 text-sky-700 border-sky-200", description: "Allgemeine Vereinstermine" } // Fallback for legacy data
};

// Safe scope accessor with fallback
const getScopeConfig = (scope: string) => scopeConfig[scope] || scopeConfig.club;

// Role visibility options - available for future use if needed
// const roleVisibilityOptions: { id: RoleVisibility; label: string; icon: string }[] = [
//   { id: "all", label: "Alle Mitglieder", icon: "👥" },
//   { id: "players", label: "Nur Spieler", icon: "🏃" },
//   { id: "parents", label: "Nur Eltern", icon: "👨‍👩‍👧" },
//   { id: "coaches", label: "Nur Trainer", icon: "📣" },
//   { id: "board", label: "Nur Vorstand", icon: "🎖️" }
// ];

// Default form state
const defaultFormState: EnhancedEventForm = {
  title: "",
  scope: "club", // Default to club events for admin portal
  eventType: "general",
  teamIds: [],
  roleVisibility: ["all"],
  calendarVisibility: "private",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  description: "",
  rsvpRequired: true,
  isRecurring: false,
  selectedMembers: [],
  excludedMemberIds: [],
  manuallyAddedMemberIds: []
};

// Team membership data - who is in which team and their role
const TEAM_MEMBERSHIP: Record<string, { members: { id: string; role: "player" | "coach" | "parent" }[] }> = {
  "team_u12": {
    members: [
      { id: "max_schneider", role: "player" },
      { id: "noah_hoffmann", role: "player" },
      { id: "sophie_klein", role: "player" },
      { id: "coach_marco", role: "coach" },
      // Parents are auto-included based on child relationships
    ]
  },
  "team_volleyball_u16": {
    members: [
      { id: "flurina_schneider", role: "player" },
      { id: "anna_bauer", role: "player" },
      { id: "coach_katja", role: "coach" },
    ]
  },
  "team_frauen_ue40": {
    members: [
      { id: "lena_schneider", role: "player" },
    ]
  },
  "team_fitness": {
    members: [
      { id: "lena_schneider", role: "player" },
      { id: "trainer_sandra", role: "coach" },
    ]
  }
};

// Parent-child relationships
const PARENT_CHILD_RELATIONS: Record<string, string[]> = {
  "lena_schneider": ["max_schneider", "flurina_schneider"],
  "peter_hoffmann": ["noah_hoffmann"],
  "daniel_klein": ["sophie_klein"],
  "petra_weber": [] // Parent but child not in demo data
};

// Get parent ID for a child
const getParentOfChild = (childId: string): string | null => {
  for (const [parentId, children] of Object.entries(PARENT_CHILD_RELATIONS)) {
    if (children.includes(childId)) {
      return parentId;
    }
  }
  return null;
};

// Check if person is a child player
const isChildPlayer = (personId: string): boolean => {
  for (const children of Object.values(PARENT_CHILD_RELATIONS)) {
    if (children.includes(personId)) {
      return true;
    }
  }
  return false;
};

// Helper to get members from teams with proper role assignment
// Simplified: Only team and club scopes for Pilot/MVP
const getMembersFromSelection = (teamIds: string[], scope: EventScope): SelectedMember[] => {
  const members: SelectedMember[] = [];
  const addedIds = new Set<string>();
  const childPlayersSelected = new Set<string>();

  // First pass: Add direct team members (players and coaches)
  teamIds.forEach(teamId => {
    const team = mockTeams.find(t => t.id === teamId);
    const teamData = TEAM_MEMBERSHIP[teamId];
    
    if (team && teamData) {
      teamData.members.forEach(member => {
        const person = mockPersons.find(p => p.id === member.id);
        if (person && !addedIds.has(person.id)) {
          members.push({
            id: person.id,
            name: `${person.firstName} ${person.lastName}`,
            email: person.email || "",
            source: "team",
            sourceId: team.id,
            sourceName: team.name
          });
          addedIds.add(person.id);
          
          // Track if this is a child player
          if (member.role === "player" && isChildPlayer(person.id)) {
            childPlayersSelected.add(person.id);
          }
        }
      });
    }
  });

  // Second pass: Auto-include parents of selected child players
  childPlayersSelected.forEach(childId => {
    const parentId = getParentOfChild(childId);
    if (parentId && !addedIds.has(parentId)) {
      const parent = mockPersons.find(p => p.id === parentId);
      const child = mockPersons.find(p => p.id === childId);
      if (parent) {
        members.push({
          id: parent.id,
          name: `${parent.firstName} ${parent.lastName}`,
          email: parent.email || "",
          source: "team",
          sourceId: "parent_auto",
          sourceName: `Elternteil von ${child?.firstName || "Kind"}`
        });
        addedIds.add(parent.id);
      }
    }
  });

  // For club scope without specific team selections, add all members
  if (scope === "club" && teamIds.length === 0) {
    mockPersons.forEach(person => {
      if (!addedIds.has(person.id)) {
        members.push({
          id: person.id,
          name: `${person.firstName} ${person.lastName}`,
          email: person.email || "",
          source: "club",
          sourceName: "Alle Mitglieder"
        });
        addedIds.add(person.id);
      }
    });
  }

  return members;
};

// Check if a parent can be deselected (only if all their children are also deselected)
const canDeselectParent = (parentId: string, selectedMemberIds: string[], excludedIds: string[]): boolean => {
  const children = PARENT_CHILD_RELATIONS[parentId] || [];
  // Parent can be deselected if all their children are either not selected or already excluded
  return children.every(childId => 
    !selectedMemberIds.includes(childId) || excludedIds.includes(childId)
  );
};

// Check if member is an auto-included parent
const isAutoIncludedParent = (memberId: string, teamIds: string[]): boolean => {
  const children = PARENT_CHILD_RELATIONS[memberId] || [];
  if (children.length === 0) return false;
  
  // Check if any of their children are in the selected teams
  return children.some(childId => {
    return teamIds.some(teamId => {
      const teamData = TEAM_MEMBERSHIP[teamId];
      return teamData?.members.some(m => m.id === childId && m.role === "player");
    });
  });
};

export function Events() {
  const [typeFilter, setTypeFilter] = useState<EventType | "">("");
  const [statusFilter, setStatusFilter] = useState<EventStatus | "">("");
  const [scopeFilter, setScopeFilter] = useState<EventScope | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<typeof eventsWithDetails[0] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<EnhancedEventForm>(defaultFormState);

  const eventsWithDetails = useMemo(() => {
    return mockEvents.map(event => {
      const team = event.teamId ? mockTeams.find(t => t.id === event.teamId) : null;
      const registrations = mockEventRegistrations.filter(r => r.eventId === event.id);
      // Assign scope: team if has teamId, otherwise club (simplified for Pilot/MVP)
      const scope: EventScope = event.teamId ? "team" : "club";
      return { ...event, team, registrations, registrationCount: registrations.length, scope };
    });
  }, []);

  const filteredEvents = useMemo(() => {
    return eventsWithDetails
      .filter(e => !typeFilter || e.eventType === typeFilter)
      .filter(e => !statusFilter || e.status === statusFilter)
      .filter(e => !scopeFilter || e.scope === scopeFilter)
      .filter(e => !searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [eventsWithDetails, typeFilter, statusFilter, scopeFilter, searchTerm]);

  const upcomingEvents = filteredEvents.filter(e => new Date(e.startsAt) > new Date() && e.status !== "cancelled");
  const pastEvents = filteredEvents.filter(e => new Date(e.startsAt) <= new Date() || e.status === "completed");

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const typeOptions = Object.entries(eventTypeConfig).map(([value, { label }]) => ({ value, label }));
  const statusOptions = Object.entries(eventStatusConfig).map(([value, { label }]) => ({ value, label }));
  const scopeOptions = Object.entries(scopeConfig).map(([value, { label }]) => ({ value, label }));

  const handleOpenDetail = (event: typeof eventsWithDetails[0]) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleOpenCreate = () => {
    setFormData(defaultFormState);
    setIsEditing(false);
    setEditingEventId(null);
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: typeof eventsWithDetails[0]) => {
    // Don't allow editing completed events
    if (event.status === "completed") return;
    
    // Determine scope from event data (simplified for Pilot/MVP: team or club only)
    const scope: EventScope = event.teamId ? "team" : "club";
    
    // Load event data into form
    setFormData({
      title: event.title,
      scope: scope,
      eventType: event.eventType,
      teamIds: event.teamId ? [event.teamId] : [],
      roleVisibility: ["all"],
      calendarVisibility: "private",
      date: new Date(event.startsAt).toISOString().split("T")[0],
      startTime: new Date(event.startsAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      endTime: new Date(event.endsAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      location: event.location || "",
      description: event.description || "",
      maxParticipants: event.maxParticipants,
      rsvpRequired: true,
      isRecurring: false,
      selectedMembers: [],
      excludedMemberIds: [],
      manuallyAddedMemberIds: []
    });
    
    setIsEditing(true);
    setEditingEventId(event.id);
    setShowDetailModal(false);
    setShowCreateModal(true);
  };

  const handleSaveEvent = () => {
    // In a real app, this would save to the backend
    if (isEditing) {
      console.log("Updating event:", editingEventId, formData);
    } else {
      console.log("Creating event:", formData);
    }
    setShowCreateModal(false);
    setFormData(defaultFormState);
    setIsEditing(false);
    setEditingEventId(null);
  };

  const renderEventCard = (event: typeof eventsWithDetails[0]) => (
    <Card 
      key={event.id} 
      className="hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => handleOpenDetail(event)}
    >
      <div className="flex items-start gap-4">
        {/* Date Badge */}
        <div className="flex-shrink-0 w-14 text-center">
          <div className="bg-[#004941] text-white rounded-t-lg py-1 text-xs font-medium">
            {new Date(event.startsAt).toLocaleDateString("de-DE", { month: "short" })}
          </div>
          <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg py-2">
            <p className="text-2xl font-bold text-slate-800">
              {new Date(event.startsAt).getDate()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {/* Scope Badge */}
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getScopeConfig(event.scope).color}`}>
                  {getScopeConfig(event.scope).icon} {getScopeConfig(event.scope).label}
                </span>
                {/* Type Badge */}
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getEventTypeConfig(event.eventType).color}`}>
                  {getEventTypeConfig(event.eventType).label}
                </span>
                <Badge variant={eventStatusConfig[event.status].variant}>
                  {eventStatusConfig[event.status].label}
                </Badge>
              </div>
              <h3 className="font-semibold text-slate-800 group-hover:text-[#004941] transition-colors">
                {event.title}
              </h3>
              {event.team && (
                <p className="text-sm text-slate-500">{event.team.name}</p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0" />
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatTime(event.startsAt)} - {formatTime(event.endsAt)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.maxParticipants && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.registrationCount}/{event.maxParticipants}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  // State for member selection modal
  const [showMemberSelection, setShowMemberSelection] = useState(false);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [memberRoleFilter, setMemberRoleFilter] = useState<string>("all");
  
  // State for team search
  const [teamSearchTerm, setTeamSearchTerm] = useState("");
  
  // Get member role based on their relationship to selected teams
  // This is context-aware: same person can be "Spieler" in one team and "Elternteil" in another
  const getMemberRoleForContext = (memberId: string): string => {
    // Import demo personas data for accurate role mapping
    const demoPersonaRoles: Record<string, { 
      defaultRole: string; 
      teamRoles: Record<string, string>;
      isParentOf?: string[];
    }> = {
      // Coaches
      "coach_marco": { defaultRole: "Trainer", teamRoles: { "team_u12": "Trainer" } },
      "coach_katja": { defaultRole: "Trainer", teamRoles: { "team_volleyball_u16": "Trainer" } },
      "trainer_sandra": { defaultRole: "Trainer", teamRoles: {} },
      
      // Lena - Player in her teams, Parent for kids' teams
      "lena_schneider": { 
        defaultRole: "Spieler", 
        teamRoles: { 
          "team_frauen_ue40": "Spieler",
          "team_fitness": "Spieler",
          "team_u12": "Elternteil", // Parent of Max
          "team_volleyball_u16": "Elternteil" // Parent of Flurina
        },
        isParentOf: ["max_schneider", "flurina_schneider"]
      },
      
      // Children - Always players in their teams
      "flurina_schneider": { defaultRole: "Spieler", teamRoles: { "team_volleyball_u16": "Spieler" } },
      "max_schneider": { defaultRole: "Spieler", teamRoles: { "team_u12": "Spieler" } },
      "noah_hoffmann": { defaultRole: "Spieler", teamRoles: { "team_u12": "Spieler" } },
      "sophie_klein": { defaultRole: "Spieler", teamRoles: { "team_u12": "Spieler" } },
      "anna_bauer": { defaultRole: "Spieler", teamRoles: { "team_volleyball_u16": "Spieler" } },
      
      // Parents
      "peter_hoffmann": { 
        defaultRole: "Elternteil", 
        teamRoles: { "team_u12": "Elternteil" },
        isParentOf: ["noah_hoffmann"]
      },
      "daniel_klein": { 
        defaultRole: "Elternteil", 
        teamRoles: { "team_u12": "Elternteil" },
        isParentOf: ["sophie_klein"]
      },
      "petra_weber": { 
        defaultRole: "Elternteil", 
        teamRoles: { "team_volleyball_u16": "Elternteil" }
      },
      
      // Board/Admin
      "thomas_mueller": { defaultRole: "Vorstand", teamRoles: {} }
    };

    const personData = demoPersonaRoles[memberId];
    
    if (personData) {
      // Check if any selected team has a specific role for this person
      for (const teamId of formData.teamIds) {
        if (personData.teamRoles[teamId]) {
          return personData.teamRoles[teamId];
        }
      }
      return personData.defaultRole;
    }
    
    // Fallback for non-demo personas - use hash-based assignment
    const roles = ["Spieler", "Trainer", "Elternteil", "Vorstand", "Betreuer"];
    const hash = memberId.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return roles[hash % roles.length];
  };

  // Get event types based on scope (available for future use)
  // const getEventTypesForScope = (scope: EventScope) => {
  //   switch (scope) {
  //     case "team": return teamEventTypes;
  //     case "club": return clubEventTypes;
  //   }
  // };

  // Calculate selected members based on team selection (or all members for club scope)
  const computedMembers = useMemo(() => {
    const baseMembers = getMembersFromSelection(formData.teamIds, formData.scope);
    
    // Filter out excluded members
    const filtered = baseMembers.filter(m => !formData.excludedMemberIds.includes(m.id));
    
    // Add manually selected members
    formData.manuallyAddedMemberIds.forEach(memberId => {
      if (!filtered.find(m => m.id === memberId)) {
        const person = mockPersons.find(p => p.id === memberId);
        if (person) {
          filtered.push({
            id: person.id,
            name: `${person.firstName} ${person.lastName}`,
            email: person.email || "",
            source: "manual",
            sourceName: "Manuell hinzugefügt"
          });
        }
      }
    });
    
    return filtered;
  }, [formData.teamIds, formData.scope, formData.excludedMemberIds, formData.manuallyAddedMemberIds]);

  // Handle team multi-selection
  const toggleTeamSelection = (teamId: string) => {
    const newTeamIds = formData.teamIds.includes(teamId)
      ? formData.teamIds.filter(id => id !== teamId)
      : [...formData.teamIds, teamId];
    setFormData({...formData, teamIds: newTeamIds, excludedMemberIds: [], manuallyAddedMemberIds: []});
  };

  // Toggle member exclusion/inclusion
  const toggleMemberExclusion = (memberId: string) => {
    // Check if this is an auto-included parent
    if (isAutoIncludedParent(memberId, formData.teamIds)) {
      // Get the selected members (those from selection minus excluded)
      const fromSelection = getMembersFromSelection(formData.teamIds, formData.scope);
      const selectedIds = fromSelection.map(m => m.id).filter(id => !formData.excludedMemberIds.includes(id));
      
      // Check if parent can be deselected
      if (!canDeselectParent(memberId, selectedIds, formData.excludedMemberIds)) {
        // Can't deselect - their child is still selected
        console.log("Cannot deselect parent while child is still selected");
        return;
      }
    }
    
    if (formData.excludedMemberIds.includes(memberId)) {
      setFormData({...formData, excludedMemberIds: formData.excludedMemberIds.filter(id => id !== memberId)});
    } else {
      // When excluding a child, also check if we should auto-exclude the parent
      const parentId = getParentOfChild(memberId);
      if (parentId) {
        // Check if all children would be excluded after this
        const children = PARENT_CHILD_RELATIONS[parentId] || [];
        const willAllChildrenBeExcluded = children.every(childId => 
          childId === memberId || formData.excludedMemberIds.includes(childId)
        );
        
        if (willAllChildrenBeExcluded && !formData.excludedMemberIds.includes(parentId)) {
          // Also exclude the parent
          setFormData({
            ...formData, 
            excludedMemberIds: [...formData.excludedMemberIds, memberId, parentId]
          });
          return;
        }
      }
      
      setFormData({...formData, excludedMemberIds: [...formData.excludedMemberIds, memberId]});
    }
  };

  // Toggle manual member addition
  const toggleManualMember = (memberId: string) => {
    if (formData.manuallyAddedMemberIds.includes(memberId)) {
      setFormData({...formData, manuallyAddedMemberIds: formData.manuallyAddedMemberIds.filter(id => id !== memberId)});
    } else {
      setFormData({...formData, manuallyAddedMemberIds: [...formData.manuallyAddedMemberIds, memberId]});
    }
  };

  // Check if member is selected (either from team or manually)
  const isMemberSelected = (memberId: string) => {
    const fromSelection = getMembersFromSelection(formData.teamIds, formData.scope);
    const isInSelection = fromSelection.some(m => m.id === memberId);
    const isExcluded = formData.excludedMemberIds.includes(memberId);
    const isManuallyAdded = formData.manuallyAddedMemberIds.includes(memberId);
    
    return (isInSelection && !isExcluded) || isManuallyAdded;
  };

  // Get member selection source
  const getMemberSource = (memberId: string): string | null => {
    const fromSelection = getMembersFromSelection(formData.teamIds, formData.scope);
    const member = fromSelection.find(m => m.id === memberId);
    if (member && !formData.excludedMemberIds.includes(memberId)) {
      return member.sourceName || null;
    }
    if (formData.manuallyAddedMemberIds.includes(memberId)) {
      return "Manuell";
    }
    return null;
  };

  // Role filter options for member selection
  const roleFilterOptions = [
    { id: "all", label: "Alle Rollen" },
    { id: "Spieler", label: "Spieler" },
    { id: "Trainer", label: "Trainer" },
    { id: "Elternteil", label: "Eltern" },
    { id: "Vorstand", label: "Vorstand" },
    { id: "Betreuer", label: "Betreuer" }
  ];

  // Member Selection Modal
  const MemberSelectionModal = () => {
    // Get members with context-aware roles based on selected teams
    const allMembers = mockPersons.map(p => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email || "",
      role: getMemberRoleForContext(p.id)
    }));

    // Sort to show team-relevant members first (players, then parents, then others)
    const roleOrder: Record<string, number> = {
      "Spieler": 1,
      "Trainer": 2,
      "Elternteil": 3,
      "Betreuer": 4,
      "Vorstand": 5
    };

    const sortedMembers = [...allMembers].sort((a, b) => {
      const orderA = roleOrder[a.role] || 99;
      const orderB = roleOrder[b.role] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    const filteredMembers = sortedMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(memberSearchTerm.toLowerCase());
      const matchesRole = memberRoleFilter === "all" || m.role === memberRoleFilter;
      return matchesSearch && matchesRole;
    });

    const selectedCount = computedMembers.length;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-800">Teilnehmer manuell auswählen</h3>
              <button onClick={() => setShowMemberSelection(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Search & Role Filter */}
          <div className="px-6 py-3 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Mitglieder suchen..."
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
            </div>
            
            {/* Role Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {roleFilterOptions.map(role => (
                <button
                  key={role.id}
                  onClick={() => setMemberRoleFilter(role.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    memberRoleFilter === role.id
                      ? "bg-[#004941] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Member List */}
          <div className="overflow-y-auto max-h-[calc(80vh-280px)]">
            {filteredMembers.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p>Keine Mitglieder gefunden</p>
              </div>
            ) : (
              filteredMembers.map(member => {
                const isSelected = isMemberSelected(member.id);
                const source = getMemberSource(member.id);
                const isAutoParent = isAutoIncludedParent(member.id, formData.teamIds);
                
                // Get the children names if this is an auto-included parent
                const childrenNames = isAutoParent 
                  ? (PARENT_CHILD_RELATIONS[member.id] || [])
                      .filter(childId => {
                        // Only show children that are in selected teams
                        return formData.teamIds.some(teamId => {
                          const teamData = TEAM_MEMBERSHIP[teamId];
                          return teamData?.members.some(m => m.id === childId);
                        });
                      })
                      .map(childId => {
                        const child = mockPersons.find(p => p.id === childId);
                        return child ? child.firstName : "";
                      })
                      .filter(Boolean)
                  : [];
                
                // Check if this parent can be deselected
                const fromSelection = getMembersFromSelection(formData.teamIds, formData.scope);
                const selectedIds = fromSelection.map(m => m.id).filter(id => !formData.excludedMemberIds.includes(id));
                const canDeselect = !isAutoParent || canDeselectParent(member.id, selectedIds, formData.excludedMemberIds);
                
                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (!canDeselect && isSelected) {
                        // Show visual feedback that they can't deselect
                        return;
                      }
                      
                      // If member is from team/dept selection, toggle exclusion
                      const isInSelection = fromSelection.some(m => m.id === member.id);
                      
                      if (isInSelection) {
                        toggleMemberExclusion(member.id);
                      } else {
                        toggleManualMember(member.id);
                      }
                    }}
                    className={`flex items-center gap-3 px-6 py-3 border-b border-slate-100 last:border-0 transition-colors ${
                      isSelected ? "bg-[#C8F2E0]/30" : "hover:bg-slate-50"
                    } ${!canDeselect && isSelected ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={!canDeselect && isSelected}
                      onChange={() => {}}
                      className={`w-5 h-5 rounded border-slate-300 text-[#004941] focus:ring-[#004941] ${
                        !canDeselect && isSelected ? "opacity-50" : ""
                      }`}
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004941] to-[#006B5A] flex items-center justify-center text-white font-medium text-sm">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-slate-800 truncate">{member.name}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          member.role === "Trainer" ? "bg-amber-100 text-amber-700" :
                          member.role === "Spieler" ? "bg-sky-100 text-sky-700" :
                          member.role === "Elternteil" ? "bg-pink-100 text-pink-700" :
                          member.role === "Vorstand" ? "bg-violet-100 text-violet-700" :
                          "bg-slate-100 text-slate-700"
                        }`}>
                          {member.role}
                        </span>
                        {/* Show locked badge for auto-included parents */}
                        {isAutoParent && isSelected && !canDeselect && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-100 text-violet-700 flex items-center gap-1">
                            🔒 Auto
                          </span>
                        )}
                      </div>
                      {/* Show parent-child relationship */}
                      {isAutoParent && childrenNames.length > 0 && (
                        <p className="text-xs text-pink-600 mt-0.5">
                          👨‍👧 Elternteil von {childrenNames.join(", ")}
                        </p>
                      )}
                      {/* Show if this is a child with a parent */}
                      {isChildPlayer(member.id) && (
                        <p className="text-xs text-sky-600 mt-0.5">
                          👶 Kind (Elternteil wird automatisch informiert)
                        </p>
                      )}
                      {source && !isAutoParent && (
                        <p className="text-xs text-[#004941]">{source}</p>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#004941]" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-sm text-[#004941]">
              <Users className="w-4 h-4" />
              <span>{selectedCount} ausgewählt</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowMemberSelection(false)}>
                Abbrechen
              </Button>
              <Button onClick={() => setShowMemberSelection(false)}>
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Participant selection mode
  type ParticipantMode = "teams" | "all_members" | "manual";
  const [participantMode, setParticipantMode] = useState<ParticipantMode>("all_members");

  // Create Event Modal - Simplified flow per requirements
  const CreateEventModal = () => {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">
              {isEditing ? "Veranstaltung bearbeiten" : "Neue Veranstaltung erstellen"}
            </h2>
            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            
            {/* ═══════════════════════════════════════════════════════════════
                STEP 1: BASIC DETAILS
               ═══════════════════════════════════════════════════════════════ */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#004941] text-white text-sm flex items-center justify-center font-semibold">1</span>
                <h3 className="font-semibold text-slate-800">Grunddaten</h3>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Titel *</label>
                <Input
                  placeholder="z.B. Jahreshauptversammlung 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Datum *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Startzeit *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Endzeit *</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ort</label>
                <Input
                  placeholder="z.B. Vereinsheim, Sportplatz..."
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Beschreibung</label>
                <textarea
                  placeholder="Weitere Informationen zur Veranstaltung..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm resize-none"
                />
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 2: PARTICIPANT SELECTION
               ═══════════════════════════════════════════════════════════════ */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#004941] text-white text-sm flex items-center justify-center font-semibold">2</span>
                <h3 className="font-semibold text-slate-800">Teilnehmer</h3>
              </div>

              {/* Selection Mode Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <button
                  onClick={() => {
                    setParticipantMode("all_members");
                    setFormData({...formData, scope: "club", teamIds: [], excludedMemberIds: [], manuallyAddedMemberIds: []});
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    participantMode === "all_members"
                      ? "bg-[#004941] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Alle Mitglieder
                </button>
                <button
                  onClick={() => {
                    setParticipantMode("teams");
                    setFormData({...formData, scope: "team", excludedMemberIds: [], manuallyAddedMemberIds: []});
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    participantMode === "teams"
                      ? "bg-[#004941] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Teams auswählen
                </button>
                <button
                  onClick={() => {
                    setParticipantMode("manual");
                    setFormData({...formData, scope: "club", teamIds: []});
                    setShowMemberSelection(true);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                    participantMode === "manual"
                      ? "bg-[#004941] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Manuell auswählen
                </button>
              </div>

              {/* All Members Mode */}
              {participantMode === "all_members" && (
                <div className="p-4 bg-[#C8F2E0]/30 rounded-xl border border-[#004941]/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#004941] rounded-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Alle Vereinsmitglieder ({computedMembers.length})</p>
                      <p className="text-xs text-slate-600">Alle aktiven Mitglieder erhalten diese Einladung</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Teams Selection Mode */}
              {participantMode === "teams" && (
                <div>
                  {/* Team Search */}
                  <div className="relative mb-3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Team suchen..."
                      value={teamSearchTerm}
                      onChange={(e) => setTeamSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                    />
                  </div>
                  
                  {/* Team List */}
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-48 overflow-y-auto">
                    {mockTeams
                      .filter(team => 
                        team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                        (team.ageGroup && team.ageGroup.toLowerCase().includes(teamSearchTerm.toLowerCase()))
                      )
                      .map(team => (
                        <label 
                          key={team.id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                            formData.teamIds.includes(team.id) ? "bg-[#C8F2E0]/30" : "hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.teamIds.includes(team.id)}
                            onChange={() => toggleTeamSelection(team.id)}
                            className="w-5 h-5 rounded border-slate-300 text-[#004941] focus:ring-[#004941]"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">{team.name}</p>
                            <p className="text-xs text-slate-500">{team.ageGroup || "Alle Altersklassen"}</p>
                          </div>
                        </label>
                      ))}
                    {mockTeams.filter(team => 
                      team.name.toLowerCase().includes(teamSearchTerm.toLowerCase()) ||
                      (team.ageGroup && team.ageGroup.toLowerCase().includes(teamSearchTerm.toLowerCase()))
                    ).length === 0 && (
                      <div className="px-4 py-6 text-center text-slate-500 text-sm">
                        Kein Team gefunden
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Teams Summary */}
                  {formData.teamIds.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-slate-700">
                          {formData.teamIds.length} Team(s) → {computedMembers.length} Teilnehmer
                        </p>
                        <button
                          onClick={() => setShowMemberSelection(true)}
                          className="text-xs text-[#004941] hover:text-[#003830] font-medium"
                        >
                          Anpassen
                        </button>
                      </div>
                      
                      {/* Parent-Child Info */}
                      {computedMembers.some(m => m.sourceName?.includes("Elternteil")) && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <span>👨‍👧</span>
                          Elternteile von Kindern werden automatisch eingeladen
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Manual Selection Mode - Summary */}
              {participantMode === "manual" && (
                <div 
                  onClick={() => setShowMemberSelection(true)}
                  className="p-4 border border-slate-200 rounded-xl bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#C8F2E0] rounded-lg">
                        <UserPlus className="w-5 h-5 text-[#004941]" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {formData.manuallyAddedMemberIds.length > 0 
                            ? `${formData.manuallyAddedMemberIds.length} Teilnehmer manuell ausgewählt`
                            : "Teilnehmer manuell auswählen"
                          }
                        </p>
                        <p className="text-xs text-slate-500">Klicken um Mitglieder individuell auszuwählen</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                  
                  {/* Preview of manually selected members */}
                  {computedMembers.length > 0 && participantMode === "manual" && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex flex-wrap gap-1">
                        {computedMembers.slice(0, 8).map(member => (
                          <span 
                            key={member.id}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#C8F2E0] text-[#004941]"
                          >
                            {member.name.split(" ")[0]}
                          </span>
                        ))}
                        {computedMembers.length > 8 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-200 text-slate-600">
                            +{computedMembers.length - 8} weitere
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 3: PARTICIPATION SETTINGS
               ═══════════════════════════════════════════════════════════════ */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#004941] text-white text-sm flex items-center justify-center font-semibold">3</span>
                <h3 className="font-semibold text-slate-800">Teilnahme-Einstellungen</h3>
              </div>

              <div className="space-y-4">
                {/* Max Participants */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Max. Teilnehmer</label>
                  <input
                    type="number"
                    placeholder="Unbegrenzt"
                    value={formData.maxParticipants || ""}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value ? parseInt(e.target.value) : undefined})}
                    className="w-full max-w-[200px] px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                  />
                </div>

                {/* RSVP Toggle */}
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#004941]" />
                    <div>
                      <p className="font-medium text-slate-800">Anmeldung erforderlich</p>
                      <p className="text-xs text-slate-500">Teilnehmer müssen zu- oder absagen</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formData.rsvpRequired}
                      onChange={(e) => setFormData({...formData, rsvpRequired: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
                  </label>
                </div>

                {/* RSVP Deadline (if RSVP required) */}
                {formData.rsvpRequired && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Anmeldefrist</label>
                    <input
                      type="datetime-local"
                      value={formData.rsvpDeadline || ""}
                      onChange={(e) => setFormData({...formData, rsvpDeadline: e.target.value})}
                      className="w-full max-w-[300px] px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 4: RECURRENCE (Optional)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#004941] text-white text-sm flex items-center justify-center font-semibold">4</span>
                <h3 className="font-semibold text-slate-800">Wiederholung</h3>
                <span className="text-xs text-slate-400">(optional)</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#004941]" />
                  <div>
                    <p className="font-medium text-slate-800">Wiederkehrend</p>
                    <p className="text-xs text-slate-500">Regelmäßige Termine erstellen</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#004941] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004941]"></div>
                </label>
              </div>

              {/* Recurring Pattern (if enabled) */}
              {formData.isRecurring && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Wiederholungsmuster</label>
                  <select
                    value={formData.recurringPattern || "weekly"}
                    onChange={(e) => setFormData({...formData, recurringPattern: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941] text-sm"
                  >
                    <option value="daily">Täglich</option>
                    <option value="weekly">Wöchentlich</option>
                    <option value="biweekly">Alle 2 Wochen</option>
                    <option value="monthly">Monatlich</option>
                  </select>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                STEP 5: VISIBILITY
               ═══════════════════════════════════════════════════════════════ */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#004941] text-white text-sm flex items-center justify-center font-semibold">5</span>
                <h3 className="font-semibold text-slate-800">Sichtbarkeit</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setFormData({...formData, calendarVisibility: "private"})}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.calendarVisibility === "private"
                      ? "border-[#004941] bg-[#C8F2E0]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🔒</span>
                    <span className="font-semibold text-slate-800">Privat</span>
                  </div>
                  <p className="text-xs text-slate-500">Nur in "Mein Kalender" für ausgewählte Teilnehmer</p>
                </button>
                <button
                  onClick={() => setFormData({...formData, calendarVisibility: "public"})}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.calendarVisibility === "public"
                      ? "border-[#004941] bg-[#C8F2E0]"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🌐</span>
                    <span className="font-semibold text-slate-800">Öffentlich</span>
                  </div>
                  <p className="text-xs text-slate-500">Im "Club-Kalender" für alle sichtbar</p>
                </button>
              </div>
            </div>
          </div>

          {/* Footer with Save Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="text-sm text-slate-500">
              {computedMembers.length > 0 && (
                <span>{computedMembers.length} Teilnehmer werden eingeladen</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Abbrechen
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setFormData({...formData, eventType: "draft" as any});
                  handleSaveEvent();
                }}
              >
                Als Entwurf speichern
              </Button>
              <Button onClick={handleSaveEvent}>
                {isEditing ? "Änderungen speichern" : "Veröffentlichen"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Event Detail Modal
  const EventDetailModal = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getScopeConfig(selectedEvent.scope).icon}</span>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getScopeConfig(selectedEvent.scope).color}`}>
                    {getScopeConfig(selectedEvent.scope).label}
                  </span>
                  <Badge variant={eventStatusConfig[selectedEvent.status].variant}>
                    {eventStatusConfig[selectedEvent.status].label}
                  </Badge>
                </div>
              </div>
            </div>
            <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
            {/* Date & Time */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div className="w-14 text-center">
                <div className="bg-[#004941] text-white rounded-t-lg py-1 text-xs font-medium">
                  {new Date(selectedEvent.startsAt).toLocaleDateString("de-DE", { month: "short" })}
                </div>
                <div className="bg-white border border-t-0 border-slate-200 rounded-b-lg py-2">
                  <p className="text-2xl font-bold text-slate-800">
                    {new Date(selectedEvent.startsAt).getDate()}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-slate-800">{formatDate(selectedEvent.startsAt)}</p>
                <p className="text-slate-500">{formatTime(selectedEvent.startsAt)} - {formatTime(selectedEvent.endsAt)}</p>
              </div>
            </div>

            {/* Location */}
            {selectedEvent.location && (
              <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
                <div className="p-2.5 bg-slate-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Ort</p>
                  <p className="font-medium text-slate-800">{selectedEvent.location}</p>
                </div>
              </div>
            )}

            {/* Team */}
            {selectedEvent.team && (
              <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl">
                <div className="p-2.5 bg-emerald-100 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Team</p>
                  <p className="font-medium text-slate-800">{selectedEvent.team.name}</p>
                </div>
              </div>
            )}

            {/* Participants */}
            {selectedEvent.maxParticipants && (
              <div className="p-4 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-3">Teilnehmer</p>
                  <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedEvent.registrations.filter(r => r.status === "registered" || r.status === "attended").length}
                    </p>
                    <p className="text-xs text-emerald-600">Zugesagt</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-lg">
                    <p className="text-2xl font-bold text-amber-600">
                      {selectedEvent.registrations.filter(r => r.status === "waitlist").length}
                    </p>
                    <p className="text-xs text-amber-600">Warteliste</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {selectedEvent.registrations.filter(r => r.status === "cancelled").length}
                    </p>
                    <p className="text-xs text-red-600">Abgesagt</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {selectedEvent.description && (
              <div className="p-4 border border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-2">Beschreibung</p>
                <p className="text-slate-700">{selectedEvent.description}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowDetailModal(false)} className="text-red-600 border-red-200 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" />
                Löschen
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Vorschau
              </Button>
              {selectedEvent.status !== "completed" ? (
                <Button onClick={() => handleEditEvent(selectedEvent)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Bearbeiten
                </Button>
              ) : (
                <Button variant="outline" disabled className="opacity-50 cursor-not-allowed">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Abgeschlossen
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Veranstaltungen</h1>
          <p className="text-slate-500 mt-1">Termine, Events und Vereinsaktivitäten verwalten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
          Neue Veranstaltung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C8F2E0]">
              <Calendar className="w-5 h-5 text-[#004941]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{upcomingEvents.length}</p>
              <p className="text-sm text-slate-500">Anstehend</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {eventsWithDetails.filter(e => e.scope === "team").length}
              </p>
              <p className="text-sm text-slate-500">Team-Termine</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">
                {eventsWithDetails.filter(e => e.scope === "club").length}
              </p>
              <p className="text-sm text-slate-500">Vereins-Termine</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">
                {mockEventRegistrations.filter(r => r.status === "registered").length}
              </p>
              <p className="text-sm text-slate-500">Anmeldungen</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Veranstaltung suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004941]"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Select
              options={scopeOptions}
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value as EventScope | "")}
              placeholder="Alle Bereiche"
              className="w-40"
            />
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as EventType | "")}
              placeholder="Alle Typen"
              className="w-40"
            />
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatus | "")}
              placeholder="Alle Status"
              className="w-40"
            />
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Anstehende Veranstaltungen</h2>
          <div className="space-y-4">
            {upcomingEvents.map(renderEventCard)}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Vergangene Veranstaltungen</h2>
          <div className="space-y-4 opacity-75">
            {pastEvents.slice(0, 5).map(renderEventCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <Card className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">Keine Veranstaltungen gefunden</h3>
          <p className="text-slate-500 mt-1">Passen Sie Ihre Filter an oder erstellen Sie eine neue Veranstaltung</p>
          <Button className="mt-4" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Neue Veranstaltung
          </Button>
        </Card>
      )}

      {/* Modals */}
      {showCreateModal && <CreateEventModal />}
      {showDetailModal && <EventDetailModal />}
      {showMemberSelection && <MemberSelectionModal />}
    </div>
  );
}
