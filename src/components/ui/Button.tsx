import { ReactNode, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-teal-400 text-white hover:bg-teal-500 active:bg-teal-600 shadow-sm hover:shadow-md",
    secondary: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 active:bg-neutral-300",
    outline: "border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-neutral-400 active:bg-neutral-100",
    ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
  };
  
  const sizeClasses = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
      ) : (
        icon && iconPosition === "left" && (
          <span className={iconSizeClasses[size]}>{icon}</span>
        )
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <span className={iconSizeClasses[size]}>{icon}</span>
      )}
    </button>
  );
}
