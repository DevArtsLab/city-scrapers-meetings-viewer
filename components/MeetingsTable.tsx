"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";
import type { GridColDef } from "@mui/x-data-grid";

const DataGrid = dynamic(
  () => import("@mui/x-data-grid").then((mod) => mod.DataGrid),
  { ssr: false }
);
import type { MeetingRecord } from "@/lib/scrapers";
import DateRangeFilter from "@/components/DateRangeFilter";
import MeetingCard, {
  LocationDisplay,
  locationText,
  normalizeStatus,
  StatusChip,
} from "@/components/MeetingCard";
import TruncatedText from "./TruncatedText";
import LinkWithTooltip from "./LinkWithTooltip";
import { useSetSelectedMeeting } from "@/contexts/MeetingSelectionContext";

type SortKey =
  | "title"
  | "description"
  | "classification"
  | "start"
  | "end"
  | "all_day"
  | "time_notes"
  | "location"
  | "links"
  | "source"
  | "status"
  | "id";
type SortDirection = "asc" | "desc";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "tentative", label: "Tentative" },
];

const STAT_STATUSES = STATUS_OPTIONS.filter((o) => o.value !== "all");

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "classification", label: "Classification" },
  { key: "start", label: "Start" },
  { key: "end", label: "End" },
  { key: "all_day", label: "All Day" },
  { key: "time_notes", label: "Time Notes" },
  { key: "location", label: "Location" },
  { key: "links", label: "Links" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "id", label: "ID" },
];

const DATAGRID_COLUMNS: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    minWidth: 140,
    renderCell: ({ row }) => <TruncatedText text={row.title} wrap maxLines={4} />,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2.5,
    minWidth: 160,
    renderCell: ({ row }) => <TruncatedText text={row.description} wrap maxLines={4} />,
  },
  {
    field: "classification",
    headerName: "Classification",
    flex: 1,
    minWidth: 115,
    renderCell: ({ row }) => row.classification || "—",
  },
  {
    field: "start",
    headerName: "Start",
    width: 105,
    renderCell: ({ row }) => row.start || "—",
  },
  {
    field: "end",
    headerName: "End",
    width: 105,
    renderCell: ({ row }) => row.end || "—",
  },
  {
    field: "all_day",
    headerName: "All Day",
    width: 80,
    renderCell: ({ row }) => (row.all_day ? "Yes" : "No"),
  },
  {
    field: "time_notes",
    headerName: "Time Notes",
    flex: 1.5,
    minWidth: 120,
    renderCell: ({ row }) => <TruncatedText text={row.time_notes} wrap maxLines={4} />,
  },
  {
    field: "location",
    headerName: "Location",
    width: 200,
    minWidth: 99,
    valueGetter: (_value: unknown, row: unknown) =>
      locationText(row as MeetingRecord),
    renderCell: ({ row }) => <LocationDisplay record={row as MeetingRecord} />,
  },
  {
    field: "links",
    headerName: "Links",
    flex: 1.5,
    minWidth: 120,
    sortable: false,
    renderCell: ({ row }) => {
      const r = row as MeetingRecord;
      if (!r.links?.length) return "—";
      const visible = r.links.slice(0, 3);
      const extra = r.links.length - 3;
      return (
        <Box>
          {visible.map((link, i) => (
            <Box key={i} sx={{ mb: i < visible.length - 1 ? 0.75 : 0 }}>
              <LinkWithTooltip href={link.href} label={link.title} />
            </Box>
          ))}
          {extra > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              +{extra} more link{extra > 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
      );
    },
  },
  {
    field: "source",
    headerName: "Source",
    flex: 1.5,
    minWidth: 130,
    renderCell: ({ row }) =>
      row.source ? (
        <LinkWithTooltip href={row.source} label="Source Link" />
      ) : (
        "—"
      ),
  },
  {
    field: "status",
    headerName: "Status",
    width: 105,
    valueGetter: (_value: unknown, row: unknown) =>
      normalizeStatus((row as MeetingRecord).status),
    renderCell: ({ value }) => <StatusChip status={value} />,
  },
  {
    field: "id",
    headerName: "ID",
    flex: 1,
    minWidth: 120,
    renderCell: ({ row }) => <TruncatedText text={row.id} />,
  },
];

function EmptyState() {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
      No meetings match the current filters.
    </Typography>
  );
}

const SORT_EXTRACTORS: Partial<Record<SortKey, (r: MeetingRecord) => string>> =
  {
    location: (r) => locationText(r).toLowerCase(),
    classification: (r) => (r.classification ?? "").toLowerCase(),
    all_day: (r) => (r.all_day ? "yes" : "no"),
    links: (r) => String(r.links?.length ?? 0),
  };

