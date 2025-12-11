import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  User,
  CreditCard,
  Receipt,
  Shield,
  Wallet,
  Building,
  Banknote
} from "lucide-react";
import { 
  Card, 
  CardHeader, 
  Button, 
  Tabs, 
  TabList, 
  Tab, 
  TabPanel,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  MembershipStatusBadge,
  MembershipTypeBadge,
  Badge,
  TeamRoleBadge,
  SubscriptionStatusBadge,
  InvoiceStatusBadge,
  PaymentMethodTypeBadge,
  PaymentStatusBadge
} from "../components/ui";
import { mockPersons } from "../data/mockPersons";
import { mockClubMemberships, mockDepartmentMemberships, mockTeamRoles } from "../data/mockMemberships";
import { mockDepartments } from "../data/mockDepartments";
import { mockTeams } from "../data/mockTeams";
import { 
  mockSubscriptions, 
  mockInvoices, 
  mockPaymentMethods, 
  mockPayments,
  mockProducts,
  mockPrices
} from "../data/mockBilling";

export function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const membership = useMemo(() => {
    return mockClubMemberships.find(m => m.id === id);
  }, [id]);

  const person = useMemo(() => {
    if (!membership) return null;
    return mockPersons.find(p => p.id === membership.personId);
  }, [membership]);

  const departmentMemberships = useMemo(() => {
    if (!membership) return [];
    return mockDepartmentMemberships
      .filter(dm => dm.clubMembershipId === membership.id)
      .map(dm => ({
        ...dm,
        department: mockDepartments.find(d => d.id === dm.departmentId)
      }));
  }, [membership]);

  const teamRoles = useMemo(() => {
    if (!membership) return [];
    return mockTeamRoles
      .filter(tr => tr.clubMembershipId === membership.id)
      .map(tr => ({
        ...tr,
        team: mockTeams.find(t => t.id === tr.teamId)
      }));
  }, [membership]);

  // Billing data
  const memberSubscriptions = useMemo(() => {
    if (!membership) return [];
    return mockSubscriptions
      .filter(s => s.clubMembershipId === membership.id)
      .map(s => {
        const price = mockPrices.find(p => p.id === s.priceId);
        const product = price ? mockProducts.find(pr => pr.id === price.productId) : null;
        return { ...s, price, product };
      });
  }, [membership]);

  const memberInvoices = useMemo(() => {
    if (!membership) return [];
    return mockInvoices
      .filter(i => i.clubMembershipId === membership.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [membership]);

  const memberPaymentMethods = useMemo(() => {
    if (!membership) return [];
    return mockPaymentMethods.filter(pm => pm.clubMembershipId === membership.id);
  }, [membership]);

  const memberPayments = useMemo(() => {
    if (!membership) return [];
    return mockPayments
      .filter(p => p.clubMembershipId === membership.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [membership]);

  if (!membership || !person) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-slate-500 mb-4">Mitglied nicht gefunden</p>
        <Button onClick={() => navigate("/members")}>
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatInterval = (interval?: string, count?: number) => {
    if (!interval) return "";
    const labels: Record<string, string> = { day: "Tag", week: "Woche", month: "Monat", year: "Jahr" };
    return count === 1 ? `/ ${labels[interval]}` : `/ ${count} ${labels[interval]}e`;
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card": return <CreditCard className="w-5 h-5" />;
      case "sepa_debit": return <Building className="w-5 h-5" />;
      case "bank_transfer": return <Wallet className="w-5 h-5" />;
      case "cash": return <Banknote className="w-5 h-5" />;
      default: return <CreditCard className="w-5 h-5" />;
    }
  };

  const getPaymentMethodLabel = (pm: typeof memberPaymentMethods[0]) => {
    switch (pm.type) {
      case "card":
        return `${pm.cardBrand?.toUpperCase() || "Card"} ****${pm.cardLast4 || ""} (${pm.cardExpMonth}/${pm.cardExpYear})`;
      case "sepa_debit":
        return `SEPA ${pm.sepaIban?.slice(-4) || ""} - ${pm.sepaAccountHolder || ""}`;
      case "bank_transfer":
        return `Überweisung - ${pm.bankAccountHolder || ""}`;
      case "cash":
        return "Barzahlung";
      default:
        return pm.type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/members")}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Zurück
      </Button>

      {/* Member Header */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-xl">
            {person.firstName[0]}{person.lastName[0]}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">
                {person.firstName} {person.lastName}
              </h1>
              <MembershipStatusBadge status={membership.status} />
              <MembershipTypeBadge type={membership.membershipType} />
            </div>
            <p className="text-slate-500 mt-1">
              Mitgliedsnummer: {membership.membershipNumber} · Mitglied seit {formatDate(membership.startsAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Bearbeiten</Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultTab="profile">
        <TabList>
          <Tab value="profile" icon={<User className="w-4 h-4" />}>Profil</Tab>
          <Tab value="teams" icon={<Shield className="w-4 h-4" />}>Teams</Tab>
          <Tab value="billing" icon={<CreditCard className="w-4 h-4" />}>Billing</Tab>
          <Tab value="payments" icon={<Receipt className="w-4 h-4" />}>Zahlungen</Tab>
        </TabList>

        {/* Profile Tab */}
        <TabPanel value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card>
              <CardHeader title="Persönliche Daten" />
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-500">Geburtsdatum</p>
                    <p className="font-medium text-slate-700">
                      {formatDate(person.dateOfBirth)} ({calculateAge(person.dateOfBirth)} Jahre)
                    </p>
                  </div>
                </div>
                {person.email && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">E-Mail</p>
                      <a href={`mailto:${person.email}`} className="font-medium text-sky-600 hover:underline">
                        {person.email}
                      </a>
                    </div>
                  </div>
                )}
                {person.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-500">Telefon</p>
                      <a href={`tel:${person.phone}`} className="font-medium text-sky-600 hover:underline">
                        {person.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Departments */}
            <Card>
              <CardHeader title="Abteilungen" />
              <div className="space-y-3">
                {departmentMemberships.length > 0 ? (
                  departmentMemberships.map((dm) => (
                    <div key={dm.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-700">{dm.department?.name}</p>
                        <p className="text-xs text-slate-500">
                          Rolle: {dm.role === "member" ? "Mitglied" : dm.role === "staff" ? "Personal" : "Vorstand"}
                        </p>
                      </div>
                      <Badge variant={dm.department?.kind === "sport" ? "teal" : "neutral"}>
                        {dm.department?.kind === "sport" ? "Sport" : "Admin"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">Keine Abteilungen zugewiesen</p>
                )}
              </div>
            </Card>
          </div>
        </TabPanel>

        {/* Teams Tab */}
        <TabPanel value="teams">
          <Card padding="none">
            <div className="p-5 border-b border-slate-200">
              <CardHeader title="Team-Zugehörigkeiten" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead className="hidden sm:table-cell">Trikotnummer</TableHead>
                  <TableHead className="hidden md:table-cell">Altersklasse</TableHead>
                  <TableHead>Seit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamRoles.length === 0 ? (
                  <TableEmpty message="Keine Team-Zugehörigkeiten" colSpan={5} />
                ) : (
                  teamRoles.map((tr) => (
                    <TableRow key={tr.id}>
                      <TableCell>
                        <span className="font-medium text-slate-800">{tr.team?.name}</span>
                      </TableCell>
                      <TableCell>
                        <TeamRoleBadge role={tr.roleKey} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {tr.shirtNumber ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-slate-100 rounded-lg font-bold text-slate-700">
                            {tr.shirtNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {tr.team?.ageGroup || "—"}
                      </TableCell>
                      <TableCell>{formatDate(tr.startsAt)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabPanel>

        {/* Billing Tab */}
        <TabPanel value="billing">
          <div className="space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader 
                title="Zahlungsmethoden" 
                action={<Button variant="outline" size="sm">Hinzufügen</Button>}
              />
              <div className="space-y-3">
                {memberPaymentMethods.length > 0 ? (
                  memberPaymentMethods.map((pm) => (
                    <div key={pm.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          pm.type === "card" ? "bg-sky-100 text-sky-600" :
                          pm.type === "sepa_debit" ? "bg-violet-100 text-violet-600" :
                          pm.type === "bank_transfer" ? "bg-slate-200 text-slate-600" :
                          "bg-amber-100 text-amber-600"
                        }`}>
                          {getPaymentMethodIcon(pm.type)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{getPaymentMethodLabel(pm)}</p>
                          {pm.sepaMandateId && (
                            <p className="text-xs text-slate-500">Mandat: {pm.sepaMandateId}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pm.isDefault && <Badge variant="success">Standard</Badge>}
                        <PaymentMethodTypeBadge type={pm.type} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">Keine Zahlungsmethoden hinterlegt</p>
                )}
              </div>
            </Card>

            {/* Subscriptions */}
            <Card padding="none">
              <div className="p-5 border-b border-slate-200">
                <CardHeader 
                  title="Abonnements" 
                  subtitle={`${memberSubscriptions.filter(s => s.status === "active").length} aktiv`}
                  action={<Button variant="outline" size="sm">Neues Abo</Button>}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produkt</TableHead>
                    <TableHead>Betrag</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Periode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberSubscriptions.length === 0 ? (
                    <TableEmpty message="Keine Abonnements" colSpan={4} />
                  ) : (
                    memberSubscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-800">{sub.product?.name}</p>
                            <p className="text-xs text-slate-500">
                              {sub.price && formatInterval(sub.price.billingInterval, sub.price.intervalCount)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
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
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-slate-600">
                            {formatDate(sub.currentPeriodStart)} - {formatDate(sub.currentPeriodEnd)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Invoices */}
            <Card padding="none">
              <div className="p-5 border-b border-slate-200">
                <CardHeader 
                  title="Rechnungen" 
                  action={<Button variant="outline" size="sm">Neue Rechnung</Button>}
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nummer</TableHead>
                    <TableHead>Beschreibung</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead align="right">Betrag</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberInvoices.length === 0 ? (
                    <TableEmpty message="Keine Rechnungen" colSpan={4} />
                  ) : (
                    memberInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell>
                          <div>
                            <p className="font-mono font-medium text-slate-800">{inv.invoiceNumber}</p>
                            <p className="text-xs text-slate-500">{formatDate(inv.createdAt)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-slate-700">{inv.description || "—"}</span>
                        </TableCell>
                        <TableCell>
                          <InvoiceStatusBadge status={inv.status} />
                        </TableCell>
                        <TableCell align="right">
                          <div>
                            <p className="font-semibold text-slate-800">{formatCurrency(inv.total)}</p>
                            {inv.amountDue > 0 && inv.status !== "paid" && (
                              <p className="text-xs text-amber-600">Offen: {formatCurrency(inv.amountDue)}</p>
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
        </TabPanel>

        {/* Payments Tab */}
        <TabPanel value="payments">
          <Card padding="none">
            <div className="p-5 border-b border-slate-200">
              <CardHeader title="Zahlungshistorie" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Datum</TableHead>
                  <TableHead>Methode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead align="right">Betrag</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberPayments.length === 0 ? (
                  <TableEmpty message="Keine Zahlungen" colSpan={4} />
                ) : (
                  memberPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-700">{formatDate(payment.createdAt)}</p>
                          <p className="text-xs text-slate-400 font-mono">{payment.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <PaymentMethodTypeBadge type={payment.paymentMethodType} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <PaymentStatusBadge status={payment.status} />
                          {payment.failureReason && (
                            <p className="text-xs text-rose-600 mt-1">{payment.failureReason}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        <span className={`font-semibold ${
                          payment.status === "succeeded" ? "text-emerald-600" :
                          payment.status === "failed" ? "text-rose-600" :
                          "text-slate-700"
                        }`}>
                          {formatCurrency(payment.amount)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabPanel>
      </Tabs>
    </div>
  );
}
