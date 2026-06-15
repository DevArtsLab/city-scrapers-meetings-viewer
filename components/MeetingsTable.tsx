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
import type { MeetingRecord } from "@/lib/scrapers";
import MeetingCard, {
  locationText,
  normalizeStatus,
  StatusChip,
} from "@/components/MeetingCard";

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

function ExpandableDescriptionCell({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const text = description || "—";
  return (
    <TableCell
      onClick={() => setExpanded((prev) => !prev)}
      sx={{
        maxWidth: 350,
        cursor: "pointer",
        ...(expanded
          ? { whiteSpace: "normal", wordBreak: "break-word" }
          : {
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }),
      }}
    >
      {text}
    </TableCell>
  );
}

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
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of records) {
      const s = normalizeStatus(r.status);
      counts[s] = (counts[s] ?? 0) + 1;
    }
    return { total: records.length, counts };
  }, [records]);

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => normalizeStatus(r.status) === statusFilter
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

  return (
    <Box>
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
        Showing {visibleRecords.length} of {records.length} meetings
      </Typography>

      {/* Desktop / tablet: full table with horizontal scroll as a fallback */}
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ display: { xs: "none", md: "block" }, overflowX: "auto" }}
      >
        <Table aria-label="meetings table" size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              {COLUMNS.map((column) => (
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
                <TableCell colSpan={COLUMNS.length} align="center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            ) : (
              visibleRecords.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.title}</TableCell>
                  <ExpandableDescriptionCell description={record.description} />
                  <TableCell>{record.classification || "—"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.start}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {record.end}
                  </TableCell>
                  <TableCell>{record.all_day ? "Yes" : "No"}</TableCell>
                  <TableCell>{record.time_notes || "—"}</TableCell>
                  <TableCell>{locationText(record) || "—"}</TableCell>
                  <TableCell>
                    {record.links?.length
                      ? record.links.map((link, i) => (
                          <a
                            key={i}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "block" }}
                          >
                            {link.title || link.href}
                          </a>
                        ))
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {record.source ? (
                      <a
                        href={record.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {record.source}
                      </a>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusChip status={normalizeStatus(record.status)} />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem" }}>
                    {record.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile: card layout */}
      <Stack
        spacing={1.5}
        sx={{ display: { xs: "flex", md: "none" } }}
        aria-label="meetings list"
      >
        {visibleRecords.length === 0 ? (
          <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
            <EmptyState />
          </Paper>
        ) : (
          visibleRecords.map((record) => (
            <MeetingCard key={record.id} record={record} />
          ))
        )}
      </Stack>
    </Box>
  );
}
