/**
 * MemberGuardianSection - Guardian management for member profiles
 * 
 * Shows:
 * - List of linked guardians (for minors)
 * - Permissions per guardian
 * - Add guardian button
 * - Invite guardian functionality
 */

import { useState } from "react";
import { Plus, Mail, Phone, Check, X, Link2, Send, UserPlus } from "lucide-react";
import { Button, Badge } from "../ui";
import { usePeople } from "../../contexts/PeopleContext";
import { getFullName, getStatusLabel } from "../../data/mockPeople";
import { InviteModal } from "./InviteModal";
import type { Person } from "../../types/people";

interface MemberGuardianSectionProps {
  member: Person;
  onRefresh?: () => void;
}

export function MemberGuardianSection({ member, onRefresh }: MemberGuardianSectionProps) {
  const { 
    getGuardiansByChild, 
    addGuardianLink, 
    getContacts,
    addPerson
  } = usePeople();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const guardians = getGuardiansByChild(member.id);
  const availableContacts = getContacts().filter(
    c => !guardians.some(g => g.guardian.id === c.id)
  );

  // Check if member is a minor
  const isMinor = member.dateOfBirth 
    ? new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear() < 18
    : false;

  if (!isMinor) {
    return null;
  }

  const handleAddExistingContact = (contact: Person) => {
    addGuardianLink({
      guardianPersonId: contact.id,
      childPersonId: member.id
    });
    setShowAddModal(false);
    onRefresh?.();
  };

  const handleCreateAndLink = (data: { firstName: string; lastName: string; email?: string; phone?: string }) => {
    const newContact = addPerson({
      ...data,
      kind: "contact"
    });
    addGuardianLink({
      guardianPersonId: newContact.id,
      childPersonId: member.id
    });
    setShowAddModal(false);
    onRefresh?.();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">
          Erziehungsberechtigte ({guardians.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Hinzufügen
        </Button>
      </div>

      {/* Guardian List */}
      {guardians.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl">
          <UserPlus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Keine Erziehungsberechtigten verknüpft</p>
          <p className="text-sm text-slate-500 mb-4">
            Fügen Sie einen Erziehungsberechtigten hinzu oder senden Sie eine Einladung
          </p>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-1" /> Kontakt verknüpfen
            </Button>
            <Button size="sm" onClick={() => setShowInviteModal(true)}>
              <Send className="w-4 h-4 mr-1" /> Einladung senden
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {guardians.map(({ guardian, link }) => (
            <div 
              key={link.id}
              className="p-4 bg-slate-50 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {guardian.avatarUrl ? (
                    <img 
                      src={guardian.avatarUrl} 
                      alt={getFullName(guardian)}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-700 font-medium">
                        {guardian.firstName[0]}{guardian.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-800">{getFullName(guardian)}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {guardian.email && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {guardian.email}
                        </span>
                      )}
                      {guardian.phone && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {guardian.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={link.status === "active" ? "success" : "warning"}
                >
                  {getStatusLabel(link.status)}
                </Badge>
              </div>

              {/* Permissions */}
              <div className="mt-3 flex flex-wrap gap-2">
                {link.permissions.manageRsvp && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> RSVP
                  </span>
                )}
                {link.permissions.viewComms && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> Kommunikation
                  </span>
                )}
                {link.permissions.payFees && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> Beiträge
                  </span>
                )}
                {link.permissions.editProfile && (
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> Profil bearbeiten
                  </span>
                )}
              </div>

              {/* Account Status */}
              {!guardian.hasClaimedIdentity && (
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs text-amber-600">Konto noch nicht aktiviert</span>
                  <Button variant="ghost" size="sm">
                    <Send className="w-3 h-3 mr-1" /> Einladung senden
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Weiteren Erziehungsberechtigten einladen
          </button>
        </div>
      )}

      {/* Add Guardian Modal */}
      {showAddModal && (
        <AddGuardianModal
          onClose={() => setShowAddModal(false)}
          availableContacts={availableContacts}
          onSelectContact={handleAddExistingContact}
          onCreateNew={handleCreateAndLink}
          onInvite={() => {
            setShowAddModal(false);
            setShowInviteModal(true);
          }}
        />
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          childPerson={member}
          defaultMode="guardian"
        />
      )}
    </div>
  );
}

// ==========================================
// ADD GUARDIAN MODAL
// ==========================================
function AddGuardianModal({
  onClose,
  availableContacts,
  onSelectContact,
  onCreateNew,
  onInvite
}: {
  onClose: () => void;
  availableContacts: Person[];
  onSelectContact: (contact: Person) => void;
  onCreateNew: (data: { firstName: string; lastName: string; email?: string; phone?: string }) => void;
  onInvite: () => void;
}) {
  const [mode, setMode] = useState<"select" | "create">("select");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleCreate = () => {
    if (!firstName || !lastName) return;
    onCreateNew({
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Erziehungsberechtigten hinzufügen</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Mode Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setMode("select")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                mode === "select" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Kontakt auswählen
            </button>
            <button
              onClick={() => setMode("create")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                mode === "create" 
                  ? "bg-white text-slate-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Neu anlegen
            </button>
          </div>

          {/* Select Mode */}
          {mode === "select" && (
            <div className="space-y-3">
              {availableContacts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-500 mb-3">Keine verfügbaren Kontakte</p>
                  <Button variant="outline" size="sm" onClick={() => setMode("create")}>
                    Neuen Kontakt anlegen
                  </Button>
                </div>
              ) : (
                <div className="divide-y border rounded-lg">
                  {availableContacts.map(contact => (
                    <button
                      key={contact.id}
                      onClick={() => onSelectContact(contact)}
                      className="w-full p-3 hover:bg-slate-50 flex items-center gap-3 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <span className="text-teal-700 font-medium">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{getFullName(contact)}</p>
                        <p className="text-sm text-slate-500">{contact.email || "Keine E-Mail"}</p>
                      </div>
                      <Link2 className="w-4 h-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Create Mode */}
          {mode === "create" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vorname *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nachname *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-Mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {/* Invite Option */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={onInvite}
              className="w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Einladung per E-Mail senden
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          {mode === "create" && (
            <Button onClick={handleCreate} disabled={!firstName || !lastName}>
              Anlegen und verknüpfen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
