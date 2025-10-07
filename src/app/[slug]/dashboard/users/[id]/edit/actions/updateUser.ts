"use server";

import { updateUserByAdmin } from "@/libs/api/updateUserByAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUser(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;

  const nameRaw = (formData.get("name") as string)?.trim();
  const phoneRaw = (formData.get("phone") as string)?.trim();

  const data: { name?: string; phone?: string } = {};
  if (nameRaw) data.name = nameRaw;
  if (phoneRaw) data.phone = phoneRaw;

  await updateUserByAdmin(id, token, data);

  revalidatePath(`/${slug}/dashboard/users/${id}`);
  redirect(`/${slug}/dashboard/users/${id}`);
}
