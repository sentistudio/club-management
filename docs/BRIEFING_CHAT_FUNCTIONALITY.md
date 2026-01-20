# Team Briefing: Chat Functionality
## Club Management & Member Portal

**Duration:** ~20 minutes  
**Audience:** Engineering Team  
**Date:** January 2026

---

## 1. OVERVIEW (3 min)

### What We're Building
A **two-sided communication system** for sports clubs:

| Portal | Users | Purpose |
|--------|-------|---------|
| **Club Admin Portal** | Club admins, staff | Monitor, moderate, manage chat settings |
| **Member Portal** | Members, parents, coaches | Day-to-day team communication |

### Three Chat Types

```
┌─────────────────────────────────────────────────────────────┐
│  CHAT TYPES                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📢 ANNOUNCEMENT        👥 TEAM GROUP         💬 DIRECT     │
│  ─────────────         ─────────────         ─────────     │
│  One-way broadcast     Team conversations    1:1 messages  │
│  Coach/Admin → Team    All team members      Coach ↔ Member│
│  No replies            Everyone can post     Private       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PERMISSION SYSTEM (5 min)

### Role-Based Access

| Role | Team Group | Direct Messages | Announcements |
|------|------------|-----------------|---------------|
| **Admin** | ❌ Monitor only | ❌ Audit required | ✅ Create |
| **Coach** | ✅ Read/Write | ✅ With players | ✅ Create |
| **Adult Player** | ✅ Read/Write | ✅ With coach | ❌ |
| **Minor** | ⚠️ Restricted | ❌ Never alone | ❌ |
| **Parent** | ✅ For child's team | ✅ With child's coach | ❌ |

### Critical Rule: Minor Protection 🛡️

```
┌────────────────────────────────────────────────────────────┐
│  MINOR PROTECTION RULES                                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ❌ Coach → Minor (1:1)         NEVER allowed alone        │
│  ✅ Coach → Minor + Parent      Parent MUST be included    │
│  👁 All minor messages          Visible to parent          │
│  🔒 Minor cannot delete         Messages are permanent     │
│                                                            │
│  WHY: Safeguarding compliance, legal protection            │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Parent-Child Context Switching

Parents can **switch context** to act on behalf of their children:

```
Lena (Parent)
├── As herself → Sees own team chats (Frauen Ü40, Fitness)
├── As Flurina (15) → Sees Volleyball U16 chats
└── As Max (11) → Sees Fußball U12 chats

Messages sent in child context show:
"Lena für Flurina: She'll be 10 min late"
```

---

## 3. MEMBER PORTAL - CHAT VIEW (4 min)

### UI Structure

```
┌─────────────────────────────────────────────────────────────┐
│  CHATS                                            [Lena ▼] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📢 ANKÜNDIGUNGEN (2)                                       │
│  ├─ 🔔 Frauen Ü40 - Info               "Kein Training..."  │
│  └─ 🔔 Fitness Morgengruppe - Info     "Neuer Kursplan..." │
│                                                             │
│  👥 TEAM-CHATS (2)                                          │
│  ├─ ⚽ Frauen Ü40 Football              "Super Spiel!"     │
│  └─ 🏃 Fitness Morgengruppe             "Bis morgen!"      │
│                                                             │
│  💬 DIREKTNACHRICHTEN (1)                                   │
│  └─ Sandra (Coach)                      "Alles klar!"      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Chat Detail View

```
┌─────────────────────────────────────────────────────────────┐
│  ← Frauen Ü40 Football                              👥 12  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Sandra (Coach)]              10:30                        │
│  Training morgen um 18:00!                                  │
│                                                             │
│              [Du]              11:15                        │
│              Bin dabei! 👍                                  │
│                                                             │
│  [Maria]                       11:20                        │
│  Ich auch!                                                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  [Message input...]                              [Send ➤]  │
└─────────────────────────────────────────────────────────────┘
```

### Sender Labels

When viewing chat history, messages show smart labels:

| Scenario | Label Shown |
|----------|-------------|
| Own message | **Du** |
| Own message for child | **Du für Flurina** |
| Coach message | **Sandra (Coach)** |
| Minor message (parent viewing) | **Max (Kind)** |
| Other adult | **Maria** |

---

## 4. ADMIN PORTAL - CHAT MODERATION (4 min)

### Dashboard Overview

New **split-view layout** for managing many chats:

```
┌─────────────────────────────────────────────────────────────┐
│  🛡️ CHAT MODERATION                        [Export] [Logs] │
├─────────────────────────────────────────────────────────────┤
│  Quick Filters:                                             │
│  [All: 15] [⚠️ 3] [Info: 4] [Teams: 6] [DMs: 5] [🛡️ 4]     │
├─────────────────────────────────────────────────────────────┤
│                                │                            │
│  TABLE VIEW                    │  DETAIL PANEL              │
│  ──────────                    │  ────────────              │
│  ☐ 📢 Club Announcements      │  📢 Club Announcements     │
│  ☐ 👥 Frauen Ü40         12   │                            │
│  ☐ 👥 Fußball U12    🛡️  8   │  Participants: 15          │
│  ☑ 💬 Coach → Max    🛡️  2   │  Messages: 42              │
│  ☐ 💬 Coach → Lena        2   │                            │
│                                │  [Lock] [Mute] [Flag]      │
│                                │                            │
│                                │  MESSAGES:                 │
│                                │  (content here...)         │
│                                │                            │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Priority Indicators** (colored left border)
   - 🔴 Red = Locked
   - 🟡 Amber = Pending audit
   - 🩷 Pink = Youth protection

