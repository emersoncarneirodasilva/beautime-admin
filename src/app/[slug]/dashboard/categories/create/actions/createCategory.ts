"use server";

import { cookies } from "next/headers";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { redirect } from "next/navigation";
import { createCategoryApi } from "@/libs/api/createCategory";
import { revalidateTag } from "next/cache";

interface BackendError {
  message?: string;
}

export async function createCategory(formData: FormData) {
  const slug = formData.get("slug") as string;
  const name = formData.get("name")?.toString().trim();

  if (!name) {
    redirect(
      `/${slug}/dashboard/categories/create?error=${encodeURIComponent(
        "O nome da categoria é obrigatório."
      )}`
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);

  if (!salon) redirect("/login");

  try {
    await createCategoryApi({
      name,
      salonId: salon.id,
      token,
    });
  } catch (error) {
    const err = error as BackendError;
    const message = encodeURIComponent(
      err.message || "Erro ao criar categoria"
    );
    redirect(`/${slug}/dashboard/categories/create?error=${message}`);
  }

  // limpa o cache da tag "categories" para atualizar a lista de categorias
  revalidateTag("categories");

  redirect(`/${slug}/dashboard/categories`);
}
