"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatusChip } from "@/components/ui/StatusChip";

const stats = [
  { label: "Total", value: 128 },
  { label: "Passed", value: 96 },
  { label: "Cancelled", value: 12 },
  { label: "Tentative", value: 20 },
  { label: "Duplicates", value: 4 },
];

type Row = {
  title: string;
  start: string;
  location: string;
  status: "passed" | "cancelled" | "tentative";
  duplicate?: boolean;
};

const rows: Row[] = [
  {
    title: "City Council Regular Meeting",
    start: "2026-08-04 18:00",
    location: "Council Chambers",
    status: "passed",
  },
  {
    title: "Planning Commission",
    start: "2026-08-06 09:30",
    location: "City Hall, Room 210",
    status: "tentative",
    duplicate: true,
  },
  {
    title: "Planning Commission",
    start: "2026-08-06 09:30",
    location: "City Hall, Room 210",
    status: "tentative",
    duplicate: true,
  },
  {
    title: "Zoning Board of Adjustment",
    start: "2026-08-11 13:00",
    location: "Municipal Building",
    status: "cancelled",
  },
  {
    title: "Parks & Recreation Board",
    start: "2026-08-13 17:30",
    location: "Community Center",
    status: "passed",
  },
];

/**
 * Static, illustrative rendering of the /scrapers/:spider view. Purely
 * decorative — the real view is powered by MUI X Data Grid.
 */
export function TablePreview() {
  return (
    <Box aria-hidden="true">
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Showing {rows.length} of {stats[0].value} meetings
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 1,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box sx={{ minWidth: 700 }}>
            {/* Table header */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1.4fr 0.6fr",
                gap: 2,
                px: 2,
                py: 1,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "action.hover",
              }}
            >
              {["Title", "Start", "Location", "Status"].map((head) => (
                <Typography
                  key={head}
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  {head}
                </Typography>
              ))}
            </Box>

            {rows.map((row, index) => (
              <Box
                key={`${row.title}-${index}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.2fr 1.4fr 0.6fr",
                  gap: 2,
                  alignItems: "center",
                  px: 2,
                  py: 1.5,
                  borderBottom: index === rows.length - 1 ? 0 : 1,
                  borderColor: "divider",
                  bgcolor: row.duplicate ? "action.hover" : "transparent",
                  transition: "bgcolor 0.15s",
                  "&:hover": {
                    bgcolor: row.duplicate ? "action.selected" : "action.hover",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{ fontSize: "0.875rem", fontWeight: 500 }}
                    noWrap
                  >
                    {row.title}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontFamily: "monospace",
                    fontSize: "0.8125rem",
                    color: "text.secondary",
                  }}
                  noWrap
                >
                  {row.start}
                </Typography>
                <Typography
                  sx={{ fontSize: "0.8125rem", color: "text.secondary" }}
                  noWrap
                >
                  {row.location}
                </Typography>
                <StatusChip status={row.status} />
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
