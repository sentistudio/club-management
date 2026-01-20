# Events Features - User Stories & Acceptance Criteria

## Overview

This document outlines the user stories and acceptance criteria for the club management events/calendar system, covering both the **Admin Portal** (Club Management) and the **Member Portal App**.

Given the complexity of the core solution for team events, we decided not to mix team events with club events and for now have a **separate Club Events logic**.

The events system follows different Event Models with **two scopes**:

- **Team Events**: Training, matches, team activities (managed by coaches)
- **Club Events**: General assemblies, festivals, club-wide announcements (managed by club admins)

### Future Scope Extensions

In the future it is possible that additional event scopes will occur:

- **Organization Events**: Cross-club events within one organization
- **Department Events**: Assemblies, workshops, parent meetings (managed by department admins)

With the current knowledge given from stakeholders, we see the event as a **unified model** and not as separate models, so that additional scopes for Department Events or Organizational Events are more a matter of **visibility**.

---

## Event Scopes & Permissions Matrix

| Scope | Can Create | Can Edit | Can View | Calendar Visibility |
|-------|-----------|----------|----------|-------------------|
| **Team** | Coach | Coach | Team (Players) | Team Calendar |
| **Club** | Club Admin | Club Admin | All members | My Calendar (Private) / Club Calendar (Public) |

---

## Event Types by Scope

Every event in the system is, by default, created as a **General Event**. This means it only contains the core event information (title, time, location, visibility, participants, etc.) and can be used for any kind of appointment.

When an admin switches an event to a specific event type (e.g., Training, Match, Workshop), the system can trigger **additional follow-up tasks** that must be completed outside of the basic event form. These follow-up tasks ensure that all domain-specific requirements for that type are covered.

**Examples:**
- When choosing **Training**, the system may create a task to upload training documents or session plans
- When choosing **Match**, it may trigger a task to confirm the official fixture or add referee information

In this way, event types extend the basic event with structured, type-specific workflows while keeping the core event model unified.

### Event Types

| Type ID | Label (DE) | Icon | Scope |
|---------|-----------|------|-------|
| general | Allgemein | 📅 | Club (Pilot/MVP) |
| training | Training | 🏃 | Team |
| match | Spiel | 🏆 | Team |
| friendly | Freundschaftsspiel | 🤝 | Team |

> **Note:** During Pilot and potentially MVP phase, we only have **general events on club level**. Training, match, and friendly will remain in the core on the **team level**.

---

# PART 1: ADMIN PORTAL (Club Management)

## Epic: Event Management

### Core Features

---

#### US-EVT-001: View Event Dashboard
**As a** Club Admin  
**I want to** see an overview of all events  
**So that** I can manage the club calendar effectively

**Acceptance Criteria:**
- [ ] Display list of all events sorted by date (upcoming first)
- [ ] Show event cards with: title, date/time, location, type, status
- [ ] Filter by event type (General, Training, Match, etc.) *if team events visible*
- [ ] Filter by status (Draft, Published, Cancelled, Completed)
- [ ] Search by event title
- [ ] Separate sections for "Upcoming" and "Past" events
- [ ] Quick stats showing event counts by status

> **Note:** We need to evaluate if team events can be brought into the club events page for view-only purposes. If not, filter by type and scope may not be relevant.

**Priority:** P0 (Pilot)

---

#### US-EVT-002: Create New Event
**As a** Club Admin  
**I want to** create a new event  
**So that** members can see and register for it

**Acceptance Criteria:**

**Step 1: Basic Details:**
- [ ] Title (required)
- [ ] Date (required)
- [ ] Start time (required)
- [ ] End time (required)
- [ ] Location (optional)
- [ ] Description (optional)

**Step 2: Event Participant Selection:**
- [ ] Team scope: Select one or multiple teams (with search)
- [ ] Club scope: Automatically targets all members
- [ ] Custom lists: Select specific groups created from custom lists
- [ ] Manual Selection: Fine-tune individual members

**Step 3: Participation Settings:**
- [ ] Max participants (optional)
- [ ] RSVP required toggle
- [ ] RSVP deadline (if RSVP required)

