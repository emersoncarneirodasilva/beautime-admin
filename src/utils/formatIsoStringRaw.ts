export function formatIsoStringRaw(isoString: string) {
  const [date, time] = isoString.split("T");
  const [year, month, day] = date.split("-");
  const [hour, minute] = time.split(":");

  return `${day}/${month}/${year} às ${hour}:${minute}`;
}
