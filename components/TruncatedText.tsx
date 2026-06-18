import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

const MAX_LENGTH = 50;

interface TruncatedDescriptionProps {
  text: string | null | undefined;
  maxLength?: number;
}

export default function TruncatedDescription({
  text,
  maxLength = MAX_LENGTH,
}: TruncatedDescriptionProps) {
  if (!text) return <>—</>;

  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.slice(0, maxLength).trimEnd() + "…" : text;

  if (!isTruncated) return <>{displayText}</>;

  return (
    <Tooltip
      title={
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", maxWidth: 320 }}>
          {text}
        </Typography>
      }
      placement="top"
      arrow
      enterDelay={200}
      slotProps={{
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
      }}
    >
      <span
        style={{
          cursor: "pointer",
          borderBottom: "1px dashed currentColor",
          textDecorationSkipInk: "none",
        }}
      >
        {displayText}
      </span>
    </Tooltip>
  );
}