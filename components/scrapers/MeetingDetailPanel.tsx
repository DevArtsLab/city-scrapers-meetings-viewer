"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Close from "@mui/icons-material/Close";
import { locationText, normalizeStatus } from "@/lib/meetings";
import type { MeetingRecord } from "@/lib/scrapers";
import { StatusChip } from "@/components/ui/StatusChip";
import {
  useSelectedMeeting,
  useSetSelectedMeeting,
} from "@/contexts/MeetingSelectionContext";
import { linkifyText } from "@/components/ui/Linkify";

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          fontWeight: 700,
          letterSpacing: 0.8,
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function PanelContent({
  record,
  onClose,
}: {
  record: MeetingRecord;
  onClose: () => void;
}) {
  return (
    <>
      <Box sx={{ p: 2.5, pb: 0, flexShrink: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1, pr: 1 }}>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                fontWeight: 700,
                letterSpacing: 0.8,
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 0.5,
              }}
            >
              Meeting
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {record.title}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={onClose}
            aria-label="Close panel"
            sx={{ flexShrink: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Divider />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, pt: 2.5 }}>
        <Section label="Status">
          <StatusChip status={normalizeStatus(record.status)} />
        </Section>

        <Section label="Classification">
          <Typography variant="body2">
            {record.classification || "—"}
          </Typography>
        </Section>

        <Section label="Start">
          <Typography variant="body2">{record.start || "—"}</Typography>
        </Section>

        <Section label="End">
          <Typography variant="body2">{record.end || "—"}</Typography>
        </Section>

        <Section label="All Day">
          <Typography variant="body2">
            {record.all_day ? "Yes" : "No"}
          </Typography>
        </Section>

        <Section label="Time Notes">
          <Typography variant="body2">{record.time_notes || "—"}</Typography>
        </Section>

        <Section label="Location">
          <Typography variant="body2">{locationText(record) || "—"}</Typography>
        </Section>

        <Section label="Description">
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {record.description ? linkifyText(record.description) : "—"}
          </Typography>
        </Section>

        <Section label="Links">
          {record.links?.length ? (
            record.links.map((link, i) => (
              <Box key={i} sx={{ mb: 1.5 }}>
                <Box
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "primary.main" }}
                >
                  {link.title || "No title"}
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "text.secondary",
                    wordBreak: "break-all",
                    mt: 0.25,
                  }}
                >
                  {link.href}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography variant="body2">—</Typography>
          )}
        </Section>

        <Section label="Source">
          {record.source ? (
            <Box>
              <Box
                component="a"
                href={record.source}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "primary.main" }}
              >
                Source
              </Box>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  color: "text.secondary",
                  wordBreak: "break-all",
                  mt: 0.25,
                }}
              >
                {record.source}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2">—</Typography>
          )}
        </Section>

        <Section label="ID">
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {record.id}
          </Typography>
        </Section>
      </Box>
    </>
  );
}

export default function MeetingDetailPanel() {
  const selectedMeeting = useSelectedMeeting();
  const setSelectedMeeting = useSetSelectedMeeting();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const handleClose = () => setSelectedMeeting(null);

  return (
    <>
      {/* Desktop: sticky sidebar panel (md and up) */}
      {isDesktop && selectedMeeting && (
        <Box
          sx={{
            position: "sticky",
            top: 16,
            width: 340,
            flexShrink: 0,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PanelContent record={selectedMeeting} onClose={handleClose} />
        </Box>
      )}

      {/* Tablet/mobile: slide-in drawer (below md) */}
      <Drawer
        open={!!selectedMeeting && !isDesktop}
        onClose={handleClose}
        anchor="right"
        ModalProps={{ disableScrollLock: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 340 },
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {selectedMeeting && (
          <PanelContent record={selectedMeeting} onClose={handleClose} />
        )}
      </Drawer>
    </>
  );
}
