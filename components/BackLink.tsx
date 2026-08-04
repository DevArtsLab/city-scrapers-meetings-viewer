import Button from "@mui/material/Button";
import ArrowBack from "@mui/icons-material/ArrowBack";
import NextLink from "@/components/NextLink";

interface BackLinkProps {
  /** Destination to navigate back to. */
  href: string;
  /** Label shown next to the arrow icon. */
  label: string;
  /** Button size. */
  size?: "small" | "medium" | "large";
}

/** Reusable "← Back to X" navigation link, e.g. for page headers. */
export default function BackLink({
  href,
  label,
  size = "small",
}: BackLinkProps) {
  return (
    <Button
      component={NextLink}
      href={href}
      startIcon={<ArrowBack aria-hidden />}
      variant="text"
      size={size}
      sx={{ textTransform: "none", whiteSpace: "nowrap" }}
    >
      {label}
    </Button>
  );
}
