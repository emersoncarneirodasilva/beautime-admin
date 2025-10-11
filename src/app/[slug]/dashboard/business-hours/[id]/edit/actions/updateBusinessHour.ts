"use server";

import { updateBusinessHour } from "@/libs/api/updateBusinessHour";

export async function handleUpdateBusinessHour(formData: FormData) {
  const id = formData.get("id") as string;
  const slug = formData.get("slug") as string;
  const token = formData.get("token") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  await updateBusinessHour({ slug, id, token, startTime, endTime });
}
