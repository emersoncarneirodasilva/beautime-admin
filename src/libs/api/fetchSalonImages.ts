export type ImageType = {
  id: string;
  url: string;
  type: string;
  uploadedAt: string;
  salonId: string;
  professionalId: string | null;
  serviceId: string | null;
};

export async function fetchSalonImages(token: string): Promise<ImageType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/salon`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Erro ao buscar imagens:", await res.text());
    throw new Error("Falha ao buscar imagens.");
  }

  return res.json();
}
