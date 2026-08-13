import Link from "@mui/material/Link";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NextLink from "@/components/ui/NextLink";

interface BackLinkProps {
  /** Destination to navigate back to. */
  href: string;
  /** Label shown next to the arrow icon. */
  label: string;
}

/** Reusable "← Back to X" navigation link, e.g. for page headers. */
export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      component={NextLink}
      href={href}
      underline="none"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.7,
        whiteSpace: "nowrap",
        padding: "0.2rem 0.5rem 0.3rem 0.3rem",
        borderRadius: 1,
      }}
    >
      <ArrowBack aria-hidden fontSize="small" />
      {label}
    </Link>
  );
}
