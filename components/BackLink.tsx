import Button from "@mui/material/Button";
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
    <Button
      component={NextLink}
      href={href}
      variant="text"
      startIcon={<ArrowBack />}
      size="small"
      sx={{ whiteSpace: "nowrap" }}
    >
      {label}
    </Button>
  );
}
