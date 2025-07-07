export function getFirstName(fullName: string | undefined): string {
  if (!fullName) return "";

  return fullName.trim().split(/\s+/)[0];
}
