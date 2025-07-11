"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { redirect } from "next/navigation";

export async function createImage(formData: FormData) {
  const token = await verifyAdminAuth();

  const url = formData.get("url") as string;
  const type = formData.get("type") as string;
  const target = formData.get("target") as string;
  const professionalId = formData.get("professionalId") as string;
  const serviceId = formData.get("serviceId") as string;

  const salonId = process.env.NEXT_PUBLIC_SALON_ID;

  const body: Record<string, string> = {
    url,
    type,
    salonId: salonId!,
  };

  if (target === "professional" && professionalId) {
    body.professionalId = professionalId;
  }

  if (target === "service" && serviceId) {
    body.serviceId = serviceId;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao enviar imagem:", error);
    throw new Error("Falha ao criar imagem");
  }

  redirect("/dashboard/images");
}
