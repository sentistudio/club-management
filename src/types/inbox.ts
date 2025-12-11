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
  | "suggestion";

export type MemberRole = "active" | "passive" | "admin" | "trainer" | "volunteer";

export interface Ticket {
  id: string;
  clubId: string;
  // Requester (member)
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

