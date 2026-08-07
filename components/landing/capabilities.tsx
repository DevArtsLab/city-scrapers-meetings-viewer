import ContentCopyRounded from "@mui/icons-material/ContentCopyRounded";
import FilterAltRounded from "@mui/icons-material/FilterAltRounded";
import InsertChartOutlinedRounded from "@mui/icons-material/InsertChartOutlinedRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import UnfoldMoreRounded from "@mui/icons-material/UnfoldMoreRounded";
import ViewColumnRounded from "@mui/icons-material/ViewColumnRounded";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

const capabilities: { icon: SvgIconComponent; title: string; body: string }[] =
  [
    {
      icon: SearchRounded,
      title: "Search across records",
      body: "Free-text search over every record in a run, so you can jump straight to the meeting you are checking.",
    },
    {
      icon: FilterAltRounded,
      title: "Status & date filters",
      body: "Narrow to passed, cancelled, or tentative records, and clamp results to a date range.",
    },
    {
      icon: ContentCopyRounded,
      title: "Duplicate highlighting",
      body: "Duplicate groups are detected and colour-coded, which catches the classic lowercase -o append mistake instantly.",
    },
    {
      icon: UnfoldMoreRounded,
      title: "Sort by start time",
      body: "Order records chronologically to spot bad date parsing, missing end times, and off-by-a-year bugs.",
    },
    {
      icon: ViewColumnRounded,
      title: "Column visibility",
      body: "Show only the fields under review, then open the detail panel for the full record including links and source.",
    },
    {
      icon: InsertChartOutlinedRounded,
      title: "Stats that always render",
      body: "Total, passed, cancelled, tentative, and duplicate counts are shown even when the count is zero.",
    },
  ];

export function Capabilities() {
  return (
    <Box component="section" sx={{ py: { xs: 10, md: 14 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Everything you check during QA
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: "1.125rem",
              lineHeight: 1.6,
              maxWidth: 650,
              mx: "auto",
            }}
          >
            The record table is built on MUI X Data Grid, so the whole run stays
            scannable no matter how many meetings a spider returns.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: { xs: 4, md: 6 },
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <Box key={item.title}>
                <Icon sx={{ fontSize: 28, color: "primary.main", mb: 2 }} />
                <Typography
                  component="h3"
                  sx={{ fontWeight: 600, fontSize: "1.125rem", mb: 1.5 }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.6,
                    fontSize: "0.9375rem",
                  }}
                >
                  {item.body}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
