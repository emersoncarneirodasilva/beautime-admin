export async function deleteImageById(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao excluir imagem:", error);
    throw new Error("Erro ao excluir imagem");
  }
}
