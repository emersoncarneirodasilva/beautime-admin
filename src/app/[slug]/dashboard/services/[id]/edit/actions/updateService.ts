"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { updateServiceById } from "@/libs/api/updateService";

export async function updateService(formData: FormData) {
  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const categoryId = formData.get("categoryId") as string;

  // Trata imagem opcional
  let imageUrl: string | undefined;
  const rawImageUrl = formData.get("imageUrl")?.toString().trim();

  if (rawImageUrl && rawImageUrl !== "") {
    imageUrl = rawImageUrl;
  }

  if (!id || !name || !description || !price || !duration || !categoryId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  await updateServiceById(token, id, {
    name,
    description,
    price,
    duration,
    imageUrl,
    categoryId,
  });

  redirect(`/${slug}/dashboard/services/${id}`);
}