**Step 4: Recurrence (optional):**
- [ ] One-time or recurring
- [ ] Recurring pattern selection

**Step 5: Visibility:**
- [ ] Private: Only selected members see in "My Calendar"
- [ ] Public: Visible in "Club Calendar" for all members

**Step 6: Save:**
- [ ] Save as Draft or Publish immediately

**Parent-Child Logic:**
- [ ] When team with child players selected, parents auto-included
- [ ] Parent shows "🔒 Auto" badge if included via child
- [ ] Cannot deselect parent while child is still selected
- [ ] Child players show "👶 Kind (Elternteil wird automatisch informiert)"

**Priority:** P0 (Pilot)

---

#### US-EVT-003: Select Event Participants (Teams)
**As a** Admin  
**I want to** select which teams an event is for  
**So that** only relevant members see it

**Acceptance Criteria:**
- [ ] For Team events: Show searchable list of all teams
- [ ] Multi-select capability (can select multiple teams)
- [ ] Show team name and age group in selection list
- [ ] Visual indicator for selected teams
- [ ] Show count of selected teams
- [ ] Selecting team auto-populates member list

**Priority:** P0 (Pilot)

---

#### US-EVT-004: Manual Member Selection
**As a** Admin  
**I want to** manually adjust which members see an event  
**So that** I can fine-tune the audience beyond team selection

**Acceptance Criteria:**
- [ ] "Manual Selection" button available after team selection
- [ ] Opens modal with full member list
- [ ] Members shown with: name, role (context-aware), selection source
- [ ] Search members by name or email
- [ ] Filter members by role (Spieler, Trainer, Elternteil, Vorstand)
- [ ] Pre-selected members from team shown as checked
- [ ] Can uncheck to exclude members
- [ ] Can add members not in original selection
- [ ] Show selection count in footer

**Priority:** P0 (Pilot)

---

#### US-EVT-005: Edit Event
**As a** Admin  
**I want to** edit an existing event  
**So that** I can update details or fix mistakes

**Acceptance Criteria:**
- [ ] Edit button available on event cards (not for completed events)
- [ ] Click opens edit modal with pre-filled data
- [ ] Can modify all fields: title, date, time, location, description
- [ ] Can adjust member selection
- [ ] Can change status (Draft → Published, etc.)
- [ ] Cannot edit completed events
- [ ] Save updates event immediately

**Priority:** P0 (Pilot)

---

#### US-EVT-006: View Event Details
**As a** Admin  
**I want to** view full event details  
**So that** I can see all information and registrations

**Acceptance Criteria:**
- [ ] Click event opens detail view
- [ ] Shows all event information:
  - Title, description
  - Date, time, duration
  - Location
  - Event type badge
  - Status badge
- [ ] Shows organizer/team information
- [ ] Shows participant count and registration stats
- [ ] Shows RSVP deadline if applicable
- [ ] Action buttons: Edit, Delete, Cancel
- [ ] Quick status change dropdown

**Priority:** P0 (Pilot)

---

#### US-EVT-007: Event Status Management
**As a** Admin  
**I want to** manage event status  
**So that** members know if an event is confirmed or cancelled

**Acceptance Criteria:**
- [ ] Status dropdown with options: Draft, Published, Cancelled, Completed
- [ ] **Draft**: Not visible to members
- [ ] **Published**: Visible to selected members, RSVP open
- [ ] **Cancelled**: Shows as cancelled, notification sent
- [ ] **Completed**: Archived, read-only
- [ ] Status change logged with timestamp

**Status Flow:**
```
Draft → Published → Completed
          ↓
      Cancelled
```

**Priority:** P0 (Pilot)

---

#### US-EVT-008: Calendar Visibility (Private/Public)
**As a** Admin  
**I want to** set whether an event appears in the public club calendar  
**So that** I can control what's visible to all members vs. specific groups

**Acceptance Criteria:**
- [ ] "Calendar Visibility" option in event creation
- [ ] **Private**: Only selected members see event in "My Calendar"
- [ ] **Public**: Event visible in "Club Calendar" for all members
- [ ] Private events still respect team selection
- [ ] Visual indicator showing visibility setting
- [ ] Can change visibility after creation

