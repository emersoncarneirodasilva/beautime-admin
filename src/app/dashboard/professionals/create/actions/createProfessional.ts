"use server";

import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { isValidUrl } from "@/utils/isValidUrl";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createProfessional(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString() || null;
  const bio = formData.get("bio")?.toString() || null;
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  // ✅ Apenas valida a URL se estiver preenchida
  if (avatarUrl && avatarUrl.trim() !== "" && !isValidUrl(avatarUrl)) {
    throw new Error("A URL do avatar é inválida.");
  }

  // ✅ Se for string vazia, transforma em null
  if (avatarUrl?.trim() === "") {
    avatarUrl = null;
  }

  if (!name || !email) {
    throw new Error("Nome e email são obrigatórios.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professionals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name,
      email,
      phone,
      bio,
      avatarUrl,
      salonId: salon.id,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao criar profissional:", errorData);

    if (
      res.status === 400 ||
      res.status === 409 ||
      errorData.message?.includes("email")
    ) {
      throw new Error(errorData.message || "E-mail já cadastrado.");
    }

    throw new Error("Erro ao criar profissional.");
  }

  redirect("/dashboard/professionals");
}
