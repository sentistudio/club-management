import { useState, useMemo } from "react";
import { Plus, Link2, Copy, ExternalLink, MoreHorizontal, QrCode, Users } from "lucide-react";
import { 
  Card, 
  Button,
  Badge,
  PaymentLinkStatusBadge
} from "../components/ui";
import { mockPaymentLinks, mockProducts, mockPrices } from "../data/mockBilling";

export function PaymentLinks() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const paymentLinksWithDetails = useMemo(() => {
    return mockPaymentLinks.map(link => {
      const price = mockPrices.find(p => p.id === link.priceId);
      const product = price ? mockProducts.find(pr => pr.id === price.productId) : null;
      return { ...link, price, product };
    });
  }, []);

  const stats = useMemo(() => {
    const active = mockPaymentLinks.filter(l => l.status === "active").length;
    const totalRedemptions = mockPaymentLinks.reduce((sum, l) => sum + l.redemptionCount, 0);
    const revenue = paymentLinksWithDetails
      .filter(l => l.price)
      .reduce((sum, l) => sum + (l.price!.amount * l.redemptionCount), 0);
    return { active, totalRedemptions, revenue };
  }, [paymentLinksWithDetails]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE");
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isLimitReached = (max?: number, count?: number) => {
    if (max === undefined) return false;
    return count !== undefined && count >= max;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Payment Links</h1>
          <p className="text-slate-500 mt-1">
            Erstellen Sie teilbare Zahlungslinks
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neuer Payment Link
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100">
              <Link2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.active}</p>
              <p className="text-sm text-slate-500">Aktive Links</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Users className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.totalRedemptions}</p>
              <p className="text-sm text-slate-500">Einlösungen</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100">
              <Link2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.revenue)}</p>
              <p className="text-sm text-slate-500">Umsatz</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Links Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paymentLinksWithDetails.map((link) => {
          const expired = isExpired(link.expiresAt);
          const limitReached = isLimitReached(link.maxRedemptions, link.redemptionCount);
          const effectiveStatus = expired || limitReached ? "inactive" : link.status;

          return (
            <Card 
              key={link.id} 
              className={effectiveStatus !== "active" ? "opacity-70" : ""}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600">
                    <Link2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{link.title || link.product?.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {link.product?.name} · {link.price && formatCurrency(link.price.amount)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PaymentLinkStatusBadge status={effectiveStatus} />
                  <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {link.description && (
                <p className="text-sm text-slate-600 mb-4">{link.description}</p>
              )}

              {/* URL */}
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg mb-4">
                <code className="flex-1 text-sm text-slate-600 truncate">{link.url}</code>
                <button 
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  onClick={() => copyToClipboard(link.url, link.id)}
                  title="Link kopieren"
                >
                  <Copy className={`w-4 h-4 ${copiedId === link.id ? "text-emerald-600" : "text-slate-400"}`} />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  onClick={() => window.open(link.url, "_blank")}
                  title="Link öffnen"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </button>
                <button 
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                  title="QR-Code"
                >
                  <QrCode className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Stats & Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {link.redemptionCount}
                    {link.maxRedemptions && ` / ${link.maxRedemptions}`}
                    {" "}Einlösungen
                  </span>
                </div>
                
                {link.expiresAt && (
                  <Badge variant={expired ? "danger" : "warning"}>
                    {expired ? "Abgelaufen" : `Bis ${formatDate(link.expiresAt)}`}
                  </Badge>
                )}

                {limitReached && (
                  <Badge variant="danger">Limit erreicht</Badge>
                )}

                {link.collectAddress && (
                  <Badge variant="neutral">Adresse</Badge>
                )}
                {link.collectPhone && (
                  <Badge variant="neutral">Telefon</Badge>
                )}
              </div>

              {/* Created date */}
              <p className="text-xs text-slate-400 mt-4">
                Erstellt am {formatDate(link.createdAt)}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

