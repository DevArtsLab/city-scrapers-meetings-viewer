"use client";

import { useMemo, useState } from "react";
import type { MeetingRecord } from "@/lib/scrapers";
import { locationText, normalizeStatus } from "@/components/MeetingCard";

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "passed", label: "Passed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "tentative", label: "Tentative" },
];

export interface MeetingFiltersState {
  search: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  setSearch: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  clearDates: () => void;
  filteredRecords: MeetingRecord[];
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
export function useMeetingFilters(
  records: MeetingRecord[]
): MeetingFiltersState {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (r) => normalizeStatus(r.status) === statusFilter
      );
    }

    // Date filtering: include meetings that start or end within the selected date range
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
        [
          r.title,
          r.description,
          r.classification,
          r.time_notes,
          r.status,
          locationText(r),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }

    return filtered;
  }, [records, search, statusFilter, dateFrom, dateTo]);

  return {
    search,
    statusFilter,
    dateFrom,
    dateTo,
    setSearch,
    setStatusFilter,
    setDateFrom,
    setDateTo,
    clearDates: () => {
      setDateFrom("");
      setDateTo("");
    },
    filteredRecords,
  };
}