**Priority:** P0 (Pilot)

---

# PART 2: MEMBER PORTAL APP

## Epic: Member Calendar & Events

### Core Features

---

#### US-MEM-EVT-001: View Calendar
**As a** Club Member  
**I want to** see my upcoming events in a calendar  
**So that** I know what's scheduled

**Acceptance Criteria:**
- [ ] Calendar view as main navigation tab
- [ ] Week view with day selector
- [ ] Navigate between weeks (previous/next)
- [ ] Days with events visually highlighted
- [ ] Selected day shows event details below
- [ ] Events grouped by: Today, Tomorrow, Later this Week

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-002: Calendar View Filters
**As a** Club Member  
**I want to** switch between calendar views  
**So that** I can see personal events vs. club-wide events

**Acceptance Criteria:**
- [ ] **My Calendar**: Personal events (team trainings, matches, private events)
- [ ] **Club Calendar**: Public club events visible to all members
- [ ] Filter chips at top of calendar
- [ ] Selected filter visually highlighted
- [ ] Events filtered based on selection
- [ ] Shows relevant section headers (e.g., "VEREINSTERMINE")

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-003: View Event in List
**As a** Club Member  
**I want to** see event cards in a list  
**So that** I can quickly scan upcoming activities

**Acceptance Criteria:**
- [ ] Event card shows:
  - Day number and weekday
  - Event title
  - Time
  - Location
  - RSVP status badge (Confirmed, Pending, Declined)
  - Event type badge (Training, Match, etc.)
- [ ] Click card opens event detail
- [ ] Scope badge for club events

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-004: View Event Detail
**As a** Club Member  
**I want to** see full event details  
**So that** I have all necessary information

**Acceptance Criteria:**
- [ ] Detail view shows:
  - Event title
  - Date and time
  - Duration
  - Location (with map link?)
  - Description
  - Team name
- [ ] **RSVP Section** (if RSVP required):
  - Participant counts (Confirmed, Pending, Declined)
  - RSVP deadline
  - RSVP action buttons
- [ ] **Attachments** (if any):
  - List of attached files
  - Download button for each
- [ ] **Notes** (if any)
- [ ] **Resources** (if any)
- [ ] Recurring pattern indicator

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-005: RSVP to Event
**As a** Club Member  
**I want to** respond to event invitations  
**So that** organizers know if I'm attending

**Acceptance Criteria:**
- [ ] RSVP buttons: Confirm (✓), Decline (✗), Maybe (?)
- [ ] Current RSVP status shown
- [ ] Can change RSVP until deadline
- [ ] After deadline: RSVP locked
- [ ] Confirmation feedback on action
- [ ] My RSVP visible in event card

**RSVP States:**
```
No Response → Confirmed/Declined/Maybe
     ↑              ↓
     ←──── Can change ────→ (until deadline)
```

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-006: Home Screen Event Preview
**As a** Club Member  
**I want to** see my next event on the home screen  
**So that** I know what's coming up without going to calendar

**Acceptance Criteria:**
- [ ] "Next Appointment" section on home screen
- [ ] Shows: date, title, time, location
- [ ] Today/Tomorrow badge if applicable
- [ ] Team icon
- [ ] "All Appointments" link to calendar
- [ ] "More Appointments" section with additional events
- [ ] Tap event opens calendar/detail

**Priority:** P0 (Pilot)

---

### Member as Parent for Child

---

#### US-MEM-EVT-007: View Child's Calendar
**As a** Parent Member  
**I want to** see my child's events when acting on their behalf  
**So that** I can manage their schedule

**Acceptance Criteria:**
- [ ] When switched to child's profile context:
  - Calendar shows child's team events
  - Shows trainings, matches for child's teams
  - Does NOT show parent's personal events
- [ ] Clear indication this is child's calendar
- [ ] Can RSVP on behalf of child

**Priority:** P0 (Pilot)

---

#### US-MEM-EVT-008: RSVP on Behalf of Child
**As a** Parent Member  
**I want to** RSVP for events on behalf of my child  
**So that** the coach knows if my child will attend

