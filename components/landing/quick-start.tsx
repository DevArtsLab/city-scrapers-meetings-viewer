import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import WarningAmberRounded from "@mui/icons-material/WarningAmberRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CONTENT_MAX_WIDTH } from "@/lib/layout";

const steps = [
  {
    title: "Start the viewer",
    body: "From the meetings-viewer repo root.",
    code: "npm install\nnpm run dev",
  },
  {
    title: "Point a spider at the data directory",
    body: "Run the crawl from inside your city-scrapers repo. The filename without .json must match the spider name attribute — it becomes the slug in the URL.",
    code: "cd ~/code/city-scrapers-fortx\nscrapy crawl fortx_council \\\n  -O ~/code/meetings-viewer/data/scrapers/fortx_council.json",
  },
  {
    title: "Open the run",
    body: "The viewer reads from disk on each request, so a refresh reflects the latest crawl.",
    code: "http://localhost:3000/scrapers/fortx_council",
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        mt: 2,
        p: 2.5,
        borderRadius: 1.5,
        border: 1,
        borderColor: "divider",
        bgcolor: "action.hover",
        overflowX: "auto",
        fontFamily: "monospace",
        fontSize: "0.875rem",
        lineHeight: 1.7,
        color: "text.primary",
      }}
    >
      <code>{code}</code>
    </Box>
  );
}

export function QuickStart() {
  return (
    <Box
      component="section"
      id="quick-start"
      sx={{
        py: { xs: 10, md: 14 },
        bgcolor: "background.default",
        scrollMarginTop: "80px",
      }}
    >
      <Container maxWidth={CONTENT_MAX_WIDTH}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 600,
              mb: 2,
            }}
          >
            Load your first run
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
            Requires Node.js 20.9+ and npm. Nothing else to configure.
          </Typography>
        </Box>

        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Box
            component="ol"
            sx={{
              listStyle: "none",
              p: 0,
              m: 0,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}
          >
            {steps.map((step, index) => (
              <Box
                component="li"
                key={step.title}
                sx={{
                  display: "flex",
                  gap: 3,
                  position: "relative",
                  pb: index === steps.length - 1 ? 0 : 4,
                }}
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <Box
                    aria-hidden="true"
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: 36,
                      bottom: 0,
                      width: 2,
                      bgcolor: "divider",
                    }}
                  />
                )}
                <Box
                  aria-hidden="true"
                  sx={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: 2,
                    borderColor: "primary.main",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    zIndex: 1,
                  }}
                >
                  {index + 1}
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    component="h3"
                    sx={{ fontWeight: 500, fontSize: "1.125rem", mb: 1 }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.6,
                      fontSize: "0.9375rem",
                      mb: 2,
                    }}
                  >
                    {step.body}
                  </Typography>
                  <CodeBlock code={step.code} />
                </Box>
              </Box>
            ))}
          </Box>

          <Paper
            variant="outlined"
            sx={{
              mt: 6,
              p: 3,
              borderRadius: 2,
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              borderColor: "warning.main",
            }}
          >
            <WarningAmberRounded
              sx={{ fontSize: 24, mt: "2px", color: "warning.main" }}
            />
            <Typography sx={{ fontSize: "0.9375rem", lineHeight: 1.6 }}>
              Use the capital{" "}
              <Box
                component="code"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                -O
              </Box>{" "}
              flag, which overwrites the file on each run. The lowercase{" "}
              <Box
                component="code"
                sx={{ fontFamily: "monospace", fontWeight: 600 }}
              >
                -o
              </Box>{" "}
              flag appends and will produce duplicate records on subsequent
              runs.
            </Typography>
          </Paper>

          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Button
              href="/scrapers"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              sx={{ textTransform: "none", fontWeight: 500, px: 4 }}
            >
              Go to scrapers
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
