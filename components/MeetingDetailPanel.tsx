"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  locationText,
  normalizeStatus,
  StatusChip,
} from "@/components/MeetingCard";
import { useMeetingSelection } from "@/contexts/MeetingSelectionContext";

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

export default function MeetingDetailPanel() {
  const { selectedRecord, setSelectedRecord } = useMeetingSelection();

  if (!selectedRecord) return null;

  const record = selectedRecord;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 16,
        width: 340,
        flexShrink: 0,
        height: "calc(100vh - 32px)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
      }}
    >
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
            onClick={() => setSelectedRecord(null)}
            aria-label="Close panel"
            sx={{ flexShrink: 0 }}
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
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {record.start || "—"}
          </Typography>
        </Section>

        <Section label="End">
          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
            {record.end || "—"}
          </Typography>
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
            {record.description || "—"}
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
                  {link.title || link.href}
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
          <Typography
            variant="body2"
            sx={{
              fontFamily: "monospace",
              fontSize: "0.75rem",
              wordBreak: "break-all",
            }}
          >
            {record.id}
          </Typography>
        </Section>
      </Box>
    </Box>
  );
}
