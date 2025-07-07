export async function deleteCategory(id: string, token: string): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao excluir categoria:", error);
    throw new Error("Erro ao excluir categoria.");
  }
}
