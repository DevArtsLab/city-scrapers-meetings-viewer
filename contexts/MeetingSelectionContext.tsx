"use client";

import { createContext, useContext, useState } from "react";
import type { MeetingRecord } from "@/lib/scrapers";

type SetSelectedMeetingFn = (
  update:
    | MeetingRecord
    | null
    | ((prev: MeetingRecord | null) => MeetingRecord | null)
) => void;

const SelectedMeetingContext = createContext<MeetingRecord | null>(null);
const SetSelectedMeetingContext = createContext<SetSelectedMeetingFn | null>(null);

export function MeetingSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(
    null
  );
  return (
    <SetSelectedMeetingContext.Provider value={setSelectedMeeting}>
      <SelectedMeetingContext.Provider value={selectedMeeting}>
        {children}
      </SelectedMeetingContext.Provider>
    </SetSelectedMeetingContext.Provider>
  );
}

export function useSelectedMeeting() {
  return useContext(SelectedMeetingContext);
}

export function useSetSelectedMeeting() {
  const setSelectedMeeting = useContext(SetSelectedMeetingContext);
  if (!setSelectedMeeting)
    throw new Error(
      "useSetSelectedMeeting must be used inside MeetingSelectionProvider"
    );
  return setSelectedMeeting;
}
