"use server";

import { cookies } from "next/headers";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { redirect } from "next/navigation";
import { updateProfessionalRequest } from "@/libs/api/updateProfessional";

export async function updateProfessional(formData: FormData) {
  const slug = formData.get("slug") as string;
  const id = formData.get("id") as string;

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const bio = (formData.get("bio") as string) || null;
  let avatarUrl = (formData.get("avatarUrl") as string) || null;

  if (avatarUrl?.trim() === "") avatarUrl = null;

  if (!id || !name || !email) {
    throw new Error("Campos obrigatórios ausentes.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);

  if (!salon) redirect("/login");

  await updateProfessionalRequest(
    id,
    { name, email, phone, bio, avatarUrl },
    token
  );

  redirect(`/${slug}/dashboard/professionals/${id}`);
}
