"use server";

import { createBusinessHour } from "@/libs/api/createBusinessHour";
import { redirect } from "next/navigation";

export async function handleCreateBusinessHour(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const weekday = Number(formData.get("weekday"));
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;

  await createBusinessHour({ token, weekday, startTime, endTime });

  redirect(`/${slug}/dashboard/business-hours`);
}
