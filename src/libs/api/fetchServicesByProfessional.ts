import { ServicePreview } from "@/types";

export async function fetchServicesByProfessional(
  professionalId: string,
  token: string
): Promise<ServicePreview[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services-on-professionals/${professionalId}`,
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
    console.error("Erro ao buscar serviços do profissional:", errorData);
    throw new Error("Erro ao buscar serviços do profissional.");
  }

  const data = await res.json();

  return data.map((item: any) => ({
    associationId: item.id,
    id: item.service.id,
    name: item.service.name,
  }));
}