**Acceptance Criteria:**
- [ ] RSVP buttons work in child context
- [ ] RSVP recorded as "Parent for [child name]"
- [ ] Coach sees parent's name in registration list
- [ ] Parent receives notification of event changes

**Priority:** P0 (Pilot)

---

# PART 3: EVENT LIFECYCLE MANAGEMENT

## Epic: Event Status & Member Changes

---

#### US-LIFE-EVT-001: Event Status Transitions
**As a** System  
**I want to** manage event status appropriately  
**So that** the calendar reflects reality

**Acceptance Criteria:**
- [ ] **Draft → Published**: Event becomes visible to selected members
- [ ] **Published → Cancelled**: 
  - Notification sent to all registered participants
  - Event marked with "Cancelled" badge
  - Event remains visible but strikethrough
- [ ] **Published → Completed**: 
  - Happens automatically after event end time
  - Or manually by admin
  - RSVP no longer editable
  - Event archived

**Priority:** P0 (Pilot)

---

#### US-LIFE-EVT-002: Member Leaves Team
**As a** System  
**When** a member leaves a team  
**I want to** update their event access  
**So that** they only see relevant events

**Acceptance Criteria:**
- [ ] Member no longer sees team's private events
- [ ] Existing RSVP for future events: keep as historical
- [ ] Remove from upcoming event participant lists
- [ ] Club-wide public events still visible

**Priority:** P1 (MVP)

---

#### US-LIFE-EVT-003: Child Becomes Adult
**As a** System  
**When** a child member turns 18 or is promoted  
**I want to** transition their event access  
**So that** they manage their own calendar

**Acceptance Criteria:**
- [ ] Child's events transfer to their own profile
- [ ] Parent no longer sees events in child context
- [ ] Parent no longer receives child's event notifications
- [ ] Historical events remain in child's history

**Priority:** NOT PILOT (Future)

---

#### US-LIFE-EVT-004: RSVP Deadline Enforcement
**As a** System  
**I want to** enforce RSVP deadlines  
**So that** organizers have reliable attendance counts

**Acceptance Criteria:**
- [ ] After RSVP deadline:
  - RSVP buttons disabled
  - "RSVP closed" message shown
  - Pending responses → No response
- [ ] Reminder notification before deadline (24h)
- [ ] Admin can still modify registrations after deadline

**Priority:** NOT PILOT (MVP)

---

#### US-LIFE-EVT-005: Event Cancellation Workflow
**As a** System  
**When** an event is cancelled  
**I want to** notify all affected members  
**So that** they know not to attend

**Acceptance Criteria:**
- [ ] Cancellation triggers immediate notification
- [ ] Notification includes: event name, original date/time
- [ ] Reason for cancellation (optional field)
- [ ] Event remains visible with "Cancelled" badge
- [ ] Cancelled events filtered out by default in calendar

**Priority:** P0 (Pilot)

---

# APPENDIX A: Event Data Model

```typescript
interface ClubEvent {
  id: string;
  clubId: string;
  
  // Scope
  scope: "team" | "club";  // Future: "department" | "organization"
  teamIds?: string[];       // For team scope
  
  // Basic Info
  title: string;
  description?: string;
  eventType: "general" | "training" | "match" | "friendly";
  status: "draft" | "published" | "cancelled" | "completed";
  
  // Date & Time
  startsAt: string;          // ISO datetime
  endsAt: string;            // ISO datetime
  
  // Location
  location?: string;
  
  // Participation
  maxParticipants?: number;
  rsvpRequired: boolean;
  rsvpDeadline?: string;     // ISO datetime
  
  // Visibility
  calendarVisibility: "private" | "public";
  
  // Member Selection
  selectedMemberIds: string[];
  excludedMemberIds: string[];
  
  // Recurrence
  isRecurring: boolean;
  recurringPattern?: string;
  parentEventId?: string;    // For recurring instances
  
  // Attachments
  attachments?: EventAttachment[];
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface EventRegistration {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  status: "confirmed" | "pending" | "declined";
  respondedAt?: string;
  onBehalfOfId?: string;     // If parent responding for child
  onBehalfOfName?: string;
}
```

