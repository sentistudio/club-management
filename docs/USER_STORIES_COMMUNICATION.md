# Communication Features - User Stories & Acceptance Criteria

## Overview

This document outlines the user stories and acceptance criteria for the club management communication system, covering both the **Admin Portal** (Club Management) and the **Member Portal App**. 

The communication system consists of:
- **Inbox (Requests)**: Structured, ticketed communication for official club matters
- **Chat**: Real-time messaging for informal team/coach communication
- **News Feed**: One-way announcements (out of scope for this document)

---

## Roles & Permissions Matrix

| Role | Inbox (Receive) | Inbox (Send) | Chat (Group) | Chat (Direct) | News (Create) |
|------|----------------|--------------|--------------|---------------|---------------|
| **System Admin** | Reply to Club/Org Admins | Inbox only | ❌ | ❌ | ❌ |
| **Org Admin** | All clubs in org | All clubs in org | ❌ | ❌ | Org-wide |
| **Club Admin** | All club requests | Club members | ❌ (manage only) | ❌ | Club-wide |
| **Department Admin** | Department requests | Department members | ❌ (manage only) | ❌ | Department |
| **Coach/Trainer** | Team requests | Team members | ✅ Team groups | ✅ Parents/Players | Team |
| **Member (Adult)** | Own requests | To Club/Admins | ✅ Team groups | ✅ Coach | ❌ |
| **Member (Parent for Kid)** | Kid's requests | On behalf of kid | ✅ Kid's team | ✅ Kid's coach | ❌ |

---

# PART 1: ADMIN PORTAL (Club Management)

## Epic: Admin Inbox Management

### PILOT Stories (Core MVP)

---

#### US-ADM-001: View Inbox Dashboard
**As a** Club Admin  
**I want to** see an overview of all member requests in my inbox  
**So that** I can quickly understand the workload and prioritize responses

**Acceptance Criteria:**
- [ ] Display total request count, broken down by status (Open, In Progress, Resolved)
- [ ] Show unread message count with visual indicator
- [ ] Display list of requests sorted by most recent activity (default)
- [ ] Each request shows: requester name, department, subject, category, status, timestamp
- [ ] Unread requests are visually distinguished (bold, indicator dot)
- [ ] Clicking a request opens the detail view

**Priority:** P0 (Pilot)

---

#### US-ADM-002: View Request Details
**As a** Club Admin  
**I want to** view the full conversation history of a request  
**So that** I can understand the context before responding

**Acceptance Criteria:**
- [ ] Display requester profile information (name, department, role, member since)
- [ ] Show complete message thread in chronological order
- [ ] Display message sender, timestamp, and content for each message
- [ ] Show attachments with download capability
- [ ] Clicking requester name/avatar navigates to member profile
- [ ] Display ticket number for reference

**Priority:** P0 (Pilot)

---

#### US-ADM-003: Reply to Request
**As a** Club Admin  
**I want to** reply to member requests  
**So that** I can provide assistance and resolve their issues

**Acceptance Criteria:**
- [ ] Text area for composing reply with basic formatting support
- [ ] Ability to attach files to reply
- [ ] "Send" button sends reply and updates conversation
- [ ] Reply appears immediately in conversation thread
- [ ] Request status auto-updates to "In Progress" after first admin reply
- [ ] System sends notification to member (push/email based on settings)

**Priority:** P0 (Pilot)

---

#### US-ADM-004: Update Request Status
**As a** Club Admin  
**I want to** change the status of a request  
**So that** I can track progress and organize my workload

**Acceptance Criteria:**
- [ ] Status dropdown with options: Open, In Progress, Resolved
- [ ] Status change is immediately reflected in list view
- [ ] System logs status change in ticket history
- [ ] "Resolved" status sends automatic notification to member
- [ ] Admin can reopen a resolved request by changing status back

**Status Lifecycle:**
```
Open → In Progress → Resolved
  ↑         ↓           ↓
  ←─────────←───────────←
```

**Priority:** P0 (Pilot)

---

#### US-ADM-005: Filter and Search Requests
**As a** Club Admin  
**I want to** filter and search through requests  
**So that** I can quickly find specific requests

