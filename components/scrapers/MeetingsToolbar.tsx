"use client";

import type { Ref } from "react";
import Box from "@mui/material/Box";
import type { MeetingRecord } from "@/components/scrapers/lib/scrapers";
import FilterButton from "@/components/scrapers/FilterButton";
import MeetingStats from "@/components/scrapers/MeetingStats";

interface MeetingsToolbarProps {
  records: MeetingRecord[];
  filtersOpen: boolean;
  onToggleFilters: () => void;
  /** id of the panel this button controls, for aria-controls. */
  panelId: string;
  /** Ref forwarded to the filter toggle button. */
  ref?: Ref<HTMLButtonElement>;
}

export default function MeetingsToolbar({
  records,
  filtersOpen,
  onToggleFilters,
  panelId,
  ref,
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
        ref={ref}
        open={filtersOpen}
        onToggle={onToggleFilters}
        panelId={panelId}
      />
      <MeetingStats records={records} />
    </Box>
  );
}
