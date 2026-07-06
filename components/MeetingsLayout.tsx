"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import { MeetingSelectionProvider } from "@/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/MeetingsTable";
import MeetingDetailPanel from "@/components/MeetingDetailPanel";

export default function MeetingsLayout({
  records,
  totalCount,
}: {
  records: MeetingRecord[];
  /** Unfiltered record count, for the "Showing X of Y" summary. */
  totalCount: number;
}) {
  return (
    <MeetingSelectionProvider>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <MeetingsTable records={records} totalCount={totalCount} />
        <MeetingDetailPanel />
      </Box>
    </MeetingSelectionProvider>
  );
}