---

# APPENDIX B: Event Status Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       EVENT LIFECYCLE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Admin Creates Event]                                         │
│            │                                                    │
│            ▼                                                    │
│       ┌─────────┐                                              │
│       │  DRAFT  │ ─── Not visible to members                   │
│       └────┬────┘                                              │
│            │                                                    │
│            │ Admin publishes                                    │
│            ▼                                                    │
│     ┌───────────┐                                              │
│     │ PUBLISHED │ ─── Visible, RSVP open                       │
│     └─────┬─────┘                                              │
│           │                                                     │
│     ┌─────┴─────┐                                              │
│     │           │                                              │
│     ▼           ▼                                              │
│ ┌──────────┐  ┌───────────┐                                    │
│ │CANCELLED │  │ COMPLETED │                                    │
│ │          │  │           │                                    │
│ │Notif sent│  │Auto after │                                    │
│ │Strikeout │  │event ends │                                    │
│ └──────────┘  └───────────┘                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# APPENDIX C: RSVP Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        RSVP FLOW                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [Event Published with RSVP Required]                          │
│            │                                                    │
│            ▼                                                    │
│   ┌────────────────┐                                           │
│   │ NO RESPONSE    │ ◄─── Default state for all invitees       │
│   └───────┬────────┘                                           │
│           │                                                     │
│     ┌─────┼─────┬─────────────┐                                │
│     │     │     │             │                                │
│     ▼     ▼     ▼             │                                │
│  ┌─────┐ ┌─────┐ ┌─────────┐  │                                │
│  │ ✓   │ │ ✗   │ │    ?    │  │                                │
│  │Conf.│ │Decl.│ │  Maybe  │  │                                │
│  └──┬──┘ └──┬──┘ └────┬────┘  │                                │
│     │       │         │       │                                │
│     └───────┴─────────┴───────┘                                │
│             │                                                   │
│             │ Can change until deadline                        │
│             │                                                   │
│     [RSVP Deadline Reached]                                    │
│             │                                                   │
│             ▼                                                   │
│     ┌───────────────┐                                          │
│     │ RSVP LOCKED   │ ─── No changes by member                 │
│     └───────────────┘     Admin can still modify               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# APPENDIX D: Parent-Child Event Logic

## When Team with Child Players is Selected:

1. **Auto-include parents**: When selecting a team that has child players (e.g., U12), parents are automatically added to the event
2. **Visual indicator**: Parents show "🔒 Auto" badge and "👨‍👧 Elternteil von [child name]"
3. **Cannot deselect parent**: While child is selected, parent cannot be manually excluded
4. **Deselecting child**: When child is deselected, parent can then be deselected (unless they have other children in the event)

## Event Visibility:

| Who | What They See |
|-----|---------------|
| Child Player | Event appears in their calendar (via parent's view) |
| Parent | Event appears in child's context, notification to parent |
| Coach | All team members + parents in participant list |

## RSVP Attribution:

- When parent RSVPs in child's context: "Daniel für Noah - Confirmed"
- Coach sees: "Noah Hoffmann (via Daniel Hoffmann) - Confirmed"

---

# APPENDIX E: Scope Comparison

| Aspect | Team Events | Club Events |
|--------|-------------|-------------|
| **Created by** | Coach | Club Admin |
| **Event Types** | Training, Match, Friendly | General |
| **Visibility** | Team Calendar (Team members only) | My Calendar / Club Calendar |
| **Default Audience** | Team players + parents | All members or selected |
| **RSVP** | Usually required | Optional |
| **Pilot Phase** | Core functionality | General events only |

---

# APPENDIX F: Future Considerations

## Department Events (Post-MVP)
- Managed by Department Admins
- Event types: Assembly, Workshop, Parent Meeting, etc.
- Visibility: Department members

## Organization Events (Post-MVP)
- Cross-club events within one organization
- Managed by Organization Admins
- Visibility: Members across multiple clubs

> These are **visibility extensions** of the unified event model, not separate event systems.

---

*Document Version: 2.0*  
*Last Updated: January 2026*  
*Author: Product Team*
