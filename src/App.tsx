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
import { ClubEvents } from "./routes/ClubEvents";
import { Volunteering } from "./routes/Volunteering";
import { Matches } from "./routes/Matches";
// Communications is now consolidated into Inbox
import { Documents } from "./routes/Documents";
import { Inbox } from "./routes/Inbox";
import { ClubNews } from "./routes/ClubNews";
import { PilotInbox, PilotMemberPortal, ChatModeration, MemberWebPortal } from "./routes/pilot";

function App() {
  // Use basename for GitHub Pages deployment
  const basename = import.meta.env.BASE_URL;
  
  return (
    <BrowserRouter basename={basename}>
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
          <Route path="club-events" element={<ClubEvents />} />
          <Route path="volunteering" element={<Volunteering />} />
          
          {/* Billing */}
          <Route path="products" element={<Products />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payment-links" element={<PaymentLinks />} />
          
          {/* Finanzen */}
          <Route path="transactions" element={<Transactions />} />
          <Route path="finance" element={<Finance />} />
          
          {/* Kommunikation */}
          <Route path="communications" element={<Navigate to="/inbox" replace />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="club-news" element={<ClubNews />} />
          
          {/* Verwaltung */}
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        
        {/* Member Portal - redirect old URL to new pilot version */}
        <Route path="member-portal" element={<Navigate to="/pilot/member-portal" replace />} />
        
        {/* Main Member Portal with profile routes */}
        <Route path="pilot/member-portal" element={<Navigate to="/pilot/member-portal/lena" replace />} />
        <Route path="pilot/member-portal/:profileSlug" element={<PilotMemberPortal />} />
        
        {/* Pilot Admin Routes */}
        <Route path="pilot" element={<AppLayout />}>
          <Route index element={<Navigate to="/pilot/inbox" replace />} />
          <Route path="inbox" element={<PilotInbox />} />
          <Route path="chat-moderation" element={<ChatModeration />} />
          <Route path="club-news" element={<ClubNews />} />
        </Route>
        
        {/* Member Web Portal (Desktop version for members like Lena) */}
        <Route path="member" element={<MemberWebPortal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
