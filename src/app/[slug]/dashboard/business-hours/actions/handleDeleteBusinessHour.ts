"use server";

import { deleteBusinessHour } from "@/libs/api/deleteBusinessHour";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleDeleteBusinessHour(formData: FormData) {
  try {
    const hourId = formData.get("hourId") as string;
    const token = formData.get("token") as string;
    const slug = formData.get("slug") as string;

    if (!hourId || !token) {
      console.error("ID do horário ou token não informado");
      return;
    }

    await deleteBusinessHour(hourId, token);

    // Limpa o cache da página de horários
    revalidateTag("business-hours");

    redirect(`/${slug}/dashboard/business-hours`);
  } catch (error) {
    console.error("Erro ao excluir horário:", error);
  }
}
