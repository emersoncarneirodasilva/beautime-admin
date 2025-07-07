"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

export async function createService(formData: FormData) {
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const categoryId = formData.get("categoryId")?.toString();

  // Tratamento seguro do campo opcional imageUrl
  let imageUrl: string | undefined = undefined;
  const rawImageUrl = formData.get("imageUrl")?.toString().trim();
  if (rawImageUrl) {
    imageUrl = rawImageUrl;
  }

  if (!name || !description || !price || !duration || !categoryId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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

  redirect("/dashboard/services");
}
