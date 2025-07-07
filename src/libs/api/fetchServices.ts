import { Service } from "@/types";

export async function fetchServices(token: string): Promise<Service[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar serviços.");
  }

  return res.json();
}
