import { ImageType } from "@/types";

export async function fetchProfessionalImages(
  professionalId: string,
  token: string
): Promise<ImageType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/images/professional/${professionalId}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Erro ao buscar imagens do profissional:", await res.text());
    throw new Error("Falha ao buscar imagens do profissional.");
  }

  const data = await res.json();
  return data as ImageType[];
}
