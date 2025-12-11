import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings,
  X,
  Shield,
  Package,
  Wallet,
  Trophy,
  Calendar,
  FolderOpen,
  Inbox,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { useState } from "react";
import { mockTickets, CURRENT_STAFF_ID } from "../../data/mockInbox";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  children?: { to: string; label: string; badge?: number }[];
}

// Calculate badge for inbox
const myOpenTickets = mockTickets.filter(
  t => t.assignedToId === CURRENT_STAFF_ID && (t.status === "open" || t.status === "pending")
).length;

const navSections: NavSection[] = [
  {
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/teams", icon: Shield, label: "Teams" },
    ]
  },
  {
    items: [
      { to: "/members", icon: Users, label: "Mitglieder" },
      { 
        to: "/matches", 
        icon: Trophy, 
        label: "Spielbetrieb",
        children: [
          { to: "/matches", label: "Spiele" },
          { to: "/player-passes", label: "Spielerpässe" }
        ]
      },
    ]
  },
  {
    items: [
      { 
        to: "/products", 
        icon: Package, 
        label: "Produkte & Zahlung",
        children: [
          { to: "/products", label: "Produkte" },
          { to: "/subscriptions", label: "Abonnements" },
          { to: "/invoices", label: "Rechnungen" },
          { to: "/payment-links", label: "Payment Links" }
        ]
      },
      { to: "/events", icon: Calendar, label: "Veranstaltungen" },
    ]
  },
  {
    items: [
      { 
        to: "/departments", 
        icon: Building2, 
        label: "Vereinsverwaltung",
        children: [
          { to: "/departments", label: "Abteilungen" },
          { to: "/committees", label: "Gremien" },
          { to: "/volunteering", label: "Ehrenamt" }
        ]
      },
      { 
        to: "/finance", 
        icon: Wallet, 
        label: "Finanzen",
        children: [
          { to: "/transactions", label: "Transaktionen" },
          { to: "/finance", label: "Buchungen" }
        ]
      },
    ]
  },
  {
    items: [
      { to: "/inbox", icon: Inbox, label: "Posteingang", badge: myOpenTickets },
      { to: "/documents", icon: FolderOpen, label: "Dokumente" },
      { to: "/settings", icon: Settings, label: "Einstellungen" },
    ]
  }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(l => l !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col
        w-64 min-h-screen
        bg-white border-r border-neutral-200
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
              <span className="text-white font-bold text-lg">cb</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Club Logo/Avatar */}
        <div className="px-4 py-5 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">cb</span>
            </div>
            <button className="p-1 hover:bg-neutral-100 rounded-lg">
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-2">
              {section.title && (
                <p className="px-3 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <div key={item.to}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={`
                            w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                            text-sm font-medium transition-all duration-150
                            text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${
                            expandedItems.includes(item.label) ? "rotate-90" : ""
                          }`} />
                        </button>
                        {expandedItems.includes(item.label) && (
                          <div className="ml-8 mt-1 space-y-0.5">
                            {item.children.map((child) => (
                              <NavLink
                                key={child.to}
                                to={child.to}
                                onClick={onClose}
                                className={({ isActive }) => `
                                  flex items-center justify-between px-3 py-2 rounded-lg
                                  text-sm transition-all duration-150
                                  ${isActive 
                                    ? "text-teal-600 bg-teal-50 font-medium" 
                                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                                  }
                                `}
                              >
                                <span>{child.label}</span>
                                {child.badge && child.badge > 0 && (
                                  <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                                    {child.badge}
                                  </span>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) => `
                          flex items-center justify-between px-3 py-2.5 rounded-lg
                          text-sm font-medium transition-all duration-150
                          ${isActive 
                            ? "bg-teal-50 text-teal-600" 
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Member Portal Link */}
        <div className="px-4 pb-2">
          <a
            href="/member-portal"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-sm text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Mitglieder-Portal öffnen</span>
          </a>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-100 cursor-pointer transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">PS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Patrick Steuble</p>
              <p className="text-xs text-neutral-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
