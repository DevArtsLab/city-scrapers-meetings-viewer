"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import type { DuplicateInfo } from "@/lib/duplicates";
import { MeetingSelectionProvider } from "@/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/MeetingsTable";
import MeetingDetailPanel from "@/components/MeetingDetailPanel";

export default function MeetingsLayout({
  records,
  totalCount,
  duplicateInfoMap,
}: {
  records: MeetingRecord[];
  /** Unfiltered record count, for the "Showing X of Y" summary. */
  totalCount: number;
  /** Per-record duplicate info computed from the full, unfiltered dataset. */
  duplicateInfoMap: Map<MeetingRecord, DuplicateInfo>;
}) {
  return (
    <MeetingSelectionProvider>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <MeetingsTable
          records={records}
          totalCount={totalCount}
          duplicateInfoMap={duplicateInfoMap}
        />
        <MeetingDetailPanel />
      </Box>
    </MeetingSelectionProvider>
  );
}
