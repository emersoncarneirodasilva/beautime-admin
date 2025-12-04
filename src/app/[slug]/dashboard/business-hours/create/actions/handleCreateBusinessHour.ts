"use server";

import { createBusinessHour } from "@/libs/api/createBusinessHour";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function handleCreateBusinessHour(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const weekday = Number(formData.get("weekday"));

  const startTime = (formData.get("startTime") as string).slice(0, 5);
  const endTime = (formData.get("endTime") as string).slice(0, 5);

  try {
    await createBusinessHour({ token, weekday, startTime, endTime });
  } catch (error: unknown) {
    let message = "Erro desconhecido";
    if (error instanceof Error && error.message) message = error.message;
    const encoded = encodeURIComponent(message);
    redirect(`/${slug}/dashboard/business-hours/create?error=${encoded}`);
  }

  // Limpa o cache da página de horários
  updateTag("business-hours");

  redirect(`/${slug}/dashboard/business-hours`);
}
