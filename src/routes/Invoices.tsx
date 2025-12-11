import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Filter, FileText, Download, Send, Eye, MoreHorizontal } from "lucide-react";
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
  InvoiceStatusBadge
} from "../components/ui";
import { mockInvoices } from "../data/mockBilling";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import type { InvoiceStatus } from "../types/billing";

export function Invoices() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "">("");

  const invoicesWithDetails = useMemo(() => {
    return mockInvoices.map(inv => {
      const membership = inv.clubMembershipId 
        ? mockClubMemberships.find(m => m.id === inv.clubMembershipId) 
        : null;
      const person = membership ? mockPersons.find(p => p.id === membership.personId) : null;
      
      return { ...inv, membership, person };
    });
  }, []);

  const filteredInvoices = useMemo(() => {
    return invoicesWithDetails.filter(inv => {
      return !statusFilter || inv.status === statusFilter;
    });
  }, [invoicesWithDetails, statusFilter]);

  const stats = useMemo(() => {
    const draft = mockInvoices.filter(i => i.status === "draft").length;
    const open = mockInvoices.filter(i => i.status === "open").length;
    const paid = mockInvoices.filter(i => i.status === "paid").length;
    const openAmount = mockInvoices
      .filter(i => i.status === "open")
      .reduce((sum, i) => sum + i.amountDue, 0);
    const paidAmount = mockInvoices
      .filter(i => i.status === "paid")
      .reduce((sum, i) => sum + i.amountPaid, 0);
    
    return { draft, open, paid, openAmount, paidAmount };
  }, []);

  const statusOptions = [
    { value: "draft", label: "Entwurf" },
    { value: "open", label: "Offen" },
    { value: "paid", label: "Bezahlt" },
    { value: "void", label: "Storniert" },
    { value: "uncollectible", label: "Uneinbringlich" }
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Rechnungen</h1>
          <p className="text-slate-500 mt-1">
            Erstellen und verwalten Sie Rechnungen
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neue Rechnung
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.draft}</p>
              <p className="text-sm text-slate-500">Entwürfe</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.open}</p>
              <p className="text-sm text-slate-500">Offen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.paid}</p>
              <p className="text-sm text-slate-500">Bezahlt</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(stats.openAmount)}</p>
              <p className="text-sm text-slate-500">Ausstehend</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.paidAmount)}</p>
              <p className="text-sm text-slate-500">Eingenommen</p>
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
              onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | "")}
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

      {/* Invoices Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader 
            title="Alle Rechnungen" 
            subtitle={`${filteredInvoices.length} Rechnungen`}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nummer</TableHead>
              <TableHead>Kunde</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Fällig</TableHead>
              <TableHead align="right">Betrag</TableHead>
              <TableHead align="right" className="w-24">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableEmpty message="Keine Rechnungen gefunden" colSpan={6} />
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div>
                      <p className="font-mono font-medium text-slate-800">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-slate-500">{formatDate(invoice.createdAt)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {invoice.person ? (
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => invoice.membership && navigate(`/members/${invoice.membership.id}`)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-medium text-xs">
                          {invoice.person.firstName[0]}{invoice.person.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">
                            {invoice.person.firstName} {invoice.person.lastName}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500">Verein</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {invoice.dueDate ? (
                      <span className={`text-sm ${
                        invoice.status === "open" && new Date(invoice.dueDate) < new Date()
                          ? "text-rose-600 font-medium"
                          : "text-slate-600"
                      }`}>
                        {formatDate(invoice.dueDate)}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div>
                      <p className="font-semibold text-slate-800">{formatCurrency(invoice.total)}</p>
                      {invoice.amountDue > 0 && invoice.status !== "paid" && (
                        <p className="text-xs text-amber-600">
                          Offen: {formatCurrency(invoice.amountDue)}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Ansehen">
                        <Eye className="w-4 h-4 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Download">
                        <Download className="w-4 h-4 text-slate-400" />
                      </button>
                      {invoice.status === "draft" && (
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg" title="Senden">
                          <Send className="w-4 h-4 text-slate-400" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
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

