/**
 * InviteModal - Reusable invite component
 * 
 * Used to send invites from:
 * - Members page (invite member to claim account)
 * - Contacts page (invite guardian/contact)
 * - Member detail (invite guardian for a player)
 * 
 * Modes:
 * 1. Invite existing person
 * 2. Invite by email (creates contact)
 * 3. Invite guardian for specific player
 */

import { useState } from "react";
import { X, Check, Send, Mail, User, Users, Copy } from "lucide-react";
import { Button, Badge } from "../ui";
import { usePeople } from "../../contexts/PeopleContext";
import { getFullName } from "../../data/mockPeople";
import type { Person, MembershipRole, IntentTarget } from "../../types/people";

type InviteMode = "existing" | "email" | "guardian";

interface InviteModalProps {
  onClose: () => void;
  // Pre-selected person (for mode 1)
  person?: Person;
  // For guardian invite mode
  childPerson?: Person;
  // Default mode
  defaultMode?: InviteMode;
}

export function InviteModal({ 
  onClose, 
  person, 
  childPerson,
  defaultMode = person ? "existing" : childPerson ? "guardian" : "email"
}: InviteModalProps) {
  const { 
    persons, 
    sendInvite, 
    addPerson, 
    org, 
    teams
  } = usePeople();

  const [mode, setMode] = useState<InviteMode>(defaultMode);
  
  // Selection state
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(person || null);
  const [selectedChild, setSelectedChild] = useState<Person | null>(childPerson || null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState<MembershipRole>("player");
  
  // Email mode state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  // Result state
  const [inviteSent, setInviteSent] = useState(false);
  const [claimUrl, setClaimUrl] = useState("");

  // Get available persons for selection
  const availablePersons = persons.filter(p => 
    !p.hasClaimedIdentity && 
    (mode === "guardian" ? p.kind === "contact" : true)
  );

  // Get available children (minors)
  const availableChildren = persons.filter(p => {
    if (!p.dateOfBirth) return false;
    const age = new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear();
    return age < 18 && p.kind === "member";
  });

  const handleSendInvite = () => {
    try {
      let targetPerson = selectedPerson;
      let target: IntentTarget = "self";
      let role = selectedRole;

      // For email mode or guardian mode with new person, create person first
      if ((mode === "email" || mode === "guardian") && !targetPerson) {
        const newPerson = addPerson({
          firstName,
          lastName,
          email,
          kind: "contact"
        });
        targetPerson = newPerson;
      }

      // For guardian mode
      if (mode === "guardian" || selectedChild) {
        target = "child";
        role = "guardian_contact";
      }

      if (!targetPerson) return;

      const result = sendInvite({
        personId: targetPerson.id,
        orgId: org.id,
        teamId: selectedTeam || undefined,
        role,
        target,
        childPersonId: selectedChild?.id
      });

      setClaimUrl(result.invite.claimUrl);
      setInviteSent(true);
    } catch (error) {
      console.error("Failed to send invite:", error);
    }
  };

  const copyLink = () => {
    const fullUrl = window.location.origin + claimUrl;
    navigator.clipboard.writeText(fullUrl);
    alert("Link kopiert!");
  };

  // Success view
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
              Die Einladung wurde erfolgreich erstellt.
            </p>
            <div className="bg-slate-100 rounded-lg p-3 mb-4 text-left">
              <p className="text-xs text-slate-500 mb-1">Einladungslink:</p>
              <p className="text-sm text-slate-800 break-all font-mono">{claimUrl}</p>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Da wir im Demo-Modus sind, wird keine E-Mail gesendet. 
              Kopieren Sie den Link zum Testen.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={copyLink}>
                <Copy className="w-4 h-4 mr-1" /> Link kopieren
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
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Einladung senden</h2>
              <p className="text-slate-500 mt-1">
                {mode === "existing" && "Existierende Person einladen"}
                {mode === "email" && "Per E-Mail einladen"}
                {mode === "guardian" && "Erziehungsberechtigten einladen"}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Mode Selector (if not pre-set) */}
          {!person && !childPerson && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Art der Einladung</label>
              <div className="grid gap-3">
                <button
                  onClick={() => setMode("existing")}
                  className={`p-4 border-2 rounded-xl text-left flex items-center gap-3 ${
                    mode === "existing" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}
                >
                  <User className={`w-5 h-5 ${mode === "existing" ? "text-teal-500" : "text-slate-400"}`} />
                  <div>
                    <p className="font-medium text-slate-800">Existierende Person</p>
                    <p className="text-sm text-slate-500">Bereits im System angelegt</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode("email")}
                  className={`p-4 border-2 rounded-xl text-left flex items-center gap-3 ${
                    mode === "email" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}
                >
                  <Mail className={`w-5 h-5 ${mode === "email" ? "text-teal-500" : "text-slate-400"}`} />
                  <div>
                    <p className="font-medium text-slate-800">Per E-Mail einladen</p>
                    <p className="text-sm text-slate-500">Neue Person anlegen und einladen</p>
                  </div>
                </button>
                <button
                  onClick={() => setMode("guardian")}
                  className={`p-4 border-2 rounded-xl text-left flex items-center gap-3 ${
                    mode === "guardian" ? "border-teal-500 bg-teal-50" : "border-slate-200"
                  }`}
                >
                  <Users className={`w-5 h-5 ${mode === "guardian" ? "text-teal-500" : "text-slate-400"}`} />
                  <div>
                    <p className="font-medium text-slate-800">Erziehungsberechtigten</p>
                    <p className="text-sm text-slate-500">Guardian für ein Kind einladen</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Existing Person Mode */}
          {mode === "existing" && (
            <>
              {/* Person Selection */}
              {!selectedPerson && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Person auswählen</label>
                  <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg divide-y">
                    {availablePersons.length === 0 ? (
                      <p className="p-4 text-slate-500 text-center text-sm">
                        Keine Personen ohne Konto gefunden
                      </p>
                    ) : (
                      availablePersons.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPerson(p)}
                          className="w-full p-3 hover:bg-slate-50 flex items-center gap-3 text-left"
                        >
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-700 font-medium">
                              {p.firstName[0]}{p.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{getFullName(p)}</p>
                            <p className="text-sm text-slate-500">{p.email || "Keine E-Mail"}</p>
                          </div>
                          <Badge variant={p.kind === "member" ? "teal" : "default"} className="ml-auto">
                            {p.kind === "member" ? "Mitglied" : "Kontakt"}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Selected Person */}
              {selectedPerson && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-teal-700 font-medium">
                        {selectedPerson.firstName[0]}{selectedPerson.lastName[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{getFullName(selectedPerson)}</p>
                      <p className="text-sm text-slate-500">{selectedPerson.email || "Keine E-Mail"}</p>
                    </div>
                    {!person && (
                      <button
                        onClick={() => setSelectedPerson(null)}
                        className="text-sm text-teal-600 hover:text-teal-700"
                      >
                        Ändern
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email Mode */}
          {mode === "email" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
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
            </div>
          )}

          {/* Guardian Mode - Child Selection */}
          {mode === "guardian" && (
            <>
              {!selectedChild && !childPerson && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">Kind auswählen</label>
                  <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg divide-y">
                    {availableChildren.map(child => (
                      <button
                        key={child.id}
                        onClick={() => setSelectedChild(child)}
                        className="w-full p-3 hover:bg-slate-50 flex items-center gap-3 text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                          <span className="text-amber-700 font-medium text-sm">
                            {child.firstName[0]}{child.lastName[0]}
                          </span>
                        </div>
                        <span className="font-medium text-slate-800">{getFullName(child)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(selectedChild || childPerson) && (
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Für Kind:</strong> {getFullName(selectedChild || childPerson!)}
                  </p>
                </div>
              )}

              {/* Guardian Email Input */}
              {(selectedChild || childPerson) && (
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Geben Sie die Daten des Erziehungsberechtigten ein:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Vorname</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nachname</label>
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
                </div>
              )}
            </>
          )}

          {/* Role & Team Selection (for existing person mode) */}
          {mode === "existing" && selectedPerson && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rolle</label>
                <select
                  value={selectedRole}
                  onChange={e => setSelectedRole(e.target.value as MembershipRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="player">Spieler</option>
                  <option value="coach">Trainer</option>
                  <option value="guardian_contact">Erziehungsberechtigter</option>
                  <option value="volunteer">Helfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Team (optional)</label>
                <select
                  value={selectedTeam}
                  onChange={e => setSelectedTeam(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Kein spezifisches Team</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSendInvite}
            disabled={
              (mode === "existing" && !selectedPerson) ||
              (mode === "email" && (!firstName || !lastName || !email)) ||
              (mode === "guardian" && ((!selectedChild && !childPerson) || !firstName || !lastName || !email))
            }
          >
            <Send className="w-4 h-4 mr-1" />
            Einladung senden
          </Button>
        </div>
      </div>
    </div>
  );
}
