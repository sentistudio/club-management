import { NavLink, useNavigate } from "react-router-dom";
import { mockClub } from "../../data/mockClub";
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
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  User,
  Newspaper,
  Home,
  ClipboardList,
  LayoutGrid,
  CheckSquare
} from "lucide-react";
import { useState, useMemo } from "react";
import { mockTickets, CURRENT_STAFF_ID } from "../../data/mockInbox";
import { useRole, UserSwitcher } from "../../contexts";
import { useLanguage } from "../../i18n";
import { mockTeams } from "../../data/mockTeams";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  to?: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: number;
  children?: { to: string; label: string; badge?: number }[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const myOpenTickets = mockTickets.filter(
  t => t.assignedToId === CURRENT_STAFF_ID && (t.status === "open" || t.status === "pending")
).length;

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, activeRole, setActiveRole, canSwitchRoles, selectedPersons, togglePerson } = useRole();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const adminNavSections: NavSection[] = useMemo(() => [
    {
      items: [
        { to: "/dashboard", icon: LayoutDashboard, label: t("sidebar.dashboard") },
        { to: "/people", icon: Users, label: t("sidebar.people") },
        { to: "/events", icon: Calendar, label: t("sidebar.events") },
        { to: "/tasks", icon: CheckSquare, label: "Aufgaben" },
        {
          icon: MessageSquare,
          label: t("sidebar.communication"),
          badge: myOpenTickets,
          children: [
            { to: "/pilot/inbox", label: t("sidebar.inboxPilot") },
            { to: "/pilot/chat-moderation", label: t("sidebar.chatModeration") },
            { to: "/inbox", label: t("sidebar.inboxMvp") },
            { to: "/club-news", label: t("sidebar.clubNews") }
          ]
        },
        {
          to: "/teams",
          icon: Trophy,
          label: "Spielbetrieb",
          children: [
            { to: "/teams", label: t("sidebar.teams") },
            { to: "/seasons", label: "Saison" },
            { to: "/matches", label: t("sidebar.matches") },
            { to: "/player-passes", label: t("sidebar.playerPasses") },
            { to: "/drills", label: "Übungen" },
            { to: "/knowledge", label: "Wissen" },
            { to: "/lineups", label: "Aufstellungen" },
          ]
        },
        { to: "/fields", icon: LayoutGrid, label: t("sidebar.fieldBooking") },
        { to: "/registration", icon: ClipboardList, label: t("sidebar.registration") },
        {
          to: "/products",
          icon: Package,
          label: t("sidebar.productsPayment"),
          children: [
            { to: "/products", label: t("sidebar.products") },
            { to: "/subscriptions", label: t("sidebar.subscriptions") },
            { to: "/invoices", label: t("sidebar.invoices") },
            { to: "/payment-links", label: t("sidebar.paymentLinks") }
          ]
        },
        {
          to: "/finance",
          icon: Wallet,
          label: t("sidebar.finance"),
          children: [
            { to: "/transactions", label: t("sidebar.transactions") },
            { to: "/finance", label: t("sidebar.bookings") }
          ]
        },
        { to: "/documents", icon: FolderOpen, label: t("sidebar.documents") },
        {
          to: "/departments",
          icon: Building2,
          label: t("sidebar.clubManagement"),
          children: [
            { to: "/departments", label: t("sidebar.departments") },
            { to: "/committees", label: t("sidebar.committees") },
            { to: "/volunteering", label: t("sidebar.volunteering") }
          ]
        },
        { to: "/settings", icon: Settings, label: t("sidebar.settings") },
      ]
    }
  ], [t]);

  const memberNavSections: NavSection[] = useMemo(() => [
    {
      items: [
        { to: "/member", icon: Home, label: t("sidebar.overview") },
        { to: "/member/calendar", icon: Calendar, label: t("sidebar.events") },
        { to: "/member/team", icon: Shield, label: "Mein Team" },
        { to: "/member/chats", icon: MessageSquare, label: t("sidebar.messages") },
        { to: "/member/news", icon: Newspaper, label: t("sidebar.news") },
      ]
    },
    {
      items: [
        { to: "/member/profile", icon: User, label: t("sidebar.profile") },
        { to: "/member/settings", icon: Settings, label: t("sidebar.settings") },
      ]
    }
  ], [t]);

  const isCoachMode = activeRole === "coach";
  const isMemberMode = activeRole === "member";

  const coachNavSections: NavSection[] = useMemo(() => {
    const teamIds = user.coachTeamIds ?? [];
    const teamItems = teamIds.map(id => {
      const team = mockTeams.find(t => t.id === id);
      return {
        to: `/teams/${id}/dashboard`,
        icon: Shield,
        label: team?.name ?? id
      };
    });
    return [{ title: "Meine Teams", items: teamItems }];
  }, [user.coachTeamIds]);

  const navSections = isMemberMode ? memberNavSections : isCoachMode ? coachNavSections : adminNavSections;

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
    );
  };

  const switchToAdmin = () => {
    setActiveRole("admin");
    navigate("/dashboard");
    onClose();
  };

  const switchToMember = () => {
    setActiveRole("member");
    navigate("/member");
    onClose();
  };

  const memberSubtitle = selectedPersons.map(p => {
    if (p === "me") return user.firstName;
    return user.linkedChildren?.find(c => c.id === p)?.firstName ?? "";
  }).filter(Boolean).join(", ");

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        relative
        fixed lg:static inset-y-0 left-0 z-50
        flex flex-col h-full
        bg-white border-r border-gray-100
        transform transition-all duration-200 ease-in-out
        ${isCollapsed ? "w-16" : "w-64"}
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>

        {/* Collapse toggle — desktop only */}
        <button
          onClick={() => setIsCollapsed(c => !c)}
          className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white shadow-md ring-1 ring-gray-200 hover:bg-gray-50 transition-colors z-10 items-center justify-center"
        >
          <ChevronLeft className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
        </button>

        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-gray-100 flex-shrink-0 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}`}>
          {isCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center">
              <span className="text-white font-bold text-xs">cb</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-neutral-900 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">cb</span>
                </div>
              </div>
              <button onClick={onClose} className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </>
          )}
        </div>

        {/* Club identity card */}
        <div className={`border-b border-gray-100 flex-shrink-0 ${isCollapsed ? "px-2 py-3 flex justify-center" : "px-3 py-3"}`}>
          {isCollapsed ? (
            mockClub.logoUrl ? (
              <img src={mockClub.logoUrl} alt={mockClub.shortName} className="w-8 h-8 object-contain" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{mockClub.shortName?.slice(0, 2)}</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-3 rounded-[10px] p-3 shadow-xs ring-1 ring-gray-100 hover:shadow-md transition-shadow">
              {mockClub.logoUrl ? (
                <img src={mockClub.logoUrl} alt={mockClub.shortName} className="w-10 h-10 object-contain flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">{mockClub.shortName?.slice(0, 3)}</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-900 text-sm truncate">{mockClub.shortName}</p>
                <p className="text-xs text-neutral-400">
                  {isMemberMode
                    ? `${memberSubtitle} · ${t("sidebar.memberSubtitle")}`
                    : isCoachMode
                    ? "Trainer-Ansicht"
                    : t("sidebar.clubAdminSubtitle")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Role switcher */}
        {!isCollapsed && canSwitchRoles && (
          <div className="px-3 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex bg-neutral-100 rounded-lg p-0.5 gap-0.5">
              <button
                onClick={switchToAdmin}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  !isMemberMode
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                {t("sidebar.clubToggle")}
              </button>
              <button
                onClick={switchToMember}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                  isMemberMode
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {t("sidebar.meToggle")}
              </button>
            </div>
          </div>
        )}

        {/* Person selector */}
        {!isCollapsed && isMemberMode && (user.linkedChildren?.length ?? 0) > 0 && (
          <div className="px-3 py-3 border-b border-gray-100 flex-shrink-0">
            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">{t("sidebar.viewFor")}</p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => togglePerson("me")}
                className={`flex items-center gap-1.5 pl-0.5 pr-2.5 py-0.5 rounded-full text-xs font-medium transition-all border ${
                  selectedPersons.includes("me")
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <img src={user.avatar} alt={user.firstName} className="w-5 h-5 rounded-full object-cover" />
                {user.firstName}
              </button>
              {user.linkedChildren?.map(child => (
                <button
                  key={child.id}
                  onClick={() => togglePerson(child.id)}
                  className={`flex items-center gap-1.5 pl-0.5 pr-2.5 py-0.5 rounded-full text-xs font-medium transition-all border ${
                    selectedPersons.includes(child.id)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {child.avatar
                    ? <img src={child.avatar} alt={child.firstName} className="w-5 h-5 rounded-full object-cover" />
                    : <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[9px] font-bold">{child.firstName[0]}</div>
                  }
                  {child.firstName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              {!isCollapsed && section.title && (
                <p className="px-3 mb-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <div key={item.to || item.label}>
                    {item.children ? (
                      isCollapsed ? (
                        item.to ? (
                          <NavLink
                            to={item.to}
                            onClick={onClose}
                            title={item.label}
                            className={({ isActive }) => `
                              flex items-center justify-center p-2.5 rounded-lg text-sm transition-all
                              ${isActive ? "bg-teal-50 text-teal-600" : "text-neutral-600 hover:bg-neutral-100"}
                            `}
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                          </NavLink>
                        ) : (
                          <button
                            title={item.label}
                            className="w-full flex items-center justify-center p-2.5 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-all"
                          >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                          </button>
                        )
                      ) : (
                        <>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5 flex-shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.badge && item.badge > 0 && (
                                <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                                  {item.badge}
                                </span>
                              )}
                              <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                                expandedItems.includes(item.label) ? "rotate-90" : ""
                              }`} />
                            </div>
                          </button>
                          {expandedItems.includes(item.label) && (
                            <div className="relative mt-0.5 ml-5 pl-4">
                              {/* Vertical tree line */}
                              <span className="absolute left-0 top-0 bottom-2 border-l border-gray-200" />
                              {item.children.map((child) => (
                                <div key={child.to} className="relative">
                                  {/* Horizontal connector */}
                                  <span className="absolute left-0 top-1/2 w-4 border-b border-gray-200" />
                                  <NavLink
                                    to={child.to}
                                    onClick={onClose}
                                    className={({ isActive }) => `
                                      flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
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
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )
                    ) : item.to ? (
                      isCollapsed ? (
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          end={item.to === "/member"}
                          title={item.label}
                          className={({ isActive }) => `
                            flex items-center justify-center p-2.5 rounded-lg text-sm transition-all
                            ${isActive ? "bg-teal-50 text-teal-600" : "text-neutral-600 hover:bg-neutral-100"}
                          `}
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                        </NavLink>
                      ) : (
                        <NavLink
                          to={item.to}
                          onClick={onClose}
                          end={item.to === "/member"}
                          className={({ isActive }) => `
                            flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                            ${isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && item.badge > 0 && (
                            <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      )
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <UserSwitcher onClose={onClose} />
          </div>
        )}
      </aside>
    </>
  );
}
