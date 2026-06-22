import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface LinkWithTooltipProps {
  href: string;
  label?: string;
  tooltipText?: string;
}

export default function LinkWithTooltip({ href, label }: LinkWithTooltipProps) {
  const displayLabel = label || href;

  return (
    <Tooltip
      title={
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          {href}
        </Typography>
      }
      placement="right"
      enterDelay={200}
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -5],
              },
            },
          ],
        },
        tooltip: {
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 3,
            border: "1px solid",
            borderColor: "divider",
            p: 0.5,
            maxWidth: "none",
            width: "fit-content",
          },
        },
      }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: "inline-block", color: "#1976d2" }}
      >
        {displayLabel}
      </a>
    </Tooltip>
  );
}
