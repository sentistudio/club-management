# 🏗️ Shape Up: Communication Features

## Cycle Planning Document
**Cycle Duration:** 2 Weeks  
**Start Date:** [Planning Session Date]  
**Team:** Engineering  

---

## 🎯 The Pitch

### Problem Statement

> "Club administrators spend hours managing member communications through fragmented channels (email, WhatsApp, phone calls). Members don't know where to find responses, and important messages get lost. Parents managing children's memberships have no clear way to communicate on behalf of their kids."

**Current Pain Points:**
- ❌ No unified inbox for club administrators
- ❌ Member requests via email = no tracking, no status, lost threads
- ❌ Parents can't clearly communicate for their children
- ❌ Coaches use personal WhatsApp = no club oversight, data scattered
- ❌ No audit trail for compliance

### The Opportunity

Build the **communication backbone** that connects club staff to members through a structured, trackable, auditable system—while enabling real-time team chat for informal coordination.

---

# Communication Features - User Stories & Acceptance Criteria

## Overview

This document outlines the user stories and acceptance criteria for the club management communication system, covering both the **Admin Portal** (Club Management) and the **Member Portal App**. 

The communication system consists of:
- **Inbox (Requests)**: Structured, ticketed communication for official club matters
- **Chat**: Real-time messaging for informal team/coach communication
- **News Feed**: One-way announcements (out of scope for this document)

## 🍽️ Appetite

**We're willing to spend:** 2 weeks (10 working days)

This is a **small batch** focused on shipping a working **Pilot** version. We're betting on getting core inbox functionality live, not building the complete vision.

### What "Done" Looks Like

At the end of this cycle, a club admin can:
1. See all member requests in one inbox
2. Reply to requests with status tracking
3. Send a new message to any member

And a member can:
1. Submit a request through the app
2. See their request history
3. Reply to admin messages

**That's it.** No bulk messaging, no templates, no chat. Those are future bets.

---

## 🖼️ Shaped Solution

### Fat Marker Sketch: Admin Inbox

```
┌─────────────────────────────────────────────────────────────────┐
│  POSTEINGANG                                    [+ Neue Nachricht]
├─────────────────────────────────────────────────────────────────┤
│  Stats:  12 Gesamt │ 🔵 5 Offen │ 🟡 4 In Bearbeitung │ ✅ 3 Erledigt
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────┐   ┌────────────────────────────┐ │
│  │  📋 Request List         │   │  💬 Conversation View      │ │
│  │                          │   │                            │ │
│  │  🔵 Tim Jung             │   │  Tim Jung                  │ │
│  │  Beitragsfrage      14:30│   │  Fußball • Aktiv           │ │
│  │  "Frage zur Rechnung..." │   │  TKT-2026-0042             │ │
│  │                          │   │                            │ │
│  │  🟡 Lisa Schmidt         │   │  ┌──────────────────────┐  │ │
│  │  Abwesenheit        Mo   │   │  │ Member Message       │  │ │
│  │  "Urlaub vom 15.-22..."  │   │  │ "Hallo, ich habe..." │  │ │
│  │                          │   │  └──────────────────────┘  │ │
│  │  ✅ Max Müller           │   │                            │ │
│  │  Dokumente          Sa   │   │  ┌──────────────────────┐  │ │
│  │  "Bescheinigung..."      │   │  │ Admin Reply          │  │ │
│  │                          │   │  │ "Vielen Dank für..." │  │ │
│  └──────────────────────────┘   │  └──────────────────────┘  │ │
│                                 │                            │ │
│                                 │  [Status: v In Bearbeitung]│ │
│                                 │                            │ │
│                                 │  ┌────────────────────────┐│ │
│                                 │  │ Type reply...     [📎]││ │
│                                 │  │                  [Send]││ │
│                                 │  └────────────────────────┘│ │
│                                 └────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Fat Marker Sketch: Member App Messages

```
┌─────────────────────────────────┐
│  ← Mitteilungen                 │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │ 🏢 SfB Burkhardsfelden   • ││
│  │ "Ihre Anfrage wurde..."  11m││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 💰 Beitragsfrage          🔵││
│  │ "Danke für Ihre..."    Ges.││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │ 📄 Bescheinigung            ││
│  │ "Dokument angehängt"    Mo ││
│  └─────────────────────────────┘│
│                                 │
│               [+]               │
│         Neue Anfrage            │
└─────────────────────────────────┘
```

### Breadboard: Request Flow

```
Member App                              Admin Portal
──────────                              ─────────────
                                        
