"use server";

import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

export async function createService(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const categoryId = formData.get("categoryId") as string;

  // Tratamento seguro do campo opcional imageUrl
  let imageUrl: string | undefined = undefined;
  const rawImageUrl = formData.get("imageUrl")?.toString().trim();
  if (rawImageUrl) {
    imageUrl = rawImageUrl;
  }

  if (!name || !description || !price || !duration || !categoryId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      description,
      price,
      duration,
      imageUrl,
      categoryId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao criar serviço:", errorData);
    throw new Error("Erro ao criar serviço.");
  }

  redirect(`/${slug}/dashboard/services`);
}
