import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { linkifyText } from "./Linkify";

const MAX_LENGTH = 50;

interface TruncatedTextProps {
  text: string | null | undefined;
  maxLength?: number;
  wrap?: boolean;
  maxLines?: number;
}

export default function TruncatedText({
  text,
  maxLength = MAX_LENGTH,
  wrap = false,
  maxLines,
}: TruncatedTextProps) {
  if (!text) return <>—</>;

  const isTruncated = text.length > maxLength;

  if (wrap) {
    const box = (
      <Box
        sx={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          width: "100%",
          ...(maxLines && {
            display: "-webkit-box",
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
      >
        {isTruncated ? (
          <span
            style={{
              cursor: "pointer",
              borderBottom: "1px dashed currentColor",
              textDecorationSkipInk: "none",
            }}
          >
            {linkifyText(text)}
          </span>
        ) : (
          linkifyText(text)
        )}
      </Box>
    );

    if (!isTruncated) return box;

    return (
      <Tooltip
        title={
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-wrap", maxWidth: 320 }}
          >
            {linkifyText(text)}
          </Typography>
        }
        placement="top"
        arrow
        enterDelay={200}
        slotProps={TOOLTIP_SLOT_PROPS}
      >
        {box}
      </Tooltip>
    );
  }

  const inner = (
    <Box
      component="span"
      sx={{
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...(isTruncated && {
          cursor: "pointer",
          borderBottom: "1px dashed currentColor",
          textDecorationSkipInk: "none",
        }),
      }}
    >
      {linkifyText(text)}
    </Box>
  );

  if (!isTruncated) return inner;

  return (
    <Tooltip
      title={
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", maxWidth: 320 }}
        >
          {linkifyText(text)}
        </Typography>
      }
      placement="top"
      arrow
      enterDelay={200}
      slotProps={TOOLTIP_SLOT_PROPS}
    >
      {inner}
    </Tooltip>
  );
}

const TOOLTIP_SLOT_PROPS = {
  tooltip: {
    sx: {
      bgcolor: "background.paper",
      color: "text.primary",
      boxShadow: 3,
      border: "1px solid",
      borderColor: "divider",
      p: 1.5,
    },
  },
  arrow: {
    sx: {
      color: "background.paper",
      "&::before": {
        border: "1px solid",
        borderColor: "divider",
      },
    },
  },
};
