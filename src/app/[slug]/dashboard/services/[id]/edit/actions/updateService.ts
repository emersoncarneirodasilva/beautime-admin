"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { sanitizeFile } from "@/utils/sanitizeFile";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function updateService(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;
  const price = formData.get("price") ? Number(formData.get("price")) : null;
  const duration = formData.get("duration")
    ? Number(formData.get("duration"))
    : null;
  const categoryId = (formData.get("categoryId") as string)?.trim() || null;
  const image = formData.get("image") as File | null;

  // 🔹 Monta o corpo como multipart/form-data
  const body = new FormData();
  if (name !== null) body.append("name", name);
  if (description !== null) body.append("description", description);
  if (price !== null) body.append("price", String(price));
  if (duration !== null) body.append("duration", String(duration));
  if (categoryId !== null) body.append("categoryId", categoryId);

  if (image && image.size > 0) {
    const safeImage = sanitizeFile(image);
    body.append("image", safeImage);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ não definir Content-Type manualmente
    },
    body,
  });

  if (!res.ok) {
    const errorData: { message?: string } = await res.json().catch(() => ({}));
    const message =
      errorData?.message || "Erro ao atualizar serviço. Tente novamente.";

    console.error("Erro ao atualizar serviço:", errorData);

    redirect(
      `/${slug}/dashboard/services/${id}/edit?error=${encodeURIComponent(
        message
      )}`
    );
  }

  // limpa o cache de serviços
  revalidateTag("services");

  redirect(`/${slug}/dashboard/services/${id}`);
}
