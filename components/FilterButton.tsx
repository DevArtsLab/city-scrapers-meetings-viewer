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
      variant="outlined"
      size="small"
      disableRipple
      onClick={onToggle}
      startIcon={<FilterIcon />}
      aria-expanded={open}
      aria-controls={panelId}
      sx={{
        color: open ? "primary.contrastText" : "primary.main",
        bgcolor: open ? "primary.main" : "transparent",
        borderColor: "primary.main",
        boxShadow: open
          ? "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)"
          : "none",
        transition: (theme) =>
          theme.transitions.create(
            ["background-color", "color", "box-shadow"],
            { duration: 150 }
          ),
        "&:hover": {
          bgcolor: open ? "primary.dark" : "action.hover",
        },
      }}
    >
      Filters
    </Button>
  );
}
