"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import MeetingsToolbar from "@/components/MeetingsToolbar";
import FiltersPanel from "@/components/FiltersPanel";
import MeetingFilters from "@/components/MeetingFilters";
import MeetingsLayout from "@/components/MeetingsLayout";
import { useMeetingFilters } from "@/hooks/useMeetingFilters";

const FILTERS_PANEL_ID = "meetings-filters-panel";

export default function ScraperWorkspace({
  records,
}: {
  records: MeetingRecord[];
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = useMeetingFilters(records);

  return (
    <Box>
      <MeetingsToolbar
        records={records}
        filtersOpen={filtersOpen}
        onToggleFilters={() => setFiltersOpen((open) => !open)}
        panelId={FILTERS_PANEL_ID}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
        }}
      >
        <FiltersPanel
          id={FILTERS_PANEL_ID}
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        >
          <MeetingFilters filters={filters} open={filtersOpen} />
        </FiltersPanel>

        {/* Only this region is pushed when the panel opens. */}
        <Box sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          <MeetingsLayout
            records={filters.filteredRecords}
            totalCount={records.length}
          />
        </Box>
      </Box>
    </Box>
  );
}
