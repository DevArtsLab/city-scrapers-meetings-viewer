"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import { MeetingSelectionProvider } from "@/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/MeetingsTable";
import MeetingDetailPanel from "@/components/MeetingDetailPanel";

export default function MeetingsLayout({
  records,
}: {
  records: MeetingRecord[];
}) {
  return (
    <MeetingSelectionProvider records={records}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <MeetingsTable />
        <MeetingDetailPanel />
      </Box>
    </MeetingSelectionProvider>
  );
}
