"use client";

import { useMemo, useState } from "react";
import type { MeetingRecord } from "@/lib/scrapers";
import { locationText, normalizeStatus } from "@/lib/meetings";
import { buildDuplicateGroups, type DuplicateInfo } from "@/lib/duplicates";

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "tentative", label: "Tentative" },
  { value: "duplicates", label: "Duplicates" },
];

export const SEARCH_FIELD_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
  { value: "time_notes", label: "Time Notes" },
  { value: "location", label: "Location" },
  { value: "source", label: "Source" },
] as const;

export type SearchField = (typeof SEARCH_FIELD_OPTIONS)[number]["value"];

export interface MeetingFiltersState {
  search: string;
  searchField: SearchField;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  setSearch: (value: string) => void;
  setSearchField: (value: SearchField) => void;
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  clearDates: () => void;
  filteredRecords: MeetingRecord[];
  duplicateInfoMap: Map<MeetingRecord, DuplicateInfo>;
}

// Convert "YYYY-MM-DD" to Date object in local time
function parseLocalDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Owns the search / status / date-range filter state and applies it to the
 * given records. Lifted out of the table so the filter controls can live in
 * the FiltersPanel while the table only receives the filtered result.
 */

function getFieldValue(record: MeetingRecord, field: SearchField): string {
  switch (field) {
    case "title":
      return record.title ?? "";
    case "description":
      return record.description ?? "";
    case "time_notes":
      return record.time_notes ?? "";
    case "location":
      return locationText(record) ?? "";
    case "source":
      return record.source ?? "";
    default:
      return "";
  }
}

// "no name" / "no address" to find records missing that part, in addition to
// normal substring matching against the actual name/address text.
function matchesLocationQuery(record: MeetingRecord, query: string): boolean {
  const name = record.location?.name?.trim() ?? "";
  const address = record.location?.address?.trim() ?? "";
  const isMissingName = name === "";
  const isMissingAddress = address === "";

  if (isMissingName && "no name".startsWith(query)) return true;
  if (isMissingAddress && "no address".startsWith(query)) return true;

  return [name, address]
    .filter(Boolean)
    .join(", ")
    .toLowerCase()
    .includes(query);
}

export function useMeetingFilters(
  records: MeetingRecord[]
): MeetingFiltersState {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState<SearchField>("title");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const duplicateInfoMap = useMemo(() => {
    const info = buildDuplicateGroups(records);
    return new Map(records.map((r, i) => [r, info[i]]));
  }, [records]);
  const duplicateSet = useMemo(
    () => new Set(records.filter((r) => duplicateInfoMap.get(r)!.isDuplicate)),
    [records, duplicateInfoMap]
  );

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = records;

    if (statusFilter === "duplicates") {
      filtered = filtered.filter((r) => duplicateSet.has(r));
    } else if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => normalizeStatus(r.status) === statusFilter
      );
    }

    if (dateFrom || dateTo) {
      const from = parseLocalDate(dateFrom);
      const toDate = parseLocalDate(dateTo) ?? (from ? new Date(from) : null);
      if (toDate) toDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((r) => {
        const isWithinDateRange = (dateStr: string | undefined) => {
          if (!dateStr) return false;
          const meetingDate = new Date(dateStr);
          if (isNaN(meetingDate.getTime())) return false;
          if (from && meetingDate < from) return false;
          if (toDate && meetingDate > toDate) return false;
          return true;
        };
        return isWithinDateRange(r.start) || isWithinDateRange(r.end);
      });
    }

    if (query) {
      filtered = filtered.filter((r) =>
        searchField === "location"
          ? matchesLocationQuery(r, query)
          : getFieldValue(r, searchField).toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [
    records,
    search,
    searchField,
    statusFilter,
    dateFrom,
    dateTo,
    duplicateSet,
  ]);

  return {
    search,
    searchField,
    statusFilter,
    dateFrom,
    dateTo,
    setSearch,
    setSearchField,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    clearDates: () => {
      setDateFrom("");
      setDateTo("");
    },
    filteredRecords,
    duplicateInfoMap,
  };
}
