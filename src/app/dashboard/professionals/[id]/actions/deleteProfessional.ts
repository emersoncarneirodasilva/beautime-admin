"use server";

import { deleteProfessionalById } from "@/libs/api/deleteProfessionalById";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteProfessional(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("ID do profissional não informado.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  await deleteProfessionalById(id, token);

  redirect("/dashboard/professionals");
}
