// ========= PRODUCTS & PRICES (like Stripe) =========

export type PriceType = "one_time" | "recurring";
export type BillingInterval = "day" | "week" | "month" | "year";

export interface Product {
  id: string;
  clubId: string;
  name: string;
  description?: string;
  isActive: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Price {
  id: string;
  productId: string;
  type: PriceType;
  amount: number;
  currency: string;
  // For recurring prices
  billingInterval?: BillingInterval;
  intervalCount?: number; // e.g., 1 month, 3 months, 1 year
  // Constraints
  ageMin?: number;
  ageMax?: number;
  isFamilyRate?: boolean;
  departmentId?: string;
  // State
  isActive: boolean;
  createdAt: string;
}

// ========= PAYMENT METHODS =========

export type PaymentMethodType = "card" | "sepa_debit" | "bank_transfer" | "cash";

export interface PaymentMethod {
  id: string;
  clubMembershipId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  // Card details
  cardBrand?: string; // visa, mastercard, etc.
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  // SEPA/LSV details
  sepaIban?: string;
  sepaBic?: string;
  sepaAccountHolder?: string;
  sepaMandateId?: string;
  sepaMandateDate?: string;
  // Bank transfer details
  bankName?: string;
  bankAccountHolder?: string;
  // State
  isActive: boolean;
  createdAt: string;
}

// ========= SUBSCRIPTIONS =========

export type SubscriptionStatus = 
  | "active" 
  | "past_due" 
  | "canceled" 
  | "unpaid" 
  | "trialing"
  | "paused";

export interface Subscription {
  id: string;
  clubMembershipId: string;
  priceId: string;
  paymentMethodId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  createdAt: string;
}

// ========= INVOICES =========

export type InvoiceStatus = 
  | "draft" 
  | "open" 
  | "paid" 
  | "void" 
  | "uncollectible";

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  priceId?: string;
  description: string;
  quantity: number;
  unitAmount: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clubId: string;
  clubMembershipId?: string;
  subscriptionId?: string;
  status: InvoiceStatus;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  dueDate?: string;
  paidAt?: string;
  voidedAt?: string;
  description?: string;
  lineItems: InvoiceLineItem[];
  createdAt: string;
}

// ========= PAYMENTS (Transactions) =========

export type PaymentStatus = 
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface Payment {
  id: string;
  clubId: string;
  invoiceId?: string;
  clubMembershipId?: string;
  paymentMethodId?: string;
  paymentMethodType: PaymentMethodType;
  amount: number;
  currency: string;
  status: PaymentStatus;
  // For card payments
  cardBrand?: string;
  cardLast4?: string;
  // For SEPA/LSV
  sepaReference?: string;
  // For bank transfer
  bankReference?: string;
  // For cash
  receivedBy?: string;
  // Refund info
  refundedAmount?: number;
  refundReason?: string;
  // Timestamps
  createdAt: string;
  succeededAt?: string;
  failedAt?: string;
  failureReason?: string;
}

// ========= PAYMENT LINKS =========

export type PaymentLinkStatus = "active" | "inactive" | "expired";

export interface PaymentLink {
  id: string;
  clubId: string;
  priceId: string;
  url: string;
  status: PaymentLinkStatus;
  // Customization
  title?: string;
  description?: string;
  collectAddress: boolean;
  collectPhone: boolean;
  // Allowed payment methods
  allowedPaymentMethods: PaymentMethodType[];
  // Limits
  maxRedemptions?: number;
  redemptionCount: number;
  expiresAt?: string;
  // State
  createdAt: string;
}
