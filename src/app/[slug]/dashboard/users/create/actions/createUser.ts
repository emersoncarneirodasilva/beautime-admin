"use server";

import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData): Promise<void> {
  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !phone || !password) {
    redirect(
      `/${slug}/dashboard/users/create?error=${encodeURIComponent(
        "Todos os campos são obrigatórios."
      )}`
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) redirect("/login");

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

    // Passa a mensagem do backend direto para o toast
    const backendMessage = errorData?.message || "Erro desconhecido";
    redirect(
      `/${slug}/dashboard/users/create?error=${encodeURIComponent(
        backendMessage
      )}`
    );
  }

  // Invalida cache dos usuários
  revalidateTag("users");

  redirect(`/${slug}/dashboard/users`);
}
