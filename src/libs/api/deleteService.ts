export async function deleteServiceRequest(
  id: string,
  token: string
): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao excluir serviço:", errorData);
    throw new Error("Erro ao excluir serviço.");
  }
}
