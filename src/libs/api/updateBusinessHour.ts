"use server";

import { redirect } from "next/navigation";

export async function updateBusinessHour({
  id,
  token,
  startTime,
  endTime,
  slug,
}: {
  id: string;
  token: string;
  startTime: string;
  endTime: string;
  slug: string;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/business-hours/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ startTime, endTime }),
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const backendMessage = errorData?.message || "Erro ao atualizar horário";
    console.error("Erro ao atualizar horário:", backendMessage);

    // redireciona para a página de edição com o erro
    redirect(
      `/${slug}/dashboard/business-hours/${id}/edit?error=${encodeURIComponent(
        backendMessage
      )}`
    );
  }

  // Se deu certo, redireciona para a lista de horários
  redirect(`/${slug}/dashboard/business-hours`);
}
