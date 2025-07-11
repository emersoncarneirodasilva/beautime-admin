export async function fetchAppointmentHistory({
  token,
  page = 1,
  limit = 10,
  status,
}: {
  token: string;
  page?: number;
  limit?: number;
  status?: string;
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (status === "CANCELED" || status === "COMPLETED") {
    params.set("status", status);
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
