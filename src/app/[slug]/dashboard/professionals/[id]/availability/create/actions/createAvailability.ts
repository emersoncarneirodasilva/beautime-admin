"use server";

import { createAvailability } from "@/libs/api/createAvailability";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { redirect } from "next/navigation";

export async function handleCreateAvailability(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const professionalId = formData.get("professionalId") as string;
  const weekday = parseInt(formData.get("weekday") as string, 10);
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  await createAvailability(
    { professionalId, weekday, startTime, endTime },
    token
  );

  redirect(`/${slug}/dashboard/professionals/${professionalId}/availability`);
}
