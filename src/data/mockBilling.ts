import type { 
  Product, 
  Price, 
  PaymentMethod,
  Subscription, 
  Invoice, 
  InvoiceLineItem,
  Payment,
  PaymentLink
} from "../types/billing";

// ========= PRODUCTS =========

export const mockProducts: Product[] = [
  {
    id: "prod_1",
    clubId: "club1",
    name: "Vollmitgliedschaft Erwachsene",
    description: "Reguläre Mitgliedschaft für Erwachsene ab 18 Jahren",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_2",
    clubId: "club1",
    name: "Jugendmitgliedschaft",
    description: "Mitgliedschaft für Jugendliche zwischen 14-17 Jahren",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_3",
    clubId: "club1",
    name: "Kindermitgliedschaft",
    description: "Mitgliedschaft für Kinder bis 13 Jahre",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_4",
    clubId: "club1",
    name: "Familienmitgliedschaft",
    description: "Vergünstigte Mitgliedschaft für Familien mit 2+ Mitgliedern",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_5",
    clubId: "club1",
    name: "Fördermitgliedschaft",
    description: "Passive Mitgliedschaft ohne aktive Teilnahme",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_6",
    clubId: "club1",
    name: "Handball Abteilung",
    description: "Zusatzbeitrag für die Handball-Abteilung",
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: "prod_7",
    clubId: "club1",
    name: "Trainingscamp",
    description: "Einmaliges Trainingscamp in den Ferien",
    isActive: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01"
  },
  {
    id: "prod_8",
    clubId: "club1",
    name: "Vereinsfest Eintritt",
    description: "Eintrittskarte für das jährliche Vereinsfest",
    isActive: true,
    createdAt: "2024-04-01",
    updatedAt: "2024-04-01"
  }
];

// ========= PRICES =========

