"use server";

import { updateUserByAdmin } from "@/libs/api/updateUserByAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  await updateUserByAdmin(id, token, { name, phone });

  revalidatePath(`/${slug}/dashboard/users/${id}`);

  redirect(`/${slug}/dashboard/users/${id}`);
}
