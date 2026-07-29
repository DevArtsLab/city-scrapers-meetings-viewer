import Box from "@mui/material/Box";
import type { ReactNode } from "react";

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
