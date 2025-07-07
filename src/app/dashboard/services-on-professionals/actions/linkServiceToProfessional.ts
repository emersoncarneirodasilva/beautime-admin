"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function linkServiceToProfessional(formData: FormData) {
  const professionalId = formData.get("professionalId")?.toString();
  const serviceId = formData.get("serviceId")?.toString();

  if (!professionalId || !serviceId) throw new Error("Dados incompletos.");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Token não encontrado.");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services-on-professionals`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ professionalId, serviceId }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error("Erro ao vincular:", error);
    throw new Error("Erro ao vincular serviço.");
  }

  redirect("/dashboard/services-on-professionals");
}
