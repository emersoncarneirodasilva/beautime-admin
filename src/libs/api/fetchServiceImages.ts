import { ImageType } from "@/types";

export async function fetchServiceImages(
  serviceId: string,
  token: string
): Promise<ImageType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/images/service/${serviceId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Erro ao buscar imagens do serviço:", await res.text());
    throw new Error("Falha ao buscar imagens do serviço.");
  }

  const data = await res.json();
  return data as ImageType[];
}
