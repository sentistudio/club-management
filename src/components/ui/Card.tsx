import { ReactNode } from "react";

export interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  padding = "md", 
  onClick,
  hover = false 
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-5",
    lg: "p-6"
  };

  const baseClasses = "bg-white rounded-xl border border-neutral-200 shadow-card";
  const hoverClasses = hover || onClick ? "hover:shadow-card-hover hover:border-neutral-300 transition-all duration-200 cursor-pointer" : "";
  const clickClasses = onClick ? "cursor-pointer" : "";

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClasses} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
