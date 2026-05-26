import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Shield } from "lucide-react";
import { Card } from "../../components/ui/Card";
import { useEffectiveSeason } from "../../hooks/useEffectiveSeason";
import { useRole } from "../../contexts";
import { getRosterByTeam, getPositionLabel, type PlayerPosition } from "../../data/mockTeamRoster";
import { getPersonDisplay, getPersonInitials } from "../../data/personHelpers";
import { getTasksForPerson, TASK_STATUS_LABELS } from "../../data/mockTaskGroups";

function AttendanceBar({ attended, invited }: { attended: number; invited: number }) {
  const rate = invited > 0 ? Math.round(attended / invited * 100) : 0;
  const color = rate >= 80 ? "bg-emerald-500" : rate >= 60 ? "bg-amber-400" : "bg-red-400";
  const textColor = rate >= 80 ? "text-emerald-600" : rate >= 60 ? "text-amber-600" : "text-red-500";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-neutral-600">Anwesenheitsrate</span>
        <span className={`text-sm font-bold ${textColor}`}>{rate}%</span>
      </div>
      <div className="w-full bg-neutral-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${rate}%` }} />
      </div>
      <div className="flex gap-4 text-xs text-neutral-500 pt-1">
        <span>✅ {attended} anwesend</span>
        <span>🗓 {invited} eingeladen</span>
        <span>❌ {invited - attended} gefehlt</span>
      </div>
    </div>
  );
}

export function PlayerDetail() {
  const { teamId, personId } = useParams<{ teamId: string; personId: string }>();
  const { effectiveSeason: currentSeason } = useEffectiveSeason();
  const { activeRole } = useRole();
  const isCoachOrAdmin = activeRole === "admin" || activeRole === "coach";

  const roster = getRosterByTeam(teamId!, currentSeason.id);
  const entry = roster.find(r => r.personId === personId);
  const person = getPersonDisplay(personId!);
  const initials = getPersonInitials(person);
  const tasks = getTasksForPerson(personId!);

  if (!entry) {
    return (
      <div className="p-6">
        <p className="text-neutral-400">Spieler nicht im Kader dieser Saison.</p>
        <Link to={`/teams/${teamId}/players`} className="text-teal-600 text-sm mt-2 inline-block">
          ← Zurück zum Kader
        </Link>
      </div>
    );
  }

  const roleLabel =
    entry.role === "coach" ? "Cheftrainer" :
    entry.role === "assistant_coach" ? "Co-Trainer" :
    "Spieler";

  const positionLabel = entry.position ? getPositionLabel(entry.position as PlayerPosition) : null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to={`/teams/${teamId}/players`}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Kader
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card padding="md" className="flex flex-col items-center gap-4 text-center lg:col-span-1">
          {person.avatarUrl ? (
            <img src={person.avatarUrl} alt={person.fullName} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
              <span className="text-teal-700 font-bold text-2xl">{initials}</span>
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{person.fullName}</h1>
            <p className="text-sm text-neutral-500">{roleLabel}</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {entry.jerseyNumber !== undefined && (
              <span className="bg-teal-100 text-teal-700 text-sm font-bold px-3 py-1 rounded-full">
                #{entry.jerseyNumber}
              </span>
            )}
            {positionLabel && (
              <span className="bg-neutral-100 text-neutral-600 text-sm px-3 py-1 rounded-full">
                {positionLabel}
              </span>
            )}
            {entry.isCaptain && (
              <span className="bg-amber-100 text-amber-700 text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3" /> Kapitän
              </span>
            )}
          </div>

          {/* Contact info */}
          {isCoachOrAdmin && (
            <div className="w-full border-t border-neutral-100 pt-4 space-y-2">
              {person.email && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <a href={`mailto:${person.email}`} className="truncate hover:text-teal-600">
                    {person.email}
                  </a>
                </div>
              )}
              {person.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <span>{new Date(person.dateOfBirth).toLocaleDateString("de-DE")}</span>
                </div>
              )}
              <p className="text-xs text-neutral-400">
                Im Team seit {new Date(entry.joinedTeamAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
              </p>
            </div>
          )}
        </Card>

        {/* Stats + Tasks */}
        <div className="lg:col-span-2 space-y-5">
          {/* Attendance */}
          <Card padding="md">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Anwesenheit ({currentSeason.label})</h2>
            <AttendanceBar
              attended={entry.attendanceStats.attended}
              invited={entry.attendanceStats.invited}
            />
          </Card>

          {/* Tasks */}
          {tasks.length > 0 && (
            <Card padding="md">
              <h2 className="text-sm font-semibold text-neutral-900 mb-3">Aufgaben</h2>
              <div className="space-y-2">
                {tasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-start gap-3 py-2 border-b border-neutral-50 last:border-0">
                    <span className={`mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                      task.status === "done" ? "bg-emerald-100 text-emerald-700" :
                      task.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                      "bg-neutral-100 text-neutral-600"
                    }`}>
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${task.status === "done" ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                        {task.title}
                      </p>
                      {task.dueDate && (
                        <p className="text-xs text-neutral-400">
                          Fällig: {new Date(task.dueDate + "T00:00:00").toLocaleDateString("de-DE")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {tasks.length > 5 && (
                <Link to={`/teams/${teamId}/tasks`} className="text-xs text-teal-600 hover:text-teal-700 mt-2 inline-block">
                  Alle {tasks.length} Aufgaben anzeigen →
                </Link>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
