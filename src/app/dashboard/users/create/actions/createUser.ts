"use server";

import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData): Promise<void> {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString();
  const password = formData.get("password")?.toString();

  if (!name || !email || !phone || !password) {
    throw new Error("Todos os campos são obrigatórios.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado.");
  }

  const salon = await fetchSalonByAdmin(token);

  if (!salon) {
    throw new Error("Salão não encontrado.");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      salonId: salon.id,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Erro ao criar usuário:", errorData);
    throw new Error("Erro ao criar usuário.");
  }

  redirect("/dashboard/users");
}
