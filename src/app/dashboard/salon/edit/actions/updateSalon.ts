"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { redirect } from "next/navigation";

export async function updateSalon(formData: FormData) {
  const token = await verifyAdminAuth();

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const logoUrl = formData.get("logoUrl")?.toString() || "";

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

  redirect("/dashboard/salon");
}
