"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLUMNS } from "@/components/MeetingsTable";
import { useColumnVisibility } from "@/contexts/ColumnVisibilityContext";

export default function ColumnVisibilityFilter() {
  const { columnVisibilityModel, toggleColumn } = useColumnVisibility();

  return (
    <Stack spacing={0}>
      {COLUMNS.map((col) => (
        <FormControlLabel
          key={col.key}
          label={<Typography variant="body2">{col.label}</Typography>}
          control={
            <Checkbox
              size="small"
              checked={columnVisibilityModel[col.key] !== false}
              onChange={() => toggleColumn(col.key)}
            />
          }
        />
      ))}
    </Stack>
  );
}
