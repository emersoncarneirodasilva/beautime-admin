"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function handleLogout() {
  const cookieStore = await cookies();

  cookieStore.delete("token"); // remove o cookie do login

  redirect("/login");
}
