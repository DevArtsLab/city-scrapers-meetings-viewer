"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const PANEL_WIDTH = 300;

interface FiltersPanelProps {
  /** Whether the panel is expanded. Controlled by the parent. */
  open: boolean;
  /** Called when the user closes the panel from inside it. */
  onClose: () => void;
  /** DOM id so a toggle button can reference it via aria-controls. */
  id?: string;
  /** Heading shown at the top of the panel. */
  title?: string;
  /** Filter sections. Empty for now; future tickets compose them in. */
  children?: React.ReactNode;
}

export default function FiltersPanel({
  open,
  onClose,
  id,
  title = "Filters",
  children,
}: FiltersPanelProps) {
  // Rendered conditionally (no transition) so it opens and closes instantly,
  // matching the meeting detail panel.
  if (!open) return null;

  return (
    <Box
      id={id}
      component="section"
      role="region"
      aria-label={title}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      sx={{
        flexShrink: 0,
        // Pushes the table sideways on wider screens; stacks above it on
        // mobile so the (narrow) card list is never squished.
        width: { xs: "100%", sm: PANEL_WIDTH },
        mr: { sm: 2 },
        mb: { xs: 2, sm: 0 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        // Full-height sidebar on desktop (mirrors the detail panel); natural
        // block height on mobile where it stacks above the table.
        position: { sm: "sticky" },
        top: { sm: 16 },
        height: { sm: "calc(100vh - 32px)" },
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, flexShrink: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
          <IconButton size="small" onClick={onClose} aria-label="Close filters">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </IconButton>
        </Box>
        <Divider />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", px: 2, pb: 2 }}>{children}</Box>
    </Box>
  );
}
