"use server";

import { postLogin } from "@/libs/api/postLogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

export async function handleLogin(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    throw new Error("E-mail ou senha inválidos.");
  }

  const data = await postLogin(email, password);
  const token = data.token.token;

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  const salon = await fetchSalonByAdmin(token);

  if (!salon?.slug) {
    throw new Error("Salão não encontrado.");
  }

  redirect(`/${salon.slug}/dashboard/`);
}
