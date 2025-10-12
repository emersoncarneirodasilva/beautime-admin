"use server";

import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { sanitizeFile } from "@/utils/sanitizeFile";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createImage(formData: FormData) {
  const slug = formData.get("slug") as string;
  const type = formData.get("type") as string;
  const target = formData.get("target") as string;
  const professionalId = formData.get("professionalId") as string;
  const serviceId = formData.get("serviceId") as string;
  const bannerFile = formData.get("banner") as File | null;

  if (!bannerFile || bannerFile.size === 0) {
    redirect(
      `/${slug}/dashboard/images?error=${encodeURIComponent(
        "Imagem obrigatória"
      )}`
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) redirect("/login");

  // Normaliza o arquivo
  const safeBannerFile = sanitizeFile(bannerFile);

  // Cria FormData para enviar à API
  const apiFormData = new FormData();
  apiFormData.append("banner", safeBannerFile);
  apiFormData.append("type", type);
  apiFormData.append("target", target);
  apiFormData.append("salonId", salon.id);

  if (target === "professional" && professionalId) {
    apiFormData.append("professionalId", professionalId);
  }
  if (target === "service" && serviceId) {
    apiFormData.append("serviceId", serviceId);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: apiFormData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const backendMessage = errorData?.message || "Erro desconhecido";
    redirect(
      `/${slug}/dashboard/images?error=${encodeURIComponent(backendMessage)}`
    );
  }

  redirect(`/${slug}/dashboard/images`);
}
