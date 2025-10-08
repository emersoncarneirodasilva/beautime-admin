"use server";

import { deleteCategory } from "@/libs/api/deleteCategory";
import { revalidatePath } from "next/cache";

export async function handleDeleteCategory(formData: FormData) {
  const id = formData.get("id") as string;
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;

  await deleteCategory(id, token);

  revalidatePath(`/${slug}/dashboard/category`);
}