[Messages Screen]                       
      │                                 
      ├── Tap [+] ──────────────────►  
      │                                 
[New Request Form]                      
  • Category (dropdown)                 
  • Subject (text)                      
  • Message (textarea)                  
  • [Attach] [Send]                     
      │                                 
      │ ─── Creates Ticket ───────────► [Inbox: New item appears]
      │                                        │
      │                                        ▼
      │                                 [Click to open]
      │                                        │
      │                                        ▼
      │                                 [Conversation View]
      │                                   • Read message
      │                                   • Type reply
      │                                   • Change status
      │                                   • [Send]
      │                                        │
      │ ◄── Notification + Reply ─────────────┘
      ▼                                 
[Message Detail]                        
  • See reply                           
  • Reply back ──────────────────────► [New message in thread]
```

---

## 🔨 Scopes

Breaking this into **independently shippable** pieces:

### Scope 1: Data Foundation (Days 1-2)
**Hill: 🏔️ Figuring out → Making it happen**

- [ ] Database schema for tickets/messages
- [ ] API endpoints: create, list, get, reply
- [ ] Status transitions logic
- [ ] Ticket number generation

**Deliverable:** Backend API working, testable via Postman

---

### Scope 2: Admin Inbox List (Days 2-4)
**Hill: 🏔️ Figuring out → Making it happen**

- [ ] Inbox page layout (list + detail split)
- [ ] Request list with filters (status, category)
- [ ] Search functionality
- [ ] Stats bar (counts by status)
- [ ] Real data from API

**Deliverable:** Admin can see list of all requests

---

### Scope 3: Admin Conversation View (Days 4-6)
**Hill: 🏔️ Figuring out → Making it happen**

- [ ] Message thread display
- [ ] Reply composer
- [ ] Status dropdown
- [ ] Requester profile link
- [ ] Attachment display (read-only first)

**Deliverable:** Admin can read and reply to requests

---

### Scope 4: Member Request Flow (Days 6-8)
**Hill: 🏔️ Figuring out → Making it happen**

- [ ] Messages list in member app
- [ ] New request form (category, subject, message)
- [ ] Request detail view
- [ ] Reply functionality
- [ ] Status display

**Deliverable:** Member can create and track requests

---

### Scope 5: New Message (Admin → Member) (Days 8-9)
**Hill: 🏔️ Figuring out → Making it happen**

- [ ] "New Message" modal
- [ ] Member search/select
- [ ] Category & subject
- [ ] Send creates new ticket

**Deliverable:** Admin can proactively message any member

---

### Scope 6: Polish & Edge Cases (Days 9-10)
**Hill: 🏔️ Making it happen**

- [ ] Empty states
- [ ] Loading states
- [ ] Error handling
- [ ] Mobile responsiveness
- [ ] Basic notification (in-app)

**Deliverable:** Production-ready pilot

---

## 📊 Hill Chart Preview

```
                    FIGURING IT OUT                    MAKING IT HAPPEN
                          │                                  │
   ●───────────────────────────────────────────────────────────────●
   │                      │                                  │     │
   │   1. Data Foundation │████████████████░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   │   2. Admin List      │██████████░░░░░░░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   │   3. Conversation    │████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   │   4. Member Flow     │██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   │   5. New Message     │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   │   6. Polish          │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│     │
   │                      │                                  │     │
   ●───────────────────────────────────────────────────────────────●
                    "Uphill"                          "Downhill"
