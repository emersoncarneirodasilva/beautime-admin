export async function updateUserByAdmin(
  id: string,
  token: string,
  data: { name?: string; phone?: string }
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Falha ao atualizar usuário");
  }

  return res.json();
}
