export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  retries = 2,
  delayMs = 500
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchFn();
    } catch (err) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        throw err;
      }
    }
  }
  throw new Error("Fetch failed after retries");
}
