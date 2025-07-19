import { NotificationsResponse } from "@/types";

export async function fetchNotifications({
  token,
  page = 1,
  limit = 10,
  isRead,
  search,
}: {
  token: string;
  page?: number;
  limit?: number;
  isRead?: boolean;
  search?: string;
}): Promise<NotificationsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search: search || "",
  });

  if (isRead !== undefined) {
    params.append("isRead", String(isRead));
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao buscar notificações:", error);
    throw new Error("Falha ao buscar notificações.");
  }

  return res.json();
}
