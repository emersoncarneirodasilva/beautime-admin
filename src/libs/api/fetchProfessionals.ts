export async function fetchProfessionals({
  token,
  page = 1,
  limit = 10,
  search,
}: {
  token: string;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.append("search", search);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/professionals?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { tags: ["professionals"] },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar profissionais:", errorData);
    throw new Error("Erro ao buscar profissionais.");
  }

  return res.json();
}
