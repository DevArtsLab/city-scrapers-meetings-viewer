"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

const PANEL_WIDTH = 300;
const TRANSITION_MS = 280;

interface FiltersPanelProps {
  /** Whether the panel is expanded. Controlled by the parent. */
  open: boolean;
  /** Called when the user closes the panel from inside it. */
  onClose: () => void;
  /** DOM id so a toggle button can reference it via aria-controls. */
  id?: string;
  /** Heading shown at the top of the panel. */
  title?: string;
  /** Ref to the button that toggles this panel, so focus can return to it on close. */
  triggerRef?: React.RefObject<HTMLElement>;
  /** Filter sections. Empty for now; future tickets compose them in. */
  children?: React.ReactNode;
}

export default function FiltersPanel({
  open,
  onClose,
  id,
  title = "Filters",
  triggerRef,
  children,
}: FiltersPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  const handleClose = () => {
    // If focus is currently inside the panel, move it out before hiding —
    // otherwise it can get "stuck" on an invisible, unfocusable element.
    const active = document.activeElement;
    if (
      panelRef.current &&
      active instanceof HTMLElement &&
      panelRef.current.contains(active)
    ) {
      if (triggerRef?.current) {
        triggerRef.current.focus();
      } else {
        active.blur();
      }
    }
    onClose();
  };

  return (
    <Box
      id={id}
      ref={panelRef}
      component="section"
      role="region"
      aria-label={title}
      aria-hidden={!open}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleClose();
      }}
      sx={{
        flexShrink: 0,
        width: { xs: "100%", sm: open ? PANEL_WIDTH : 0 },
        mr: { sm: open ? 2 : 0 },
        mb: { xs: open ? 2 : 0, sm: 0 },
        maxHeight: { xs: open ? 2000 : 0, sm: "none" },
        opacity: open ? 1 : 0,
        transform: open ? "translateX(0)" : "translateX(-6px)",
        pointerEvents: open ? "auto" : "none",
        visibility: open ? "visible" : "hidden",
        transition: (theme) =>
          [
            theme.transitions.create(["width", "margin", "max-height"], {
              duration: TRANSITION_MS,
              easing: theme.transitions.easing.easeInOut,
            }),
            theme.transitions.create(["opacity", "transform"], {
              duration: TRANSITION_MS * 0.7,
              easing: theme.transitions.easing.easeOut,
              delay: open ? TRANSITION_MS * 0.3 : 0,
            }),
          ].join(", "),
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        position: { sm: "sticky" },
        top: { sm: 16 },
        height: { sm: "calc(100vh - 32px)" },
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, flexShrink: 0, width: { sm: PANEL_WIDTH } }}>
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
          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="Close filters"
          >
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

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          pb: 2,
          width: { sm: PANEL_WIDTH },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
