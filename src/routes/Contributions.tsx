import { useMemo } from "react";
import { Plus, Users } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge
} from "../components/ui";
import { mockContributionPlans, mockContributionAssignments } from "../data/mockContributions";
import { mockDepartments } from "../data/mockDepartments";

export function Contributions() {
  const contributionsWithStats = useMemo(() => {
    return mockContributionPlans.map(plan => {
      const memberCount = mockContributionAssignments.filter(
        ca => ca.contributionPlanId === plan.id
      ).length;
      
      const department = plan.departmentId 
        ? mockDepartments.find(d => d.id === plan.departmentId)
        : null;

      return {
        ...plan,
        memberCount,
        department
      };
    });
  }, []);

  const totalMembers = useMemo(() => {
    const uniqueMembers = new Set(mockContributionAssignments.map(ca => ca.clubMembershipId));
    return uniqueMembers.size;
  }, []);

  const totalYearlyRevenue = useMemo(() => {
    return contributionsWithStats.reduce((sum, c) => {
      let yearlyAmount = c.amount;
      if (c.interval === "monthly") yearlyAmount *= 12;
      else if (c.interval === "quarterly") yearlyAmount *= 4;
      else if (c.interval === "half-yearly") yearlyAmount *= 2;
      return sum + (yearlyAmount * c.memberCount);
    }, 0);
  }, [contributionsWithStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const intervalLabels: Record<string, string> = {
    yearly: "Jährlich",
    "half-yearly": "Halbjährlich",
    quarterly: "Vierteljährlich",
    monthly: "Monatlich",
    "one-time": "Einmalig"
  };

  const intervalColors: Record<string, "default" | "success" | "warning" | "info"> = {
    yearly: "info",
    "half-yearly": "default",
    quarterly: "warning",
    monthly: "success",
    "one-time": "default"
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Beitragssätze</h1>
          <p className="text-slate-500 mt-1">
            {mockContributionPlans.length} Beitragssätze definiert
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neuer Beitragssatz
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-800">{mockContributionPlans.length}</p>
            <p className="text-sm text-slate-500 mt-1">Beitragssätze</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-600">{totalMembers}</p>
            <p className="text-sm text-slate-500 mt-1">Zugewiesene Mitglieder</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">{formatCurrency(totalYearlyRevenue)}</p>
            <p className="text-sm text-slate-500 mt-1">Erwartete Jahreseinnahmen</p>
          </div>
        </Card>
      </div>

      {/* Contributions Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader 
            title="Alle Beitragssätze" 
            subtitle="Übersicht aller definierten Mitgliedsbeiträge"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Betrag</TableHead>
              <TableHead>Intervall</TableHead>
              <TableHead className="hidden md:table-cell">Altersgruppe</TableHead>
              <TableHead className="hidden lg:table-cell">Abteilung</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Mitglieder</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contributionsWithStats.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-slate-800">{contribution.name}</p>
                    {contribution.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{contribution.description}</p>
                    )}
                    {contribution.isFamilyRate && (
                      <Badge variant="warning" className="mt-1">Familientarif</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(contribution.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={intervalColors[contribution.interval]}>
                    {intervalLabels[contribution.interval]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {contribution.ageMin !== undefined || contribution.ageMax !== undefined ? (
                    <span className="text-slate-600">
                      {contribution.ageMin !== undefined && contribution.ageMax !== undefined
                        ? `${contribution.ageMin} - ${contribution.ageMax} Jahre`
                        : contribution.ageMin !== undefined
                          ? `ab ${contribution.ageMin} Jahre`
                          : `bis ${contribution.ageMax} Jahre`
                      }
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {contribution.department ? (
                    <Badge variant="info">{contribution.department.name}</Badge>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">{contribution.memberCount}</span>
                    {contribution.memberCount > 0 && (
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-sky-500 rounded-full"
                          style={{ width: `${Math.min((contribution.memberCount / totalMembers) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
