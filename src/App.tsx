import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { LanguageProvider } from "./i18n";
import { RoleProvider } from "./contexts";
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
import { ClubEvents } from "./routes/ClubEvents";
import { Volunteering } from "./routes/Volunteering";
import { Matches } from "./routes/Matches";
import { Documents } from "./routes/Documents";
import { Inbox } from "./routes/Inbox";
import { ClubNews } from "./routes/ClubNews";
import { Login } from "./routes/Login";
import { PilotInbox, PilotMemberPortal, ChatModeration } from "./routes/pilot";
import { 
  MemberHome, 
  MemberCalendar, 
  MemberChats, 
  MemberNews, 
  MemberProfile, 
  MemberSettings 
} from "./routes/member";

function App() {
  const basename = import.meta.env.BASE_URL;
  
  return (
    <LanguageProvider>
      <RoleProvider>
        <BrowserRouter basename={basename}>
          <Routes>
            {/* Login Page */}
            <Route path="login" element={<Login />} />
            
            {/* 
              Unified AppLayout for both Admin and Member portals.
              The Sidebar automatically shows different menu items based on the route.
              - /member/* routes → Member menu items
              - Other routes → Admin menu items
            */}
            <Route path="/" element={<AppLayout />}>
              {/* Default redirect */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* ==========================================
                  ADMIN ROUTES
                  ========================================== */}
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
              <Route path="events" element={<ClubEvents />} />
              <Route path="club-events" element={<Navigate to="/events" replace />} />
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
              
              {/* Pilot Admin Routes (inside AppLayout) */}
              <Route path="pilot/inbox" element={<PilotInbox />} />
              <Route path="pilot/chat-moderation" element={<ChatModeration />} />
              <Route path="pilot/club-news" element={<ClubNews />} />

              {/* ==========================================
                  MEMBER ROUTES (Desktop Portal)
                  Same layout, different menu items based on role
                  ========================================== */}
              <Route path="member" element={<MemberHome />} />
              <Route path="member/calendar" element={<MemberCalendar />} />
              <Route path="member/chats" element={<MemberChats />} />
              <Route path="member/news" element={<MemberNews />} />
              <Route path="member/profile" element={<MemberProfile />} />
              <Route path="member/settings" element={<MemberSettings />} />
              
              {/* Legacy member routes - redirect to new paths */}
              <Route path="member/patrick" element={<Navigate to="/member" replace />} />
              <Route path="member/lena" element={<Navigate to="/member" replace />} />
            </Route>
            
            {/* ==========================================
                MOBILE MEMBER PORTAL (Standalone - different layout)
                ========================================== */}
            <Route path="member-portal" element={<Navigate to="/pilot/member-portal" replace />} />
            <Route path="pilot/member-portal" element={<Navigate to="/pilot/member-portal/lena" replace />} />
            <Route path="pilot/member-portal/:profileSlug" element={<PilotMemberPortal />} />
          </Routes>
        </BrowserRouter>
      </RoleProvider>
    </LanguageProvider>
  );
}

export default App;
