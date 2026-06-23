"use client";

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

  if (!name && !address) return "";
  if (!name) return `No Name, ${address}`;
  if (!address) return `${name}, No address`;

  return `${name}, ${address}`;
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
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

// Renders a value, or a fallback label in error color if the value is empty
function LocationPart({
  value,
  fallback,
}: {
  value: string;
  fallback: string;
}) {
  if (value) return <>{value}</>;
  return (
    <Typography
      component="span"
      sx={{ color: "error.main", fontSize: "inherit" }}
    >
      {fallback}
    </Typography>
  );
}

// For display, highlighting "No Name"/"No address" in error color
export function LocationDisplay({ record }: { record: MeetingRecord }) {
  const name = record.location?.name?.trim() ?? "";
  const address = record.location?.address?.trim() ?? "";

  if (!name && !address) return <>—</>;

  return (
    <>
      <LocationPart value={name} fallback="No Name" />
      {","}
      <br />
      <LocationPart value={address} fallback="No address" />
    </>
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
