import MuiLink from "@mui/material/Link";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NextLink from "@/components/NextLink";

interface BackLinkProps {
  /** Destination to navigate back to. */
  href: string;
  /** Label shown next to the arrow icon. */
  label: string;
}

/** Reusable "← Back to X" navigation link, e.g. for page headers. */
export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline="hover"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        flexShrink: 0,
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "primary.main",
      }}
    >
      <ArrowBack fontSize="small" />
      {label}
    </MuiLink>
  );
}
