"use server";

import { revalidatePath } from "next/cache";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";

export async function createNotification(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const userId = formData.get("userId") as string;
  const appointmentId = formData.get("appointmentId") as string;
  const message = formData.get("message") as string;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ appointmentId, message }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao criar notificação:", error);
    throw new Error("Falha ao criar notificação.");
  }

  revalidatePath(`/${slug}/dashboard/notifications`);
}
