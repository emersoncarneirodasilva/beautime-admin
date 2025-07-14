"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAvailability(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const availabilityId = formData.get("availabilityId") as string;
  const professionalId = formData.get("professionalId") as string;
  const weekday = Number(formData.get("weekday"));
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/availability/${availabilityId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weekday,
        startTime,
        endTime,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao atualizar disponibilidade.");
  }

  // Revalida o cache da rota de disponibilidade do profissional
  revalidatePath(
    `/${slug}/dashboard/professionals/${professionalId}/availability`
  );

  // Redireciona para a página de lista após sucesso
  redirect(`/${slug}/dashboard/professionals/${professionalId}/availability`);
}
