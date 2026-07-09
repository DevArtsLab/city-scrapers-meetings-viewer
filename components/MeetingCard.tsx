"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { MeetingRecord } from "@/lib/scrapers";
import React from "react";

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

export default function MeetingCard({ record }: { record: MeetingRecord }) {
  const status = normalizeStatus(record.status);
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {record.title}
        </Typography>
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
