export async function fetchSalonByAdmin(token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/me/salons`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar dados do salão:", errorData);
    throw new Error("Erro ao buscar informações do salão.");
  }

  return await res.json();
}
