"use server";

import { deleteCategory } from "@/libs/api/deleteCategory";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDeleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;

  await deleteCategory(id, token);

  // Invalida todos os caches relacionados às categorias
  revalidateTag("categories");

  redirect(`/${slug}/dashboard/categories`);
}
