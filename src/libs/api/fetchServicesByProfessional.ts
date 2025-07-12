import { Service } from "@/types";

export async function fetchServicesByProfessional(
  professionalId: string,
  token: string
): Promise<Service[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services-on-professionals/${professionalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar serviços");
  }

  const data: Service[] = await res.json();
  return data;
}
