"use server";

import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { sanitizeFile } from "@/utils/sanitizeFile";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createProfessional(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  const avatarFile = formData.get("avatar") as File | null;

  if (!name || !email) {
    redirect(
      `/dashboard/professionals/create?error=${encodeURIComponent(
        "Nome e email são obrigatórios."
      )}`
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) redirect("/login");

  // Criar novo FormData para enviar à API
  const apiFormData = new FormData();
  apiFormData.append("name", name);
  apiFormData.append("email", email);
  apiFormData.append("salonId", salon.id);
  if (phone) apiFormData.append("phone", phone);
  if (bio) apiFormData.append("bio", bio);
  if (avatarFile && avatarFile.size > 0) {
    const safeAvatarFile = sanitizeFile(avatarFile);
    apiFormData.append("avatar", safeAvatarFile);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professionals`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: apiFormData, // envio como multipart/form-data
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao criar profissional:", errorData);

    // Pega a mensagem do backend diretamente
    const backendMessage = errorData?.message || "Erro desconhecido";

    redirect(
      `/${salon.slug}/dashboard/professionals/create?error=${encodeURIComponent(
        backendMessage
      )}`
    );
  }

  // Invalida o cache dos profissionais
  revalidateTag("professionals");

  redirect(`/${salon.slug}/dashboard/professionals`);
}
