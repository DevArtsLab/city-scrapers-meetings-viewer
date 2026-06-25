"use client";

import { createContext, useContext, useState } from "react";
import type { MeetingRecord } from "@/lib/scrapers";

interface MeetingSelectionContextValue {
  selectedRecord: MeetingRecord | null;
  setSelectedRecord: (
    update:
      | MeetingRecord
      | null
      | ((prev: MeetingRecord | null) => MeetingRecord | null)
  ) => void;
}

const MeetingSelectionContext =
  createContext<MeetingSelectionContextValue | null>(null);

export function MeetingSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedRecord, setSelectedRecord] = useState<MeetingRecord | null>(
    null
  );
  return (
    <MeetingSelectionContext.Provider
      value={{ selectedRecord, setSelectedRecord }}
    >
      {children}
    </MeetingSelectionContext.Provider>
  );
}

export function useMeetingSelection() {
  const ctx = useContext(MeetingSelectionContext);
  if (!ctx)
    throw new Error(
      "useMeetingSelection must be used inside MeetingSelectionProvider"
    );
  return ctx;
}
