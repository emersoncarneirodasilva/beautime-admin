import { Category } from "@/types";

export async function fetchCategoryById(
  id: string,
  token: string
): Promise<Category> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Falha ao buscar categoria.");
  }

  return res.json();
}
