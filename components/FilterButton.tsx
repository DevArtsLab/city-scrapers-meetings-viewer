"use client";

import type { Ref } from "react";
import Button from "@mui/material/Button";
import FilterList from "@mui/icons-material/FilterList";

interface FilterButtonProps {
  /** Whether the panel this button controls is currently open. */
  open: boolean;
  onToggle: () => void;
  /** id of the panel this button controls, for aria-controls. */
  panelId: string;
  /** Ref to the underlying button element. */
  ref?: Ref<HTMLButtonElement>;
}

/** Toggle button for the filters panel. Rendered in MeetingsToolbar. */
export default function FilterButton({
  open,
  onToggle,
  panelId,
  ref,
}: FilterButtonProps) {
  return (
    <Button
      ref={ref}
      variant="outlined"
      size="small"
      disableRipple
      onClick={onToggle}
      startIcon={<FilterList fontSize="small" />}
      aria-expanded={open}
      aria-controls={panelId}
      sx={{
        color: open ? "primary.contrastText" : "primary.main",
        bgcolor: open ? "primary.main" : "transparent",
        borderColor: "primary.main",
        boxShadow: open ? 4 : "none",
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
