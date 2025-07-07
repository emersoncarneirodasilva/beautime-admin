"use server";

import { cookies } from "next/headers";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { redirect } from "next/navigation";
import { updateProfessionalRequest } from "@/libs/api/updateProfessional";

export async function updateProfessional(formData: FormData) {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const phone = formData.get("phone")?.toString() || null;
  const bio = formData.get("bio")?.toString() || null;
  let avatarUrl = formData.get("avatarUrl")?.toString() || null;

  if (avatarUrl?.trim() === "") avatarUrl = null;

  if (!id || !name || !email) {
    throw new Error("Campos obrigatórios ausentes.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  await updateProfessionalRequest(
    id,
    { name, email, phone, bio, avatarUrl },
    token
  );

  redirect(`/dashboard/professionals/${id}`);
}
