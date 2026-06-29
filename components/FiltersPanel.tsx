"use client";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  // Push the table sideways on wider screens; stack above it on mobile so the
  // (narrow) card list is never squished.
  const isWide = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Collapse
      in={open}
      orientation={isWide ? "horizontal" : "vertical"}
      sx={{ flexShrink: 0 }}
    >
      <Box
        id={id}
        component="section"
        role="region"
        aria-label={title}
        inert={!open}
        sx={{
          width: { xs: "100%", sm: PANEL_WIDTH },
          mr: { sm: 2 },
          mb: { xs: 2, sm: 0 },
          p: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography component="h2" variant="subtitle1" sx={{ fontWeight: 600 }}>
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
        {children}
      </Box>
    </Collapse>
  );
}
