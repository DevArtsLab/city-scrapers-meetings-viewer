"use client";

import Button from "@mui/material/Button";

interface FilterButtonProps {
  /** Whether the panel this button controls is currently open. */
  open: boolean;
  onToggle: () => void;
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

/** Toggle button for the filters panel. Rendered in MeetingsToolbar. */
export default function FilterButton({
  open,
  onToggle,
  panelId,
}: FilterButtonProps) {
  return (
    <Button
      variant={open ? "contained" : "outlined"}
      size="small"
      onClick={onToggle}
      startIcon={<FilterIcon />}
      aria-expanded={open}
      aria-controls={panelId}
    >
      Filters
    </Button>
  );
}
