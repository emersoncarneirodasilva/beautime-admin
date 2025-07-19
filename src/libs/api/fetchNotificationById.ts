import { NotificationType } from "@/types";

export async function fetchNotificationById(
  id: string,
  token: string
): Promise<NotificationType> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao buscar notificação");
  }

  const data = await res.json();
  return data.notification;
}
