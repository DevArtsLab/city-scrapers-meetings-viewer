import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BackLink from "@/components/scrapers/BackLink";

interface PageHeaderProps {
  /** Page title. */
  title: string;
  /** Destination for the back link. Omit to render the title alone. */
  backHref?: string;
  /** Label for the back link. */
  backLabel?: string;
}

/**
 * Reusable page header row: an optional back link on the left with the
 * page title on the same line. Used across top-level pages for a
 * consistent, scalable header layout.
 */
export default function PageHeader({
  title,
  backHref,
  backLabel = "Back",
}: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: 1,
      }}
    >
      {backHref && <BackLink href={backHref} label={backLabel} />}
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          textAlign: "center",
          flexGrow: { xs: 0, sm: 1 },
          flexBasis: { xs: "auto", sm: "0%" },
        }}
      >
        {title}
      </Typography>
      {backHref && (
        <Box
          sx={{
            display: { xs: "none", sm: "block" },
            visibility: "hidden",
            flexShrink: 0,
          }}
          aria-hidden
        >
          <BackLink href={backHref} label={backLabel} />
        </Box>
      )}
    </Box>
  );
}
