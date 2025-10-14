"use server";

import { postLogin } from "@/libs/api/postLogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

export async function handleLogin(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect(`/login?error=${encodeURIComponent("Credenciais inválidas.")}`);
  }

  let data;
  try {
    data = await postLogin(email, password);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Credenciais inválidas.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  const token = data?.token;
  if (!token) {
    redirect(`/login?error=${encodeURIComponent("Token inválido!")}`);
  }

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  let salon;
  try {
    salon = await fetchSalonByAdmin(token);
  } catch (err: unknown) {
    let message = "Erro ao buscar informações do salão.";

    if (err instanceof Error) {
      message = err.message;
    }

    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  if (!salon?.slug) {
    redirect(`/login?error=${encodeURIComponent("Salão não encontrado.")}`);
  }

  redirect(`/${salon.slug}/dashboard/`);
}
