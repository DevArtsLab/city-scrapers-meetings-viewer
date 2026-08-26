"use client";

import Chip from "@mui/material/Chip";

export const STATUS_CHIP_COLOR: Record<
  string,
  "success" | "error" | "warning" | "default"
> = {
  passed: "success",
  cancelled: "error",
  tentative: "warning",
};

export function StatusChip({ status }: { status: string }) {
  return (
    <Chip
      component="span"
      label={status || "—"}
      size="small"
      color={STATUS_CHIP_COLOR[status] ?? "default"}
      variant="outlined"
    />
  );
}
