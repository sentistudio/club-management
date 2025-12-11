import { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

interface TabsProps {
  children: ReactNode;
  defaultTab: string;
}

export function Tabs({ children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className = "" }: TabListProps) {
  return (
    <div className={`flex gap-1 border-b border-neutral-200 ${className}`}>
      {children}
    </div>
  );
}

interface TabProps {
  children: ReactNode;
  value: string;
  icon?: ReactNode;
}

export function Tab({ children, value, icon }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        relative flex items-center gap-2 px-4 py-3
        text-sm font-medium transition-colors duration-150
        ${isActive 
          ? "text-teal-600" 
          : "text-neutral-500 hover:text-neutral-700"
        }
      `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
      )}
    </button>
  );
}

interface TabPanelProps {
  children: ReactNode;
  value: string;
}

export function TabPanel({ children, value }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabPanel must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <div className="pt-5 animate-fade-in">{children}</div>;
}