**Acceptance Criteria:**
- [ ] Search field searching across: subject, requester name, ticket number, department
- [ ] Filter by status (Open, In Progress, Resolved)
- [ ] Filter by category (Beitragsfrage, Mitgliedschaft, Dokumente, etc.)
- [ ] Filters can be combined
- [ ] Results update in real-time as filters change
- [ ] Clear filters option resets to default view

**Priority:** P0 (Pilot)

---

#### US-ADM-006: Create New Message to Member
**As a** Club Admin  
**I want to** initiate a new message to a member  
**So that** I can proactively communicate important information

**Acceptance Criteria:**
- [ ] "New Message" button opens composition modal
- [ ] Member selector with search functionality
- [ ] Required fields: Recipient, Subject, Category, Message
- [ ] Optional: File attachments
- [ ] Preview before sending
- [ ] Send creates new request visible to both admin and member

**Priority:** P0 (Pilot)

---

#### US-ADM-007: Add Private/Internal Note
**As a** Club Admin  
**I want to** add internal notes to a request  
**So that** I can document information not visible to the member

**Acceptance Criteria:**
- [ ] Toggle to mark message as "Internal Note"
- [ ] Internal notes visually distinguished (amber/yellow styling)
- [ ] Internal notes show lock icon and "Internal Note" label
- [ ] Internal notes NOT visible to member in their app
- [ ] Internal notes visible to all admins
- [ ] Admin can add internal note without notifying member

**Priority:** P0 (Pilot)

---

#### US-ADM-008: Attach Files to Messages
**As a** Club Admin  
**I want to** attach files to my replies  
**So that** I can share documents with members

**Acceptance Criteria:**
- [ ] File picker button in reply area
- [ ] Support for: PDF, Images (JPG, PNG), Documents (DOC, DOCX)
- [ ] File size limit: 10MB per file
- [ ] Show attached files with name, size, remove option before sending
- [ ] Attachments visible in conversation with download button
- [ ] File type indicated by icon

**Priority:** P0 (Pilot)

---

### MVP Stories (Extended Features)

---

#### US-ADM-009: Assignment to Staff
**As a** Club Admin  
**I want to** assign requests to specific staff members  
**So that** the right person handles each request

**Acceptance Criteria:**
- [ ] "Assign to" dropdown with staff members
- [ ] Filter requests by: Assigned to me, Unassigned, All
- [ ] Assignment change logged in ticket history
- [ ] Assigned staff receives notification
- [ ] Assigned staff name shown in request list and detail view

**Priority:** P1 (MVP)

---

#### US-ADM-010: Bulk Messaging (Rundschreiben)
**As a** Club Admin  
**I want to** send a message to multiple members at once  
**So that** I can efficiently communicate announcements

**Acceptance Criteria:**
- [ ] Toggle between "Single" and "Bulk" message mode
- [ ] Recipient selection by: All members, Department, Team, Role, Manual selection
- [ ] Show recipient count before sending
- [ ] Each recipient sees message as individual inbox item
- [ ] Admin can see delivery statistics (sent count, open count)
- [ ] Option to enable/disable email notification

**Recipient Selection Logic:**
```
All Members → 150 recipients
Department (Fußball) → 45 recipients  
Team (Herren 1. Mannschaft) → 22 recipients
Role (Aktiv) → 120 recipients
Manual → Search & select individuals
```

**Priority:** P1 (MVP)

---

#### US-ADM-011: Message Templates
**As a** Club Admin  
**I want to** use and manage message templates  
**So that** I can respond quickly to common inquiries

**Acceptance Criteria:**
- [ ] Template dropdown in reply composer
- [ ] Templates organized by category
- [ ] Select template populates reply text
- [ ] "Save as template" option for current reply
- [ ] Template manager to create, edit, delete templates
- [ ] Templates support placeholders: {name}, {membership_id}

**Priority:** P1 (MVP)

---

#### US-ADM-012: Email Notification Toggle
**As a** Club Admin  
**I want to** control whether members receive email notifications  
**So that** I can manage communication channels appropriately

**Acceptance Criteria:**
- [ ] "Also send email" checkbox (default: checked)
- [ ] When unchecked, member only receives in-app notification
- [ ] Setting remembered per session
- [ ] Visual indicator when email is disabled

**Priority:** P1 (MVP)

---

