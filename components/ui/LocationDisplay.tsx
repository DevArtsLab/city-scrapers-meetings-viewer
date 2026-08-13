"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { MeetingRecord } from "@/lib/scrapers";
import { highlightMatches } from "./HighlightMatches";

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
