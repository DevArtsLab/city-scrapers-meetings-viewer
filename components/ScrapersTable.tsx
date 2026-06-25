"use client";

import dynamic from "next/dynamic";
import type { GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const DataGrid = dynamic(
  () => import("@mui/x-data-grid").then((mod) => mod.DataGrid),
  { ssr: false }
);
import MuiLink from "@mui/material/Link";
import NextLink from "@/components/NextLink";
import type { SpiderEntry } from "@/lib/scrapers";

const PLACEHOLDER = "—";

function placeholderValue(value?: string) {
  return value && value.length > 0 ? value : PLACEHOLDER;
}

const columns: GridColDef[] = [
  {
    field: "slug",
    headerName: "Slug / Spider Name",
    flex: 1.5,
    minWidth: 160,
    renderCell: ({ value }) => (
      <MuiLink
        component={NextLink}
        href={`/scrapers/${value}`}
        underline="hover"
      >
        {value}
      </MuiLink>
    ),
  },
  {
    field: "agency",
    headerName: "Agency",
    flex: 2,
    minWidth: 200,
    valueFormatter: (value?: string) => placeholderValue(value),
  },
  {
    field: "last_run_status",
    headerName: "Status",
    width: 110,
    valueFormatter: (value?: string) => placeholderValue(value),
  },
  {
    field: "last_run",
    headerName: "Last Run",
    width: 170,
    valueFormatter: (value?: string) => placeholderValue(value),
  },
];

export default function ScrapersTable({ spiders }: { spiders: SpiderEntry[] }) {
  const rows = spiders.map((spider) => ({ id: spider.slug, ...spider }));

  return (
    <Paper variant="outlined" sx={{ mt: 3 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnMenu
        autoHeight
        density="compact"
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        aria-label="scrapers table"
        sx={{ border: "none" }}
      />
    </Paper>
  );
}