#### US-ADM-013: View Member Profile from Request
**As a** Club Admin  
**I want to** navigate to a member's full profile from a request  
**So that** I can see their complete membership information

**Acceptance Criteria:**
- [ ] Click on requester avatar/name opens profile
- [ ] Profile shows: membership details, payment history, other open requests
- [ ] Back button returns to inbox
- [ ] Deep link to specific profile sections

**Priority:** P1 (MVP)

---

### LATER Stories (Post-MVP)

---

#### US-ADM-014: Request Categories & Routing
**As a** Club Admin  
**I want to** configure categories that auto-route to specific staff  
**So that** requests reach the right person automatically

**Acceptance Criteria:**
- [ ] Admin can configure category → assignee rules
- [ ] New requests automatically assigned based on category
- [ ] Department-specific categories route to department admins
- [ ] Override possible for individual requests

**Priority:** P2 (Later)

---

#### US-ADM-015: Request Statistics & Analytics
**As a** Club Admin  
**I want to** see communication statistics  
**So that** I can understand response times and volumes

**Acceptance Criteria:**
- [ ] Dashboard showing: total requests, avg response time, resolution rate
- [ ] Filter by time period
- [ ] Breakdown by category, department, staff member
- [ ] Export capability

**Priority:** P2 (Later)

---

#### US-ADM-016: Print Message/Letter Format
**As a** Club Admin  
**I want to** print a request conversation as a formal letter  
**So that** I can create official documentation

**Acceptance Criteria:**
- [ ] Print button generates formatted document
- [ ] Club letterhead included
- [ ] Member address details
- [ ] Professional letter format

**Priority:** P2 (Later)

---

#### US-ADM-017: Reply as Club (not personal name)
**As a** Club Admin  
**I want to** send replies that appear from "Club Administration"  
**So that** communication appears official rather than personal

**Acceptance Criteria:**
- [ ] Toggle to send as "Club Administration"
- [ ] Member sees club name as sender
- [ ] Admin's actual identity logged internally

**Priority:** P2 (Later)

---

## Epic: Admin Chat Management

---

#### US-ADM-020: View All Chats
**As a** Club Admin  
**I want to** view all active chats in the club  
**So that** I can monitor communication

