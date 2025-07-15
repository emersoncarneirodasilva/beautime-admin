export async function fetchAppointmentHistory({
  token,
  page = 1,
  limit = 10,
  status,
  search,
}: {
  token: string;
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (status === "CANCELED" || status === "COMPLETED") {
    params.set("status", status);
  }

  if (search && search.trim().length > 0) {
    params.set("search", search.trim());
  }

  const url = `${
    process.env.NEXT_PUBLIC_API_URL
  }/appointment-history?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao buscar histórico:", error);
    throw new Error("Falha ao buscar histórico.");
  }

  return res.json();
}
