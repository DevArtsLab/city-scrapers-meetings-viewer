import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import BackLink from "@/components/BackLink";

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
        display: "grid",
        gridTemplateColumns: backHref ? "1fr auto 1fr" : "1fr",
        alignItems: "center",
        columnGap: 2,
        mb: 2,
      }}
    >
      {backHref && (
        <Box>
          <BackLink href={backHref} label={backLabel} />
        </Box>
      )}
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          gridColumn: backHref ? 2 : 1,
          justifySelf: "center",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
