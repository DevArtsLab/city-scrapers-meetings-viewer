"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MeetingRecord } from "@/lib/scrapers";
import React from "react";
import { highlightMatches } from "./HighlightMatches";

/**
 * Generates a unique highlight color for a given duplicate count using the
 * golden angle (≈137.5°). Each count maps to a distinct hue — no palette needed.
 *   ×2 → hue   0° (red),  ×3 → 138° (green),  ×4 → 275° (violet),
 *   ×5 → 53°  (amber),   ×6 → 190° (teal),    ×7 → 328° (pink), …
 */
export function colorForDuplicateCount(count: number): {
  bg: string;
  bgHover: string;
  border: string;
} {
  const hue = Math.round(((count - 2) * 137.508) % 360);
  return {
    bg: `hsla(${hue}, 70%, 50%, 0.12)`,
    bgHover: `hsla(${hue}, 70%, 50%, 0.22)`,
    border: `hsla(${hue}, 70%, 50%, 0.50)`,
  };
}

export const STATUS_CHIP_COLOR: Record<
  string,
  "success" | "error" | "warning" | "default"
> = {
  passed: "success",
  cancelled: "error",
  tentative: "warning",
};

export function normalizeStatus(status: string | undefined): string {
  return (status ?? "").toLowerCase();
}

export function locationText(record: MeetingRecord): string {
  const name = record.location?.name ?? "";
  const address = record.location?.address ?? "";
  return [name, address].filter(Boolean).join(", ");
}

export function StatusChip({ status }: { status: string }) {
  return (
    <Chip
      label={status || "—"}
      size="small"
      color={STATUS_CHIP_COLOR[status] ?? "default"}
      variant="outlined"
    />
  );
}

function CardField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ minWidth: 72, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography variant="body2" component="div">
        {value}
      </Typography>
    </Stack>
  );
}

function LocationPart({
  value,
  fallback,
  highlight,
}: {
  value: string;
  fallback: string;
  highlight?: string;
}) {
  return (
    <Box
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {value ? (
        highlightMatches([value], highlight ?? "")
      ) : (
        <Typography
          component="span"
          sx={{ color: "error.main", fontSize: "inherit" }}
        >
          {fallback}
        </Typography>
      )}
    </Box>
  );
}

export function LocationDisplay({
  record,
  highlight,
}: {
  record: MeetingRecord;
  /** Search keyword to highlight within the name/address text, if any. */
  highlight?: string;
}) {
  const name = record.location?.name?.trim() ?? "";
  const address = record.location?.address?.trim() ?? "";

  if (!name && !address) return <>—</>;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        py: 1,
        px: 1,
        wordBreak: "break-word",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <LocationPart value={name} fallback="No name" highlight={highlight} />
      <LocationPart
        value={address}
        fallback="No address"
        highlight={highlight}
      />
    </Box>
  );
}

export default function MeetingCard({
  record,
  titleHighlight,
  locationHighlight,
  isFirstDuplicate,
  duplicateCount,
}: {
  record: MeetingRecord;
  /** Search keyword to highlight within the title, if any. */
  titleHighlight?: string;
  /** Search keyword to highlight within the location, if any. */
  locationHighlight?: string;
  isFirstDuplicate?: boolean;
  duplicateCount?: number;
}) {
  const status = normalizeStatus(record.status);
  const groupColor =
    duplicateCount != null && duplicateCount >= 2
      ? colorForDuplicateCount(duplicateCount)
      : null;
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        ...(groupColor && {
          borderColor: groupColor.border,
          backgroundColor: groupColor.bg,
        }),
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {highlightMatches([record.title], titleHighlight ?? "")}
          </Typography>
          {isFirstDuplicate && duplicateCount && (
            <Chip
              label={`×${duplicateCount}`}
              size="small"
              color="warning"
              sx={{
                flexShrink: 0,
                height: 20,
                fontSize: "0.7rem",
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
        </Box>
        <StatusChip status={status} />
      </Stack>
      <Stack spacing={0.5}>
        <CardField label="Start" value={record.start} />
        <CardField label="End" value={record.end} />
        <CardField
          label="Location"
          value={
            <LocationDisplay record={record} highlight={locationHighlight} />
          }
        />
        <CardField label="Type" value={record.classification || "—"} />
      </Stack>
    </Paper>
  );
}
