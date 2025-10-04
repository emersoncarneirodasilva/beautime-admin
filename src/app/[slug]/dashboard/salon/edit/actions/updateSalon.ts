"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { redirect } from "next/navigation";

export async function updateSalon(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  const logo = formData.get("logo") as File | null;

  // Criar FormData para enviar via multipart/form-data
  const body = new FormData();
  body.append("name", name);
  body.append("description", description);
  // Só adiciona logo se o usuário realmente selecionou uma imagem
  if (logo && logo.size > 0) {
    body.append("logo", logo);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/me/salons`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ NÃO DEFINIR Content-Type manualmente
        // fetch já define como multipart/form-data automaticamente
      },
      body,
    }
  );

  if (!res.ok) {
    const errorResponse = await res.json().catch(() => ({}));
    console.error("Erro ao atualizar salão:", errorResponse);
    throw new Error(errorResponse.message || "Erro ao atualizar salão.");
  }

  redirect(`/${slug}/dashboard/salon`);
}
