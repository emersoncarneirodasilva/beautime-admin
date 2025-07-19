"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { updateNotificationMessage } from "@/libs/api/updateNotificationMessage";
import { redirect } from "next/navigation";

export async function updateNotification(formData: FormData) {
  const token = await verifyAdminAuth();
  if (!token) throw new Error("Unauthorized");

  const id = formData.get("id")?.toString();
  const slug = formData.get("slug")?.toString();
  const message = formData.get("message")?.toString();

  if (!id || !slug || !message) {
    throw new Error("Campos obrigatórios ausentes");
  }

  await updateNotificationMessage(id, message, token);

  revalidatePath(`/${slug}/dashboard/notifications`);

  redirect(`/${slug}/dashboard/notifications`);
}
