import type { MeetingRecord } from "@/components/scrapers/lib/scrapers";

const GENERIC_WORDS = new Set([
  "the",
  "a",
  "an",
  "of",
  "and",
  "or",
  "in",
  "at",
  "for",
  "to",
  "by",
  "regular",
  "special",
  "called",
  "emergency",
  "meeting",
  "session",
  "workshop",
  "hearing",
]);

function significantWords(title: string): Set<string> {
  return new Set(
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0 && !GENERIC_WORDS.has(w))
  );
}

export function titlesAreSimilar(a: string, b: string): boolean {
  const na = a.trim().toLowerCase().replace(/\s+/g, " ");
  const nb = b.trim().toLowerCase().replace(/\s+/g, " ");

  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  const wa = significantWords(a);
  const wb = significantWords(b);
  if (wa.size === 0 || wb.size === 0) return false;

  const [shorter, longer] = wa.size <= wb.size ? [wa, wb] : [wb, wa];
  return [...shorter].every((w) => longer.has(w));
}

export interface DuplicateInfo {
  isDuplicate: boolean;
  isFirst: boolean;
  count: number;
  groupIndex: number;
}

/**
 * Generates a unique highlight color for a given duplicate count using the
 * golden angle (≈137.5°). Each count maps to a distinct hue — no palette needed.
 *   ×2 → hue   0° (red),  ×3 → 138° (green),  ×4 → 275° (violet),
 *   ×5 → 53°  (amber),   ×6 → 190° (teal),    ×7 → 328° (pink), …
 */
export function colorForDuplicateCount(count: number): {
  bg: string;
  bgHover: string;
  border: string;
} {
  const hue = Math.round(((count - 2) * 137.508) % 360);
  return {
    bg: `hsla(${hue}, 55%, 50%, 0.07)`,
    bgHover: `hsla(${hue}, 55%, 50%, 0.13)`,
    border: `hsla(${hue}, 55%, 50%, 0.30)`,
  };
}

export function buildDuplicateGroups(
  records: MeetingRecord[]
): DuplicateInfo[] {
  const n = records.length;

  // Union-Find
  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x: number): number {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression
      x = parent[x];
    }
    return x;
  }
  function union(x: number, y: number) {
    parent[find(x)] = find(y);
  }

  // Group indices by start time, then union similar titles within each group
  const byStart = new Map<string, number[]>();
  for (let i = 0; i < n; i++) {
    const s = records[i].start.trim();
    if (!byStart.has(s)) byStart.set(s, []);
    byStart.get(s)!.push(i);
  }
  for (const indices of byStart.values()) {
    for (let ii = 0; ii < indices.length; ii++) {
      for (let jj = ii + 1; jj < indices.length; jj++) {
        if (
          titlesAreSimilar(
            records[indices[ii]].title,
            records[indices[jj]].title
          )
        ) {
          union(indices[ii], indices[jj]);
        }
      }
    }
  }

  // Count how many records share each root
  const groupSizes = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    groupSizes.set(root, (groupSizes.get(root) ?? 0) + 1);
  }

  // Assign sequential color indices only to groups with more than one record
  const rootToGroupIndex = new Map<number, number>();
  let groupCounter = 0;
  for (let i = 0; i < n; i++) {
    const root = find(i);
    if ((groupSizes.get(root) ?? 0) > 1 && !rootToGroupIndex.has(root)) {
      rootToGroupIndex.set(root, groupCounter++);
    }
  }

  // Count records per color group (for the ×N badge)
  const groupCount = new Map<number, number>();
  for (let i = 0; i < n; i++) {
    const gi = rootToGroupIndex.get(find(i)) ?? -1;
    if (gi >= 0) groupCount.set(gi, (groupCount.get(gi) ?? 0) + 1);
  }

  // Build per-record result
  const firstInGroup = new Set<number>();
  return records.map((_, i) => {
    const groupIndex = rootToGroupIndex.get(find(i)) ?? -1;
    if (groupIndex < 0)
      return { isDuplicate: false, isFirst: false, count: 1, groupIndex: -1 };
    const isFirst = !firstInGroup.has(groupIndex);
    if (isFirst) firstInGroup.add(groupIndex);
    return {
      isDuplicate: true,
      isFirst,
      count: groupCount.get(groupIndex)!,
      groupIndex,
    };
  });
}
