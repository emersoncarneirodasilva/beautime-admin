export function getUserIdFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1]) // decodifica a parte do meio do JWT
    );

    return payload.id || null;
  } catch {
    return null;
  }
}
