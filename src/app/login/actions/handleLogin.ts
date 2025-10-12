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

  // Chama a API de login
  const data = await postLogin(email, password);

  // Corrigido: data.token já é a string do JWT
  const token = data.token;

  if (!token) {
    throw new Error("Token inválido!");
  }

  // Armazena o token em cookie httpOnly
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // Busca informações do salão associado ao admin
  const salon = await fetchSalonByAdmin(token);

  if (!salon?.slug) {
    throw new Error("Salão não encontrado.");
  }

  // Redireciona para o dashboard do salão
  redirect(`/${salon.slug}/dashboard/`);
}
