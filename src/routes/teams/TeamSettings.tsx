import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Settings, Users, Megaphone, MessageSquare,
  Plus, X, Eye, EyeOff, UserCog, Lock, CalendarDays
} from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useTeamVisibility, type PositionSchema } from "../../contexts/TeamVisibilityContext";
import { useRole } from "../../contexts";
import { mockTeams } from "../../data/mockTeams";
import { getSeasonsByTeam, type SeasonStatus } from "../../data/mockSeasons";
import { getRosterByTeam } from "../../data/mockTeamRoster";
import { getPersonDisplay } from "../../data/personHelpers";

const GENDER_LABELS: Record<string, string> = {
  m: "Männlich",
  w: "Weiblich",
  mixed: "Gemischt"
};

interface SpecialChat {
  id: string;
  name: string;
  type: "parent_only" | "coaches_only" | "custom";
}

export function TeamSettings() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isAdmin = activeRole === "admin";

  // Chat toggles
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);
  const [groupEnabled, setGroupEnabled]               = useState(true);
  const [directEnabled, setDirectEnabled]             = useState(false);
  // Visibility (shared via context so other views can read them)
  const { settings: vis, updateSetting } = useTeamVisibility();
  // Special chats
  const [specialChats, setSpecialChats] = useState<SpecialChat[]>([
    { id: "sc_1", name: "Elterngruppe", type: "parent_only" },
  ]);
  const [showSpecialChatPicker, setShowSpecialChatPicker] = useState(false);

  const team = mockTeams.find(t => t.id === teamId);
  const teamSeasons = getSeasonsByTeam(teamId!);
  const roster = getRosterByTeam(teamId!, currentSeason.id);
  const coaches = roster.filter(r => r.role !== "player");

  if (!team) {
    return <div className="p-6"><p className="text-neutral-400">Team nicht gefunden.</p></div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-lg font-semibold text-neutral-900">Einstellungen</h2>
        <p className="text-sm text-neutral-500">Team-Konfiguration und Zugangsverwaltung</p>
      </div>

      {/* Saisonmodus */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Saisonmodus</h3>
        </div>

        <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-[10px] border border-neutral-100 mb-4">
          <div>
            <p className="text-sm font-medium text-neutral-800">Saisonverwaltung aktiviert</p>
            <p className="text-xs text-neutral-500">
              Kader, Termine und Inhalte werden pro Saison organisiert. Der Saison-Wechsler erscheint im Team-Header.
            </p>
          </div>
          <button
            disabled={!isAdmin}
            onClick={() => updateSetting("saisonEnabled", !vis.saisonEnabled)}
            className={`ml-4 w-10 h-5 rounded-full transition-colors relative flex-shrink-0 disabled:opacity-50 ${vis.saisonEnabled ? "bg-teal-500" : "bg-neutral-200"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${vis.saisonEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>

        {vis.saisonEnabled && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-2">Saisons dieses Teams</p>
            {teamSeasons.map(s => {
              const STATUS_CFG: Record<SeasonStatus, { label: string; dot: string; text: string; bg: string }> = {
                active:   { label: "Aktiv",      dot: "bg-teal-500",    text: "text-teal-700",   bg: "bg-teal-50"    },
                planned:  { label: "Geplant",    dot: "bg-amber-400",   text: "text-amber-700",  bg: "bg-amber-50"   },
                archived: { label: "Archiviert", dot: "bg-neutral-300", text: "text-neutral-500",bg: "bg-neutral-50" },
              };
              const cfg = STATUS_CFG[s.status];
              return (
                <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg border border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    <span className="text-sm font-medium text-neutral-800">{s.label}</span>
                    <span className="text-xs text-neutral-400">
                      {new Date(s.startDate).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "2-digit" })}
                      {" – "}
                      {new Date(s.endDate).toLocaleDateString("de-DE", { day: "numeric", month: "short", year: "2-digit" })}
                    </span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Team info */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Team-Informationen</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Name</label>
            <input
              type="text"
              defaultValue={team.name}
              disabled={!isAdmin}
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-neutral-50 disabled:text-neutral-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Altersgruppe</label>
              <input
                type="text"
                defaultValue={team.ageGroup ?? ""}
                disabled={!isAdmin}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-neutral-50 disabled:text-neutral-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Geschlecht</label>
              <select
                defaultValue={team.gender ?? "mixed"}
                disabled={!isAdmin}
                className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-neutral-50 disabled:text-neutral-400"
              >
                {Object.entries(GENDER_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          {isAdmin && (
            <div className="flex justify-end">
              <Button variant="primary" size="sm">Speichern</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Coaches */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-neutral-400" />
            <h3 className="text-sm font-semibold text-neutral-900">Trainer & Betreuer</h3>
          </div>
          {isAdmin && (
            <Button variant="secondary" size="sm">Trainer hinzufügen</Button>
          )}
        </div>
        <div className="space-y-2">
          {coaches.map(entry => {
            const person = getPersonDisplay(entry.personId);
            const roleLabel =
              entry.role === "coach" ? "Cheftrainer" :
              entry.role === "assistant_coach" ? "Co-Trainer" :
              "Torwarttrainer";
            return (
              <div key={entry.id} className="flex items-center justify-between py-2 border-b border-neutral-50 last:border-0">
                <div className="flex items-center gap-3">
                  {person.avatarUrl ? (
                    <img src={person.avatarUrl} alt={person.fullName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-neutral-600">
                        {person.firstName[0]}{person.lastName[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-800">{person.fullName}</p>
                    <p className="text-xs text-neutral-400">{roleLabel}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button className="text-xs text-red-400 hover:text-red-600">Entfernen</button>
                )}
              </div>
            );
          })}
          {coaches.length === 0 && (
            <p className="text-sm text-neutral-400 py-4 text-center">Keine Trainer zugewiesen</p>
          )}
        </div>
      </Card>

      {/* Chat settings */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Chats</h3>
        </div>

        {/* Chat type toggles */}
        <div className="space-y-2 mb-5">
          {/* Announcement */}
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-[10px] border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">Ankündigungs-Chat</p>
                <p className="text-xs text-neutral-500">Nur Trainer können posten</p>
              </div>
            </div>
            <button
              disabled={!isAdmin}
              onClick={() => setAnnouncementEnabled(v => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${announcementEnabled ? "bg-teal-500" : "bg-neutral-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${announcementEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Group */}
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-[10px] border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">Gruppen-Chat</p>
                <p className="text-xs text-neutral-500">Alle Mitglieder können schreiben</p>
              </div>
            </div>
            <button
              disabled={!isAdmin}
              onClick={() => setGroupEnabled(v => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${groupEnabled ? "bg-teal-500" : "bg-neutral-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${groupEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Direct messages */}
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-[10px] border border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-800">Direktnachrichten</p>
                <p className="text-xs text-neutral-500">Private Chats zwischen Mitgliedern</p>
              </div>
            </div>
            <button
              disabled={!isAdmin}
              onClick={() => setDirectEnabled(v => !v)}
              className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${directEnabled ? "bg-teal-500" : "bg-neutral-200"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${directEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Youth protection — shown when DMs are off for teams with minors */}
          {!directEnabled && (
            <div className="flex items-center gap-3 p-3 bg-pink-50 border border-pink-200 rounded-[10px]">
              <Lock className="w-4 h-4 text-pink-500 flex-shrink-0" />
              <p className="text-xs text-pink-700">
                Direktnachrichten deaktiviert — empfohlen für Jugendteams. DMs zwischen Trainer und Minderjährigen nur mit Eltern-CC.
              </p>
            </div>
          )}
        </div>

        {/* Special chats */}
        <div className="border-t border-neutral-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Spezial-Chats</p>
            {isAdmin && (
              <button
                onClick={() => setShowSpecialChatPicker(v => !v)}
                className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
              >
                <Plus className="w-3.5 h-3.5" /> Hinzufügen
              </button>
            )}
          </div>

          {/* Picker */}
          {showSpecialChatPicker && (
            <div className="mb-3 p-3 bg-neutral-50 rounded-[10px] ring-1 ring-gray-100 shadow-xs space-y-2">
              {[
                { type: "parent_only" as const, label: "Elterngruppe", desc: "Automatisch alle Eltern des Teams", icon: Users, color: "bg-amber-100 text-amber-600" },
                { type: "coaches_only" as const, label: "Trainer-Gruppe", desc: "Nur Trainer & Betreuer", icon: UserCog, color: "bg-blue-100 text-blue-600" },
                { type: "custom" as const, label: "Manueller Chat", desc: "Mitglieder selbst auswählen", icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.type}
                    onClick={() => {
                      setSpecialChats(prev => [...prev, { id: `sc_${Date.now()}`, name: opt.label, type: opt.type }]);
                      setShowSpecialChatPicker(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 bg-white rounded-lg border border-neutral-100 hover:border-neutral-300 transition-colors text-left"
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${opt.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{opt.label}</p>
                      <p className="text-xs text-neutral-500">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {specialChats.length === 0 ? (
            <p className="text-xs text-neutral-400 py-2">Keine Spezial-Chats eingerichtet</p>
          ) : (
            <div className="space-y-1.5">
              {specialChats.map(chat => {
                const cfg = {
                  parent_only:  { label: "Eltern",  bg: "bg-amber-100", text: "text-amber-700", Icon: Users },
                  coaches_only: { label: "Trainer", bg: "bg-blue-100",  text: "text-blue-700",  Icon: UserCog },
                  custom:       { label: "Manuell", bg: "bg-purple-100",text: "text-purple-700",Icon: MessageSquare },
                }[chat.type];
                return (
                  <div key={chat.id} className="flex items-center gap-3 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${cfg.bg}`}>
                      <cfg.Icon className={`w-3.5 h-3.5 ${cfg.text}`} />
                    </div>
                    <span className="flex-1 text-sm text-neutral-700">{chat.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                    {isAdmin && (
                      <button onClick={() => setSpecialChats(prev => prev.filter(c => c.id !== chat.id))} className="p-0.5 hover:text-red-500 text-neutral-300 transition-colors">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Visibility */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Sichtbarkeit für Spieler</h3>
        </div>
        <div className="space-y-2">
          {([
            { key: "seasonVisible",     label: "Saison sichtbar",       sub: "Mitglieder sehen Termine, Ergebnisse und Inhalte dieser Saison" },
            { key: "uebungenVisible",   label: "Übungen sichtbar",       sub: "Spieler können Übungen und Trainingspakete einsehen" },
            { key: "wissenVisible",     label: "Wissen sichtbar",        sub: "Spieler können Artikel der Wissensdatenbank lesen" },
            { key: "aufgabenVisible",   label: "Aufgaben sichtbar",      sub: "Spieler sehen ihnen zugewiesene Aufgaben" },
            { key: "aufstellungVisible",label: "Aufstellung sichtbar",   sub: "Spieler können die geplante Aufstellung einsehen" },
          ] as const).map(({ key, label, sub }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-[10px] border border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                  {vis[key] ? <Eye className="w-4 h-4 text-teal-500" /> : <EyeOff className="w-4 h-4 text-neutral-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{label}</p>
                  <p className="text-xs text-neutral-500">{sub}</p>
                </div>
              </div>
              <button
                disabled={!isAdmin}
                onClick={() => updateSetting(key, !vis[key])}
                className={`w-10 h-5 rounded-full transition-colors relative disabled:opacity-50 ${vis[key] ? "bg-teal-500" : "bg-neutral-200"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${vis[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Position schema */}
      <Card padding="md">
        <div className="flex items-center gap-2 mb-1">
          <UserCog className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-900">Positionsschema</h3>
        </div>
        <p className="text-xs text-neutral-500 mb-4 ml-6">
          Bestimmt, welche Positionsfilter im Kader angezeigt werden.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {([
            { value: "auto",       label: "Automatisch",  sub: "Basierend auf Abteilung" },
            { value: "football",   label: "Fußball",      sub: "Torwart · Abwehr · Mittelfeld · Sturm" },
            { value: "volleyball", label: "Volleyball",   sub: "Zuspieler · Libero · Angreifer · Blocker" },
            { value: "handball",   label: "Handball",     sub: "Torwart · Rückraum · Außen · Kreis" },
            { value: "fitness",    label: "Fitness",      sub: "Keine Positionsfilter" },
            { value: "none",       label: "Keine",        sub: "Filter ausblenden" },
          ] as { value: PositionSchema; label: string; sub: string }[]).map(opt => {
            const isSelected = vis.positionSchema === opt.value;
            return (
              <button
                key={opt.value}
                disabled={!isAdmin}
                onClick={() => updateSetting("positionSchema", opt.value)}
                className={`text-left p-3 rounded-[10px] border-2 transition-all disabled:opacity-50 ${
                  isSelected
                    ? "border-teal-500 bg-teal-50"
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                }`}
              >
                <p className={`text-sm font-medium ${isSelected ? "text-teal-700" : "text-neutral-800"}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5 leading-tight">{opt.sub}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Danger zone (admin only) */}
      {isAdmin && (
        <Card padding="md" className="border-red-200">
          <h3 className="text-sm font-semibold text-red-600 mb-3">Gefahrenzone</h3>
          <p className="text-xs text-neutral-500 mb-3">
            Das Löschen des Teams entfernt alle Daten dauerhaft. Diese Aktion kann nicht rückgängig gemacht werden.
          </p>
          <Button variant="danger" size="sm">Team löschen</Button>
        </Card>
      )}
    </div>
  );
}
