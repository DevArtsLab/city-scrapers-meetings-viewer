"use client";

import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/lib/scrapers";
import FilterButton from "@/components/FilterButton";
import MeetingStats from "@/components/MeetingStats";

interface MeetingsToolbarProps {
  records: MeetingRecord[];
  filtersOpen: boolean;
  onToggleFilters: () => void;
  /** id of the panel this button controls, for aria-controls. */
  panelId: string;
}

export default function MeetingsToolbar({
  records,
  filtersOpen,
  onToggleFilters,
  panelId,
}: MeetingsToolbarProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: { sm: "space-between" },
        gap: 2,
        mb: 2,
      }}
    >
      <FilterButton
        open={filtersOpen}
        onToggle={onToggleFilters}
        panelId={panelId}
      />
      <MeetingStats records={records} />
    </Box>
  );
}
