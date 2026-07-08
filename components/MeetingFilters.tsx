"use client";

import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DateRangeFilter from "@/components/DateRangeFilter";
import ColumnVisibilityFilter from "@/components/ColumnVisibilityFilter";
import {
  STATUS_OPTIONS,
  type MeetingFiltersState,
} from "@/hooks/useMeetingFilters";

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
        <ColumnVisibilityFilter />
      </FilterSection>
    </Stack>
  );
}
