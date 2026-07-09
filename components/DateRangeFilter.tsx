"use client";

import { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Typography } from "@mui/material";
import { CalendarIcon } from "@mui/x-date-pickers";

interface DateRangeFilterProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClear: () => void;
}

const DISPLAY_FORMAT = "YYYY/MM/DD";

interface DateFieldProps {
  label: string;
  value: string; // canonical "YYYY-MM-DD" or ""
  onChange: (value: string) => void;
  minDate?: Dayjs;
  externalError?: boolean;
}

function DateField({
  label,
  value,
  onChange,
  minDate,
  externalError,
}: DateFieldProps) {
  const displayFor = (v: string) => (v ? dayjs(v).format(DISPLAY_FORMAT) : "");

  const [prevValue, setPrevValue] = useState(value);
  const [text, setText] = useState(displayFor(value));
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setText(displayFor(value));
    setTouched(false);
  }

  const parsed = text.trim() ? dayjs(text.trim(), DISPLAY_FORMAT, true) : null;
  const isInvalid =
    touched && text.trim() !== "" && !(parsed && parsed.isValid());

  // Strips everything but digits, then re-inserts "/" at the right spots as you type
  function autoFormatDate(raw: string): string {
    const digits = raw.replace(/\D/g, "").slice(0, 8); // YYYYMMDD, max 8 digits
    const year = digits.slice(0, 4);
    const month = digits.slice(4, 6);
    const day = digits.slice(6, 8);

    if (digits.length <= 4) return year;
    if (digits.length <= 6) return `${year}/${month}`;
    return `${year}/${month}/${day}`;
  }

  const handleTextChange = (raw: string) => {
    // Only auto-format when the user is adding characters (typing digits),
    // not deleting — otherwise backspace fights the inserted "/" characters.
    const formatted = raw.length > text.length ? autoFormatDate(raw) : raw;

    setText(formatted);
    if (!formatted.trim()) {
      onChange("");
      return;
    }
    const result = dayjs(formatted.trim(), DISPLAY_FORMAT, true);
    if (result.isValid()) {
      onChange(result.format("YYYY-MM-DD"));
    }
  };

  return (
    <Box ref={setAnchorEl} sx={{ position: "relative" }}>
      <TextField
        label={label}
        size="small"
        fullWidth
        placeholder={DISPLAY_FORMAT.toLowerCase()}
        value={text}
        error={externalError || isInvalid}
        helperText={isInvalid ? `Use format ${DISPLAY_FORMAT}` : undefined}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={() => setTouched(true)}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label={`Open ${label.toLowerCase()} calendar`}
                  onClick={() => setOpen((prev) => !prev)}
                  edge="end"
                >
                  <CalendarIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Paper elevation={3}>
            <DateCalendar
              value={value ? dayjs(value) : null}
              minDate={minDate}
              onChange={(val: Dayjs | null) => {
                if (val && val.isValid()) {
                  onChange(val.format("YYYY-MM-DD"));
                }
                setOpen(false);
              }}
            />
          </Paper>
        </ClickAwayListener>
      </Popper>
    </Box>
  );
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
      <Stack spacing={1.5}>
        <DateField
          label="Start date"
          value={dateFrom}
          onChange={onDateFromChange}
        />
        <DateField
          label="End date"
          value={dateTo}
          onChange={onDateToChange}
          minDate={fromValue ?? undefined}
          externalError={endDateIsBeforeStartDate}
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
        {endDateIsBeforeStartDate && (
          <Alert severity="error" sx={{ py: 0 }}>
            End date must be after start date
          </Alert>
        )}
        <Button size="small" onClick={onClear} sx={{ alignSelf: "flex-start" }}>
          Clear Dates
        </Button>
      </Stack>
    </LocalizationProvider>
  );
}
