"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MeetingRecord } from "@/lib/scrapers";
import { normalizeStatus } from "@/components/MeetingCard";

type StatColor = "text.primary" | "success.main" | "error.main" | "warning.main";

const STAT_ITEMS: { key: string; label: string; color: StatColor }[] = [
  { key: "total", label: "Total", color: "text.primary" },
  { key: "passed", label: "Passed", color: "success.main" },
  { key: "cancelled", label: "Cancelled", color: "error.main" },
  { key: "tentative", label: "Tentative", color: "warning.main" },
];

function StatItem({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: StatColor;
}) {
  return (
    <Box
      sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}
      aria-label={`${label}: ${value}`}
    >
      <Typography
        component="span"
        sx={{ fontWeight: 700, fontSize: "0.95rem", color, lineHeight: 1 }}
        aria-hidden
      >
        {value}
      </Typography>
      <Typography
        component="span"
        variant="body2"
        sx={{ color: "text.secondary", lineHeight: 1 }}
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
    return { total: records.length, byStatus };
  }, [records]);

  return (
    <Stack
      role="group"
      aria-label="Meeting statistics"
      direction="row"
      useFlexGap
      sx={{
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: { xs: 1.5, sm: 2.5 },
        rowGap: 0.5,
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
              : (counts.byStatus[item.key] ?? 0)
          }
        />
      ))}
    </Stack>
  );
}
