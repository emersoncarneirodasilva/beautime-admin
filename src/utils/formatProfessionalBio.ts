const bioContentSeparator = /\s*\|\s*Bio:\s*/i;

export function formatProfessionalBio(bio: string | null | undefined): string {
  if (!bio) return "";

  const separator = bioContentSeparator.exec(bio);

  return separator
    ? bio.slice(separator.index + separator[0].length).trim()
    : bio.trim();
}
