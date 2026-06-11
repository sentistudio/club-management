import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { mockLineups, FORMATION_SLOTS, type LineupPosition } from "../../data/mockLineups";
import { getRosterByTeam } from "../../data/mockTeamRoster";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";

export function LineupEditor() {
  const { teamId, lineupId } = useParams<{ teamId: string; lineupId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();

  const lineup = mockLineups.find(l => l.id === lineupId);
  const roster = getRosterByTeam(teamId!, currentSeason.id);
  const players = roster.filter(r => r.role === "player");

  const [positions, setPositions] = useState<LineupPosition[]>(lineup?.positions ?? []);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  if (!lineup) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Aufstellung nicht gefunden.</p>
        <Link to={`/teams/${teamId}/lineups`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zu Aufstellungen
        </Link>
      </div>
    );
  }

  const slots = FORMATION_SLOTS[lineup.formation] ?? [];

  function assignPlayer(personId: string) {
    if (!selectedSlot) return;
    setPositions(prev =>
      prev.map(p =>
        p.slot === selectedSlot ? { ...p, personId } : p
      )
    );
    setSelectedSlot(null);
  }

  function clearSlot(slot: string) {
    setPositions(prev =>
      prev.map(p => p.slot === slot ? { ...p, personId: undefined } : p)
    );
  }

  const assignedPersonIds = new Set(positions.filter(p => p.personId).map(p => p.personId!));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/teams/${teamId}/lineups`}
          className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu Aufstellungen
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">{lineup.name}</h1>
          <p className="text-sm text-neutral-500">{lineup.formation}</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
          Speichern
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pitch */}
        <div className="lg:col-span-2">
          <Card padding="md">
            {selectedSlot && (
              <div className="mb-3 px-3 py-2 bg-teal-50 border border-teal-200 rounded-lg text-sm text-teal-700">
                Position <strong>{slots.find(s => s.slot === selectedSlot)?.label}</strong> ausgewählt — Spieler aus der Liste zuweisen
              </div>
            )}
            <div className="relative w-full aspect-[2/3] bg-emerald-700 rounded-[10px] overflow-hidden">
              {/* Pitch markings */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-0 right-0 border-t border-emerald-500/40" />
                <div className="absolute inset-[8%] border border-emerald-500/30 rounded" />
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/30" />
                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square rounded-full border border-emerald-500/30" />
              </div>

              {slots.map(slotDef => {
                const pos = positions.find(p => p.slot === slotDef.slot);
                const person = pos?.personId ? getPersonDisplay(pos.personId) : null;
                const isSelected = selectedSlot === slotDef.slot;
                return (
                  <div
                    key={slotDef.slot}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5 cursor-pointer group"
                    style={{ left: `${slotDef.x}%`, top: `${slotDef.y}%` }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSlot(null);
                      } else if (pos?.personId) {
                        clearSlot(slotDef.slot);
                      } else {
                        setSelectedSlot(slotDef.slot);
                      }
                    }}
                  >
                    {person?.avatarUrl ? (
                      <img
                        src={person.avatarUrl}
                        alt={person.fullName}
                        className={`w-9 h-9 rounded-full border-2 object-cover shadow ${
                          isSelected ? "border-yellow-400" : "border-white"
                        }`}
                      />
                    ) : (
                      <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center shadow text-xs font-bold ${
                        isSelected
                          ? "border-yellow-400 bg-yellow-400 text-neutral-800"
                          : pos?.personId
                          ? "border-white bg-white text-neutral-800"
                          : "border-emerald-400/60 bg-emerald-600/50 text-emerald-200 group-hover:border-white/80"
                      }`}>
                        {pos?.personId ? (getPersonInitials(getPersonDisplay(pos.personId)) || pos.jerseyNumber) : slotDef.label}
                      </div>
                    )}
                    {person && (
                      <span className="text-[9px] text-white/80 font-medium leading-none max-w-[44px] text-center truncate">
                        {person.lastName}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {lineup.notes && (
              <p className="mt-3 text-xs text-neutral-500 italic">{lineup.notes}</p>
            )}
          </Card>
        </div>

        {/* Player list */}
        <div>
          <Card padding="md">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Kader
            </h2>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto">
              {players.map(entry => {
                const person = getPersonDisplay(entry.personId);
                const initials = getPersonInitials(person);
                const isAssigned = assignedPersonIds.has(entry.personId);
                return (
                  <button
                    key={entry.personId}
                    onClick={() => selectedSlot && assignPlayer(entry.personId)}
                    disabled={isAssigned}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                      isAssigned
                        ? "opacity-40 cursor-not-allowed"
                        : selectedSlot
                        ? "hover:bg-teal-50 cursor-pointer"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    {person.avatarUrl ? (
                      <img src={person.avatarUrl} alt={person.fullName} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-teal-700">{initials}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{person.fullName}</p>
                      <p className="text-xs text-neutral-400">{entry.jerseyNumber ? `#${entry.jerseyNumber}` : ""}</p>
                    </div>
                    {isAssigned && (
                      <span className="text-xs text-neutral-300">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
