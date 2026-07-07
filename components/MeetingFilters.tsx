"use client";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DateRangeFilter from "@/components/DateRangeFilter";
import {
  STATUS_OPTIONS,
  type MeetingFiltersState,
} from "@/hooks/useMeetingFilters";
import { COLUMNS } from "@/components/MeetingsTable";
import { useColumnVisibility } from "@/contexts/ColumnVisibilityContext";

function FilterSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Stack spacing={1}>
      <Typography
        component="h3"
        variant="caption"
        sx={{
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

/**
 * The filter controls (search, date range, status) rendered inside the
 * FiltersPanel. State lives in useMeetingFilters, owned by the workspace.
 */
export default function MeetingFilters({
  filters,
}: {
  filters: MeetingFiltersState;
}) {
  const { columnVisibilityModel, toggleColumn } = useColumnVisibility();

  return (
    <Stack spacing={2.5} sx={{ pt: 0.5 }}>
      <FilterSection label="Search">
        <TextField
          label="Search"
          size="small"
          fullWidth
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
        />
      </FilterSection>

      <FilterSection label="Status">
        <TextField
          label="Status"
          size="small"
          select
          fullWidth
          value={filters.statusFilter}
          onChange={(e) => filters.setStatusFilter(e.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FilterSection>

      <FilterSection label="Date range">
        <DateRangeFilter
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          onDateFromChange={filters.setDateFrom}
          onDateToChange={filters.setDateTo}
          onClear={filters.clearDates}
        />
      </FilterSection>

      <FilterSection label="Manage columns">
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
      </FilterSection>
    </Stack>
  );
}
