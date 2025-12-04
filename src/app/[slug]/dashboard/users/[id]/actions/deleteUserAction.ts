"use server";

import { deleteUser } from "@/libs/api/deleteUser";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUserAction(
  userId: string,
  token: string,
  slug: string
) {
  await deleteUser(userId, token);

  updateTag("users");

  redirect(`/${slug}/dashboard/users`);
}
