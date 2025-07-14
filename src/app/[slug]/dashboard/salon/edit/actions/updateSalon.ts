"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { redirect } from "next/navigation";

export async function updateSalon(formData: FormData) {
  const token = await verifyAdminAuth();

  const slug = formData.get("slug") as string;
  const name = (formData.get("name") as string) || "";
  const description = (formData.get("description") as string) || "";
  const logoUrl = (formData.get("logoUrl") as string) || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admins/me/salons`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description, logoUrl }),
    }
  );

  if (!res.ok) {
    const errorResponse = await res.json().catch(() => ({}));
    console.error("Erro ao atualizar salão:", errorResponse);
    throw new Error(errorResponse.message || "Erro ao atualizar salão.");
  }

  redirect(`/${slug}/dashboard/salon`);
}