2. **Bulk Actions**
   - Select multiple → Lock all / Mute all / Export

3. **Sortable Columns**
   - Name, Participants, Messages, Last Activity

4. **Smart Filters**
   - Type (Announcement/Team/DM)
   - Status (Locked/Muted/Needs Attention)
   - Age Group (Youth/Adult)

### Direct Message Audit System 🔐

**DMs are protected by default.** Admins cannot freely read direct messages.

```
┌─────────────────────────────────────────────────────────────┐
│  💬 Coach → Max (Direct)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    🔒 Nachrichteninhalt geschützt                          │
│                                                             │
│    Direktnachrichten sind aus Datenschutzgründen           │
│    nicht direkt einsehbar. Für eine Compliance-Prüfung     │
│    kann ein Audit-Log angefordert werden.                  │
│                                                             │
│              [📋 Audit-Log anfordern]                       │
│              ↓                                              │
│    ┌─────────────────────────────────────┐                 │
│    │ Begründung erforderlich             │                 │
│    │ → Vorstand-Genehmigung (24h)        │                 │
│    │ → 7 Tage Lesezugriff                │                 │
│    │ → Alle Zugriffe protokolliert       │                 │
│    └─────────────────────────────────────┘                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Audit Process:**
1. Admin requests audit with documented reason
2. Board approval required (simulated 24h wait)
3. If approved: 7-day read access
4. All access logged for compliance

---

## 5. MOCK DATA STORY (2 min)

### The Schneider Family + Anna (Special Case)

We use coherent stories for demo/testing:

```
🏠 THE SCHNEIDER FAMILY
────────────────────────────────────────────────────

👩 LENA (p11) - Mother, Adult Player
   ├─ Teams: Frauen Ü40 Football, Fitness Morgengruppe
   ├─ Chats: Her own team chats + DM with coaches
   └─ Can switch to: Flurina, Max

👧 FLURINA (p12) - Daughter, 15 years old (Minor)
   ├─ Teams: Volleyball U16 Mädchen
   ├─ Chats: Team chat only, DM with coach (parent visible)
   └─ Restrictions: No 1:1 DMs, all messages visible to Lena

👦 MAX (p13) - Son, 11 years old (Minor)
   ├─ Teams: Fußball U12
   ├─ Chats: Team chat only, DM with coach (parent visible)
   └─ Restrictions: Same as Flurina
```

```
⚠️ ANNA BERGER - MINOR WITHOUT GUARDIAN
────────────────────────────────────────────────────

👧 ANNA (p14) - 14 years old, NO PARENT LINKED
   ├─ Teams: Volleyball U16 Mädchen (same as Flurina)
   ├─ Chats: Team chat ONLY
   └─ Restrictions:
      ❌ NO direct messages (no guardian to include!)
      ⚠️ Warning banner shown
      📧 Prompted to contact club to link guardian
      🔒 Messages not mirrored to any parent