function sortValue(record: MeetingRecord, key: SortKey): string {
  const extractor = SORT_EXTRACTORS[key];
  if (extractor) return extractor(record);
  const val = record[key as keyof MeetingRecord];
  return typeof val === "string" ? val.toLowerCase() : "";
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <Paper
      variant="outlined"
      sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 1.5 } }}
    >
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default function MeetingsTable({
  records,
}: {
  records: MeetingRecord[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const setSelectedMeeting = useSetSelectedMeeting();

  // Convert "YYYY-MM-DD" to Date object in local time
  const parseLocalDate = (s: string): Date | null => {
    if (!s) return null;
    const [y, m, d] = s.split("-").map(Number);
    const date = new Date(y, m - 1, d, 0, 0, 0, 0);
    return isNaN(date.getTime()) ? null : date;
  };

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of records) {
      const s = normalizeStatus(r.status);
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return { total: records.length, counts };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => normalizeStatus(r.status) === statusFilter
      );
    }

    // Date filterring: include meetings that start or end within the selected date range
    if (dateFrom || dateTo) {
      const from = parseLocalDate(dateFrom);
      const toDate = parseLocalDate(dateTo) ?? (from ? new Date(from) : null);
      if (toDate) toDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((r) => {
        const isWithinDateRange = (dateStr: string | undefined) => {
          if (!dateStr) return false;
          const meetingDate = new Date(dateStr);
          if (isNaN(meetingDate.getTime())) return false;
          if (from && meetingDate < from) return false;
          if (toDate && meetingDate > toDate) return false;
          return true;
        };
        return isWithinDateRange(r.start) || isWithinDateRange(r.end);
      });
    }

    if (query) {
      filtered = filtered.filter((r) =>
        [
          r.title,
          r.description,
          r.classification,
          r.time_notes,
          r.status,
          locationText(r),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    return filtered;
  }, [records, search, statusFilter, dateFrom, dateTo]);

  // Sorted records used only for the mobile card view
  const sortedRecords = useMemo(
    () =>
      [...filteredRecords].sort((a, b) => {
        const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey));
        return sortDirection === "asc" ? cmp : -cmp;
      }),
    [filteredRecords, sortKey, sortDirection]
  );

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (record: MeetingRecord) => {
    setSelectedMeeting((prev) => (prev?.id === record.id ? null : record));
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
          gap: { xs: 1.5, sm: 2 },
          mb: 3,
        }}
      >
        <StatBox label="Total" value={stats.total} />
        {STAT_STATUSES.map((s) => (
          <StatBox
            key={s.value}
            label={s.label}
            value={stats.counts[s.value] ?? 0}
          />
        ))}
      </Box>

      <DateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onClear={() => {
          setDateFrom("");
          setDateTo("");
        }}
      />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
        useFlexGap
      >
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, width: { xs: "100%" } }}
        />
        <TextField
          label="Status"
          size="small"
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160, width: { xs: "100%", sm: "auto" } }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Sort by"
          size="small"
          select
          value={sortKey}
          onChange={(e) => handleSort(e.target.value as SortKey)}
          sx={{
            minWidth: 160,
            width: { xs: "100%" },
            display: { xs: "flex", md: "none" },
          }}
        >
          {COLUMNS.map((column) => (
            <MenuItem key={column.key} value={column.key}>
              {column.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Showing {filteredRecords.length} of {records.length} meetings
      </Typography>

      {/* Desktop / tablet: DataGrid with resizable columns */}
      <Paper
        variant="outlined"
        sx={{ display: { xs: "none", md: "block" }, width: "100%" }}
      >
        <DataGrid
          rows={filteredRecords}
          columns={DATAGRID_COLUMNS}
          disableColumnMenu
          autoHeight
          getRowHeight={() => "auto"}
          density="compact"
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
            sorting: {
              sortModel: [{ field: "start", sort: "asc" }],
            },
          }}
          slots={{
            noRowsOverlay: EmptyState,
          }}
          onRowClick={(params) => handleRowClick(params.row as MeetingRecord)}
          aria-label="meetings table"
          sx={{
            border: "none",
            cursor: "pointer",
            "& .MuiDataGrid-row": {
              minHeight: "52px !important",
              maxHeight: "96px !important",
            },
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
              paddingTop: "14px !important",
              paddingBottom: "14px !important",
              paddingLeft: "16px",
              paddingRight: "16px",
            },
          }}
        />
      </Paper>

      {/* Mobile: card layout */}
      <Stack
        spacing={1.5}
        sx={{ display: { xs: "flex", md: "none" } }}
        aria-label="meetings list"
      >
        {sortedRecords.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <EmptyState />
          </Paper>
        ) : (
          sortedRecords.map((record) => (
            <MeetingCard key={record.id} record={record} />
          ))
        )}
      </Stack>
    </Box>
  );
}
