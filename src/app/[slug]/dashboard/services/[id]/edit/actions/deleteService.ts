"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { deleteServiceRequest } from "@/libs/api/deleteService";
import { updateTag } from "next/cache";

export async function deleteService(formData: FormData) {
  const slug = formData.get("slug") as string;

  const id = formData.get("id") as string;
  if (!id) throw new Error("ID do serviço não fornecido.");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  await deleteServiceRequest(id, token);

  // limpa o cache de serviços
  updateTag("services");

  redirect(`/${slug}/dashboard/services`);
}
