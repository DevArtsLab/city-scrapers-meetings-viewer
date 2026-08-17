"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/components/scrapers/lib/scrapers";
import type { DuplicateInfo } from "@/components/scrapers/lib/duplicates";
import { MeetingSelectionProvider } from "@/components/scrapers/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/scrapers/MeetingsTable";
import MeetingDetailPanel from "@/components/scrapers/MeetingDetailPanel";
import type { SearchField } from "@/components/scrapers/hooks/useMeetingFilters";

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
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
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
