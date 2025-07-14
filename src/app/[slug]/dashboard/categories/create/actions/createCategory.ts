"use server";

import { cookies } from "next/headers";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { redirect } from "next/navigation";
import { createCategoryApi } from "@/libs/api/createCategory";

export async function createCategory(formData: FormData) {
  const slug = formData.get("slug") as string;
  const name = formData.get("name")?.toString().trim();

  if (!name) {
    throw new Error("O nome da categoria é obrigatório.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const salon = await fetchSalonByAdmin(token);

  if (!salon) {
    throw new Error("Salão não encontrado.");
  }

  await createCategoryApi({
    name,
    salonId: salon.id,
    token,
  });

  redirect(`/${slug}/dashboard/categories`);
}
