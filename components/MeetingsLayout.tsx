"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import { MeetingSelectionProvider } from "@/contexts/MeetingSelectionContext";
import MeetingsTable from "@/components/MeetingsTable";
import MeetingDetailPanel from "@/components/MeetingDetailPanel";
import type { SearchField } from "@/hooks/useMeetingFilters";

export default function MeetingsLayout({
  records,
  totalCount,
  search,
  searchField,
}: {
  records: MeetingRecord[];
  /** Unfiltered record count, for the "Showing X of Y" summary. */
  totalCount: number;
  /** Current search keyword, to highlight matches in the table. */
  search: string;
  /** Field the search keyword is being matched against. */
  searchField: SearchField;
}) {
  return (
    <MeetingSelectionProvider>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <MeetingsTable
          records={records}
          totalCount={totalCount}
          search={search}
          searchField={searchField}
        />
        <MeetingDetailPanel />
      </Box>
    </MeetingSelectionProvider>
  );
}
