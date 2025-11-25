import { ServiceOnProfessional } from "@/types";

export async function fetchServicesByProfessional(
  professionalId: string,
  token: string
): Promise<ServiceOnProfessional[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services-on-professionals/${professionalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["services-on-professionals"] },
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar serviços");
  }

  return await res.json();
}
