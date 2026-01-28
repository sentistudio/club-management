/**
 * Kontakte (Contacts) Page
 * 
 * DEMO STEPS:
 * 1. View list of contacts (guardians, volunteers, external)
 * 2. See "Verknüpfungen" column showing linked children
 * 3. Click row to open contact detail with linked children and permissions
 * 4. Use "Einladen" to send invite, "Zu Mitglied machen" to convert
 * 5. Add new contact via "Kontakt hinzufügen" button
 */

import { useState, useMemo } from "react";
import { 
  Plus, Search, Mail, Phone, UserPlus, Link2, 
  ChevronRight, X, Check, Send
} from "lucide-react";
import { Card, Button, Badge } from "../components/ui";
import { usePeople } from "../contexts/PeopleContext";
import { 
  getFullName, 
  getStatusLabel, 
  getRoleLabel
} from "../data/mockPeople";
import type { Person } from "../types/people";

// ==========================================
// CONTACTS PAGE
// ==========================================
export function Contacts() {
  const { 
    persons,
    getChildrenByGuardian,
    getInvitesByPerson,
    addPerson
  } = usePeople();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Person | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<Person | null>(null);

  // Get contacts (kind = "contact")
  const contacts = useMemo(() => {
    return persons.filter(p => p.kind === "contact");
  }, [persons]);

  // Filter contacts
  const filteredContacts = useMemo(() => {
    if (!searchTerm) return contacts;
    const term = searchTerm.toLowerCase();
    return contacts.filter(c => 
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.phone?.includes(term)
    );
  }, [contacts, searchTerm]);

  // Get linked children for a contact
  const getLinkedChildrenText = (contactId: string): string => {
    const children = getChildrenByGuardian(contactId);
    if (children.length === 0) return "-";
    return children.map(c => getFullName(c.child)).join(", ");
  };

  // Get invite status for a contact
  const getInviteStatus = (contactId: string): { status: string; color: string } | null => {
    const contactInvites = getInvitesByPerson(contactId);
    if (contactInvites.length === 0) return null;
    const latestInvite = contactInvites[contactInvites.length - 1];
    const statusColors: Record<string, string> = {
      sent: "warning",
      opened: "info",
      accepted: "success",
      expired: "error"
    };
    return {
      status: latestInvite.status === "sent" ? "Einladung gesendet" :
              latestInvite.status === "opened" ? "Einladung geöffnet" :
              latestInvite.status === "accepted" ? "Einladung angenommen" : "Einladung abgelaufen",
      color: statusColors[latestInvite.status] || "default"
    };
  };

  // Handle convert to member
  const handleConvertToMember = (contact: Person) => {
    // Update person kind
    // In a real app, this would also create appropriate memberships
    // For demo, we'll just show it's possible
    alert(`${getFullName(contact)} würde zu einem Mitglied konvertiert werden.`);
  };

  // Handle send invite
  const handleSendInvite = (contact: Person) => {
    setInviteTarget(contact);
    setShowInviteModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kontakte</h1>
          <p className="text-slate-500 mt-1">
            {filteredContacts.length} Kontakte (Erziehungsberechtigte, Helfer, Externe)
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
          Kontakt hinzufügen
        </Button>
      </div>

      {/* Search & Filters */}
      <Card className="!p-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Kontakte durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </Card>

      {/* Contacts Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Kontakt
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Verknüpfungen
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => {
                const inviteStatus = getInviteStatus(contact.id);
                const linkedChildren = getLinkedChildrenText(contact.id);
                
                return (
                  <tr 
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {contact.avatarUrl ? (
                          <img 
                            src={contact.avatarUrl} 
                            alt={getFullName(contact)}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-700 font-medium">
                              {contact.firstName[0]}{contact.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{getFullName(contact)}</p>
                          {contact.hasClaimedIdentity && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Konto aktiviert
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {contact.email && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {linkedChildren !== "-" ? (
                        <div className="flex items-center gap-1">
                          <Link2 className="w-3.5 h-3.5 text-teal-500" />
                          <span className="text-sm text-slate-600">
                            Guardian von: {linkedChildren}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">Keine Verknüpfungen</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge variant={contact.status === "active" ? "success" : "default"}>
                          {getStatusLabel(contact.status)}
                        </Badge>
                        {inviteStatus && (
                          <Badge variant={inviteStatus.color as any}>
                            {inviteStatus.status}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleSendInvite(contact)}
                          className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                          title="Einladen"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleConvertToMember(contact)}
                          className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg"
                          title="Zu Mitglied machen"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedContact(contact)}
                          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Details anzeigen"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Keine Kontakte gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onInvite={() => handleSendInvite(selectedContact)}
        />
      )}

      {/* Add Contact Modal */}
      {showAddModal && (
        <AddContactModal
          onClose={() => setShowAddModal(false)}
          onAdd={(data) => {
            addPerson({ ...data, kind: "contact" });
            setShowAddModal(false);
          }}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && inviteTarget && (
        <InviteContactModal
          contact={inviteTarget}
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
// CONTACT DETAIL MODAL
// ==========================================
function ContactDetailModal({ 
  contact, 
  onClose,
  onInvite 
}: { 
  contact: Person; 
  onClose: () => void;
  onInvite: () => void;
}) {
  const { getChildrenByGuardian, getInvitesByPerson, memberships } = usePeople();
  
  const linkedChildren = getChildrenByGuardian(contact.id);
  const contactInvites = getInvitesByPerson(contact.id);
  const contactMemberships = memberships.filter(m => m.personId === contact.id);

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
              {contact.avatarUrl ? (
                <img 
                  src={contact.avatarUrl} 
                  alt={getFullName(contact)}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl text-teal-700 font-medium">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </span>
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-800">{getFullName(contact)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={contact.status === "active" ? "success" : "default"}>
                    {getStatusLabel(contact.status)}
                  </Badge>
                  {contact.hasClaimedIdentity && (
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
              {contact.email && (
                <div>
                  <label className="text-xs text-slate-500">E-Mail</label>
                  <p className="text-slate-800">{contact.email}</p>
                </div>
              )}
              {contact.phone && (
                <div>
                  <label className="text-xs text-slate-500">Telefon</label>
                  <p className="text-slate-800">{contact.phone}</p>
                </div>
              )}
              {contact.dateOfBirth && (
                <div>
                  <label className="text-xs text-slate-500">Geburtsdatum</label>
                  <p className="text-slate-800">
                    {new Date(contact.dateOfBirth).toLocaleDateString("de-DE")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Linked Children */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">
              Verknüpfte Kinder ({linkedChildren.length})
            </h3>
            {linkedChildren.length > 0 ? (
              <div className="space-y-3">
                {linkedChildren.map(({ child, link }) => (
                  <div 
                    key={link.id}
                    className="p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {child.avatarUrl ? (
                          <img 
                            src={child.avatarUrl} 
                            alt={getFullName(child)}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-700 font-medium">
                              {child.firstName[0]}{child.lastName[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{getFullName(child)}</p>
                          <Badge 
                            variant={link.status === "active" ? "success" : "warning"}
                            className="mt-1"
                          >
                            {getStatusLabel(link.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {/* Permissions */}
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
                      {link.permissions.editProfile && (
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded">
                          Profil bearbeiten
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">Keine verknüpften Kinder</p>
            )}
          </div>

          {/* Memberships */}
          {contactMemberships.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Mitgliedschaften</h3>
              <div className="space-y-2">
                {contactMemberships.map(m => (
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

          {/* Invites */}
          {contactInvites.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Einladungen</h3>
              <div className="space-y-2">
                {contactInvites.map(inv => (
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
          {!contact.hasClaimedIdentity && (
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
// ADD CONTACT MODAL
// ==========================================
function AddContactModal({ 
  onClose, 
  onAdd 
}: { 
  onClose: () => void;
  onAdd: (data: { firstName: string; lastName: string; email?: string; phone?: string }) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) return;
    onAdd({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Kontakt hinzufügen</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
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
          <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit">
              Hinzufügen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// INVITE CONTACT MODAL
// ==========================================
function InviteContactModal({ 
  contact, 
  onClose 
}: { 
  contact: Person;
  onClose: () => void;
}) {
  const { sendInvite, org, teams, getChildrenByGuardian } = usePeople();
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState<"guardian_contact" | "volunteer">("guardian_contact");
  const [inviteSent, setInviteSent] = useState(false);
  const [claimUrl, setClaimUrl] = useState("");

  const linkedChildren = getChildrenByGuardian(contact.id);

  const handleSend = () => {
    const result = sendInvite({
      personId: contact.id,
      orgId: org.id,
      teamId: selectedTeam || undefined,
      role: selectedRole,
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
            <h2 className="text-xl font-bold text-slate-800 mb-2">Einladung gesendet!</h2>
            <p className="text-slate-600 mb-4">
              Die Einladung wurde an {getFullName(contact)} gesendet.
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
          <p className="text-slate-500 mt-1">An: {getFullName(contact)}</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Rolle
            </label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="guardian_contact">Erziehungsberechtigter</option>
              <option value="volunteer">Helfer</option>
            </select>
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
            <div className="p-3 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800">
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
            Einladung senden
          </Button>
        </div>
      </div>
    </div>
  );
}
