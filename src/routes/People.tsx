/**
 * Personen (People) Page - Unified Members + Contacts
 * 
 * DEMO STEPS:
 * 1. Toggle between "Mitglieder" and "Kontakte" views
 * 2. Add a new person with role selection (Guardian, Coach, Player, Contact)
 * 3. Send invites to people who haven't claimed their account
 * 4. View person details including guardian links and memberships
 */

import { useState, useMemo } from "react";
import { 
  Plus, Search, Mail, Phone, Link2, Send,
  ChevronRight, X, Check, Users, UserCheck,
  Shield, User, Heart
} from "lucide-react";
import { 
  Card, Button, Badge, 
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableEmpty
} from "../components/ui";
import { usePeople } from "../contexts/PeopleContext";
import { 
  getFullName, 
  getStatusLabel, 
  getRoleLabel
} from "../data/mockPeople";
import type { Person, MembershipRole } from "../types/people";

// Role options for adding a new person
type PersonRole = "player" | "coach" | "guardian" | "contact";

const ROLE_CONFIG: Record<PersonRole, { label: string; icon: React.ReactNode; color: string }> = {
  player: { label: "Spieler", icon: <Shield className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" },
  coach: { label: "Trainer", icon: <Users className="w-4 h-4" />, color: "bg-green-100 text-green-700" },
  guardian: { label: "Erziehungsberechtigter", icon: <Heart className="w-4 h-4" />, color: "bg-violet-100 text-violet-700" },
  contact: { label: "Allgemeiner Kontakt", icon: <User className="w-4 h-4" />, color: "bg-slate-100 text-slate-700" },
};

// ==========================================
// MAIN PEOPLE PAGE
// ==========================================
export function People() {
  const { 
    persons, 
    memberships,
    getChildrenByGuardian,
    getInvitesByPerson,
    addPerson,
    addMembership,
    org
  } = usePeople();

  // View toggle: "members" or "contacts"
  const [viewMode, setViewMode] = useState<"members" | "contacts">("members");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<Person | null>(null);

  // Get members (kind = "member")
  const members = useMemo(() => {
    return persons.filter(p => p.kind === "member");
  }, [persons]);

  // Get contacts (kind = "contact")
  const contacts = useMemo(() => {
    return persons.filter(p => p.kind === "contact");
  }, [persons]);

  // Current list based on view mode
  const currentList = viewMode === "members" ? members : contacts;

  // Filter list
  const filteredList = useMemo(() => {
    if (!searchTerm) return currentList;
    const term = searchTerm.toLowerCase();
    return currentList.filter(p => 
      p.firstName.toLowerCase().includes(term) ||
      p.lastName.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.phone?.includes(term)
    );
  }, [currentList, searchTerm]);

  // Get person's roles from memberships
  const getPersonRoles = (personId: string): MembershipRole[] => {
    return memberships
      .filter(m => m.personId === personId)
      .map(m => m.role);
  };

  // Get linked children text
  const getLinkedChildrenText = (personId: string): string => {
    const children = getChildrenByGuardian(personId);
    if (children.length === 0) return "";
    return children.map(c => getFullName(c.child)).join(", ");
  };

  // Get invite status
  const getInviteStatus = (personId: string): { label: string; variant: string } | null => {
    const invites = getInvitesByPerson(personId);
    if (invites.length === 0) return null;
    const latest = invites[invites.length - 1];
    const statusMap: Record<string, { label: string; variant: string }> = {
      sent: { label: "Einladung gesendet", variant: "warning" },
      opened: { label: "Einladung geöffnet", variant: "info" },
      accepted: { label: "Angenommen", variant: "success" },
      expired: { label: "Abgelaufen", variant: "error" }
    };
    return statusMap[latest.status];
  };

  // Handle add person
  const handleAddPerson = (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    roles: PersonRole[];
  }) => {
    // Determine kind based on roles
    const isMember = data.roles.includes("player") || data.roles.includes("coach");
    const kind = isMember ? "member" : "contact";

    // Add person
    const person = addPerson({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      kind
    });

    // Add memberships for each role
    data.roles.forEach(role => {
      if (role === "player" || role === "coach" || role === "guardian") {
        const membershipRole: MembershipRole = 
          role === "player" ? "player" :
          role === "coach" ? "coach" : "guardian_contact";
        
        addMembership({
          personId: person.id,
          orgId: org.id,
          role: membershipRole,
          status: "pending"
        });
      }
    });

    setShowAddModal(false);
    
    // Switch to appropriate view
    if (isMember && viewMode === "contacts") {
      setViewMode("members");
    } else if (!isMember && viewMode === "members") {
      setViewMode("contacts");
    }
  };

  // Handle send invite
  const handleSendInvite = (person: Person) => {
    setInviteTarget(person);
    setShowInviteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Personen</h1>
          <p className="text-slate-500 mt-1">
            {members.length} Mitglieder, {contacts.length} Kontakte
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Person hinzufügen
        </Button>
      </div>

      {/* View Toggle + Search */}
      <Card className="!p-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("members")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "members" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Mitglieder
              <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-xs">
                {members.length}
              </span>
            </button>
            <button
              onClick={() => setViewMode("contacts")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "contacts" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Users className="w-4 h-4" />
              Kontakte
              <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-xs">
                {contacts.length}
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={viewMode === "members" ? "Mitglieder suchen..." : "Kontakte suchen..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </Card>

      {/* Results info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredList.length} {viewMode === "members" ? "Mitglieder" : "Kontakte"} gefunden
        </p>
      </div>

      {/* People Table */}
      <Card padding="none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kontakt</TableHead>
              <TableHead>Rollen / Verknüpfungen</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredList.length === 0 ? (
              <TableEmpty 
                message={viewMode === "members" ? "Keine Mitglieder gefunden" : "Keine Kontakte gefunden"}
                colSpan={5}
              />
            ) : (
              filteredList.map((person) => {
                const roles = getPersonRoles(person.id);
                const linkedChildren = getLinkedChildrenText(person.id);
                const inviteStatus = getInviteStatus(person.id);

                return (
                  <TableRow 
                    key={person.id}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {person.avatarUrl ? (
                          <img 
                            src={person.avatarUrl} 
                            alt={getFullName(person)}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-700 font-medium">
                              {person.firstName[0]}{person.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{getFullName(person)}</p>
                          {person.hasClaimedIdentity && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Konto aktiviert
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {person.email && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {person.email}
                          </div>
                        )}
                        {person.phone && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {person.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {roles.map((role, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 text-xs font-medium bg-teal-100 text-teal-700 rounded"
                          >
                            {getRoleLabel(role)}
                          </span>
                        ))}
                        {linkedChildren && (
                          <div className="flex items-center gap-1 px-2 py-0.5 text-xs bg-violet-100 text-violet-700 rounded">
                            <Link2 className="w-3 h-3" />
                            Guardian: {linkedChildren}
                          </div>
                        )}
                        {roles.length === 0 && !linkedChildren && (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={person.status === "active" ? "success" : "default"}>
                          {getStatusLabel(person.status)}
                        </Badge>
                        {inviteStatus && (
                          <Badge variant={inviteStatus.variant as any}>
                            {inviteStatus.label}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        {!person.hasClaimedIdentity && (
                          <button
                            onClick={() => handleSendInvite(person)}
                            className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                            title="Einladen"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPerson(person)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Details"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Person Detail Modal */}
      {selectedPerson && (
        <PersonDetailModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onInvite={() => handleSendInvite(selectedPerson)}
        />
      )}

      {/* Add Person Modal */}
      {showAddModal && (
        <AddPersonModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPerson}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && inviteTarget && (
        <InvitePersonModal
          person={inviteTarget}
          onClose={() => {
            setShowInviteModal(false);
            setInviteTarget(null);
          }}
        />
      )}
    </div>
  );
}

// ==========================================
// ADD PERSON MODAL
// ==========================================
function AddPersonModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    roles: PersonRole[];
  }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<PersonRole[]>([]);

  const toggleRole = (role: PersonRole) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || selectedRoles.length === 0) return;
    onAdd({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      roles: selectedRoles
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Person hinzufügen</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Vorname *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nachname *
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rolle(n) auswählen *
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Wähle eine oder mehrere Rollen für diese Person
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(ROLE_CONFIG) as PersonRole[]).map((role) => {
                  const config = ROLE_CONFIG[role];
                  const isSelected = selectedRoles.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRole(role)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected 
                          ? "border-teal-500 bg-teal-50" 
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${config.color}`}>
                        {config.icon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{config.label}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-5 h-5 text-teal-500 ml-auto" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              type="submit" 
              disabled={!firstName || !lastName || selectedRoles.length === 0}
            >
              Person hinzufügen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// PERSON DETAIL MODAL
// ==========================================
function PersonDetailModal({ 
  person, 
  onClose,
  onInvite 
}: { 
  person: Person; 
  onClose: () => void;
  onInvite: () => void;
}) {
  const { getChildrenByGuardian, getInvitesByPerson, memberships } = usePeople();
  
  const linkedChildren = getChildrenByGuardian(person.id);
  const personInvites = getInvitesByPerson(person.id);
  const personMemberships = memberships.filter(m => m.personId === person.id);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {person.avatarUrl ? (
                <img 
                  src={person.avatarUrl} 
                  alt={getFullName(person)}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl text-teal-700 font-medium">
                    {person.firstName[0]}{person.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-800">{getFullName(person)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={person.kind === "member" ? "teal" : "default"}>
                    {person.kind === "member" ? "Mitglied" : "Kontakt"}
                  </Badge>
                  <Badge variant={person.status === "active" ? "success" : "default"}>
                    {getStatusLabel(person.status)}
                  </Badge>
                  {person.hasClaimedIdentity && (
                    <Badge variant="info">Konto aktiviert</Badge>
                  )}
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Kontaktdaten</h3>
            <div className="grid grid-cols-2 gap-4">
              {person.email && (
                <div>
                  <label className="text-xs text-slate-500">E-Mail</label>
                  <p className="text-slate-800">{person.email}</p>
                </div>
              )}
              {person.phone && (
                <div>
                  <label className="text-xs text-slate-500">Telefon</label>
                  <p className="text-slate-800">{person.phone}</p>
                </div>
              )}
              {person.dateOfBirth && (
                <div>
                  <label className="text-xs text-slate-500">Geburtsdatum</label>
                  <p className="text-slate-800">
                    {new Date(person.dateOfBirth).toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Memberships / Roles */}
          {personMemberships.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Rollen & Mitgliedschaften</h3>
              <div className="space-y-2">
                {personMemberships.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-800">{getRoleLabel(m.role)}</span>
                    <Badge variant={m.status === "active" ? "success" : "warning"}>
                      {getStatusLabel(m.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Children (for guardians) */}
          {linkedChildren.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">
                Verknüpfte Kinder ({linkedChildren.length})
              </h3>
              <div className="space-y-3">
                {linkedChildren.map(({ child, link }) => (
                  <div key={link.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-700 font-medium">
                          {child.firstName[0]}{child.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{getFullName(child)}</p>
                        <Badge variant={link.status === "active" ? "success" : "warning"}>
                          {getStatusLabel(link.status)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {link.permissions.manageRsvp && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          RSVP verwalten
                        </span>
                      )}
                      {link.permissions.viewComms && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          Kommunikation sehen
                        </span>
                      )}
                      {link.permissions.payFees && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                          Beiträge zahlen
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invites */}
          {personInvites.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Einladungen</h3>
              <div className="space-y-2">
                {personInvites.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm text-slate-800">
                        {inv.channel === "email" ? `Per E-Mail an ${inv.sentTo}` : "Per Link"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Gesendet: {new Date(inv.sentAt).toLocaleDateString("de-DE")}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        inv.status === "accepted" ? "success" :
                        inv.status === "sent" ? "warning" : "default"
                      }
                    >
                      {inv.status === "sent" ? "Ausstehend" :
                       inv.status === "opened" ? "Geöffnet" :
                       inv.status === "accepted" ? "Angenommen" : "Abgelaufen"}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
          {!person.hasClaimedIdentity && (
            <Button onClick={onInvite} icon={<Send className="w-4 h-4" />}>
              Einladen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INVITE PERSON MODAL
// ==========================================
function InvitePersonModal({ 
  person, 
  onClose 
}: { 
  person: Person;
  onClose: () => void;
}) {
  const { sendInvite, org, teams, getChildrenByGuardian } = usePeople();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [claimUrl, setClaimUrl] = useState("");

  const linkedChildren = getChildrenByGuardian(person.id);

  const handleSend = () => {
    const result = sendInvite({
      personId: person.id,
      orgId: org.id,
      teamId: selectedTeam || undefined,
      role: "player", // Will be determined during onboarding
      target: "self",
      childPersonId: linkedChildren.length > 0 ? linkedChildren[0].child.id : undefined
    });
    setClaimUrl(result.invite.claimUrl);
    setInviteSent(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin + claimUrl);
    alert("Link kopiert!");
  };

  if (inviteSent) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div 
          className="bg-white rounded-2xl w-full max-w-md text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Einladung erstellt!</h2>
            <p className="text-slate-600 mb-4">
              Teile diesen Link mit {getFullName(person)}.
            </p>
            <div className="bg-slate-100 rounded-lg p-3 mb-4">
              <p className="text-xs text-slate-500 mb-1">Einladungslink:</p>
              <p className="text-sm text-slate-800 break-all font-mono">{claimUrl}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyLink}>
                Link kopieren
              </Button>
              <Button className="flex-1" onClick={onClose}>
                Fertig
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Einladung senden</h2>
          <p className="text-slate-500 mt-1">An: {getFullName(person)}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-teal-50 rounded-lg">
            <p className="text-sm text-teal-800">
              <strong>Hinweis:</strong> Die eingeladene Person wählt beim Öffnen des Links selbst, 
              ob sie sich selbst, ein Kind oder eine Familie anmeldet.
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Team (optional)
            </label>
            <select
              value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Kein Team</option>
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          {linkedChildren.length > 0 && (
            <div className="p-3 bg-violet-50 rounded-lg">
              <p className="text-sm text-violet-800">
                <strong>Verknüpfte Kinder:</strong> {linkedChildren.map(c => getFullName(c.child)).join(", ")}
              </p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSend} icon={<Send className="w-4 h-4" />}>
            Einladungslink erstellen
          </Button>
        </div>
      </div>
    </div>
  );
}
