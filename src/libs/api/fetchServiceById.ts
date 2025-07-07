import { Service } from "@/types";

export async function fetchServiceById(
  token: string,
  id: string
): Promise<Service | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar serviço:", errorData);
    throw new Error("Erro ao buscar serviço.");
  }

  const data = await res.json();
  return data as Service;
}
