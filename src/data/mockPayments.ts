import type { PaymentMethod, SepaMandate } from "../types/domain";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm1",
    clubMembershipId: "cm1",
    type: "sepa",
    maskedDetails: "DE**************1234",
    isDefault: true
  },
  {
    id: "pm2",
    clubMembershipId: "cm2",
    type: "sepa",
    maskedDetails: "DE**************5678",
    isDefault: true
  },
  {
    id: "pm3",
    clubMembershipId: "cm3",
    type: "sepa",
    maskedDetails: "DE**************9012",
    isDefault: true
  },
  {
    id: "pm4",
    clubMembershipId: "cm5",
    type: "paypal",
    maskedDetails: "l***@example.com",
    isDefault: true
  },
  {
    id: "pm5",
    clubMembershipId: "cm7",
    type: "sepa",
    maskedDetails: "DE**************3456",
    isDefault: true
  },
  {
    id: "pm6",
    clubMembershipId: "cm9",
    type: "credit_card",
    maskedDetails: "****-****-****-7890",
    isDefault: true
  }
];

export const mockSepaMandates: SepaMandate[] = [
  {
    id: "sm1",
    paymentMethodId: "pm1",
    iban: "DE89370400440532013000",
    bic: "COBADEFFXXX",
    mandateReference: "FCM-2024-001",
    signedAt: "2024-01-10",
    validFrom: "2024-01-15"
  },
  {
    id: "sm2",
    paymentMethodId: "pm2",
    iban: "DE89370400440532013001",
    bic: "COBADEFFXXX",
    mandateReference: "FCM-2024-002",
    signedAt: "2024-01-12",
    validFrom: "2024-01-17"
  },
  {
    id: "sm3",
    paymentMethodId: "pm3",
    iban: "DE89370400440532013002",
    bic: "DEUTDEDBFRA",
    mandateReference: "FCM-2024-003",
    signedAt: "2024-01-08",
    validFrom: "2024-01-13"
  },
  {
    id: "sm4",
    paymentMethodId: "pm5",
    iban: "DE89370400440532013003",
    bic: "COBADEFFXXX",
    mandateReference: "FCM-2024-004",
    signedAt: "2024-01-20",
    validFrom: "2024-01-25"
  }
];

