"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const DEFAULT_COLUMN_VISIBILITY: Record<string, boolean> = {
  classification: false,
  all_day: false,
  time_notes: false,
  source: false,
  id: false,
};

interface ColumnVisibilityContextValue {
  columnVisibilityModel: Record<string, boolean>;
  toggleColumn: (field: string) => void;
  applyVisibilityModel: (model: Record<string, boolean>) => void;
  openFilters: () => void;
}

const ColumnVisibilityContext =
  createContext<ColumnVisibilityContextValue | null>(null);

export function ColumnVisibilityProvider({
  children,
  onOpenFilters,
}: {
  children: ReactNode;
  /** Stable callback (wrap in useCallback at the call site). */
  onOpenFilters: () => void;
}) {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<
    Record<string, boolean>
  >(DEFAULT_COLUMN_VISIBILITY);

  const toggleColumn = useCallback((field: string) => {
    setColumnVisibilityModel((prev) => ({
      ...prev,
      [field]: prev[field] === false,
    }));
  }, []);

  const applyVisibilityModel = useCallback(
    (model: Record<string, boolean>) => setColumnVisibilityModel(model),
    []
  );

  const value = useMemo(
    () => ({
      columnVisibilityModel,
      toggleColumn,
      applyVisibilityModel,
      openFilters: onOpenFilters,
    }),
    [columnVisibilityModel, toggleColumn, applyVisibilityModel, onOpenFilters]
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
