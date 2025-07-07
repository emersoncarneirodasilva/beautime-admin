import { Category } from "@/types";

export async function fetchCategories(token: string): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar categorias:", errorData);
    throw new Error("Erro ao buscar categorias.");
  }

  return res.json();
}
