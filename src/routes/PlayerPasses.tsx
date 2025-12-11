import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, IdCard, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  Button,
  Select,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Badge
} from "../components/ui";
import { mockPlayerPasses } from "../data/mockDfbnet";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import type { PassStatus, PassType } from "../types/dfbnet";

const passStatusConfig: Record<PassStatus, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  active: { label: "Aktiv", variant: "success" },
  pending: { label: "Beantragt", variant: "warning" },
  expired: { label: "Abgelaufen", variant: "danger" },
  blocked: { label: "Gesperrt", variant: "danger" },
  transferred: { label: "Gewechselt", variant: "neutral" }
};

const passTypeConfig: Record<PassType, { label: string; variant: "info" | "success" | "warning" }> = {
  youth: { label: "Jugend", variant: "info" },
  amateur: { label: "Amateur", variant: "success" },
  senior: { label: "Senior", variant: "warning" }
};

export function PlayerPasses() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<PassStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<PassType | "">("");

  const passesWithDetails = useMemo(() => {
    return mockPlayerPasses.map(pass => {
      const person = mockPersons.find(p => p.id === pass.personId);
      const membership = mockClubMemberships.find(m => m.personId === pass.personId);
      return { ...pass, person, membership };
    });
  }, []);

  const filteredPasses = useMemo(() => {
    return passesWithDetails
      .filter(p => !statusFilter || p.status === statusFilter)
      .filter(p => !typeFilter || p.passType === typeFilter);
  }, [passesWithDetails, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: mockPlayerPasses.length,
    active: mockPlayerPasses.filter(p => p.status === "active").length,
    pending: mockPlayerPasses.filter(p => p.status === "pending").length,
    expiringSoon: mockPlayerPasses.filter(p => {
      if (!p.expiresAt) return false;
      const daysUntilExpiry = (new Date(p.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    }).length
  }), []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "pending", label: "Beantragt" },
    { value: "expired", label: "Abgelaufen" },
    { value: "blocked", label: "Gesperrt" }
  ];

  const typeOptions = [
    { value: "youth", label: "Jugend" },
    { value: "amateur", label: "Amateur" },
    { value: "senior", label: "Senior" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Spielerpässe</h1>
          <p className="text-slate-500 mt-1">Verwalten Sie Spielerberechtigungen und Pässe</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neuen Pass beantragen
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <IdCard className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-sm text-slate-500">Gesamt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
              <p className="text-sm text-slate-500">Aktiv</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
              <p className="text-sm text-slate-500">Beantragt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-rose-600">{stats.expiringSoon}</p>
              <p className="text-sm text-slate-500">Läuft bald ab</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PassStatus | "")}
              placeholder="Alle Status"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PassType | "")}
              placeholder="Alle Typen"
            />
          </div>
          {(statusFilter || typeFilter) && (
            <Button variant="ghost" onClick={() => { setStatusFilter(""); setTypeFilter(""); }} icon={<Filter className="w-4 h-4" />}>
              Zurücksetzen
            </Button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader title="Alle Spielerpässe" subtitle={`${filteredPasses.length} Pässe`} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Passnummer</TableHead>
              <TableHead>Spieler</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Spielberechtigt ab</TableHead>
              <TableHead className="hidden lg:table-cell">Gültig bis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPasses.length === 0 ? (
              <TableEmpty message="Keine Spielerpässe gefunden" colSpan={6} />
            ) : (
              filteredPasses.map((pass) => (
                <TableRow 
                  key={pass.id}
                  onClick={() => pass.membership && navigate(`/members/${pass.membership.id}`)}
                >
                  <TableCell>
                    <span className="font-mono text-sm font-medium text-slate-800">
                      {pass.passNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
                        {pass.person?.firstName[0]}{pass.person?.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {pass.person?.firstName} {pass.person?.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{pass.association}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={passTypeConfig[pass.passType].variant}>
                      {passTypeConfig[pass.passType].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={passStatusConfig[pass.status].variant}>
                      {passStatusConfig[pass.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-slate-600">{formatDate(pass.eligibleFrom)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className={`${
                      pass.expiresAt && (new Date(pass.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24) <= 30
                        ? "text-rose-600 font-medium"
                        : "text-slate-600"
                    }`}>
                      {formatDate(pass.expiresAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

