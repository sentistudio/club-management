import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

interface TableHeaderProps {
  children: ReactNode;
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <thead className="bg-neutral-50 border-y border-neutral-200">
      {children}
    </thead>
  );
}

interface TableBodyProps {
  children: ReactNode;
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-neutral-100">{children}</tbody>;
}

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className = "" }: TableRowProps) {
  return (
    <tr 
      className={`
        transition-colors duration-100
        ${onClick 
          ? "cursor-pointer hover:bg-neutral-50 active:bg-neutral-100" 
          : "hover:bg-neutral-50/50"
        }
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function TableHead({ children, align = "left", className = "" }: TableHeadProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <th className={`
      px-4 py-3 
      text-xs font-semibold text-neutral-500 uppercase tracking-wider
      ${alignClasses[align]}
      ${className}
    `}>
      {children}
    </th>
  );
}

interface TableCellProps {
  children?: ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export function TableCell({ children, align = "left", className = "" }: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <td className={`
      px-4 py-3.5
      text-neutral-700
      ${alignClasses[align]}
      ${className}
    `}>
      {children}
    </td>
  );
}

interface TableEmptyProps {
  message?: string;
  colSpan?: number;
  icon?: ReactNode;
}

export function TableEmpty({ 
  message = "Keine Daten vorhanden", 
  colSpan = 1,
  icon 
}: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          {icon && <div className="text-neutral-300">{icon}</div>}
          <p className="text-neutral-500">{message}</p>
        </div>
      </td>
    </tr>
  );
}
