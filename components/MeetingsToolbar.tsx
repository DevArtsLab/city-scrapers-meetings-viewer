"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import type { MeetingRecord } from "@/lib/scrapers";
import MeetingStats from "@/components/MeetingStats";

interface MeetingsToolbarProps {
  records: MeetingRecord[];
  filtersOpen: boolean;
  onToggleFilters: () => void;
  /** id of the panel this button controls, for aria-controls. */
  panelId: string;
}

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  );
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
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 2,
      }}
    >
      <Button
        variant={filtersOpen ? "contained" : "outlined"}
        size="small"
        onClick={onToggleFilters}
        startIcon={<FilterIcon />}
        aria-expanded={filtersOpen}
        aria-controls={panelId}
      >
        Filters
      </Button>
      <MeetingStats records={records} />
    </Box>
  );
}
