import Box from "@mui/material/Box";
import type { ReactNode, MouseEvent } from "react";

const URL_REGEX = /https?:\/\/[^\s]+/g;
const TRAILING_PUNCTUATION_REGEX = /[.,;:!?'"]+$/;

function stopClickPropagation(event: MouseEvent) {
  event.stopPropagation();
}

/**
 * Trims sentence punctuation a URL regex match can accidentally swallow.
 * Closing parens are only trimmed when unbalanced, so URLs that legitimately
 * end in one (e.g. Wikipedia disambiguation links) keep it.
 */
function trimTrailingPunctuation(url: string): string {
  const punctuationMatch = url.match(TRAILING_PUNCTUATION_REGEX);
  if (punctuationMatch) {
    url = url.slice(0, url.length - punctuationMatch[0].length);
  }

  while (url.endsWith(")")) {
    const opens = (url.match(/\(/g) ?? []).length;
    const closes = (url.match(/\)/g) ?? []).length;
    if (closes <= opens) break;
    url = url.slice(0, -1);
  }

  return url;
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

    const trimmedUrl = trimTrailingPunctuation(url);
    end -= url.length - trimmedUrl.length;
    url = trimmedUrl;

    if (start > lastIndex) parts.push(text.slice(lastIndex, start));

    parts.push(
      <Box
        key={key++}
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={stopClickPropagation}
        sx={{
          color: "primary.main",
          wordBreak: "break-all",
          overflowWrap: "anywhere",
        }}
      >
        {url}
      </Box>
    );

    lastIndex = end;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return parts;
}

/**
 * Wraps case-insensitive matches of `query` in each plain-string node with a
 * <mark>, leaving already-rendered nodes (e.g. linkifyText's links) untouched.
 */
export function highlightMatches(
  nodes: ReactNode[],
  query: string
): ReactNode[] {
  const trimmed = query.trim();
  if (!trimmed) return nodes;

  const lowerQuery = trimmed.toLowerCase();
  const result: ReactNode[] = [];
  let key = 0;

  for (const node of nodes) {
    if (typeof node !== "string") {
      result.push(node);
      continue;
    }

    const lower = node.toLowerCase();
    let lastIndex = 0;
    let idx = lower.indexOf(lowerQuery);

    if (idx === -1) {
      result.push(node);
      continue;
    }

    while (idx !== -1) {
      if (idx > lastIndex) result.push(node.slice(lastIndex, idx));

      result.push(
        <Box
          key={`highlight-${key++}`}
          component="mark"
          sx={{
            bgcolor: "#ffd54f",
            color: "#1a1a1a",
            borderRadius: "2px",
            px: "1px",
          }}
        >
          {node.slice(idx, idx + trimmed.length)}
        </Box>
      );

      lastIndex = idx + trimmed.length;
      idx = lower.indexOf(lowerQuery, lastIndex);
    }

    if (lastIndex < node.length) result.push(node.slice(lastIndex));
  }

  return result;
}
