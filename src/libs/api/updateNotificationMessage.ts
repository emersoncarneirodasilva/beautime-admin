export async function updateNotificationMessage(
  id: string,
  message: string,
  token: string
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Falha ao atualizar notificação");
  }

  return res.json();
}
