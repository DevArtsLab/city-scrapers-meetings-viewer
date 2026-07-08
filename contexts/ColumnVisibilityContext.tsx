"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ColumnVisibilityContextValue {
  columnVisibilityModel: Record<string, boolean>;
  toggleColumn: (field: string) => void;
}

const ColumnVisibilityContext =
  createContext<ColumnVisibilityContextValue | null>(null);

export function ColumnVisibilityProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<
    Record<string, boolean>
  >({
    classification: false,
    all_day: false,
    time_notes: false,
    source: false,
    id: false,
  });

  const toggleColumn = useCallback((field: string) => {
    setColumnVisibilityModel((prev) => ({
      ...prev,
      [field]: prev[field] === false,
    }));
  }, []);

  const value = useMemo(
    () => ({ columnVisibilityModel, toggleColumn }),
    [columnVisibilityModel, toggleColumn]
  );

  return (
    <ColumnVisibilityContext.Provider value={value}>
      {children}
    </ColumnVisibilityContext.Provider>
  );
}

export function useColumnVisibility(): ColumnVisibilityContextValue {
  const ctx = useContext(ColumnVisibilityContext);
  if (!ctx)
    throw new Error(
      "useColumnVisibility must be used within ColumnVisibilityProvider"
    );
  return ctx;
}
