"use server";

import { deleteUser } from "@/libs/api/deleteUser";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteUserAction(
  userId: string,
  token: string,
  slug: string
) {
  await deleteUser(userId, token);

  revalidateTag("users");

  redirect(`/${slug}/dashboard/users`);
}
