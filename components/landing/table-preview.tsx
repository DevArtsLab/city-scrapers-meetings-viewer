import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const stats = [
  { label: "Total", value: 128 },
  { label: "Passed", value: 96 },
  { label: "Cancelled", value: 12 },
  { label: "Tentative", value: 20 },
  { label: "Duplicates", value: 4 },
];

type Row = {
  title: string;
  start: string;
  location: string;
  status: "passed" | "cancelled" | "tentative";
  duplicate?: boolean;
};

const rows: Row[] = [
  {
    title: "City Council Regular Meeting",
    start: "2026-08-04 18:00",
    location: "Council Chambers",
    status: "passed",
  },
  {
    title: "Planning Commission",
    start: "2026-08-06 09:30",
    location: "City Hall, Room 210",
    status: "tentative",
    duplicate: true,
  },
  {
    title: "Planning Commission",
    start: "2026-08-06 09:30",
    location: "City Hall, Room 210",
    status: "tentative",
    duplicate: true,
  },
  {
    title: "Zoning Board of Adjustment",
    start: "2026-08-11 13:00",
    location: "Municipal Building",
    status: "cancelled",
  },
  {
    title: "Parks & Recreation Board",
    start: "2026-08-13 17:30",
    location: "Community Center",
    status: "passed",
  },
];

const statusColor: Record<Row["status"], string> = {
  passed: "success.main",
  cancelled: "error.main",
  tentative: "warning.main",
};

function StatusPill({ status }: { status: Row["status"] }) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Box
        component="span"
        aria-hidden="true"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: statusColor[status],
        }}
      />
      <Typography
        component="span"
        sx={{ fontSize: "0.875rem", color: "text.secondary", fontWeight: 500 }}
      >
        {status}
      </Typography>
    </Box>
  );
}

/**
 * Static, illustrative rendering of the /scrapers/:spider view. Purely
 * decorative — the real view is powered by MUI X Data Grid.
 */
export function TablePreview() {
  return (
    <Paper
      variant="outlined"
      aria-hidden="true"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "action.hover",
        }}
      >
        <Typography
          sx={{
            fontFamily: "monospace",
            fontSize: "0.875rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          /scrapers/fortx_council
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: { xs: 2, sm: 4 },
          px: 3,
          py: 3,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {stats.map((stat) => (
          <Box key={stat.label}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}
            >
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 700 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1.4fr 0.9fr",
              gap: 2,
              px: 3,
              py: 2,
              borderBottom: 1,
              borderColor: "divider",
              bgcolor: "action.hover",
            }}
          >
            {["Title", "Start", "Location", "Status"].map((head) => (
              <Typography
                key={head}
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "text.secondary",
                }}
              >
                {head}
              </Typography>
            ))}
          </Box>

          {rows.map((row, index) => (
            <Box
              key={`${row.title}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 1.2fr 1.4fr 0.9fr",
                gap: 2,
                alignItems: "center",
                px: 3,
                py: 2.5,
                borderBottom: index === rows.length - 1 ? 0 : 1,
                borderColor: "divider",
                borderLeft: 4,
                borderLeftColor: row.duplicate ? "primary.main" : "transparent",
                bgcolor: row.duplicate ? "action.hover" : "transparent",
              }}
            >
              <Typography
                sx={{ fontSize: "0.9375rem", fontWeight: 600 }}
                noWrap
              >
                {row.title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  color: "text.secondary",
                }}
                noWrap
              >
                {row.start}
              </Typography>
              <Typography
                sx={{ fontSize: "0.875rem", color: "text.secondary" }}
                noWrap
              >
                {row.location}
              </Typography>
              <StatusPill status={row.status} />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
