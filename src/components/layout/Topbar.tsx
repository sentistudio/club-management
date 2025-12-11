import { useState, useRef, useEffect } from "react";
import { Menu, Globe, Bell, Inbox, Clock, CheckCircle, X, Check } from "lucide-react";
import { SearchInput } from "../ui/Input";
import { mockNotifications } from "../../data/mockInbox";
import type { Notification } from "../../data/mockInbox";

interface TopbarProps {
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

export function Topbar({ onMenuClick, actions }: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  // Get unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    if (days === 1) return "Gestern";
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
  };

  const toggleNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notifId ? { ...n, isRead: !n.isRead } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center h-16 px-4 lg:px-6 bg-white border-b border-neutral-200">
      {/* Mobile menu button */}
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-2 mr-2 hover:bg-neutral-100 rounded-lg transition-colors"
      >
        <Menu className="w-5 h-5 text-neutral-600" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <SearchInput placeholder="Suchen..." />
      </div>

      {/* Right side actions - pushed to right */}
      <div className="flex items-center gap-1 ml-auto">
        {actions}

        {/* Language Selector */}
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">DE</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50">
                <h3 className="font-semibold text-neutral-900">Systemmeldungen</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-neutral-200 rounded-lg"
                >
                  <X className="w-4 h-4 text-neutral-400" />
                </button>
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-neutral-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                    <p>Keine Systemmeldungen</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-neutral-100 last:border-0 ${
                        !notif.isRead ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          notif.type === "ticket_assigned" 
                            ? "bg-teal-100 text-teal-600"
                            : notif.type === "ticket_reply"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-neutral-100 text-neutral-600"
                        }`}>
                          {notif.type === "ticket_assigned" && <Inbox className="w-4 h-4" />}
                          {notif.type === "ticket_reply" && <CheckCircle className="w-4 h-4" />}
                          {notif.type === "system" && <Clock className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm ${!notif.isRead ? "font-semibold text-neutral-900" : "text-neutral-700"}`}>
                              {notif.title}
                            </p>
                            <button
                              onClick={() => toggleNotificationRead(notif.id)}
                              className={`p-1 rounded hover:bg-neutral-100 ${
                                notif.isRead ? "text-neutral-400" : "text-teal-500"
                              }`}
                              title={notif.isRead ? "Als ungelesen markieren" : "Als gelesen markieren"}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-neutral-500">{notif.message}</p>
                          <p className="text-xs text-neutral-400 mt-1">{formatDate(notif.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-center text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Alle als gelesen markieren
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
