"use client";

import Alert from "@mui/material/Alert";
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
      <Stack
        direction="row"
        spacing={1}
        useFlexGap
        sx={{ mb: 2, alignItems: "center", flexWrap: "wrap" }}
      >
        <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
          Start date:
        </Typography>
        <DatePicker
          value={fromValue}
          onChange={(val: Dayjs | null) =>
            onDateFromChange(val ? val.format("YYYY-MM-DD") : "")
          }
          format="YYYY/MM/DD"
          slotProps={{ textField: { size: "small", sx: { width: 180 } } }}
        />
        <Typography variant="body2">to</Typography>
        <DatePicker
          value={toValue}
          minDate={fromValue ?? undefined}
          onChange={(val: Dayjs | null) =>
            onDateToChange(val ? val.format("YYYY-MM-DD") : "")
          }
          format="YYYY/MM/DD"
          slotProps={{
            textField: {
              size: "small",
              sx: { width: 180 },
              error: endDateIsBeforeStartDate,
            },
          }}
        />
        {endDateIsBeforeStartDate && (
          <Alert severity="error" sx={{ py: 0 }}>
            End date must be after start date
          </Alert>
        )}
        <Button size="small" onClick={onClear}>
          Clear
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
