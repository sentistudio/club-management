import { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Filter,
  Download,
  Plus
} from "lucide-react";
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
  BookingStatusBadge,
  BookingTypeBadge
} from "../components/ui";
import { mockBookings } from "../data/mockBookings";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import type { BookingStatus, BookingType } from "../types/domain";

export function Finance() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [typeFilter, setTypeFilter] = useState<BookingType | "">("");

  const filteredBookings = useMemo(() => {
    return mockBookings.filter((booking) => {
      const matchesStatus = !statusFilter || booking.status === statusFilter;
      const matchesType = !typeFilter || booking.bookingType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [statusFilter, typeFilter]);

  const stats = useMemo(() => {
    const income = mockBookings
      .filter(b => b.status === "paid" && b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);
    
    const expenses = mockBookings
      .filter(b => b.status === "paid" && b.amount < 0)
      .reduce((sum, b) => sum + Math.abs(b.amount), 0);
    
    const openAmount = mockBookings
      .filter(b => b.status === "open" && b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);
    
    const overdueAmount = mockBookings
      .filter(b => b.status === "overdue" && b.amount > 0)
      .reduce((sum, b) => sum + b.amount, 0);

    return { income, expenses, openAmount, overdueAmount, balance: income - expenses };
  }, []);

  const statusOptions = [
    { value: "open", label: "Offen" },
    { value: "paid", label: "Bezahlt" },
    { value: "overdue", label: "Überfällig" },
    { value: "cancelled", label: "Storniert" }
  ];

  const typeOptions = [
    { value: "contribution", label: "Beitrag" },
    { value: "donation", label: "Spende" },
    { value: "other_income", label: "Sonstige Einnahme" },
    { value: "expense", label: "Ausgabe" }
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

  const getMemberName = (membershipId?: string) => {
    if (!membershipId) return "Verein";
    const membership = mockClubMemberships.find(m => m.id === membershipId);
    if (!membership) return "Unbekannt";
    const person = mockPersons.find(p => p.id === membership.personId);
    return person ? `${person.firstName} ${person.lastName}` : "Unbekannt";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Finanzen</h1>
          <p className="text-slate-500 mt-1">
            Übersicht aller Buchungen und Finanzbewegungen
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>
            Neue Buchung
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Einnahmen</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.income)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <TrendingDown className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Ausgaben</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(stats.expenses)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Offen</p>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(stats.openAmount)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-rose-100">
              <TrendingUp className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Überfällig</p>
              <p className="text-lg font-bold text-rose-600">{formatCurrency(stats.overdueAmount)}</p>
            </div>
          </div>
        </Card>
        <Card className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stats.balance >= 0 ? "bg-sky-100" : "bg-rose-100"}`}>
              <TrendingUp className={`w-5 h-5 ${stats.balance >= 0 ? "text-sky-600" : "text-rose-600"}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">Saldo</p>
              <p className={`text-lg font-bold ${stats.balance >= 0 ? "text-sky-600" : "text-rose-600"}`}>
                {formatCurrency(stats.balance)}
              </p>
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
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "")}
              placeholder="Alle Status"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={typeOptions}
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as BookingType | "")}
              placeholder="Alle Typen"
            />
          </div>
          {(statusFilter || typeFilter) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setStatusFilter("");
                setTypeFilter("");
              }}
              icon={<Filter className="w-4 h-4" />}
            >
              Zurücksetzen
            </Button>
          )}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader 
            title="Alle Buchungen" 
            subtitle={`${filteredBookings.length} Buchungen gefunden`}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Beschreibung</TableHead>
              <TableHead className="hidden sm:table-cell">Mitglied</TableHead>
              <TableHead>Typ</TableHead>
              <TableHead className="hidden md:table-cell">Datum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Betrag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableEmpty message="Keine Buchungen gefunden" colSpan={6} />
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-800">
                        {booking.description || "—"}
                      </p>
                      <p className="text-xs text-slate-500 sm:hidden">
                        {getMemberName(booking.clubMembershipId)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-slate-600">
                      {getMemberName(booking.clubMembershipId)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BookingTypeBadge type={booking.bookingType} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-slate-600">
                      {formatDate(booking.bookingDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <BookingStatusBadge status={booking.status} />
                  </TableCell>
                  <TableCell align="right">
                    <span className={`font-semibold ${booking.amount >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {booking.amount >= 0 ? "+" : ""}{formatCurrency(booking.amount)}
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