```

### Profile URL Routing

```
/pilot/member-portal/lena      → Lena's own view
/pilot/member-portal/flurina   → Flurina's view (Lena can switch here)
/pilot/member-portal/max       → Max's view (Lena can switch here)
/pilot/member-portal/anna      → Anna's view (RESTRICTED - no guardian!)
```

---

## 6. TECHNICAL IMPLEMENTATION (3 min)

### Data Structures

```typescript
// Chat Types
type ChatType = "announcement" | "team_group" | "direct";

// Who can see this chat
interface Chat {
  id: string;
  type: ChatType;
  name: string;
  visibleToProfiles: string[];  // ["lena", "flurina", "max"]
  participants: ChatParticipant[];
  settings: {
    repliesEnabled: boolean;
    parentVisibility: boolean;   // Parents see all in youth teams
    messageMonitoring: boolean;
    minorPostingAllowed: boolean;
  };
  // ...
}

// Message with "on behalf of" support
interface ChatMessage {
  senderId: string;
  senderRole: UserRole;
  content: string;
  onBehalfOf?: {
    childId: string;
    childName: string;
  };
  visibleToParent?: boolean;  // For minor messages
}
```

### Key Files

| File | Purpose |
|------|---------|
| `src/data/mockChats.ts` | Mock data + permission matrix |
| `src/routes/pilot/PilotMemberPortal.tsx` | Member chat UI |
| `src/routes/pilot/ChatModeration.tsx` | Admin moderation UI |

### Permission Check Flow

```typescript
// Example: Can user start DM?
function canStartDirectMessage(fromRole: UserRole, toRole: UserRole): boolean {
  if (toRole === "minor" && fromRole === "coach") {
    return false; // Never coach → minor alone
  }
  if (fromRole === "minor") {
    return false; // Minors can't initiate DMs
  }
  return true;
}
```

---

## 7. TESTING SCENARIOS (2 min)

### Happy Path Tests

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Lena views her chats | Sees Frauen Ü40, Fitness only |
| 2 | Lena switches to Flurina | Sees Volleyball U16 only |
| 3 | Lena sends message for Flurina | Shows "Lena für Flurina" |
| 4 | Admin views team chat | Can read all messages |
| 5 | Admin views DM | "Content protected" + audit button |
| 6 | **Anna views her chats** | Sees Volleyball U16 team chat + announcements |
| 7 | **Anna sees warning** | "Kein Erziehungsberechtigter verknüpft" banner |
| 8 | **Anna posts in team chat** | Message shows as "Anna", no parent notified |

### Edge Cases

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Minor tries to DM | Block with explanation |
| 2 | Coach tries to DM minor alone | Block - must include parent |
| 3 | Flurina sees profile switcher | Cannot switch to Max or Lena |
| 4 | Parent leaves child in event | Auto-included if child selected |
| 5 | **Anna (no guardian) views chats** | ⚠️ Warning banner + no DM section |
| 6 | **Anna sees team chat** | ✅ Can see & post in Volleyball U16 |
| 7 | **Coach tries DM to Anna** | ❌ Blocked - no parent to include |
| 8 | **Anna's messages in team chat** | `visibleToParent: false` - no mirror |

---

## 8. NEXT STEPS

### Current Status ✅
- [x] Chat types implemented (announcement, team_group, direct)
- [x] Permission matrix defined
- [x] Member Portal chat view
- [x] Admin moderation dashboard
- [x] Audit log for DMs
- [x] Profile switching with URL routing
- [x] Mock data with coherent story

### Remaining Work 🔜
- [ ] Real-time messaging (WebSocket integration)
- [ ] Push notifications
- [ ] Message persistence (backend API)
- [ ] File attachments
- [ ] Emoji reactions
- [ ] Message search

---

## QUESTIONS?

**Demo URL:** https://sentistudio.github.io/club-management/

- Member Portal: `/pilot/member-portal/lena`
- Chat Moderation: `/chat-moderation`

**Documentation:**
- `docs/USER_STORIES_COMMUNICATION.md`
- `docs/SHAPE_UP_COMMUNICATION_SPRINT.md`

---

*Briefing Version: 1.0*  
*Last Updated: January 2026*
