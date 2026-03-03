import moment from "moment";

/** Normalize API date (Date | string | { toDate(): Date }) to moment and format */
export const convertFBTimestamp = (
  timestamp: Date | string | { toDate?: () => Date },
  format: string
): string => {
  if (!timestamp) return "";
  const date =
    typeof timestamp === "object" && timestamp !== null && "toDate" in timestamp && typeof (timestamp as { toDate: () => Date }).toDate === "function"
      ? (timestamp as { toDate: () => Date }).toDate()
      : timestamp instanceof Date
        ? timestamp
        : new Date(timestamp as string);
  return moment(date).format(format);
};

// Formatting Functions
export const formatDate = (
  date: Date | string | moment.Moment,
  format: string = "YYYY-MM-DD"
): string => {
  return moment(date).format(format);
};

export const formatDateTime = (
  date: Date | string | moment.Moment,
  format: string = "YYYY-MM-DD HH:mm:ss"
): string => {
  return moment(date).format(format);
};

export const formatTime = (
  date: Date | string | moment.Moment,
  format: string = "HH:mm:ss"
): string => {
  return moment(date).format(format);
};

export const formatRelativeTime = (
  date: Date | string | moment.Moment
): string => {
  return moment(date).fromNow();
};

/**
 * Returns a human-readable "time ago" string: "just now", "1 minute ago", "2 hours ago", "1 day ago", "1 month ago", "2 years ago".
 */
export const getTimeAgo = (date: Date | string | null | undefined): string => {
  if (date == null || date === "") return "N/A";
  const m = moment(typeof date === "string" ? date : date);
  if (!m.isValid()) return "N/A";
  const now = moment();
  const seconds = now.diff(m, "seconds");
  if (seconds < 60) return "just now";
  const minutes = now.diff(m, "minutes");
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  const hours = now.diff(m, "hours");
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = now.diff(m, "days");
  if (days < 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  const months = now.diff(m, "months");
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"} ago`;
  const years = now.diff(m, "years");
  return `${years} ${years === 1 ? "year" : "years"} ago`;
};

export const formatDateForDisplay = (
  date: Date | string | moment.Moment
): string => {
  return moment(date).format("MMM DD, YYYY");
};

export const formatDateTimeForDisplay = (
  date: Date | string | moment.Moment
): string => {
  return moment(date).format("MMM DD, YYYY HH:mm");
};

export const formatTimeForDisplay = (
  date: Date | string | moment.Moment
): string => {
  return moment(date).format("HH:mm");
};

// Parsing Functions
export const parseDate = (
  dateString: string,
  format?: string
): moment.Moment => {
  return format ? moment(dateString, format) : moment(dateString);
};

export const parseISODate = (dateString: string): moment.Moment => {
  return moment(dateString);
};

export const parseUnixTimestamp = (timestamp: number): moment.Moment => {
  return moment.unix(timestamp);
};

// Validation Functions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isValidDate = (date: any): boolean => {
  return moment(date).isValid();
};

export const isFutureDate = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isAfter(moment());
};

export const isPastDate = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isBefore(moment());
};

export const isToday = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isSame(moment(), "day");
};

export const isYesterday = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isSame(moment().subtract(1, "day"), "day");
};

export const isThisWeek = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isSame(moment(), "week");
};

export const isThisMonth = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isSame(moment(), "month");
};

export const isThisYear = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isSame(moment(), "year");
};

// Manipulation Functions
export const addDays = (
  date: Date | string | moment.Moment,
  days: number
): moment.Moment => {
  return moment(date).add(days, "days");
};

export const subtractDays = (
  date: Date | string | moment.Moment,
  days: number
): moment.Moment => {
  return moment(date).subtract(days, "days");
};

export const addMonths = (
  date: Date | string | moment.Moment,
  months: number
): moment.Moment => {
  return moment(date).add(months, "months");
};

export const subtractMonths = (
  date: Date | string | moment.Moment,
  months: number
): moment.Moment => {
  return moment(date).subtract(months, "months");
};

export const addYears = (
  date: Date | string | moment.Moment,
  years: number
): moment.Moment => {
  return moment(date).add(years, "years");
};

export const subtractYears = (
  date: Date | string | moment.Moment,
  years: number
): moment.Moment => {
  return moment(date).subtract(years, "years");
};

export const startOfDay = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).startOf("day");
};

export const endOfDay = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).endOf("day");
};

export const startOfWeek = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).startOf("week");
};

export const endOfWeek = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).endOf("week");
};

export const startOfMonth = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).startOf("month");
};

