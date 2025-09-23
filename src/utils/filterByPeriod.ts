export function filterByPeriod<T>(
  items: T[],
  type: "WEEK" | "MONTH" | "YEAR",
  value: string,
  dateField: keyof T
): T[] {
  return items.filter((item) => {
    const rawValue = item[dateField];
    if (!rawValue) return false;

    const date = new Date(String(rawValue));

    if (type === "WEEK") {
      const [year, week] = value.split("-W").map(Number);
      const firstDayOfYear = new Date(year, 0, 1);
      const dayOfYear =
        Math.floor(
          (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
        ) + 1;
      const currentWeek = Math.ceil(dayOfYear / 7);
      return date.getFullYear() === year && currentWeek === week;
    }

    if (type === "MONTH") {
      const [year, month] = value.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      return date >= startDate && date <= endDate;
    }

    if (type === "YEAR") {
      const year = Number(value);
      return date.getFullYear() === year;
    }

    return true;
  });
}
