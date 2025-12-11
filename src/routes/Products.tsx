import { useState, useMemo } from "react";
import { Plus, Package, ChevronDown, ChevronRight, MoreHorizontal, Repeat, Zap } from "lucide-react";
import { 
  Card, 
  Button,
  Badge,
  PriceTypeBadge
} from "../components/ui";
import { mockProducts, mockPrices } from "../data/mockBilling";
import { mockDepartments } from "../data/mockDepartments";

export function Products() {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const productsWithPrices = useMemo(() => {
    return mockProducts.map(product => {
      const prices = mockPrices.filter(p => p.productId === product.id);
      return { ...product, prices };
    });
  }, []);

  const stats = useMemo(() => {
    const activeProducts = mockProducts.filter(p => p.isActive).length;
    const recurringPrices = mockPrices.filter(p => p.type === "recurring").length;
    const oneTimePrices = mockPrices.filter(p => p.type === "one_time").length;
    return { activeProducts, recurringPrices, oneTimePrices };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("de-DE", { 
      style: "currency", 
      currency: "EUR" 
    }).format(amount);
  };

  const formatInterval = (interval?: string, count?: number) => {
    if (!interval) return "";
    const intervalLabels: Record<string, string> = {
      day: count === 1 ? "Tag" : "Tage",
      week: count === 1 ? "Woche" : "Wochen",
      month: count === 1 ? "Monat" : "Monate",
      year: count === 1 ? "Jahr" : "Jahre"
    };
    return count === 1 ? `/ ${intervalLabels[interval]}` : `/ ${count} ${intervalLabels[interval]}`;
  };

  const getDepartmentName = (deptId?: string) => {
    if (!deptId) return null;
    return mockDepartments.find(d => d.id === deptId)?.name;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Produkte</h1>
          <p className="text-slate-500 mt-1">
            Verwalten Sie Ihre Mitgliedschaften und Beiträge
          </p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>
          Neues Produkt
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-100">
              <Package className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.activeProducts}</p>
              <p className="text-sm text-slate-500">Aktive Produkte</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-100">
              <Repeat className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.recurringPrices}</p>
              <p className="text-sm text-slate-500">Wiederkehrende Preise</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.oneTimePrices}</p>
              <p className="text-sm text-slate-500">Einmalige Preise</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {productsWithPrices.map((product) => (
          <Card key={product.id} padding="none" className={!product.isActive ? "opacity-60" : ""}>
            {/* Product Header */}
            <div 
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{product.name}</h3>
                    {!product.isActive && <Badge variant="neutral">Inaktiv</Badge>}
                  </div>
                  {product.description && (
                    <p className="text-sm text-slate-500 mt-0.5">{product.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-slate-500">{product.prices.length} Preis{product.prices.length !== 1 ? "e" : ""}</p>
                </div>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                  <MoreHorizontal className="w-5 h-5 text-slate-400" />
                </button>
                {expandedProduct === product.id ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>

            {/* Prices (Expanded) */}
            {expandedProduct === product.id && (
              <div className="border-t border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-700">Preise</h4>
                  <Button variant="outline" size="sm" icon={<Plus className="w-3 h-3" />}>
                    Preis hinzufügen
                  </Button>
                </div>
                
                {product.prices.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">
                    Keine Preise definiert
                  </p>
                ) : (
                  <div className="space-y-3">
                    {product.prices.map((price) => (
                      <div 
                        key={price.id} 
                        className={`flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 ${!price.isActive ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${price.type === "recurring" ? "bg-violet-100" : "bg-amber-100"}`}>
                            {price.type === "recurring" ? (
                              <Repeat className="w-4 h-4 text-violet-600" />
                            ) : (
                              <Zap className="w-4 h-4 text-amber-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">
                                {formatCurrency(price.amount)}
                              </span>
                              {price.type === "recurring" && (
                                <span className="text-slate-500">
                                  {formatInterval(price.billingInterval, price.intervalCount)}
                                </span>
                              )}
                              <PriceTypeBadge type={price.type} />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {price.ageMin !== undefined && price.ageMax !== undefined && (
                                <Badge variant="neutral">
                                  {price.ageMin}-{price.ageMax} Jahre
                                </Badge>
                              )}
                              {price.ageMin !== undefined && price.ageMax === undefined && (
                                <Badge variant="neutral">ab {price.ageMin} Jahre</Badge>
                              )}
                              {price.ageMax !== undefined && price.ageMin === undefined && (
                                <Badge variant="neutral">bis {price.ageMax} Jahre</Badge>
                              )}
                              {price.isFamilyRate && (
                                <Badge variant="warning">Familientarif</Badge>
                              )}
                              {price.departmentId && (
                                <Badge variant="info">{getDepartmentName(price.departmentId)}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">{price.id}</span>
                          <button className="p-1.5 hover:bg-slate-100 rounded-lg">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

