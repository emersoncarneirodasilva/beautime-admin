export async function fetchProfessionals(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professionals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar profissionais:", errorData);
    throw new Error("Erro ao buscar profissionais.");
  }

  return await res.json();
}
