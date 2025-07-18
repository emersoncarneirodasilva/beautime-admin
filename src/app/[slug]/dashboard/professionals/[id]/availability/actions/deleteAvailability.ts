"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { deleteAvailability } from "@/libs/api/deleteAvailability";
import { revalidatePath } from "next/cache";

export async function handleDeleteAvailability(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const availabilityId = formData.get("availabilityId") as string;
  const professionalId = formData.get("professionalId") as string;

  await deleteAvailability(availabilityId, token);

  revalidatePath(
    `/${slug}/dashboard/professionals/${professionalId}/availability`
  );
}
