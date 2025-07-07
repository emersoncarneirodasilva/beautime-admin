export function isValidUrl(url?: string | null): boolean {
  if (!url || url.trim() === "") return true; // vazio é válido (campo opcional)

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
