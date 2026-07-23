"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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
import MeetingCard, {
  colorForDuplicateCount,
  LocationDisplay,
  locationText,
  normalizeStatus,
  StatusChip,
} from "@/components/MeetingCard";
import type { DuplicateInfo } from "@/lib/duplicates";
import TruncatedText from "./TruncatedText";
import LinkWithTooltip from "./LinkWithTooltip";
import { useSetSelectedMeeting } from "@/contexts/MeetingSelectionContext";
import { useColumnVisibility } from "@/contexts/ColumnVisibilityContext";

export type SortKey =
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

export const COLUMNS: { key: SortKey; label: string }[] = [
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
    renderCell: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          width: "100%",
          minWidth: 0,
        }}
      >
        <TruncatedText text={row.title} wrap maxLines={4} />
        {row._isFirst && (
          <Chip
            label={`×${row._duplicateCount}`}
            size="small"
            color="warning"
            sx={{
              flexShrink: 0,
              height: 20,
              fontSize: "0.7rem",
              "& .MuiChip-label": { px: 0.75 },
            }}
          />
        )}
      </Box>
    ),
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2.5,
    minWidth: 160,
    renderCell: ({ row }) => (
      <TruncatedText text={row.description} wrap maxLines={4} />
    ),
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
    renderCell: ({ row }) => (
      <TruncatedText text={row.time_notes} wrap maxLines={4} />
    ),
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
        <Box sx={{ width: "100%", minWidth: 0 }}>
          {visible.map((link, i) => (
            <Box
              key={i}
              sx={{
                mb: i < visible.length - 1 ? 0.75 : 0,
                width: "100%",
                minWidth: 0,
              }}
            >
              <LinkWithTooltip
                href={link.href}
                label={link.title}
                maxWidth="100%"
              />
            </Box>
          ))}
          {extra > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: "block" }}
            >
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
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        color: "text.disabled",
        px: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", maxWidth: 320 }}
      >
        No meetings match the current filters. Try adjusting your search or
        clearing a filter.
      </Typography>
    </Box>
  );
}

function NoColumnsOverlay() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
        p: 3,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        All columns are hidden.
      </Typography>
    </Box>
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

// Marks the first record encountered for each duplicate group in the given
// display order (independent of where each record falls in the full,
// unfiltered dataset the grouping was computed from).
function markFirstInGroup(groupIndices: number[]): boolean[] {
  const seen = new Set<number>();
  return groupIndices.map((g) => {
    if (g < 0) return false;
    if (seen.has(g)) return false;
    seen.add(g);
    return true;
  });
}

export default function MeetingsTable({
  records,
  totalCount,
  duplicateInfoMap,
}: {
  /** Records to display, already filtered upstream. */
  records: MeetingRecord[];
  /** Unfiltered record count, for the "Showing X of Y" summary. */
  totalCount: number;
  /** Per-record duplicate info computed from the full, unfiltered dataset. */
  duplicateInfoMap: Map<MeetingRecord, DuplicateInfo>;
}) {
  const { columnVisibilityModel } = useColumnVisibility();
  const [sortKey, setSortKey] = useState<SortKey>("start");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const setSelectedMeeting = useSetSelectedMeeting();

  const perRecordInfo = useMemo(() => {
    const infos = records.map(
      (r) =>
        duplicateInfoMap.get(r) ?? {
          isDuplicate: false,
          isFirst: false,
          count: 1,
          groupIndex: -1,
        }
    );
    const isFirst = markFirstInGroup(infos.map((info) => info.groupIndex));
    return infos.map((info, i) => ({ ...info, isFirst: isFirst[i] }));
  }, [records, duplicateInfoMap]);

  const enrichedRows = useMemo(
    () =>
      records.map((r, i) => ({
        ...r,
        _idx: i,
        _isFirst: perRecordInfo[i].isFirst,
        _duplicateCount: perRecordInfo[i].count,
        _duplicateGroup: perRecordInfo[i].groupIndex,
      })),
    [records, perRecordInfo]
  );

  // Generate CSS rules for each duplicate count that appears in the data
  const duplicateColorStyles = useMemo(() => {
    const counts = new Set(
      enrichedRows
        .filter((r) => r._duplicateGroup >= 0)
        .map((r) => r._duplicateCount)
    );
    return Object.fromEntries(
      [...counts].flatMap((count) => {
        const c = colorForDuplicateCount(count);
        return [
          [
            `& .MuiDataGrid-row.duplicate-count-${count}`,
            { backgroundColor: c.bg },
          ],
          [
            `& .MuiDataGrid-row.duplicate-count-${count}:hover`,
            { backgroundColor: `${c.bgHover} !important` },
          ],
        ];
      })
    );
  }, [enrichedRows]);

  // Sorted records used only for the mobile card view
  const sortedRecords = useMemo(
    () =>
      [...records].sort((a, b) => {
        const cmp = sortValue(a, sortKey).localeCompare(sortValue(b, sortKey));
        return sortDirection === "asc" ? cmp : -cmp;
      }),
    [records, sortKey, sortDirection]
  );

  const sortedDupInfo = useMemo(() => {
    const infos = sortedRecords.map(
      (r) => duplicateInfoMap.get(r) ?? { isDuplicate: false, count: 1, groupIndex: -1 }
    );
    const isFirst = markFirstInGroup(infos.map((info) => info.groupIndex));
    return infos.map((info, i) => ({
      isFirst: isFirst[i],
      count: info.count,
      groupIndex: info.groupIndex,
    }));
  }, [sortedRecords, duplicateInfoMap]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (row: MeetingRecord) => {
    setSelectedMeeting((prev) => (prev?._idx === row._idx ? null : row));
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      {/* Mobile-only sort control; the DataGrid handles sorting on desktop. */}
      <TextField
        label="Sort by"
        size="small"
        select
        value={sortKey}
        onChange={(e) => handleSort(e.target.value as SortKey)}
        sx={{
          minWidth: 160,
          width: "100%",
          mb: 2,
          display: { xs: "flex", md: "none" },
        }}
      >
        {COLUMNS.map((column) => (
          <MenuItem key={column.key} value={column.key}>
            {column.label}
          </MenuItem>
        ))}
      </TextField>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Showing {records.length} of {totalCount} meetings
      </Typography>

      {/* Desktop / tablet: DataGrid with resizable columns */}
      <Paper
        variant="outlined"
        sx={{ display: { xs: "none", md: "block" }, width: "100%" }}
      >
        <DataGrid
          rows={enrichedRows}
          getRowId={(row) => row._idx}
          columns={DATAGRID_COLUMNS}
          columnVisibilityModel={columnVisibilityModel}
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
            noColumnsOverlay: NoColumnsOverlay,
          }}
          getRowClassName={(params) => {
            const g = params.row._duplicateGroup;
            if (typeof g !== "number" || g < 0) return "";
            return `duplicate-count-${params.row._duplicateCount}`;
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
            ...duplicateColorStyles,
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
          sortedRecords.map((record, index) => (
            <MeetingCard
              key={index}
              record={record}
              isFirstDuplicate={sortedDupInfo[index].isFirst}
              duplicateCount={sortedDupInfo[index].count}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
