import { Availability } from "@/types";

export async function fetchAvailabilityByProfessional(
  professionalId: string,
  token: string
): Promise<Availability[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/availability/${professionalId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar disponibilidades do profissional.");
  }

  const data = await res.json();
  return data as Availability[];
}
