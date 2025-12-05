export function formatIsoWithTimezone(isoString: string) {
  const date = new Date(isoString);

  // Ajuste fixo UTC → UTC-3 (São Paulo)
  date.setUTCHours(date.getUTCHours() - 3);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} às ${hours}:${minutes}`;
}
