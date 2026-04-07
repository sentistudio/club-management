import { ReactNode } from "react";

type BadgeVariant = 
  | "default" 
  | "success" 
  | "warning" 
  | "danger" 
  | "info" 
  | "neutral"
  | "teal";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export function Badge({ 
  children, 
  variant = "default", 
  size = "sm",
  className = "",
  dot = false
}: BadgeProps) {
  const variantClasses = {
    default: "bg-neutral-100 text-neutral-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    neutral: "bg-neutral-100 text-neutral-600",
    teal: "bg-teal-50 text-teal-700"
  };

  const dotColors = {
    default: "bg-neutral-400",
    success: "bg-green-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-neutral-400",
    teal: "bg-teal-500"
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1"
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 font-medium rounded-md
      ${variantClasses[variant]} 
      ${sizeClasses[size]}
      ${className}
    `}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}

// Member Status Badge
export function MemberStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "success", label: "Aktiv" },
    pending: { variant: "warning", label: "Ausstehend" },
    suspended: { variant: "danger", label: "Gesperrt" },
    cancelled: { variant: "neutral", label: "Gekündigt" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant} dot>{label}</Badge>;
}

// Alias for backwards compatibility
export const MembershipStatusBadge = MemberStatusBadge;

// Membership Type Badge
export function MembershipTypeBadge({ type }: { type: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "teal", label: "Aktiv" },
    passive: { variant: "neutral", label: "Passiv" },
    honorary: { variant: "warning", label: "Ehrenmitglied" },
    staff: { variant: "info", label: "Personal" }
  };
  const { variant, label } = config[type] || { variant: "neutral", label: type };
  return <Badge variant={variant}>{label}</Badge>;
}

// Booking Badges
export function BookingStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    open: { variant: "info", label: "Offen" },
    paid: { variant: "success", label: "Bezahlt" },
    overdue: { variant: "danger", label: "Überfällig" },
    cancelled: { variant: "neutral", label: "Storniert" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

export function BookingTypeBadge({ type }: { type: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    contribution: { variant: "teal", label: "Beitrag" },
    donation: { variant: "success", label: "Spende" },
    other_income: { variant: "info", label: "Sonstiges" },
    expense: { variant: "warning", label: "Ausgabe" }
  };
  const { variant, label } = config[type] || { variant: "neutral", label: type };
  return <Badge variant={variant}>{label}</Badge>;
}

// Team Role Badge
export function TeamRoleBadge({ role }: { role: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    player: { variant: "teal", label: "Spieler" },
    coach: { variant: "info", label: "Trainer" },
    assistant: { variant: "neutral", label: "Assistent" },
    manager: { variant: "warning", label: "Manager" },
    captain: { variant: "success", label: "Kapitän" }
  };
  const { variant, label } = config[role] || { variant: "neutral", label: role };
  return <Badge variant={variant}>{label}</Badge>;
}

// Billing badges
export function SubscriptionStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "success", label: "Aktiv" },
    past_due: { variant: "warning", label: "Überfällig" },
    unpaid: { variant: "danger", label: "Unbezahlt" },
    canceled: { variant: "neutral", label: "Gekündigt" },
    paused: { variant: "info", label: "Pausiert" },
    trialing: { variant: "teal", label: "Testphase" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    draft: { variant: "neutral", label: "Entwurf" },
    open: { variant: "info", label: "Offen" },
    paid: { variant: "success", label: "Bezahlt" },
    void: { variant: "neutral", label: "Storniert" },
    uncollectible: { variant: "danger", label: "Uneinbringlich" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    succeeded: { variant: "success", label: "Erfolgreich" },
    pending: { variant: "warning", label: "Ausstehend" },
    failed: { variant: "danger", label: "Fehlgeschlagen" },
    refunded: { variant: "info", label: "Erstattet" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant} dot>{label}</Badge>;
}

export function PriceTypeBadge({ type }: { type: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    one_time: { variant: "info", label: "Einmalig" },
    recurring: { variant: "teal", label: "Wiederkehrend" }
  };
  const { variant, label } = config[type] || { variant: "neutral", label: type };
  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentLinkStatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: "success", label: "Aktiv" },
    inactive: { variant: "neutral", label: "Inaktiv" },
    expired: { variant: "warning", label: "Abgelaufen" }
  };
  const { variant, label } = config[status] || { variant: "neutral", label: status };
  return <Badge variant={variant} dot>{label}</Badge>;
}

// Field status chip — square indicator + label, matches Figma design
type StatusChipColor = "neutral" | "blue" | "amber" | "violet" | "teal" | "red" | "green";

const STATUS_CHIP_COLORS: Record<StatusChipColor, { square: string; text: string }> = {
  neutral: { square: "bg-neutral-200",  text: "text-neutral-500" },
  blue:    { square: "bg-blue-200",     text: "text-blue-700"    },
  amber:   { square: "bg-amber-300",    text: "text-amber-700"   },
  violet:  { square: "bg-violet-200",   text: "text-violet-700"  },
  teal:    { square: "bg-teal-200",     text: "text-teal-700"    },
  red:     { square: "bg-red-200",      text: "text-red-700"     },
  green:   { square: "bg-green-200",    text: "text-green-700"   },
};

export function FieldStatusChip({ label, color = "neutral" }: { label: string; color?: StatusChipColor }) {
  const { square, text } = STATUS_CHIP_COLORS[color];
  return (
    <span className="inline-flex items-center gap-1.5 bg-white rounded-lg px-1.5 py-0.5">
      <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${square}`} />
      <span className={`text-[12px] font-normal whitespace-nowrap leading-4 ${text}`}>{label}</span>
    </span>
  );
}

export function FieldClosedBadge() {
  return <FieldStatusChip label="Geschlossen" color="neutral" />;
}

// Payment Method Type Badge
export function PaymentMethodTypeBadge({ type }: { type: string }) {
  const config: Record<string, { variant: BadgeVariant; label: string }> = {
    card: { variant: "info", label: "Karte" },
    sepa: { variant: "teal", label: "SEPA" },
    bank_transfer: { variant: "neutral", label: "Überweisung" },
    cash: { variant: "warning", label: "Bar" }
  };
  const { variant, label } = config[type] || { variant: "neutral", label: type };
  return <Badge variant={variant}>{label}</Badge>;
}
