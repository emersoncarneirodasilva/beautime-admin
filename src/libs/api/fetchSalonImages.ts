import { ImageType } from "@/types";

export async function fetchSalonImages({
  token,
  type,
  page = 1,
  limit = 10,
  search = "",
}: {
  token: string;
  type: "salon" | "professional" | "service";
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  images: ImageType[];
  total: number;
  totalPages: number;
  currentPage: number;
}> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    type,
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/images/salon?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("Erro ao buscar imagens:", await res.text());
    throw new Error("Falha ao buscar imagens.");
  }

  const data = await res.json();

  // aqui dizemos ao TS que data tem essa estrutura:
  return data as {
    images: ImageType[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
}
