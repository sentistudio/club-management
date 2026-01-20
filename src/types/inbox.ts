// ========= INBOX / TICKETED COMMUNICATION =========

export type TicketStatus = "open" | "pending" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";
export type TicketCategory = 
  | "fee_question" 
  | "membership" 
  | "documents" 
  | "registration" 
  | "technical" 
  | "general"
  | "complaint"
  | "suggestion"
  | "absence"
  | "equipment"
  | "organization"
  | "report";  // Chat message reports

export type MemberRole = "active" | "passive" | "admin" | "trainer" | "volunteer";

export interface Ticket {
  id: string;
  clubId: string;
  // Requester (member) - for incoming tickets
  requesterId: string; // personId
  requesterMembershipId?: string; // clubMembershipId
  requesterEmail: string;
  requesterName: string;
  requesterDepartment?: string; // Department name
  requesterRole?: MemberRole; // Member role
  // Assignment
  assignedToId?: string; // personId of staff
  assignedToName?: string;
  // Content
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  departmentId?: string; // Which department this ticket is for
  // Tracking
  ticketNumber: string; // e.g., "TKT-2024-0001"
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  // First message preview
  previewText: string;
  // Metadata
  unreadCount: number;
  messageCount: number;
  tags?: string[];
  // Related entities
  relatedInvoiceId?: string;
  relatedSubscriptionId?: string;
  // Bulk message (Rundschreiben)
  isBulkMessage?: boolean;
  bulkRecipientCount?: number;
  bulkFilter?: string; // e.g., "Alle Mitglieder", "Abteilung: Fußball"
  bulkSentBy?: string; // Staff who sent the bulk message
  // On behalf (parent messaging for child)
  isOnBehalf?: boolean;
  onBehalfOfName?: string;
  onBehalfOfId?: string;
  // Report-specific fields (for category: "report")
  isReport?: boolean;
  reportedChatId?: string;
  reportedChatName?: string;
  reportedMessageId?: string;
  reportCategory?: "inappropriate_content" | "harassment" | "bullying" | "spam" | "safety_concern" | "other";
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  // Sender
  senderId: string; // personId
  senderName: string;
  senderType: "member" | "staff" | "system";
  senderAvatar?: string;
  // Content
  content: string;
  // Attachments
  attachments?: TicketAttachment[];
  // Metadata
  createdAt: string;
  isRead: boolean;
  isInternal: boolean; // Internal notes not visible to member
}

export interface TicketAttachment {
  id: string;
  name: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

export interface TicketForm {
  id: string;
  clubId: string;
  name: string;
  description?: string;
  category: TicketCategory;
  fields: TicketFormField[];
  isActive: boolean;
  icon?: string;  // Optional emoji icon for the form
}

export interface TicketFormField {
  id: string;
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "file" | "date" | "email" | "phone";
  required: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
}

// For the member portal
export interface MemberInboxSummary {
  totalTickets: number;
  openTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  unreadMessages: number;
}

