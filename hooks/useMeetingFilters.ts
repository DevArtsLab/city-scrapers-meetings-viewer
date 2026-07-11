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

export const SEARCH_FIELD_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "description", label: "Description" },
  { value: "time_notes", label: "Time Notes" },
  { value: "location", label: "Location" },
  { value: "source", label: "Source" },
];

export interface MeetingFiltersState {
  search: string;
  searchField: string;
  statusFilter: string;
  dateFrom: string;
  dateTo: string;
  setSearch: (value: string) => void;
  setSearchField: (value: string) => void;
  setStatusFilter: (value: string) => void;
  setDateFrom: (value: string) => void;
  setDateTo: (value: string) => void;
  clearDates: () => void;
  filteredRecords: MeetingRecord[];
}

function parseLocalDate(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  const date = new Date(y, m - 1, d, 0, 0, 0, 0);
  return isNaN(date.getTime()) ? null : date;
}

function getFieldValue(record: MeetingRecord, field: string): string {
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
  const q = query.trim().toLowerCase();

  const isMissingName = name === "";
  const isMissingAddress = address === "";

  if (isMissingName && "no name".startsWith(q)) return true;
  if (isMissingAddress && "no address".startsWith(q)) return true;

  return [name, address].filter(Boolean).join(", ").toLowerCase().includes(q);
}

export function useMeetingFilters(
  records: MeetingRecord[]
): MeetingFiltersState {
  const [search, setSearch] = useState("");
  const [searchField, setSearchField] = useState("title");
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
  }, [records, search, searchField, statusFilter, dateFrom, dateTo]);

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
  };
}
