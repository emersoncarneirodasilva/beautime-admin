"use server";

import { deleteProfessionalById } from "@/libs/api/deleteProfessionalById";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function deleteProfessional(formData: FormData) {
  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;

  if (!id) {
    throw new Error("ID do profissional não informado.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  await deleteProfessionalById(id, token);

  // Invalida o cache dos profissionais
  updateTag("professionals");

  redirect(`/${slug}/dashboard/professionals`);
}
