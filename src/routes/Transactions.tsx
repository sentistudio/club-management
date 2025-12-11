import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Filter, 
  CreditCard, 
  Building, 
  Banknote, 
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
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
  PaymentStatusBadge
} from "../components/ui";
import { mockPayments, mockInvoices } from "../data/mockBilling";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships } from "../data/mockMemberships";
import type { PaymentStatus, PaymentMethodType } from "../types/billing";

export function Transactions() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethodType | "">("");

  const paymentsWithDetails = useMemo(() => {
    return mockPayments.map(payment => {
      const membership = payment.clubMembershipId 
        ? mockClubMemberships.find(m => m.id === payment.clubMembershipId) 
        : null;
      const person = membership ? mockPersons.find(p => p.id === membership.personId) : null;
      const invoice = payment.invoiceId ? mockInvoices.find(i => i.id === payment.invoiceId) : null;
      
      return { ...payment, membership, person, invoice };
    });
  }, []);

  const filteredPayments = useMemo(() => {
    return paymentsWithDetails
      .filter(p => !statusFilter || p.status === statusFilter)
      .filter(p => !methodFilter || p.paymentMethodType === methodFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [paymentsWithDetails, statusFilter, methodFilter]);

  const stats = useMemo(() => {
    const succeeded = mockPayments.filter(p => p.status === "succeeded");
    const pending = mockPayments.filter(p => p.status === "pending" || p.status === "processing");
    const failed = mockPayments.filter(p => p.status === "failed");
    const refunded = mockPayments.filter(p => p.status === "refunded" || p.status === "partially_refunded");
    
    const totalSucceeded = succeeded.reduce((sum, p) => sum + p.amount, 0);
    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalRefunded = refunded.reduce((sum, p) => sum + (p.refundedAmount || 0), 0);

    // By payment method
    const byMethod = {
      card: mockPayments.filter(p => p.paymentMethodType === "card" && p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0),
      sepa_debit: mockPayments.filter(p => p.paymentMethodType === "sepa_debit" && p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0),
      bank_transfer: mockPayments.filter(p => p.paymentMethodType === "bank_transfer" && p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0),
      cash: mockPayments.filter(p => p.paymentMethodType === "cash" && p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0),
    };

    return { totalSucceeded, totalPending, totalRefunded, failed: failed.length, byMethod };
  }, []);

  const statusOptions = [
    { value: "succeeded", label: "Erfolgreich" },
    { value: "pending", label: "Ausstehend" },
    { value: "processing", label: "In Bearbeitung" },
    { value: "failed", label: "Fehlgeschlagen" },
    { value: "refunded", label: "Erstattet" }
  ];

  const methodOptions = [
    { value: "card", label: "Karte" },
    { value: "sepa_debit", label: "LSV/SEPA" },
    { value: "bank_transfer", label: "Überweisung" },
    { value: "cash", label: "Bar" }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getPaymentMethodIcon = (type: PaymentMethodType) => {
    switch (type) {
      case "card": return <CreditCard className="w-4 h-4" />;
      case "sepa_debit": return <Building className="w-4 h-4" />;
      case "bank_transfer": return <Wallet className="w-4 h-4" />;
      case "cash": return <Banknote className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (payment: typeof paymentsWithDetails[0]) => {
    switch (payment.paymentMethodType) {
      case "card":
        return `${payment.cardBrand?.toUpperCase() || "Card"} ****${payment.cardLast4 || ""}`;
      case "sepa_debit":
        return payment.sepaReference || "SEPA";
      case "bank_transfer":
        return payment.bankReference || "Überweisung";
      case "cash":
        return payment.receivedBy ? `Bar (${payment.receivedBy})` : "Bar";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transaktionen</h1>
          <p className="text-slate-500 mt-1">
            Alle Zahlungen und Transaktionen verfolgen
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(stats.totalSucceeded)}</p>
              <p className="text-sm text-slate-500">Erfolgreich</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-600">{formatCurrency(stats.totalPending)}</p>
              <p className="text-sm text-slate-500">Ausstehend</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-100">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-rose-600">{stats.failed}</p>
              <p className="text-sm text-slate-500">Fehlgeschlagen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-100">
              <RefreshCw className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-600">{formatCurrency(stats.totalRefunded)}</p>
              <p className="text-sm text-slate-500">Erstattet</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader title="Nach Zahlungsmethode" subtitle="Erfolgreiche Zahlungen" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-sky-600" />
              <span className="text-sm font-medium text-slate-600">Karte</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.byMethod.card)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-slate-600">LSV/SEPA</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.byMethod.sepa_debit)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-600">Überweisung</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.byMethod.bank_transfer)}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Banknote className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-slate-600">Bar</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{formatCurrency(stats.byMethod.cash)}</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | "")}
              placeholder="Alle Status"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={methodOptions}
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as PaymentMethodType | "")}
              placeholder="Alle Methoden"
            />
          </div>
          {(statusFilter || methodFilter) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                setStatusFilter("");
                setMethodFilter("");
              }}
              icon={<Filter className="w-4 h-4" />}
            >
              Zurücksetzen
            </Button>
          )}
        </div>
      </Card>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="p-5 border-b border-slate-200">
          <CardHeader 
            title="Alle Transaktionen" 
            subtitle={`${filteredPayments.length} Transaktionen`}
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Datum</TableHead>
              <TableHead>Mitglied</TableHead>
              <TableHead>Methode</TableHead>
              <TableHead className="hidden md:table-cell">Rechnung</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">Betrag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableEmpty message="Keine Transaktionen gefunden" colSpan={6} />
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-700">{formatDate(payment.createdAt)}</p>
                      <p className="text-xs text-slate-400 font-mono">{payment.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.person ? (
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => payment.membership && navigate(`/members/${payment.membership.id}`)}
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-medium text-xs">
                          {payment.person.firstName[0]}{payment.person.lastName[0]}
                        </div>
                        <span className="font-medium text-slate-800">
                          {payment.person.firstName} {payment.person.lastName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${
                        payment.paymentMethodType === "card" ? "bg-sky-100 text-sky-600" :
                        payment.paymentMethodType === "sepa_debit" ? "bg-violet-100 text-violet-600" :
                        payment.paymentMethodType === "bank_transfer" ? "bg-slate-100 text-slate-600" :
                        "bg-amber-100 text-amber-600"
                      }`}>
                        {getPaymentMethodIcon(payment.paymentMethodType)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {getPaymentMethodLabel(payment)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {payment.invoice ? (
                      <span className="font-mono text-sm text-slate-600">
                        {payment.invoice.invoiceNumber}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <PaymentStatusBadge status={payment.status} />
                      {payment.failureReason && (
                        <p className="text-xs text-rose-600 mt-1">{payment.failureReason}</p>
                      )}
                      {payment.refundReason && (
                        <p className="text-xs text-slate-500 mt-1">{payment.refundReason}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div>
                      <p className={`font-semibold ${
                        payment.status === "succeeded" ? "text-emerald-600" :
                        payment.status === "failed" ? "text-rose-600" :
                        payment.status === "refunded" ? "text-slate-500 line-through" :
                        "text-slate-700"
                      }`}>
                        {formatCurrency(payment.amount)}
                      </p>
                      {payment.refundedAmount && payment.refundedAmount > 0 && (
                        <p className="text-xs text-slate-500">
                          -{formatCurrency(payment.refundedAmount)}
                        </p>
                      )}
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

