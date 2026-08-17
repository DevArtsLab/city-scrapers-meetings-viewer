"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { MeetingRecord } from "@/components/scrapers/lib/scrapers";
import { normalizeStatus } from "@/components/scrapers/lib/meetings";
import { buildDuplicateGroups } from "@/components/scrapers/lib/duplicates";

// Numbers carry the status color; labels stay high-contrast text.secondary so
// meaning never depends on color alone (WCAG 1.4.1).
type ValueColor =
  | "text.primary"
  | "success.main"
  | "error.main"
  | "warning.main"
  | "secondary.main";

const STAT_ITEMS: { key: string; label: string; color: ValueColor }[] = [
  { key: "total", label: "Total", color: "text.primary" },
  { key: "passed", label: "Passed", color: "success.main" },
  { key: "cancelled", label: "Cancelled", color: "error.main" },
  { key: "tentative", label: "Tentative", color: "warning.main" },
  { key: "duplicates", label: "Duplicates", color: "secondary.main" },
];

function StatItem({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: ValueColor;
}) {
  return (
    <Box
      role="listitem"
      aria-label={`${label}: ${value}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        // Match the small Button height (~32px) for visual consistency.
        px: 1.5,
        py: 0.375,
        borderRadius: 1,
        bgcolor: "action.hover",
        minHeight: 32,
        boxSizing: "border-box",
      }}
    >
      <Typography
        component="span"
        sx={{
          fontWeight: 700,
          fontSize: "0.875rem",
          color,
          lineHeight: 1.2,
        }}
        aria-hidden
      >
        {value}
      </Typography>
      <Typography
        component="span"
        sx={{ fontSize: "0.8rem", color: "text.secondary", lineHeight: 1.2 }}
        aria-hidden
      >
        {label}
      </Typography>
    </Box>
  );
}

export default function MeetingStats({
  records,
}: {
  records: MeetingRecord[];
}) {
  const counts = useMemo(() => {
    const byStatus: Record<string, number> = {};
    for (const r of records) {
      const s = normalizeStatus(r.status);
      byStatus[s] = (byStatus[s] ?? 0) + 1;
    }
    const duplicates = buildDuplicateGroups(records).filter(
      (d) => d.isDuplicate
    ).length;
    return { total: records.length, byStatus, duplicates };
  }, [records]);

  return (
    <Box
      role="list"
      aria-label="Meeting statistics"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: { xs: 0.75, sm: 1 },
        width: { xs: "100%", sm: "auto" },
      }}
    >
      {STAT_ITEMS.map((item) => (
        <StatItem
          key={item.key}
          label={item.label}
          color={item.color}
          value={
            item.key === "total"
              ? counts.total
              : item.key === "duplicates"
                ? counts.duplicates
                : (counts.byStatus[item.key] ?? 0)
          }
        />
      ))}
    </Box>
  );
}
