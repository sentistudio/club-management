import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { 
  Dashboard, 
  Members, 
  MemberDetail, 
  Committees, 
  Settings,
  Products,
  Subscriptions,
  Invoices,
  PaymentLinks,
  Transactions,
  Finance
} from "./routes";
import { Teams } from "./routes/Teams";
import { Departments } from "./routes/Departments";
import { PlayerPasses } from "./routes/PlayerPasses";
import { Events } from "./routes/Events";
import { Volunteering } from "./routes/Volunteering";
import { Matches } from "./routes/Matches";
// Communications is now consolidated into Inbox
import { Documents } from "./routes/Documents";
import { Inbox } from "./routes/Inbox";
import { MemberPortal } from "./routes/MemberPortal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Vereinsverwaltung */}
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetail />} />
          <Route path="teams" element={<Teams />} />
          <Route path="departments" element={<Departments />} />
          <Route path="committees" element={<Committees />} />
          
          {/* Spielbetrieb */}
          <Route path="matches" element={<Matches />} />
          <Route path="player-passes" element={<PlayerPasses />} />
          
          {/* Veranstaltungen */}
          <Route path="events" element={<Events />} />
          <Route path="volunteering" element={<Volunteering />} />
          
          {/* Billing */}
          <Route path="products" element={<Products />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payment-links" element={<PaymentLinks />} />
          
          {/* Finanzen */}
          <Route path="transactions" element={<Transactions />} />
          <Route path="finance" element={<Finance />} />
          
          {/* Verwaltung */}
          <Route path="communications" element={<Navigate to="/inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Member Portal (standalone mobile route) */}
        <Route path="member-portal" element={<MemberPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
