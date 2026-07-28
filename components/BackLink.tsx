import MuiLink from "@mui/material/Link";
import NextLink from "@/components/NextLink";

function ArrowBackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

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
      <ArrowBackIcon />
      {label}
    </MuiLink>
  );
}
