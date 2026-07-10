"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MeetingRecord } from "@/lib/scrapers";
import React from "react";

export const DUPLICATE_GROUP_COLORS: {
  bg: string;
  bgHover: string;
  border: string;
}[] = [
  {
    bg: "rgba(255, 193, 7, 0.12)",
    bgHover: "rgba(255, 193, 7, 0.22)",
    border: "rgba(255, 193, 7, 0.5)",
  },
  {
    bg: "rgba(33, 150, 243, 0.1)",
    bgHover: "rgba(33, 150, 243, 0.2)",
    border: "rgba(33, 150, 243, 0.4)",
  },
  {
    bg: "rgba(76, 175, 80, 0.1)",
    bgHover: "rgba(76, 175, 80, 0.2)",
    border: "rgba(76, 175, 80, 0.4)",
  },
  {
    bg: "rgba(156, 39, 176, 0.08)",
    bgHover: "rgba(156, 39, 176, 0.18)",
    border: "rgba(156, 39, 176, 0.35)",
  },
  {
    bg: "rgba(233, 30, 99, 0.08)",
    bgHover: "rgba(233, 30, 99, 0.18)",
    border: "rgba(233, 30, 99, 0.35)",
  },
  {
    bg: "rgba(0, 188, 212, 0.1)",
    bgHover: "rgba(0, 188, 212, 0.2)",
    border: "rgba(0, 188, 212, 0.4)",
  },
];

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
}: {
  value: string;
  fallback: string;
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
        value
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

export function LocationDisplay({ record }: { record: MeetingRecord }) {
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
      <LocationPart value={name} fallback="No name" />
      <LocationPart value={address} fallback="No address" />
    </Box>
  );
}

export default function MeetingCard({
  record,
  duplicateGroupIndex,
  isFirstDuplicate,
  duplicateCount,
}: {
  record: MeetingRecord;
  /** ≥0 means this record is in a duplicate group; -1/undefined means not a duplicate. */
  duplicateGroupIndex?: number;
  isFirstDuplicate?: boolean;
  duplicateCount?: number;
}) {
  const status = normalizeStatus(record.status);
  const groupColor =
    duplicateGroupIndex != null && duplicateGroupIndex >= 0
      ? DUPLICATE_GROUP_COLORS[
          duplicateGroupIndex % DUPLICATE_GROUP_COLORS.length
        ]
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
            {record.title}
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
          value={<LocationDisplay record={record} />}
        />
        <CardField label="Type" value={record.classification || "—"} />
      </Stack>
    </Paper>
  );
}
