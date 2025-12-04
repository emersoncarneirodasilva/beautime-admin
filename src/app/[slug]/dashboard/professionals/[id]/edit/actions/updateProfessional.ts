"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { sanitizeFile } from "@/utils/sanitizeFile";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfessional(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim() || null;
  const phone = (formData.get("phone") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const avatar = formData.get("avatar") as File | null;

  // 🔹 Monta o corpo como multipart/form-data
  const body = new FormData();
  if (name !== null) body.append("name", name);
  if (email !== null) body.append("email", email);
  if (phone !== null) body.append("phone", phone);
  if (bio !== null) body.append("bio", bio);

  // Só envia avatar se o usuário realmente selecionou um arquivo
  if (avatar && avatar.size > 0) {
    const safeAvatar = sanitizeFile(avatar);
    body.append("avatar", safeAvatar);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/professionals/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ não defina Content-Type manualmente
      },
      body,
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const backendMessage =
      errorData?.message || "Erro ao atualizar profissional";
    console.error("Erro ao atualizar profissional:", backendMessage);

    // redireciona para a página de edição com a mensagem de erro
    redirect(
      `/${slug}/dashboard/professionals/${id}/edit?error=${encodeURIComponent(
        backendMessage
      )}`
    );
  }

  // Invalida o cache dos profissionais
  updateTag("professionals");

  redirect(`/${slug}/dashboard/professionals/${id}`);
}
