"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import type { MeetingRecord } from "@/lib/scrapers";
import { colorForDuplicateCount } from "@/lib/duplicates";
import { normalizeStatus } from "@/lib/meetings";
import { StatusChip } from "@/components/ui/StatusChip";
import { LocationDisplay } from "@/components/ui/LocationDisplay";
import { highlightMatches } from "@/components/ui/HighlightMatches";

function CardField({ label, value }: { label: string; value: ReactNode }) {
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
