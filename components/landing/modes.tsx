import CloudQueueRounded from "@mui/icons-material/CloudQueueRounded";
import FolderOpenRounded from "@mui/icons-material/FolderOpenRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { SvgIconComponent } from "@mui/icons-material";

type Mode = {
  icon: SvgIconComponent;
  name: string;
  when: string;
  body: string;
  source: string;
  chip?: string;
};

const modes: Mode[] = [
  {
    icon: FolderOpenRounded,
    name: "Local",
    when: "While developing a scraper",
    body: "Your spider writes its output to data/scrapers/ and the viewer renders it. Re-run the crawl, refresh the page, see the new records.",
    source: "data/scrapers/*.json",
  },
  {
    icon: CloudQueueRounded,
    name: "Production",
    when: "During PR review",
    body: "A GitHub Actions workflow attached to the open PR publishes the run, and the viewer reads it. Review output before the scraper is merged.",
    source: "meetings-viewer-data",
    chip: "Planned",
  },
];

export function Modes() {
  return (
    <Box
      component="section"
      sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Two modes, one interface
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
            Identical routes, columns, and stats in both modes. Only the data
            source changes — it lives entirely in{" "}
            <Box
              component="code"
              sx={{
                fontFamily: "monospace",
                bgcolor: "action.hover",
                px: 1,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              lib/scrapers.ts
            </Box>
            .
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Paper
                key={mode.name}
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <Icon sx={{ fontSize: 24, color: "primary.main" }} />
                  <Typography
                    component="h3"
                    sx={{ fontWeight: 600, fontSize: "1.25rem" }}
                  >
                    {mode.name}
                  </Typography>
                  {mode.chip ? (
                    <Chip
                      label={mode.chip}
                      size="small"
                      sx={{ height: 24, fontSize: "0.75rem", fontWeight: 500 }}
                    />
                  ) : null}
                </Box>

                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "text.secondary",
                    fontWeight: 600,
                  }}
                >
                  {mode.when}
                </Typography>

                <Typography
                  sx={{ color: "text.secondary", lineHeight: 1.6, flexGrow: 1 }}
                >
                  {mode.body}
                </Typography>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: "text.disabled",
                      fontWeight: 500,
                    }}
                  >
                    Source
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      color: "text.primary",
                    }}
                  >
                    {mode.source}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