export const mockPrices: Price[] = [
  // Vollmitgliedschaft Erwachsene
  {
    id: "price_1a",
    productId: "prod_1",
    type: "recurring",
    amount: 180,
    currency: "EUR",
    billingInterval: "year",
    intervalCount: 1,
    ageMin: 18,
    isActive: true,
    createdAt: "2024-01-01"
  },
  {
    id: "price_1b",
    productId: "prod_1",
    type: "recurring",
    amount: 16,
    currency: "EUR",
    billingInterval: "month",
    intervalCount: 1,
    ageMin: 18,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Jugendmitgliedschaft
  {
    id: "price_2a",
    productId: "prod_2",
    type: "recurring",
    amount: 90,
    currency: "EUR",
    billingInterval: "year",
    intervalCount: 1,
    ageMin: 14,
    ageMax: 17,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Kindermitgliedschaft
  {
    id: "price_3a",
    productId: "prod_3",
    type: "recurring",
    amount: 60,
    currency: "EUR",
    billingInterval: "year",
    intervalCount: 1,
    ageMax: 13,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Familienmitgliedschaft
  {
    id: "price_4a",
    productId: "prod_4",
    type: "recurring",
    amount: 300,
    currency: "EUR",
    billingInterval: "year",
    intervalCount: 1,
    isFamilyRate: true,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Fördermitgliedschaft
  {
    id: "price_5a",
    productId: "prod_5",
    type: "recurring",
    amount: 50,
    currency: "EUR",
    billingInterval: "year",
    intervalCount: 1,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Handball Zusatz
  {
    id: "price_6a",
    productId: "prod_6",
    type: "recurring",
    amount: 5,
    currency: "EUR",
    billingInterval: "month",
    intervalCount: 1,
    departmentId: "dept2",
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Trainingscamp (one-time)
  {
    id: "price_7a",
    productId: "prod_7",
    type: "one_time",
    amount: 150,
    currency: "EUR",
    isActive: true,
    createdAt: "2024-03-01"
  },
  {
    id: "price_7b",
    productId: "prod_7",
    type: "one_time",
    amount: 80,
    currency: "EUR",
    ageMax: 13,
    isActive: true,
    createdAt: "2024-03-01"
  },
  // Vereinsfest (one-time)
  {
    id: "price_8a",
    productId: "prod_8",
    type: "one_time",
    amount: 25,
    currency: "EUR",
    isActive: true,
    createdAt: "2024-04-01"
  },
  {
    id: "price_8b",
    productId: "prod_8",
    type: "one_time",
    amount: 10,
    currency: "EUR",
    ageMax: 17,
    isActive: true,
    createdAt: "2024-04-01"
  }
];

// ========= PAYMENT METHODS =========

export const mockPaymentMethods: PaymentMethod[] = [
  // Max Muster - SEPA
  {
    id: "pm_1",
    clubMembershipId: "cm1",
    type: "sepa_debit",
    isDefault: true,
    sepaIban: "DE89370400440532013000",
    sepaBic: "COBADEFFXXX",
    sepaAccountHolder: "Max Muster",
    sepaMandateId: "MNDT-2024-001",
    sepaMandateDate: "2024-01-10",
    isActive: true,
    createdAt: "2024-01-10"
  },
  // Anna Schmidt - Card
  {
    id: "pm_2",
    clubMembershipId: "cm2",
    type: "card",
    isDefault: true,
    cardBrand: "visa",
    cardLast4: "4242",
    cardExpMonth: 12,
    cardExpYear: 2026,
    isActive: true,
    createdAt: "2024-01-15"
  },
  // Thomas Müller - SEPA
  {
    id: "pm_3",
    clubMembershipId: "cm3",
    type: "sepa_debit",
    isDefault: true,
    sepaIban: "DE89370400440532013001",
    sepaBic: "DEUTDEDBFRA",
    sepaAccountHolder: "Thomas Müller",
    sepaMandateId: "MNDT-2024-002",
    sepaMandateDate: "2024-01-05",
    isActive: true,
    createdAt: "2024-01-05"
  },
  // Lisa Bauer - Card
  {
    id: "pm_4",
    clubMembershipId: "cm5",
    type: "card",
    isDefault: true,
    cardBrand: "mastercard",
    cardLast4: "5555",
    cardExpMonth: 8,
    cardExpYear: 2025,
    isActive: true,
    createdAt: "2024-02-01"
  },
  // Peter Klein - Bank Transfer
  {
    id: "pm_5",
    clubMembershipId: "cm6",
    type: "bank_transfer",
    isDefault: true,
    bankName: "Sparkasse Musterstadt",
    bankAccountHolder: "Peter Klein",
    isActive: true,
    createdAt: "2024-01-20"
  },
  // Sandra Hoffmann - SEPA
  {
    id: "pm_6",
    clubMembershipId: "cm7",
    type: "sepa_debit",
    isDefault: true,
    sepaIban: "DE89370400440532013002",
    sepaBic: "COBADEFFXXX",
    sepaAccountHolder: "Sandra Hoffmann",
    sepaMandateId: "MNDT-2024-003",
    sepaMandateDate: "2024-01-08",
    isActive: true,
    createdAt: "2024-01-08"
  },
  // Julia Fischer - Cash
  {
    id: "pm_7",
    clubMembershipId: "cm9",
    type: "cash",
    isDefault: true,
    isActive: true,
    createdAt: "2024-01-01"
  },
  // Emma Wagner (Child) - Parents SEPA
  {
    id: "pm_8",
    clubMembershipId: "cm11",
    type: "sepa_debit",
    isDefault: true,
    sepaIban: "DE89370400440532013003",
    sepaBic: "COBADEFFXXX",
    sepaAccountHolder: "Familie Wagner",
    sepaMandateId: "MNDT-2024-004",
    sepaMandateDate: "2024-01-22",
    isActive: true,
    createdAt: "2024-01-22"
  },
  // Felix Zimmermann (Child) - Cash
  {
    id: "pm_9",
    clubMembershipId: "cm12",
    type: "cash",
    isDefault: true,
    isActive: true,
    createdAt: "2024-03-01"
  }
];

// ========= SUBSCRIPTIONS =========

export const mockSubscriptions: Subscription[] = [
  {
    id: "sub_1",
    clubMembershipId: "cm1",
    priceId: "price_1a",
    paymentMethodId: "pm_1",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-01"
  },
  {
    id: "sub_2",
    clubMembershipId: "cm2",
    priceId: "price_1a",
    paymentMethodId: "pm_2",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-15"
  },
  {
    id: "sub_3",
    clubMembershipId: "cm3",
    priceId: "price_1a",
    paymentMethodId: "pm_3",
    status: "past_due",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-01"
  },
  {
    id: "sub_4",
    clubMembershipId: "cm5",
    priceId: "price_1a",
    paymentMethodId: "pm_4",
    status: "active",
    currentPeriodStart: "2024-02-01",
    currentPeriodEnd: "2025-01-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-02-01"
  },
  {
    id: "sub_5",
    clubMembershipId: "cm6",
    priceId: "price_5a",
    paymentMethodId: "pm_5",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: true,
    createdAt: "2024-01-01"
  },
  {
    id: "sub_6",
    clubMembershipId: "cm7",
    priceId: "price_1a",
    paymentMethodId: "pm_6",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-10"
  },
  {
    id: "sub_7",
    clubMembershipId: "cm7",
    priceId: "price_6a",
    paymentMethodId: "pm_6",
    status: "active",
    currentPeriodStart: "2024-04-01",
    currentPeriodEnd: "2024-04-30",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-10"
  },
  {
    id: "sub_8",
    clubMembershipId: "cm9",
    priceId: "price_1a",
    paymentMethodId: "pm_7",
    status: "unpaid",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-01"
  },
  {
    id: "sub_9",
    clubMembershipId: "cm11",
    priceId: "price_3a",
    paymentMethodId: "pm_8",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-25"
  },
  {
    id: "sub_10",
    clubMembershipId: "cm12",
    priceId: "price_3a",
    paymentMethodId: "pm_9",
    status: "active",
    currentPeriodStart: "2024-03-01",
    currentPeriodEnd: "2025-02-28",
    cancelAtPeriodEnd: false,
    createdAt: "2024-03-01"
  },
  {
    id: "sub_11",
    clubMembershipId: "cm15",
    priceId: "price_2a",
    status: "active",
    currentPeriodStart: "2024-01-01",
    currentPeriodEnd: "2024-12-31",
    cancelAtPeriodEnd: false,
    createdAt: "2024-01-01"
  }
];

// ========= INVOICES =========

export const mockInvoiceLineItems: InvoiceLineItem[] = [
  { id: "li_1", invoiceId: "inv_1", priceId: "price_1a", description: "Vollmitgliedschaft Erwachsene (Jährlich)", quantity: 1, unitAmount: 180, amount: 180 },
  { id: "li_2", invoiceId: "inv_2", priceId: "price_1a", description: "Vollmitgliedschaft Erwachsene (Jährlich)", quantity: 1, unitAmount: 180, amount: 180 },
  { id: "li_3", invoiceId: "inv_3", priceId: "price_1a", description: "Vollmitgliedschaft Erwachsene (Jährlich)", quantity: 1, unitAmount: 180, amount: 180 },
  { id: "li_4", invoiceId: "inv_4", priceId: "price_5a", description: "Fördermitgliedschaft (Jährlich)", quantity: 1, unitAmount: 50, amount: 50 },
  { id: "li_5", invoiceId: "inv_5", priceId: "price_1a", description: "Vollmitgliedschaft Erwachsene (Jährlich)", quantity: 1, unitAmount: 180, amount: 180 },
  { id: "li_6", invoiceId: "inv_5", priceId: "price_6a", description: "Handball Abteilung (12 Monate)", quantity: 12, unitAmount: 5, amount: 60 },
  { id: "li_7", invoiceId: "inv_6", priceId: "price_3a", description: "Kindermitgliedschaft (Jährlich)", quantity: 1, unitAmount: 60, amount: 60 },
  { id: "li_8", invoiceId: "inv_7", priceId: "price_7a", description: "Trainingscamp Erwachsene", quantity: 1, unitAmount: 150, amount: 150 },
  { id: "li_9", invoiceId: "inv_8", priceId: "price_7b", description: "Trainingscamp Kinder", quantity: 2, unitAmount: 80, amount: 160 },
  { id: "li_10", invoiceId: "inv_9", priceId: "price_8a", description: "Vereinsfest Eintritt Erwachsene", quantity: 2, unitAmount: 25, amount: 50 },
  { id: "li_11", invoiceId: "inv_9", priceId: "price_8b", description: "Vereinsfest Eintritt Kinder", quantity: 3, unitAmount: 10, amount: 30 },
  { id: "li_12", invoiceId: "inv_10", priceId: "price_3a", description: "Kindermitgliedschaft (Jährlich)", quantity: 1, unitAmount: 60, amount: 60 }
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv_1",
    invoiceNumber: "INV-2024-001",
    clubId: "club1",
    clubMembershipId: "cm1",
    subscriptionId: "sub_1",
    status: "paid",
    currency: "EUR",
    subtotal: 180,
    tax: 0,
    total: 180,
    amountPaid: 180,
    amountDue: 0,
    dueDate: "2024-01-31",
    paidAt: "2024-01-15",
    description: "Jahresbeitrag 2024",
    lineItems: [mockInvoiceLineItems[0]],
    createdAt: "2024-01-01"
  },
  {
    id: "inv_2",
    invoiceNumber: "INV-2024-002",
    clubId: "club1",
    clubMembershipId: "cm2",
    subscriptionId: "sub_2",
    status: "paid",
    currency: "EUR",
    subtotal: 180,
    tax: 0,
    total: 180,
    amountPaid: 180,
    amountDue: 0,
    dueDate: "2024-02-15",
    paidAt: "2024-01-20",
    description: "Jahresbeitrag 2024",
    lineItems: [mockInvoiceLineItems[1]],
    createdAt: "2024-01-15"
  },
  {
    id: "inv_3",
    invoiceNumber: "INV-2024-003",
    clubId: "club1",
    clubMembershipId: "cm3",
    subscriptionId: "sub_3",
    status: "open",
    currency: "EUR",
    subtotal: 180,
    tax: 0,
    total: 180,
    amountPaid: 0,
    amountDue: 180,
    dueDate: "2024-02-28",
    description: "Jahresbeitrag 2024",
    lineItems: [mockInvoiceLineItems[2]],
    createdAt: "2024-01-01"
  },
  {
    id: "inv_4",
    invoiceNumber: "INV-2024-004",
    clubId: "club1",
    clubMembershipId: "cm6",
    subscriptionId: "sub_5",
    status: "paid",
    currency: "EUR",
    subtotal: 50,
    tax: 0,
    total: 50,
    amountPaid: 50,
    amountDue: 0,
    dueDate: "2024-02-28",
    paidAt: "2024-02-10",
    description: "Förderbeitrag 2024",
    lineItems: [mockInvoiceLineItems[3]],
    createdAt: "2024-02-01"
  },
  {
    id: "inv_5",
    invoiceNumber: "INV-2024-005",
    clubId: "club1",
    clubMembershipId: "cm7",
    subscriptionId: "sub_6",
    status: "paid",
    currency: "EUR",
    subtotal: 240,
    tax: 0,
    total: 240,
    amountPaid: 240,
    amountDue: 0,
    dueDate: "2024-01-31",
    paidAt: "2024-01-12",
    description: "Jahresbeitrag + Handball 2024",
    lineItems: [mockInvoiceLineItems[4], mockInvoiceLineItems[5]],
    createdAt: "2024-01-01"
  },
  {
    id: "inv_6",
    invoiceNumber: "INV-2024-006",
    clubId: "club1",
    clubMembershipId: "cm11",
    subscriptionId: "sub_9",
    status: "paid",
    currency: "EUR",
    subtotal: 60,
    tax: 0,
    total: 60,
    amountPaid: 60,
    amountDue: 0,
    dueDate: "2024-01-31",
    paidAt: "2024-01-25",
    description: "Kinderbeitrag 2024",
    lineItems: [mockInvoiceLineItems[6]],
    createdAt: "2024-01-01"
  },
  {
    id: "inv_7",
    invoiceNumber: "INV-2024-007",
    clubId: "club1",
    clubMembershipId: "cm1",
    status: "paid",
    currency: "EUR",
    subtotal: 150,
    tax: 0,
    total: 150,
    amountPaid: 150,
    amountDue: 0,
    paidAt: "2024-03-20",
    description: "Trainingscamp Osterferien",
    lineItems: [mockInvoiceLineItems[7]],
    createdAt: "2024-03-15"
  },
  {
    id: "inv_8",
    invoiceNumber: "INV-2024-008",
    clubId: "club1",
    clubMembershipId: "cm2",
    status: "open",
    currency: "EUR",
    subtotal: 160,
    tax: 0,
    total: 160,
    amountPaid: 0,
    amountDue: 160,
    dueDate: "2024-04-30",
    description: "Trainingscamp Kinder",
    lineItems: [mockInvoiceLineItems[8]],
    createdAt: "2024-03-25"
  },
  {
    id: "inv_9",
    invoiceNumber: "INV-2024-009",
    clubId: "club1",
    status: "draft",
    currency: "EUR",
    subtotal: 80,
    tax: 0,
    total: 80,
    amountPaid: 0,
    amountDue: 80,
    description: "Vereinsfest Familie Schmidt",
    lineItems: [mockInvoiceLineItems[9], mockInvoiceLineItems[10]],
    createdAt: "2024-04-20"
  },
  {
    id: "inv_10",
    invoiceNumber: "INV-2024-010",
    clubId: "club1",
    clubMembershipId: "cm12",
    subscriptionId: "sub_10",
    status: "paid",
    currency: "EUR",
    subtotal: 60,
    tax: 0,
    total: 60,
    amountPaid: 60,
    amountDue: 0,
    dueDate: "2024-03-31",
    paidAt: "2024-03-05",
    description: "Kinderbeitrag 2024",
    lineItems: [mockInvoiceLineItems[11]],
    createdAt: "2024-03-01"
  }
];

// ========= PAYMENTS (Transactions) =========

export const mockPayments: Payment[] = [
  // Max Muster - SEPA payment for subscription
  {
    id: "pay_1",
    clubId: "club1",
    invoiceId: "inv_1",
    clubMembershipId: "cm1",
    paymentMethodId: "pm_1",
    paymentMethodType: "sepa_debit",
    amount: 180,
    currency: "EUR",
    status: "succeeded",
    sepaReference: "SEPA-2024-001",
    createdAt: "2024-01-15",
    succeededAt: "2024-01-15"
  },
  // Anna Schmidt - Card payment
  {
    id: "pay_2",
    clubId: "club1",
    invoiceId: "inv_2",
    clubMembershipId: "cm2",
    paymentMethodId: "pm_2",
    paymentMethodType: "card",
    amount: 180,
    currency: "EUR",
    status: "succeeded",
    cardBrand: "visa",
    cardLast4: "4242",
    createdAt: "2024-01-20",
    succeededAt: "2024-01-20"
  },
  // Thomas Müller - SEPA failed
  {
    id: "pay_3",
    clubId: "club1",
    invoiceId: "inv_3",
    clubMembershipId: "cm3",
    paymentMethodId: "pm_3",
    paymentMethodType: "sepa_debit",
    amount: 180,
    currency: "EUR",
    status: "failed",
    sepaReference: "SEPA-2024-002",
    createdAt: "2024-02-01",
    failedAt: "2024-02-03",
    failureReason: "Insufficient funds"
  },
  // Peter Klein - Bank transfer
  {
    id: "pay_4",
    clubId: "club1",
    invoiceId: "inv_4",
    clubMembershipId: "cm6",
    paymentMethodId: "pm_5",
    paymentMethodType: "bank_transfer",
    amount: 50,
    currency: "EUR",
    status: "succeeded",
    bankReference: "BT-2024-001",
    createdAt: "2024-02-10",
    succeededAt: "2024-02-10"
  },
  // Sandra Hoffmann - SEPA
  {
    id: "pay_5",
    clubId: "club1",
    invoiceId: "inv_5",
    clubMembershipId: "cm7",
    paymentMethodId: "pm_6",
    paymentMethodType: "sepa_debit",
    amount: 240,
    currency: "EUR",
    status: "succeeded",
    sepaReference: "SEPA-2024-003",
    createdAt: "2024-01-12",
    succeededAt: "2024-01-12"
  },
  // Emma Wagner - SEPA (parents)
  {
    id: "pay_6",
    clubId: "club1",
    invoiceId: "inv_6",
    clubMembershipId: "cm11",
    paymentMethodId: "pm_8",
    paymentMethodType: "sepa_debit",
    amount: 60,
    currency: "EUR",
    status: "succeeded",
    sepaReference: "SEPA-2024-004",
    createdAt: "2024-01-25",
    succeededAt: "2024-01-25"
  },
  // Max Muster - Training camp (one-off)
  {
    id: "pay_7",
    clubId: "club1",
    invoiceId: "inv_7",
    clubMembershipId: "cm1",
    paymentMethodId: "pm_1",
    paymentMethodType: "sepa_debit",
    amount: 150,
    currency: "EUR",
    status: "succeeded",
    sepaReference: "SEPA-2024-005",
    createdAt: "2024-03-20",
    succeededAt: "2024-03-20"
  },
  // Felix Zimmermann - Cash payment
  {
    id: "pay_8",
    clubId: "club1",
    invoiceId: "inv_10",
    clubMembershipId: "cm12",
    paymentMethodId: "pm_9",
    paymentMethodType: "cash",
    amount: 60,
    currency: "EUR",
    status: "succeeded",
    receivedBy: "Thomas Müller",
    createdAt: "2024-03-05",
    succeededAt: "2024-03-05"
  },
  // Pending card payment
  {
    id: "pay_9",
    clubId: "club1",
    invoiceId: "inv_8",
    clubMembershipId: "cm2",
    paymentMethodId: "pm_2",
    paymentMethodType: "card",
    amount: 160,
    currency: "EUR",
    status: "pending",
    cardBrand: "visa",
    cardLast4: "4242",
    createdAt: "2024-04-25"
  },
  // Refunded payment example
  {
    id: "pay_10",
    clubId: "club1",
    clubMembershipId: "cm5",
    paymentMethodId: "pm_4",
    paymentMethodType: "card",
    amount: 25,
    currency: "EUR",
    status: "refunded",
    cardBrand: "mastercard",
    cardLast4: "5555",
    refundedAmount: 25,
    refundReason: "Event cancelled",
    createdAt: "2024-04-01",
    succeededAt: "2024-04-01"
  }
];

// ========= PAYMENT LINKS =========

export const mockPaymentLinks: PaymentLink[] = [
  {
    id: "plink_1",
    clubId: "club1",
    priceId: "price_1a",
    url: "https://pay.fcmusterstadt.de/vollmitglied",
    status: "active",
    title: "Vollmitgliedschaft Erwachsene",
    description: "Werden Sie Vollmitglied im FC Musterstadt! Jährlicher Beitrag: 180€",
    collectAddress: true,
    collectPhone: true,
    allowedPaymentMethods: ["card", "sepa_debit"],
    redemptionCount: 5,
    createdAt: "2024-01-01"
  },
  {
    id: "plink_2",
    clubId: "club1",
    priceId: "price_3a",
    url: "https://pay.fcmusterstadt.de/kinder",
    status: "active",
    title: "Kindermitgliedschaft",
    description: "Mitgliedschaft für Kinder bis 13 Jahre. Jährlicher Beitrag: 60€",
    collectAddress: true,
    collectPhone: true,
    allowedPaymentMethods: ["card", "sepa_debit", "bank_transfer"],
    redemptionCount: 12,
    createdAt: "2024-01-01"
  },
  {
    id: "plink_3",
    clubId: "club1",
    priceId: "price_7a",
    url: "https://pay.fcmusterstadt.de/camp2024",
    status: "active",
    title: "Trainingscamp Sommer 2024",
    description: "Anmeldung zum Trainingscamp in den Sommerferien",
    collectAddress: false,
    collectPhone: true,
    allowedPaymentMethods: ["card", "sepa_debit"],
    maxRedemptions: 30,
    redemptionCount: 18,
    expiresAt: "2024-07-01",
    createdAt: "2024-03-01"
  },
  {
    id: "plink_4",
    clubId: "club1",
    priceId: "price_8a",
    url: "https://pay.fcmusterstadt.de/fest2024",
    status: "active",
    title: "Vereinsfest 2024",
    description: "Eintrittskarte für das Vereinsfest am 15. Juni",
    collectAddress: false,
    collectPhone: false,
    allowedPaymentMethods: ["card"],
    maxRedemptions: 200,
    redemptionCount: 45,
    expiresAt: "2024-06-15",
    createdAt: "2024-04-01"
  },
  {
    id: "plink_5",
    clubId: "club1",
    priceId: "price_5a",
    url: "https://pay.fcmusterstadt.de/foerder",
    status: "active",
    title: "Fördermitgliedschaft",
    description: "Unterstützen Sie den Verein als Fördermitglied",
    collectAddress: true,
    collectPhone: false,
    allowedPaymentMethods: ["card", "sepa_debit", "bank_transfer"],
    redemptionCount: 3,
    createdAt: "2024-02-01"
  }
];
