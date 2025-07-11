"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { updateCategoryApi } from "@/libs/api/updateCategoryApi";

export async function updateCategory(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();

  if (!id || !name) {
    throw new Error("ID e nome são obrigatórios.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  await updateCategoryApi(id, name, token);

  redirect("/dashboard/categories");
}
