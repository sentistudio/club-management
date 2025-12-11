import { InputHTMLAttributes, ReactNode, forwardRef } from "react";
import { Search } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  hint,
  icon,
  className = "", 
  id,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-400 w-5 h-5">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-3.5 py-2.5 text-sm
            bg-white border rounded-lg
            placeholder:text-neutral-400
            transition-all duration-150
            ${icon ? "pl-10" : ""}
            ${error 
              ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100" 
              : "border-neutral-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            }
            hover:border-neutral-400
            focus:outline-none
            disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-neutral-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

// Search Input variant
interface SearchInputProps extends Omit<InputProps, 'icon'> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ 
  placeholder = "Suchen...",
  onSearch,
  ...props 
}: SearchInputProps) {
  return (
    <Input
      icon={<Search className="w-5 h-5" />}
      placeholder={placeholder}
      onChange={(e) => onSearch?.(e.target.value)}
      {...props}
    />
  );
}