**Acceptance Criteria:**
- [ ] List of all team group chats
- [ ] List of direct chats (coach ↔ member)
- [ ] Filter by team, department
- [ ] Read-only view (admins don't participate in chats)
- [ ] Search across chat messages

**Priority:** P1 (MVP)

---

#### US-ADM-021: Configure Chat Settings
**As a** Club Admin  
**I want to** configure chat feature settings  
**So that** I can control how members communicate

**Acceptance Criteria:**
- [ ] Enable/disable chat feature club-wide
- [ ] Enable/disable team group chats
- [ ] Enable/disable direct messages to coaches
- [ ] Settings apply immediately

**Priority:** P2 (Later)

---

---

# PART 2: MEMBER PORTAL APP

## Epic: Member Inbox (Requests)

### Member as Individual Adult

---

#### US-MEM-001: View My Messages
**As a** Club Member  
**I want to** see all my communications with the club  
**So that** I can track my requests and announcements

**Acceptance Criteria:**
- [ ] Unified "Messages" view showing both inbox requests and chats
- [ ] Requests show: subject, category icon, status badge, timestamp
- [ ] Unread messages highlighted
- [ ] Sort by most recent
- [ ] Search across all messages

**Priority:** P0 (Pilot)

---

#### US-MEM-002: View Request Detail
**As a** Club Member  
**I want to** view the full conversation of a request  
**So that** I can follow up on my inquiry

**Acceptance Criteria:**
- [ ] Display complete message thread
- [ ] Show sender name, timestamp for each message
- [ ] Show attachments with download capability
- [ ] Status badge (Open, In Progress, Resolved)
- [ ] Timestamp of last update

**Priority:** P0 (Pilot)

---

#### US-MEM-003: Reply to Request
**As a** Club Member  
**I want to** reply to messages from the club  
**So that** I can provide additional information

**Acceptance Criteria:**
- [ ] Text input for reply
- [ ] Attach files option
- [ ] Send button submits reply
- [ ] Reply appears immediately in thread
- [ ] Status changes back to "Open" if was "Resolved"

**Priority:** P0 (Pilot)

---

#### US-MEM-004: Create New Request
**As a** Club Member  
**I want to** submit a new request to the club  
**So that** I can ask questions or request services

**Acceptance Criteria:**
- [ ] "+" button to create new request
- [ ] Category selection (required)
- [ ] Subject field (required)
- [ ] Message body (required)
- [ ] Optional: Department selection
- [ ] Optional: Attachments
- [ ] Submit creates request and shows confirmation

**Request Categories:**
- 💰 Beitragsfrage (Fee Question)
- 👤 Mitgliedschaft (Membership)
- 📄 Dokumente (Documents)
- 📝 Anmeldung (Registration)
- 🏖️ Abwesenheit (Absence)
- 👕 Ausrüstung (Equipment)
- 💬 Allgemein (General)
- ⚠️ Beschwerde (Complaint)
- 💡 Vorschlag (Suggestion)

**Priority:** P0 (Pilot)

---

#### US-MEM-005: Receive Push Notifications
**As a** Club Member  
**I want to** receive push notifications for new messages  
**So that** I'm informed promptly

**Acceptance Criteria:**
- [ ] Push notification when admin replies
- [ ] Push notification for bulk messages
- [ ] Notification shows preview text
- [ ] Tapping notification opens specific message
- [ ] Notification settings in profile

**Priority:** P1 (MVP)

---

### Member Acting On Behalf of Child

---

#### US-MEM-010: Switch to Child's Context
**As a** Parent Member  
**I want to** switch to my child's profile context  
**So that** I can manage their club activities

**Acceptance Criteria:**
- [ ] Profile switcher shows all linked profiles (self + children)
- [ ] Children indicated with appropriate badge
- [ ] Switching context updates entire app view
- [ ] Clear indicator showing "acting for [child name]"
- [ ] Easy switch back to own profile

**Priority:** P0 (Pilot)

---

#### US-MEM-011: View Child's Messages (Restricted)
**As a** Parent Member (acting for child)  
**I want to** see my child's relevant communications  
**So that** I can stay informed about their activities

**Acceptance Criteria:**
- [ ] In child context, only show:
  - Team group chat
  - Coach direct messages
  - Requests created for child
- [ ] Clear notice: "Child Profile - Restricted Communication"
- [ ] Cannot see parent-only club communications
- [ ] Cannot see other children's communications

**Priority:** P0 (Pilot)

---

#### US-MEM-012: Create Request On Behalf of Child
**As a** Parent Member  
**I want to** submit requests on behalf of my child  
**So that** I can manage their club matters

**Acceptance Criteria:**
- [ ] When in child context, requests tagged "On behalf of [child name]"
- [ ] Admin sees parent name as requester with child context
- [ ] Request appears in child's context, not parent's personal inbox
- [ ] Parent name shown: "Daniel für Noah"

**Priority:** P0 (Pilot)

---

#### US-MEM-013: Receive Notifications for Child
**As a** Parent Member  
**I want to** receive notifications for my child's messages  
**So that** I don't miss important information

**Acceptance Criteria:**
- [ ] Push notifications for child's team chat mentions
- [ ] Push notifications for coach messages to child
- [ ] Push notifications for requests in child's context
- [ ] Notifications indicate which child: "Noah: New message from Coach"

**Priority:** P1 (MVP)

---

## Epic: Member Chat

---

#### US-MEM-020: View Team Group Chat
**As a** Club Member  
**I want to** see my team's group chat  
**So that** I can stay informed about team activities

**Acceptance Criteria:**
- [ ] Group chat per team membership
- [ ] Shows team name and all participants
- [ ] Real-time message updates
- [ ] Scroll through message history
- [ ] Last message preview in chat list

**Priority:** P0 (Pilot)

---

#### US-MEM-021: Send Message in Team Chat
**As a** Club Member  
**I want to** send messages in my team's group chat  
**So that** I can communicate with teammates

**Acceptance Criteria:**
- [ ] Text input at bottom of chat
- [ ] Send button submits message
- [ ] Message appears immediately
- [ ] Shows "You" or name for own messages
- [ ] Basic emoji support

**Priority:** P0 (Pilot)

---

#### US-MEM-022: Direct Message Coach
**As a** Club Member  
**I want to** send direct messages to my coach  
**So that** I can discuss individual matters

**Acceptance Criteria:**
- [ ] Each team membership shows linked coach
- [ ] Tap to open direct conversation
- [ ] Messages visible only to member and coach
- [ ] Conversation persists across sessions

**Priority:** P0 (Pilot)

---

#### US-MEM-023: View Chat as Parent for Child
**As a** Parent Member  
**I want to** participate in my child's team chat  
**So that** I can communicate with the coach

**Acceptance Criteria:**
- [ ] When in child context, see child's team group chat
- [ ] Can send messages (appear as "Parent of [child]")
- [ ] Can direct message child's coach
- [ ] Messages clearly attributed to parent, not child

**Chat Display:**
```
Thomas Trainer: Training tomorrow at 5pm!
You (für Noah): Noah will be 10 min late
Lisa (für Max): Max can't attend
```

**Priority:** P0 (Pilot)

---

---

# PART 3: LIFECYCLE MANAGEMENT

## Epic: Member Status Changes

---

#### US-LIFE-001: Member Leaves Club
**As a** System  
**When** a member's membership ends  
**I want to** handle their communication appropriately  
**So that** data is managed correctly

**Acceptance Criteria:**
- [ ] Open requests auto-resolve with system message: "Membership ended"
- [ ] Chat access removed immediately
- [ ] Message history retained for club records (admin can view)
- [ ] Member can no longer send new messages
- [ ] Existing bulk message threads: member removed from recipients

**Status Transition:**
```
Active Member → Membership Ends → Communication Disabled
                    ↓
            Open Requests → Auto-Resolved
            Chat Access → Removed
            History → Archived (admin visible)
```

**Priority:** P1 (MVP)

---

#### US-LIFE-002: Member Switches Team
**As a** System  
**When** a member moves to a different team  
**I want to** update their chat access  
**So that** they're in the correct conversations

**Acceptance Criteria:**
- [ ] Remove from old team group chat
- [ ] Add to new team group chat
- [ ] Direct coach chat with old coach: archived (read-only)
- [ ] New direct chat with new coach available
- [ ] System message in old chat: "[Member] has left the team"
- [ ] System message in new chat: "[Member] has joined the team"

**Priority:** P1 (MVP)

---

#### US-LIFE-003: Child Becomes Adult Player
**As a** System  
**When** a child member turns 18 or is promoted to adult status  
**I want to** transition their communication profile  
**So that** they have full member access

**Acceptance Criteria:**
- [ ] Parent context no longer available for this member
- [ ] Former child gains full inbox access
- [ ] Previous messages transferred to their own profile
- [ ] Previous parent-sent messages show original attribution
- [ ] Parent no longer sees child's messages
- [ ] Notification to parent: "[Child] is now managing their own communications"

**Transition:**
```
Parent Context (für Noah) → Noah's Own Profile
                              ↓
                        Full Member Access
                        Own Inbox
                        Own Chat Access
```

**Priority:** P2 (Later)

---

#### US-LIFE-004: Request Inactivity Auto-Close
**As a** System  
**I want to** auto-close inactive requests  
**So that** the inbox stays manageable

**Acceptance Criteria:**
- [ ] Requests with no activity for 30 days → warning notification
- [ ] After 45 days → auto-resolved with system message
- [ ] Member can reopen by replying
- [ ] Admin configurable timeframes
- [ ] Bulk messages: no auto-close

**Priority:** P2 (Later)

---

#### US-LIFE-005: Chat Message Retention (Stretch)
**As a** Club Admin  
**I want to** configure chat message retention  
**So that** storage is managed and privacy maintained

**Acceptance Criteria:**
- [ ] Configure retention period (default: 12 months)
- [ ] Old messages automatically archived/deleted
- [ ] Warning before deletion
- [ ] Export option before deletion

**Note:** This is marked as "Later (MVP or later)" in the requirements - "chats are only available for 24h" was mentioned but may be too restrictive. Recommend longer retention.

**Priority:** P3 (Stretch)

---

---

# APPENDIX A: Request Categories

| Category ID | German | English | Icon | Auto-Route |
|-------------|--------|---------|------|------------|
| fee_question | Beitragsfrage | Fee Question | 💰 | Finance Admin |
| membership | Mitgliedschaft | Membership | 👤 | Membership Admin |
| documents | Dokumente | Documents | 📄 | - |
| registration | Anmeldung | Registration | 📝 | Membership Admin |
| technical | Technisch | Technical | 🔧 | IT Admin |
| general | Allgemein | General | 💬 | - |
| complaint | Beschwerde | Complaint | ⚠️ | Club Admin |
| suggestion | Vorschlag | Suggestion | 💡 | - |
| absence | Abwesenheit | Absence | 🏖️ | Coach |
| equipment | Ausrüstung | Equipment | 👕 | Equipment Admin |
| organization | Organisation | Organization | 📋 | - |

---

# APPENDIX B: Request Status Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        REQUEST LIFECYCLE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Member Creates Request]                                      │
│            │                                                    │
│            ▼                                                    │
│       ┌─────────┐                                              │
│       │  OPEN   │ ◄──── Member replies to resolved request     │
│       └────┬────┘                                              │
│            │                                                    │
│            │ Admin views / first reply                         │
│            ▼                                                    │
│   ┌────────────────┐                                           │
│   │  IN PROGRESS   │ ◄──── Admin working on request            │
│   └───────┬────────┘                                           │
│           │                                                     │
│           │ Admin resolves                                      │
│           ▼                                                     │
│     ┌──────────┐                                               │
│     │ RESOLVED │ ───► Auto-notification to member              │
│     └────┬─────┘                                               │
│          │                                                      │
│          │ 45 days inactive OR manual close                    │
│          ▼                                                      │
│     ┌──────────┐                                               │
│     │  CLOSED  │ ───► Archived, read-only                      │
│     └──────────┘                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# APPENDIX C: Communication Matrix by Role

## FROM: Member / Player / Parent

| TO | Allowed? | Channel | Mode | Notes |
|----|----------|---------|------|-------|
| Member / Player / Parent | ✅ (same team) | Chat | Group-only | Team groups only, no direct member-to-member |
| Coach / Trainer | ✅ | Chat | Direct + Group | Direct for individual matters, group for team |
| Department Admin | ✅ | Inbox | Request | Structured, tracked requests |
| Club Admin | ✅ | Inbox | Request | Structured, tracked requests |
| Org Admin | ✅ | Inbox | Request | Forward from club admin |

## FROM: Coach / Trainer

| TO | Allowed? | Channel | Mode | Notes |
|----|----------|---------|------|-------|
| Member / Player / Parent | ✅ | Chat | Direct + Group | Group default, direct for sensitive matters |
| Other Coaches | ✅ | Chat | Group-only | Coach groups per department |
| Department Admin | ✅ | Inbox | Request | Request from Coach |
| Club Admin | ✅ | Inbox | Request | Request from Coach |

## FROM: Club Admin

| TO | Allowed? | Channel | Mode | Notes |
|----|----------|---------|------|-------|
| Member / Player / Parent | ✅ | Inbox + News | Direct + Bulk | Official communications |
| Coach / Trainer | ✅ | Inbox | Direct | Administrative matters |
| Department Admin | ✅ | Inbox | Direct | Internal coordination |
| Org Admin | ✅ | Inbox | Request | Escalation path |

---

# APPENDIX D: Priority Definitions

| Priority | Definition | Target Release |
|----------|------------|----------------|
| P0 | Must have for Pilot | Pilot |
| P1 | Must have for MVP | MVP |
| P2 | Should have | Post-MVP |
| P3 | Nice to have (Stretch) | Future |

---

# APPENDIX E: Technical Notes

## Data Model References

### Ticket (Request)
```typescript
interface Ticket {
  id: string;
  clubId: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment?: string;
  requesterRole?: MemberRole;
  assignedToId?: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus; // open | pending | resolved | closed
  priority: TicketPriority;
  ticketNumber: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  // On behalf
  isOnBehalf?: boolean;
  onBehalfOfName?: string;
  onBehalfOfId?: string;
  // Bulk
  isBulkMessage?: boolean;
  bulkRecipientCount?: number;
}
```

### Chat
```typescript
interface Chat {
  id: string;
  type: "direct" | "group";
  name: string;
  participants: string[];
  teamId?: string;
  departmentId?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  // For parent context
  onBehalfOf?: string;
}
```

---

*Document Version: 1.0*  
*Last Updated: January 2026*  
*Author: Product Team*

