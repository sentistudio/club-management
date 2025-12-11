import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, Repeat, Calendar, AlertCircle } from "lucide-react";
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
  SubscriptionStatusBadge
} from "../components/ui";
import { mockSubscriptions, mockProducts, mockPrices } from "../data/mockBilling";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import type { SubscriptionStatus } from "../types/billing";

export function Subscriptions() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "">("");

  const subscriptionsWithDetails = useMemo(() => {
    return mockSubscriptions.map(sub => {
      const membership = mockClubMemberships.find(m => m.id === sub.clubMembershipId);
      const person = membership ? mockPersons.find(p => p.id === membership.personId) : null;
      const price = mockPrices.find(p => p.id === sub.priceId);
      const product = price ? mockProducts.find(pr => pr.id === price.productId) : null;
      
      return { ...sub, membership, person, price, product };
    });
  }, []);

  const filteredSubscriptions = useMemo(() => {
    return subscriptionsWithDetails.filter(sub => {
      return !statusFilter || sub.status === statusFilter;
    });
  }, [subscriptionsWithDetails, statusFilter]);

  const stats = useMemo(() => {
    const active = mockSubscriptions.filter(s => s.status === "active").length;
    const pastDue = mockSubscriptions.filter(s => s.status === "past_due" || s.status === "unpaid").length;
    const canceled = mockSubscriptions.filter(s => s.status === "canceled").length;
    const mrr = subscriptionsWithDetails
      .filter(s => s.status === "active" && s.price?.type === "recurring")
      .reduce((sum, s) => {
        if (!s.price) return sum;
        let monthlyAmount = s.price.amount;
        if (s.price.billingInterval === "year") monthlyAmount /= 12;
        else if (s.price.billingInterval === "week") monthlyAmount *= 4.33;
        else if (s.price.billingInterval === "day") monthlyAmount *= 30;
        return sum + monthlyAmount;
      }, 0);
    
    return { active, pastDue, canceled, mrr };
  }, [subscriptionsWithDetails]);

  const statusOptions = [
    { value: "active", label: "Aktiv" },
    { value: "past_due", label: "Überfällig" },
    { value: "unpaid", label: "Unbezahlt" },
    { value: "canceled", label: "Gekündigt" },
    { value: "paused", label: "Pausiert" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const formatInterval = (interval?: string, count?: number) => {
    if (!interval) return "";
    const intervalLabels: Record<string, string> = {
      day: "täglich",
      week: "wöchentlich",
      month: "monatlich",
      year: "jährlich"
    };
    if (count === 1) return intervalLabels[interval];
    return `alle ${count} ${interval === "month" ? "Monate" : interval === "year" ? "Jahre" : interval}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Abonnements</h1>
          <p className="text-slate-500 mt-1">
            Verwalten Sie wiederkehrende Mitgliedschaften
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neues Abonnement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Repeat className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
              <p className="text-sm text-slate-500">Aktiv</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.pastDue}</p>
              <p className="text-sm text-slate-500">Überfällig</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.canceled}</p>
              <p className="text-sm text-slate-500">Gekündigt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Repeat className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.mrr)}</p>
              <p className="text-sm text-slate-500">MRR</p>
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
              onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | "")}
              placeholder="Alle Status"
            />
          </div>
          {statusFilter && (
            <Button 
              variant="ghost" 
              onClick={() => setStatusFilter("")}
              icon={<Filter className="w-4 h-4" />}
            >
              Zurücksetzen
            </Button>
          )}
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader 
            title="Alle Abonnements" 
            subtitle={`${filteredSubscriptions.length} Abonnements`}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mitglied</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead className="hidden md:table-cell">Betrag</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Aktuelle Periode</TableHead>
              <TableHead className="hidden sm:table-cell">Erstellt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableEmpty message="Keine Abonnements gefunden" colSpan={6} />
            ) : (
              filteredSubscriptions.map((sub) => (
                <TableRow 
                  key={sub.id}
                  onClick={() => sub.membership && navigate(`/members/${sub.membership.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-medium text-sm">
                        {sub.person ? `${sub.person.firstName[0]}${sub.person.lastName[0]}` : "??"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {sub.person ? `${sub.person.firstName} ${sub.person.lastName}` : "Unbekannt"}
                        </p>
                        <p className="text-xs text-slate-500">{sub.membership?.membershipNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-700">{sub.product?.name || "—"}</p>
                      <p className="text-xs text-slate-500">
                        {sub.price && formatInterval(sub.price.billingInterval, sub.price.intervalCount)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="font-semibold text-slate-700">
                      {sub.price ? formatCurrency(sub.price.amount) : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SubscriptionStatusBadge status={sub.status} />
                      {sub.cancelAtPeriodEnd && (
                        <span className="text-xs text-amber-600">Endet</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-slate-600">
                      {formatDate(sub.currentPeriodStart)} - {formatDate(sub.currentPeriodEnd)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-slate-600">{formatDate(sub.createdAt)}</span>
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