export const endOfMonth = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).endOf("month");
};

export const startOfYear = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).startOf("year");
};

export const endOfYear = (
  date: Date | string | moment.Moment
): moment.Moment => {
  return moment(date).endOf("year");
};

// Comparison Functions
export const isSameDay = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): boolean => {
  return moment(date1).isSame(moment(date2), "day");
};

export const isSameMonth = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): boolean => {
  return moment(date1).isSame(moment(date2), "month");
};

export const isSameYear = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): boolean => {
  return moment(date1).isSame(moment(date2), "year");
};

export const isBefore = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): boolean => {
  return moment(date1).isBefore(moment(date2));
};

export const isAfter = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): boolean => {
  return moment(date1).isAfter(moment(date2));
};

export const isBetween = (
  date: Date | string | moment.Moment,
  startDate: Date | string | moment.Moment,
  endDate: Date | string | moment.Moment,
  unit: moment.unitOfTime.StartOf = "day"
): boolean => {
  return moment(date).isBetween(moment(startDate), moment(endDate), unit, "[]");
};

// Calculation Functions
export const getDaysDifference = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): number => {
  return moment(date1).diff(moment(date2), "days");
};

export const getMonthsDifference = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): number => {
  return moment(date1).diff(moment(date2), "months");
};

export const getYearsDifference = (
  date1: Date | string | moment.Moment,
  date2: Date | string | moment.Moment
): number => {
  return moment(date1).diff(moment(date2), "years");
};

export const getAge = (birthDate: Date | string | moment.Moment): number => {
  return moment().diff(moment(birthDate), "years");
};

// Range Functions
export const getDateRange = (
  startDate: Date | string | moment.Moment,
  endDate: Date | string | moment.Moment
): moment.Moment[] => {
  const start = moment(startDate);
  const end = moment(endDate);
  const dates: moment.Moment[] = [];

  const current = start.clone();
  while (current.isSameOrBefore(end)) {
    dates.push(current.clone());
    current.add(1, "day");
  }

  return dates;
};

export const getWeekRange = (
  date: Date | string | moment.Moment
): { start: moment.Moment; end: moment.Moment } => {
  const momentDate = moment(date);
  return {
    start: momentDate.clone().startOf("week"),
    end: momentDate.clone().endOf("week"),
  };
};

export const getMonthRange = (
  date: Date | string | moment.Moment
): { start: moment.Moment; end: moment.Moment } => {
  const momentDate = moment(date);
  return {
    start: momentDate.clone().startOf("month"),
    end: momentDate.clone().endOf("month"),
  };
};

// Utility Functions
export const getCurrentDate = (): moment.Moment => {
  return moment();
};

export const getCurrentTimestamp = (): number => {
  return moment().valueOf();
};

export const getUnixTimestamp = (
  date: Date | string | moment.Moment
): number => {
  return moment(date).unix();
};

export const getDayOfWeek = (date: Date | string | moment.Moment): number => {
  return moment(date).day();
};

export const getDayName = (date: Date | string | moment.Moment): string => {
  return moment(date).format("dddd");
};

export const getMonthName = (date: Date | string | moment.Moment): string => {
  return moment(date).format("MMMM");
};

export const getQuarter = (date: Date | string | moment.Moment): number => {
  return moment(date).quarter();
};

export const isLeapYear = (date: Date | string | moment.Moment): boolean => {
  return moment(date).isLeapYear();
};

export const getDaysInMonth = (date: Date | string | moment.Moment): number => {
  return moment(date).daysInMonth();
};

// Business Logic Functions
export const isBusinessDay = (date: Date | string | moment.Moment): boolean => {
  const day = moment(date).day();
  return day !== 0 && day !== 6; // Sunday = 0, Saturday = 6
};

export const getNextBusinessDay = (
  date: Date | string | moment.Moment
): moment.Moment => {
  let nextDay = moment(date).add(1, "day");
  while (!isBusinessDay(nextDay)) {
    nextDay = nextDay.add(1, "day");
  }
  return nextDay;
};

export const getPreviousBusinessDay = (
  date: Date | string | moment.Moment
): moment.Moment => {
  let prevDay = moment(date).subtract(1, "day");
  while (!isBusinessDay(prevDay)) {
    prevDay = prevDay.subtract(1, "day");
  }
  return prevDay;
};

// Duration Functions
export const formatDuration = (milliseconds: number): string => {
  return moment.duration(milliseconds).humanize();
};

export const formatDurationDetailed = (milliseconds: number): string => {
  const duration = moment.duration(milliseconds);
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};
