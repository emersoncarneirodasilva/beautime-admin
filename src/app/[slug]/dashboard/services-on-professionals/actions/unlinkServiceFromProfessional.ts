"use server";

import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function unlinkServiceFromProfessional(formData: FormData) {
  const slug = formData.get("slug") as string;
  const associationId = formData.get("associationId") as string;

  if (!associationId) throw new Error("Dados incompletos.");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Token não encontrado.");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services-on-professionals/${associationId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao desvincular:", error);
    throw new Error("Erro ao desvincular serviço.");
  }

  updateTag("services-on-professionals");

  redirect(`/${slug}/dashboard/services-on-professionals`);
}
