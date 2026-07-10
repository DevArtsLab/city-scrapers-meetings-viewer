"use client";

import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { COLUMNS } from "@/components/MeetingsTable";
import {
  DEFAULT_COLUMN_VISIBILITY,
  useColumnVisibility,
} from "@/contexts/ColumnVisibilityContext";

export default function ColumnVisibilityFilter() {
  const { columnVisibilityModel, toggleColumn, applyVisibilityModel } =
    useColumnVisibility();

  const allVisible = COLUMNS.every(
    (col) => columnVisibilityModel[col.key] !== false
  );

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            applyVisibilityModel(
              allVisible
                ? Object.fromEntries(COLUMNS.map((col) => [col.key, false]))
                : {}
            )
          }
        >
          {allVisible ? "Hide all" : "Show all"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => applyVisibilityModel(DEFAULT_COLUMN_VISIBILITY)}
        >
          Reset
        </Button>
      </Stack>

      <Divider />

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
    </Stack>
  );
}
