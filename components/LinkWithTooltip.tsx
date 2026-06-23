import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { ReactNode } from "react";

interface LinkWithTooltipProps {
  href: string;
  label?: ReactNode;
}

export default function LinkWithTooltip({ href, label }: LinkWithTooltipProps) {
  const displayLabel: ReactNode = label || (
    <Typography
      component="span"
      sx={{ color: "error.main", fontSize: "inherit" }}
    >
      No title
    </Typography>
  );

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
                offset: [0, -3],
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
      <Box
        component="a"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "inline-block",
          color: "primary.main",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: 95,
          verticalAlign: "top",
        }}
      >
        {displayLabel}
      </Box>
    </Tooltip>
  );
}
