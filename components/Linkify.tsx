import Box from "@mui/material/Box";
import type { ReactNode, MouseEvent } from "react";

const URL_REGEX = /https?:\/\/[^\s]+/g;
const TRAILING_PUNCTUATION_REGEX = /[),.;:!?'"]+$/;

function stopClickPropagation(event: MouseEvent) {
  event.stopPropagation();
}

/** Splits text on raw URLs and renders each one as a clickable link. */
export function linkifyText(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(URL_REGEX)) {
    const start = match.index ?? 0;
    let url = match[0];
    let end = start + url.length;

    const trailingMatch = url.match(TRAILING_PUNCTUATION_REGEX);
    if (trailingMatch) {
      url = url.slice(0, url.length - trailingMatch[0].length);
      end -= trailingMatch[0].length;
    }

    if (start > lastIndex) parts.push(text.slice(lastIndex, start));

    parts.push(
      <Box
        key={key++}
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopClickPropagation}
        sx={{ color: "primary.main" }}
      >
        {url}
      </Box>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}
