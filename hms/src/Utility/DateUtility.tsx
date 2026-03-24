import moment from "moment-timezone";

// Format only date in India's timezone (IST)
const formateDate = (
  dateString: string | Date | null | undefined,
): string | undefined => {
  if (!dateString) return;

  const date = moment.utc(dateString);
  if (!date.isValid()) return;

  return date.tz("Asia/Kolkata").format("DD/MM/YYYY");
};

// Format date + time in India's timezone (IST)
const formatDateWithTime = (dateString: any) => {
  if (!dateString) return undefined;

  const date = moment.utc(dateString);
  if (!date.isValid()) return undefined;

  return date.tz("Asia/Kolkata").format("dddd, D MMMM YYYY [at] h:mm A");
};

// Extract time in 12-hour format in India's timezone (IST)
const extractTimeIn12HourFormat = (dateString: any) => {
  if (!dateString) return undefined;

  const date = moment.utc(dateString);
  if (!date.isValid()) return undefined;

  return date.tz("Asia/Kolkata").format("h:mm A");
};

export { formateDate, formatDateWithTime, extractTimeIn12HourFormat };
