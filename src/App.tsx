import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout";
import { LanguageProvider } from "./i18n";
import { RoleProvider, PeopleProvider } from "./contexts";
import { 
  Dashboard, 
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
import { TeamLayout } from "./routes/teams/TeamLayout";
import { TeamDashboard } from "./routes/teams/TeamDashboard";
import { TeamPlayers } from "./routes/teams/TeamPlayers";
import { PlayerDetail } from "./routes/teams/PlayerDetail";
import { TeamEvents } from "./routes/teams/TeamEvents";
import { TeamEventDetail } from "./routes/teams/TeamEventDetail";
import { TeamActivities } from "./routes/teams/TeamActivities";
import { DrillDetail } from "./routes/teams/DrillDetail";
import { TeamKnowledge } from "./routes/teams/TeamKnowledge";
import { ArticleDetail } from "./routes/teams/ArticleDetail";
import { TeamTasks } from "./routes/teams/TeamTasks";
import { TeamLineups } from "./routes/teams/TeamLineups";
import { LineupEditor } from "./routes/teams/LineupEditor";
import { TeamSettings } from "./routes/teams/TeamSettings";
import { ClubDrills } from "./routes/ClubDrills";
import { ClubKnowledge } from "./routes/ClubKnowledge";
import { ClubLineups } from "./routes/ClubLineups";
import { ClubTasks } from "./routes/ClubTasks";
import { ClubSeasons } from "./routes/ClubSeasons";
import { Departments } from "./routes/Departments";
import { DepartmentDetail } from "./routes/DepartmentDetail";
import { PlayerPasses } from "./routes/PlayerPasses";
import { ClubEvents } from "./routes/ClubEvents";
import { FieldBooking } from "./routes/FieldBooking";
import { Volunteering } from "./routes/Volunteering";
import { Matches } from "./routes/Matches";
import { Documents } from "./routes/Documents";
import { Inbox } from "./routes/Inbox";
import { ClubNews } from "./routes/ClubNews";
import { Login } from "./routes/Login";
import { People } from "./routes/People";
import { Registration } from "./routes/Registration";
import { PilotInbox, PilotMemberPortal, ChatModeration } from "./routes/pilot";
import {
  MemberHome,
  MemberCalendar,
  MemberChats,
  MemberNews,
  MemberProfile,
  MemberSettings
} from "./routes/member";
import { MemberTeam } from "./routes/member/MemberTeam";

function App() {
  const basename = import.meta.env.BASE_URL;
  
  return (
    <LanguageProvider>
      <RoleProvider>
        <PeopleProvider>
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
                <Route path="people" element={<People />} />
                <Route path="people/:id" element={<People />} />
                {/* Legacy routes - redirect to unified People page */}
                <Route path="members" element={<Navigate to="/people" replace />} />
                <Route path="members/:id" element={<Navigate to="/people" replace />} />
                <Route path="contacts" element={<Navigate to="/people" replace />} />
                <Route path="contacts/:id" element={<Navigate to="/people" replace />} />
                <Route path="teams" element={<Teams />} />
                {/* Team detail nested routes */}
                <Route path="teams/:teamId" element={<TeamLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<TeamDashboard />} />
                  <Route path="players" element={<TeamPlayers />} />
                  <Route path="players/:personId" element={<PlayerDetail />} />
                  <Route path="events" element={<TeamEvents />} />
                  <Route path="events/:eventId" element={<TeamEventDetail />} />
                  <Route path="activities" element={<TeamActivities />} />
                  <Route path="activities/:drillId" element={<DrillDetail />} />
                  <Route path="knowledge" element={<TeamKnowledge />} />
                  <Route path="knowledge/:articleId" element={<ArticleDetail />} />
                  <Route path="tasks" element={<TeamTasks />} />
                  <Route path="lineups" element={<TeamLineups />} />
                  <Route path="lineups/:lineupId" element={<LineupEditor />} />
                  <Route path="settings" element={<TeamSettings />} />
                </Route>
                <Route path="departments" element={<Departments />} />
                <Route path="departments/:departmentId" element={<DepartmentDetail />} />
                <Route path="committees" element={<Committees />} />
                
                {/* Registrierung */}
                <Route path="registration" element={<Registration />} />
                <Route path="registration/new" element={<Registration />} />
                <Route path="registration/:id" element={<Registration />} />
                
                {/* Spielbetrieb */}
                <Route path="matches" element={<Matches />} />
                <Route path="player-passes" element={<PlayerPasses />} />
                <Route path="seasons" element={<ClubSeasons />} />
                <Route path="drills" element={<ClubDrills />} />
                <Route path="knowledge" element={<ClubKnowledge />} />
                <Route path="lineups" element={<ClubLineups />} />
                <Route path="tasks" element={<ClubTasks />} />
                
                {/* Veranstaltungen */}
                <Route path="events" element={<ClubEvents />} />
                <Route path="club-events" element={<Navigate to="/events" replace />} />
                <Route path="fields" element={<FieldBooking />} />
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
                <Route path="member/team" element={<MemberTeam />} />
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
              
              {/* ==========================================
                  PUBLIC REGISTRATION (Standalone)
                  ========================================== */}
              <Route path="join/public/:formId" element={<Registration />} />
              <Route path="join/claim/:intentId" element={<Registration />} />
            </Routes>
          </BrowserRouter>
        </PeopleProvider>
      </RoleProvider>
    </LanguageProvider>
  );
}

export default App;
