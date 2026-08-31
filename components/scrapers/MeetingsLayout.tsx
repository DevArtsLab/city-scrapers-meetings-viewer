"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import type { DuplicateInfo } from "@/lib/duplicates";
import { MeetingSelectionProvider } from "@/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/scrapers/MeetingsTable";
import MeetingDetailPanel from "@/components/scrapers/MeetingDetailPanel";
import type { SearchField } from "@/hooks/useMeetingFilters";
import { SECTION_GAP } from "@/lib/layout";

export default function MeetingsLayout({
  records,
  totalCount,
  search,
  searchField,
  duplicateInfoMap,
}: {
  records: MeetingRecord[];
  /** Unfiltered record count, for the "Showing X of Y" summary. */
  totalCount: number;
  /** Current search keyword, to highlight matches in the table. */
  search: string;
  /** Field the search keyword is being matched against. */
  searchField: SearchField;
  /** Per-record duplicate info computed from the full, unfiltered dataset. */
  duplicateInfoMap: Map<MeetingRecord, DuplicateInfo>;
}) {
  return (
    <MeetingSelectionProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: SECTION_GAP,
          alignItems: "flex-start",
        }}
      >
        <MeetingsTable
          records={records}
          totalCount={totalCount}
          search={search}
          searchField={searchField}
          duplicateInfoMap={duplicateInfoMap}
        />
        <MeetingDetailPanel />
      </Box>
    </MeetingSelectionProvider>
  );
}