```

*(Update this daily in standups)*

---

## 🐰 Rabbit Holes

Things that could derail us—**avoid these:**

| Rabbit Hole | Why It's Tempting | What To Do Instead |
|-------------|-------------------|-------------------|
| **Real-time updates** | "Messages should appear instantly!" | Use polling (30s) or manual refresh. WebSockets are scope 2.0 |
| **Rich text editor** | "Admins want formatting!" | Plain text + line breaks. Markdown later. |
| **File uploads** | "Members need to attach photos!" | Admin can view existing, member attachments = v2 |
| **Push notifications** | "How will members know?" | In-app badge count only. Push = separate scope |
| **Email delivery** | "Members expect email too!" | Log "would send email" for now. Actual SMTP = v2 |
| **Parent/child context** | "Parents need to see child requests!" | Pilot is single-member only. Family = MVP |
| **Bulk messaging** | "But Rundschreiben is key!" | Not in this cycle. It's a separate pitch. |

---

## 🚫 No-Gos (Explicitly Out of Scope)

These are **not** part of this bet:

- ❌ Chat functionality (team chats, coach DMs)
- ❌ Bulk messaging / Rundschreiben
- ❌ Message templates
- ❌ Assignment to staff
- ❌ Private/internal notes
- ❌ Parent-for-child context switching
- ❌ Analytics / statistics
- ❌ Email notifications (SMTP integration)
- ❌ Push notifications
- ❌ File upload from member app

These are all valid features for **future cycles**, but adding them now breaks our 2-week bet.

---

## ✅ Definition of Done

The cycle is **complete** when:

1. **Admin Portal:**
   - [ ] Inbox shows all member requests
   - [ ] Admin can filter by status and category
   - [ ] Admin can search by name/subject
   - [ ] Admin can open request and see full thread
   - [ ] Admin can reply to request
   - [ ] Admin can change request status
   - [ ] Admin can create new message to member

2. **Member App:**
   - [ ] Member sees list of their requests
   - [ ] Member can create new request (category, subject, message)
   - [ ] Member can view request detail with all messages
   - [ ] Member can reply to admin messages
   - [ ] Member sees status of each request

3. **Quality:**
   - [ ] No critical bugs
   - [ ] Works on desktop (admin) and mobile (member app)
   - [ ] Data persists correctly
   - [ ] Basic error handling in place

---

## 🧑‍🤝‍🧑 Team & Responsibilities

| Role | Person | Focus |
|------|--------|-------|
| **Shaper** | [PM Name] | Scope definition, daily check-ins |
| **Backend** | [Dev Name] | API, database, business logic |
| **Frontend Admin** | [Dev Name] | Club management inbox |
| **Frontend App** | [Dev Name] | Member portal messages |

### Daily Rhythm

- **9:00 AM** - Async standup (Slack): Hill chart updates
- **2:00 PM** - Quick sync if anyone is stuck (15 min max)
- **Friday** - Demo what's working

---

## 🎰 The Bet

**We're betting that:**

> In 2 weeks, we can ship a functional request/inbox system that replaces email for basic club-member communication.

**If we're wrong:**
- Circuit breaker at Day 8: If Scopes 1-4 aren't working, we stop and regroup
- Unfinished work doesn't roll over automatically—it becomes a new pitch

**If we're right:**
- Members have a clear channel to the club
- Admins have a tracked inbox instead of email chaos
- We validate the model before building chat, bulk messaging, etc.

---

## 📅 Cycle Timeline

```
Week 1                                    Week 2
─────────────────────────────────────────────────────────────────────
│ Mon │ Tue │ Wed │ Thu │ Fri │         │ Mon │ Tue │ Wed │ Thu │ Fri │
├─────┼─────┼─────┼─────┼─────┤         ├─────┼─────┼─────┼─────┼─────┤
│ S1  │ S1  │ S2  │ S2  │ S3  │         │ S4  │ S4  │ S5  │ S6  │ S6  │
│Data │     │List │     │Conv │         │Membr│     │New  │Polsh│Ship │
│     │     │     │     │     │         │Flow │     │Msg  │     │ 🚀  │
└─────┴─────┴─────┴─────┴─────┘         └─────┴─────┴─────┴─────┴─────┘
                         │                                       │
                    Review Point                           Ship Day
                    (Scope 1-3 done?)                    (Demo + Deploy)
```

---

## 📎 Resources

- **User Stories Doc:** `docs/USER_STORIES_COMMUNICATION.md`
- **Existing Prototype:** [Member Portal Link]
- **Design Reference:** Pilot Inbox, Member App Messages views
- **API Spec:** TBD (created in Scope 1)

---

## 💬 Open Questions for Planning

1. **Database:** New tables or extend existing? (Backend to decide)
2. **API versioning:** v1 endpoints or extend current?
3. **Notifications:** Badge count updates—polling or simulated?
4. **Testing:** Manual QA enough for pilot, or need automated tests?

---

*Let's build something real in 2 weeks.* 🚀

---

**Document Version:** 1.0  
**Prepared for:** Sprint Planning Session  
**Methodology:** Shape Up (adapted for 2-week cycle)

