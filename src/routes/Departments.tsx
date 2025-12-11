import { useMemo, useState } from "react";
import { Plus, Building2, Users, Shield, Settings } from "lucide-react";
import { Card, Button, Badge, Select } from "../components/ui";
import { mockDepartments } from "../data/mockDepartments";
import { mockTeams } from "../data/mockTeams";
import { mockDepartmentMemberships } from "../data/mockMemberships";
import type { DepartmentKind } from "../types/domain";

const departmentKindConfig: Record<DepartmentKind, { label: string; color: string }> = {
  sport: { label: "Sport", color: "bg-emerald-100 text-emerald-700" },
  admin: { label: "Verwaltung", color: "bg-sky-100 text-sky-700" }
};

export function Departments() {
  const [kindFilter, setKindFilter] = useState<DepartmentKind | "">("");

  const departmentsWithDetails = useMemo(() => {
    return mockDepartments.map(dept => {
      const teams = mockTeams.filter(t => t.departmentId === dept.id);
      const memberships = mockDepartmentMemberships.filter(m => m.departmentId === dept.id);
      
      return {
        ...dept,
        teamCount: teams.length,
        memberCount: memberships.length
      };
    });
  }, []);

  const filteredDepartments = useMemo(() => {
    return departmentsWithDetails
      .filter(d => !kindFilter || d.kind === kindFilter);
  }, [departmentsWithDetails, kindFilter]);

  const stats = useMemo(() => ({
    total: mockDepartments.length,
    active: mockDepartments.filter(d => d.isActive).length,
    sport: mockDepartments.filter(d => d.kind === "sport").length,
    members: mockDepartmentMemberships.length
  }), []);

  const kindOptions = Object.entries(departmentKindConfig).map(([value, { label }]) => ({ value, label }));

  const getDeptGradient = (kind: DepartmentKind) => {
    const gradients = {
      sport: "from-emerald-400 to-emerald-600",
      admin: "from-sky-400 to-sky-600"
    };
    return gradients[kind];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Abteilungen</h1>
          <p className="text-slate-500 mt-1">Vereinsstruktur und Abteilungen verwalten</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neue Abteilung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Abteilungen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Building2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              <p className="text-sm text-slate-500">Aktiv</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Shield className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-sky-600">{stats.sport}</p>
              <p className="text-sm text-slate-500">Sportabteilungen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100">
              <Users className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-violet-600">{stats.members}</p>
              <p className="text-sm text-slate-500">Zuordnungen</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="w-48">
          <Select
            options={kindOptions}
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as DepartmentKind | "")}
            placeholder="Alle Typen"
          />
        </div>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((dept) => (
          <Card 
            key={dept.id}
            className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
            padding="none"
          >
            {/* Header */}
            <div className={`bg-gradient-to-br ${getDeptGradient(dept.kind)} p-5 text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">{dept.name}</h3>
                </div>
                <Badge 
                  variant={dept.isActive ? "success" : "neutral"} 
                  className="bg-white/20 text-white border-0"
                >
                  {dept.isActive ? "Aktiv" : "Inaktiv"}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Type Badge */}
              <div className="mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${departmentKindConfig[dept.kind].color}`}>
                  {departmentKindConfig[dept.kind].label}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xl font-bold text-slate-800">{dept.teamCount}</p>
                  <p className="text-xs text-slate-500">Teams</p>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-xl font-bold text-slate-800">{dept.memberCount}</p>
                  <p className="text-xs text-slate-500">Mitglieder</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  icon={<Users className="w-3 h-3" />}
                >
                  Mitglieder
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  icon={<Settings className="w-3 h-3" />}
                >
                  <span className="sr-only">Einstellungen</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <Card className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Keine Abteilungen gefunden</h3>
          <p className="text-slate-500 mb-4">Erstellen Sie eine neue Abteilung oder ändern Sie die Filter.</p>
          <Button icon={<Plus className="w-4 h-4" />}>
            Neue Abteilung erstellen
          </Button>
        </Card>
      )}
    </div>
  );
}
