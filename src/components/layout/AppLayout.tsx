import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Button } from "../ui/Button";
import { Plus, ExternalLink } from "lucide-react";

// Page-specific actions
const pageActions: Record<string, React.ReactNode> = {
  "/teams": (
    <>
      <Button variant="outline" icon={<ExternalLink className="w-4 h-4" />}>
        Team Management
      </Button>
      <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
        Team hinzufügen
      </Button>
    </>
  ),
  "/members": (
    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
      Mitglied hinzufügen
    </Button>
  ),
  "/products": (
    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
      Produkt erstellen
    </Button>
  ),
  "/invoices": (
    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
      Rechnung erstellen
    </Button>
  ),
  "/events": (
    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
      Event erstellen
    </Button>
  )
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const actions = pageActions[location.pathname];

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          onMenuClick={() => setSidebarOpen(true)}
          actions={actions && <div className="hidden md:flex items-center gap-2">{actions}</div>}
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
