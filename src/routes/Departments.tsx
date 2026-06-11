import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Building2, Users, Shield, Settings, X } from "lucide-react";
import { Card, Button, Badge, Select } from "../components/ui";
import { mockDepartments } from "../data/mockDepartments";
import { mockTeams } from "../data/mockTeams";
import { getRosterByTeam } from "../data/mockTeamRoster";
import { CURRENT_SEASON_ID } from "../data/mockSeasons";
import type { Department, DepartmentKind } from "../types/domain";

const KIND_CONFIG: Record<DepartmentKind, { label: string; color: string; gradient: string }> = {
  sport:  { label: "Sport",       color: "bg-emerald-100 text-emerald-700", gradient: "from-emerald-400 to-emerald-600" },
  admin:  { label: "Verwaltung",  color: "bg-sky-100 text-sky-700",         gradient: "from-sky-400 to-sky-600" },
};

function CreateDepartmentModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (dept: Department) => void;
}) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<DepartmentKind>("sport");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Name ist erforderlich."); return; }
    const id = `dept_${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    onCreate({ id, clubId: "club1", name: name.trim(), kind, isActive });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-semibold text-neutral-900">Neue Abteilung</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="z.B. Leichtathletik"
              className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Typ</label>
            <Select
              options={[
                { value: "sport", label: "Sport" },
                { value: "admin", label: "Verwaltung" }
              ]}
              value={kind}
              onChange={e => setKind(e.target.value as DepartmentKind)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-neutral-700">Aktiv</p>
              <p className="text-xs text-neutral-400">Sofort als aktive Abteilung anlegen</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(v => !v)}
              className={`w-10 h-6 rounded-full transition-colors relative ${isActive ? "bg-teal-500" : "bg-neutral-200"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Abbrechen</Button>
            <Button type="submit" variant="primary" className="flex-1">Erstellen</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Departments() {
  const navigate = useNavigate();
  const [kindFilter, setKindFilter] = useState<DepartmentKind | "">("");
  const [showCreate, setShowCreate] = useState(false);
  const [extraDepts, setExtraDepts] = useState<Department[]>([]);

  const allDepts = useMemo(() => [...mockDepartments, ...extraDepts], [extraDepts]);

  const departmentsWithDetails = useMemo(() => {
    return allDepts.map(dept => {
      const teams = mockTeams.filter(t => t.departmentId === dept.id && t.isActive);
      const memberIds = new Set(
        teams.flatMap(t => getRosterByTeam(t.id, CURRENT_SEASON_ID).map(r => r.personId))
      );
      return { ...dept, teamCount: teams.length, memberCount: memberIds.size };
    });
  }, [allDepts]);

  const filteredDepartments = useMemo(() =>
    departmentsWithDetails.filter(d => !kindFilter || d.kind === kindFilter),
    [departmentsWithDetails, kindFilter]
  );

  // Stats derived from real data
  const stats = useMemo(() => {
    const linkedTeams = mockTeams.filter(t => t.isActive && allDepts.some(d => d.id === t.departmentId));
    const globalMemberIds = new Set(
      linkedTeams.flatMap(t => getRosterByTeam(t.id, CURRENT_SEASON_ID).map(r => r.personId))
    );
    return {
      total: allDepts.length,
      active: allDepts.filter(d => d.isActive).length,
      teams: linkedTeams.length,
      members: globalMemberIds.size,
    };
  }, [allDepts]);

  const kindOptions = Object.entries(KIND_CONFIG).map(([value, { label }]) => ({ value, label }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Abteilungen</h1>
          <p className="text-neutral-500 mt-1">Vereinsstruktur und Abteilungen verwalten</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
          Neue Abteilung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Building2, bg: "bg-neutral-100",  iconCls: "text-neutral-600",  valueCls: "text-neutral-800",  value: stats.total,   label: "Abteilungen" },
          { icon: Building2, bg: "bg-emerald-100",  iconCls: "text-emerald-600",  valueCls: "text-emerald-600",  value: stats.active,  label: "Aktiv" },
          { icon: Shield,    bg: "bg-sky-100",       iconCls: "text-sky-600",      valueCls: "text-sky-600",      value: stats.teams,   label: "Teams" },
          { icon: Users,     bg: "bg-violet-100",    iconCls: "text-violet-600",   valueCls: "text-violet-600",   value: stats.members, label: "Mitglieder" },
        ].map(({ icon: Icon, bg, iconCls, valueCls, value, label }) => (
          <Card key={label}>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-[10px] ${bg}`}>
                <Icon className={`w-5 h-5 ${iconCls}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${valueCls}`}>{value}</p>
                <p className="text-sm text-neutral-500">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <Card padding="sm">
        <div className="w-48">
          <Select
            options={kindOptions}
            value={kindFilter}
            onChange={e => setKindFilter(e.target.value as DepartmentKind | "")}
            placeholder="Alle Typen"
          />
        </div>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map(dept => (
          <Card
            key={dept.id}
            padding="none"
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
            onClick={() => navigate(`/departments/${dept.id}`)}
          >
            {/* Coloured header */}
            <div className={`bg-gradient-to-br ${KIND_CONFIG[dept.kind].gradient} p-5 text-white`}>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold">{dept.name}</h3>
                <Badge variant={dept.isActive ? "success" : "neutral"} className="bg-white/20 text-white border-0">
                  {dept.isActive ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>
            </div>

            {/* Body */}
            <div className="p-5">
              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${KIND_CONFIG[dept.kind].color}`}>
                  {KIND_CONFIG[dept.kind].label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xl font-bold text-neutral-800">{dept.teamCount}</p>
                  <p className="text-xs text-neutral-500">Teams</p>
                </div>
                <div className="text-center p-3 bg-neutral-50 rounded-lg">
                  <p className="text-xl font-bold text-neutral-800">{dept.memberCount}</p>
                  <p className="text-xs text-neutral-500">Mitglieder</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  icon={<Users className="w-3 h-3" />}
                  onClick={e => { e.stopPropagation(); navigate(`/departments/${dept.id}?tab=members`); }}
                >
                  Mitglieder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Settings className="w-3 h-3" />}
                  onClick={e => { e.stopPropagation(); navigate(`/departments/${dept.id}`); }}
                >
                  <span className="sr-only">Einstellungen</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredDepartments.length === 0 && (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">Keine Abteilungen gefunden</h3>
          <p className="text-neutral-500 mb-4">Erstellen Sie eine neue Abteilung oder ändern Sie den Filter.</p>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreate(true)}>
            Neue Abteilung erstellen
          </Button>
        </Card>
      )}

      {showCreate && (
        <CreateDepartmentModal
          onClose={() => setShowCreate(false)}
          onCreate={dept => setExtraDepts(prev => [...prev, dept])}
        />
      )}
    </div>
  );
}
