import { Category } from "@/types";

export async function fetchCategories(
  token: string,
  search?: string,
  page: number = 1,
  limit: number = 10
): Promise<{ categories: Category[]; total: number }> {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar categorias:", errorData);
    throw new Error("Erro ao buscar categorias.");
  }

  return res.json();
}
