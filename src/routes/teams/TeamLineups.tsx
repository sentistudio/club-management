import { useParams, Link } from "react-router-dom";
import { Plus, EyeOff } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useTeamVisibility } from "../../contexts/TeamVisibilityContext";
import { useRole } from "../../contexts";
import { mockLineups, FORMATION_SLOTS } from "../../data/mockLineups";
import { getTeamEventsByTeam } from "../../data/mockTeamEvents";
import { getPersonDisplay } from "../../data/personHelpers";

function PitchPreview({ lineupId }: { lineupId: string }) {
  const lineup = mockLineups.find(l => l.id === lineupId);
  if (!lineup) return null;
  const slots = FORMATION_SLOTS[lineup.formation] ?? [];

  return (
    <div className="relative w-full aspect-[2/3] bg-emerald-700 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 border-t border-emerald-500/30" />
        <div className="absolute inset-[8%] border border-emerald-500/20 rounded" />
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/20" />
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[35%] h-[14%] border border-emerald-500/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18%] aspect-square rounded-full border border-emerald-500/20" />
      </div>
      {slots.map(slotDef => {
        const pos = lineup.positions.find(p => p.slot === slotDef.slot);
        const person = pos?.personId ? getPersonDisplay(pos.personId) : null;
        return (
          <div
            key={slotDef.slot}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5"
            style={{ left: `${slotDef.x}%`, top: `${slotDef.y}%` }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold shadow ${
              pos?.personId ? "bg-white text-neutral-800" : "bg-emerald-600/40 text-emerald-300"
            }`}>
              {pos?.jerseyNumber ?? slotDef.label}
            </div>
            {person && (
              <span className="text-[7px] text-white/70 leading-none max-w-[36px] text-center truncate">
                {person.lastName}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function TeamLineups() {
  const { teamId } = useParams<{ teamId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";
  const { settings: vis } = useTeamVisibility();

  const lineups = mockLineups.filter(l => l.teamId === teamId && l.seasonId === currentSeason.id);
  const events = getTeamEventsByTeam(teamId!, currentSeason.id);

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Aufstellungen</h2>
          <p className="text-sm text-neutral-500">{lineups.length} Aufstellungen</p>
        </div>
        {isCoachOrAdmin && (
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Neue Aufstellung
          </Button>
        )}
      </div>

      {/* Visibility disclaimer */}
      {isCoachOrAdmin && !vis.aufstellungVisible && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-[10px] text-sm text-amber-800">
          <EyeOff className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>Dieser Bereich ist für Spieler <strong>nicht sichtbar</strong>. <Link to="../settings" className="underline font-medium hover:text-amber-900">In Einstellungen aktivieren →</Link></span>
        </div>
      )}

      {lineups.length === 0 ? (
        <Card padding="md">
          <p className="text-sm text-neutral-400 text-center py-8">Keine Aufstellungen vorhanden</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lineups.map(lineup => {
            const linkedMatch = lineup.linkedMatchId
              ? events.find(e => e.id === lineup.linkedMatchId)
              : null;
            const filledCount = lineup.positions.filter(p => p.personId).length;
            return (
              <Link key={lineup.id} to={`/teams/${teamId}/lineups/${lineup.id}`}>
                <Card padding="none" hover className="overflow-hidden">
                  <div className="p-3 pb-0">
                    <PitchPreview lineupId={lineup.id} />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-neutral-900 truncate">{lineup.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{lineup.formation}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-neutral-400">
                        {filledCount}/{lineup.positions.length} besetzt
                      </span>
                      {linkedMatch && (
                        <span className="text-xs text-emerald-600 font-medium">
                          ⚽ vs. {linkedMatch.opponent}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-300 mt-1">
                      {new Date(lineup.createdAt).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
