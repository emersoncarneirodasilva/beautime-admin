"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { sanitizeFile } from "@/utils/sanitizeFile";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSalon(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const logo = formData.get("logo") as File | null;

  // Criar FormData para enviar via multipart/form-data
  const body = new FormData();

  // Só adiciona se houver valor
  if (name) body.append("name", name);
  if (description) body.append("description", description);
  if (logo && logo.size > 0) {
    const safeLogo = sanitizeFile(logo);
    body.append("logo", safeLogo);
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

  // Revalida o cache de todo o salão
  updateTag("salon");

  redirect(`/${slug}/dashboard/salon`);
}
