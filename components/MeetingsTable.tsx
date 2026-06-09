"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import type { MeetingRecord } from "@/lib/scrapers";

type SortKey =
  | "title"
  | "start"
  | "end"
  | "location"
  | "classification"
  | "status";
type SortDirection = "asc" | "desc";

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "tentative", label: "Tentative" },
];

const STATUS_CHIP_COLOR: Record<
  string,
  "success" | "error" | "warning" | "default"
> = {
  passed: "success",
  cancelled: "error",
  tentative: "warning",
};

function locationText(record: MeetingRecord): string {
  const name = record.location?.name ?? "";
  const address = record.location?.address ?? "";
  return [name, address].filter(Boolean).join(", ");
}

function sortValue(record: MeetingRecord, key: SortKey): string {
  if (key === "location") return locationText(record).toLowerCase();
  if (key === "classification")
    return (record.classification ?? "").toLowerCase();
  return (record[key] ?? "").toLowerCase();
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <Paper variant="outlined" sx={{ px: 3, py: 1.5, minWidth: 120 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const stats = useMemo(() => {
    const byStatus = (status: string) =>
      records.filter((r) => (r.status ?? "").toLowerCase() === status).length;
    return {
      total: records.length,
      passed: byStatus("passed"),
      cancelled: byStatus("cancelled"),
      tentative: byStatus("tentative"),
    };
  }, [records]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => (r.status ?? "").toLowerCase() === statusFilter
      );
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

    return [...filtered].sort((a, b) => {
      const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey));
      return sortDirection === "asc" ? cmp : -cmp;
    });
  }, [records, search, statusFilter, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: "title", label: "Title" },
    { key: "start", label: "Start" },
    { key: "end", label: "End" },
    { key: "location", label: "Location" },
    { key: "classification", label: "Type" },
    { key: "status", label: "Status" },
  ];

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3, flexWrap: "wrap" }}>
        <StatBox label="Total" value={stats.total} />
        <StatBox label="Passed" value={stats.passed} />
        <StatBox label="Cancelled" value={stats.cancelled} />
        <StatBox label="Tentative" value={stats.tentative} />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 400 }}
        />
        <TextField
          label="Status"
          size="small"
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          {STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="meetings table" size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sortDirection={sortKey === column.key ? sortDirection : false}
                  sx={{ fontWeight: 700 }}
                >
                  <TableSortLabel
                    active={sortKey === column.key}
                    direction={sortKey === column.key ? sortDirection : "asc"}
                    onClick={() => handleSort(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 2 }}
                  >
                    No meetings match the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              visibleRecords.map((record) => {
                const status = (record.status ?? "").toLowerCase();
                return (
                  <TableRow key={record.id} hover>
                    <TableCell>{record.title}</TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.start}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {record.end}
                    </TableCell>
                    <TableCell>{locationText(record) || "—"}</TableCell>
                    <TableCell>{record.classification || "—"}</TableCell>
                    <TableCell>
                      <Chip
                        label={status || "—"}
                        size="small"
                        color={STATUS_CHIP_COLOR[status] ?? "default"}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
