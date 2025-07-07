export async function updateProfessionalRequest(
  id: string,
  data: {
    name: string;
    email: string;
    phone: string | null;
    bio: string | null;
    avatarUrl: string | null;
  },
  token: string
): Promise<void> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/professionals/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao atualizar profissional:", errorData);
    throw new Error("Erro ao atualizar profissional.");
  }
}
