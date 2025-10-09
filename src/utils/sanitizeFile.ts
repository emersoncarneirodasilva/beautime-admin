export function sanitizeFile(file: File): File {
  // Remove acentuação
  const normalized = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remove caracteres que não sejam letras, números, pontos ou underscores
  const safeName = normalized.replace(/[^a-zA-Z0-9.-]/g, "_");

  // Retorna um novo File com o nome seguro
  return new File([file], safeName, { type: file.type });
}
