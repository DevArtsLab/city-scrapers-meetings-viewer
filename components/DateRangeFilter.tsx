"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear: () => void;
}

const DISPLAY_FORMAT = "YYYY/MM/DD";

export default function DateRangeFilter({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClear,
}: DateRangeFilterProps) {
  const fromValue = dateFrom ? dayjs(dateFrom) : null;
  const toValue = dateTo ? dayjs(dateTo) : null;
  const endDateIsBeforeStartDate =
    fromValue !== null && toValue !== null && toValue.isBefore(fromValue);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={1.5}>
        <DatePicker
          label="Start date"
          value={fromValue}
          onChange={(val: Dayjs | null) =>
            onDateFromChange(val ? val.format("YYYY-MM-DD") : "")
          }
          format={DISPLAY_FORMAT}
          slotProps={{
            field: { clearable: true },
            textField: { size: "small", fullWidth: true },
          }}
        />
        <DatePicker
          label="End date"
          value={toValue}
          minDate={fromValue ?? undefined}
          onChange={(val: Dayjs | null) =>
            onDateToChange(val ? val.format("YYYY-MM-DD") : "")
          }
          format={DISPLAY_FORMAT}
          slotProps={{
            field: { clearable: true },
            textField: {
              size: "small",
              fullWidth: true,
              error: endDateIsBeforeStartDate,
              helperText: endDateIsBeforeStartDate
                ? "End date must be after start date"
                : undefined,
            },
          }}
        />
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "block",
            fontSize: "0.80rem",
            lineHeight: 1.3,
          }}
        >
          Without an end date, only exact date matches are shown
        </Typography>
        <Button size="small" onClick={onClear} sx={{ alignSelf: "flex-start" }}>
          Clear Dates
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
