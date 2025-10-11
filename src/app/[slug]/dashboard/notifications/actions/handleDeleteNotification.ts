"use server";

import { deleteNotification } from "@/libs/api/deleteNotification";
import { revalidatePath } from "next/cache";

export async function handleDeleteNotification(formData: FormData) {
  const notificationId = formData.get("notificationId") as string;
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;

  if (!notificationId || !token) {
    console.error("ID da notificação ou token não informado");
    return;
  }

  try {
    await deleteNotification(notificationId, token);

    revalidatePath(`/${slug}/dashboard/notifications`);
  } catch (error) {
    console.error("Erro ao deletar notificação:", error);
  }
}
