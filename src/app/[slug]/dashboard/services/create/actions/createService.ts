"use server";

import { redirect } from "next/navigation";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { sanitizeFile } from "@/utils/sanitizeFile"; // função genérica que criamos

export async function createService(formData: FormData) {
  const token = formData.get("token") as string;
  const slug = formData.get("slug") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const price = Number(formData.get("price"));
  const duration = Number(formData.get("duration"));
  const categoryId = (formData.get("categoryId") as string)?.trim();
  const imageFile = formData.get("image") as File | null;

  if (!name || !description || !price || !duration || !categoryId) {
    throw new Error("Preencha todos os campos obrigatórios.");
  }

  if (!token) throw new Error("Token não encontrado.");

  const salon = await fetchSalonByAdmin(token);
  if (!salon) throw new Error("Salão não encontrado.");

  // Monta o FormData para envio multipart
  const body = new FormData();
  body.append("name", name);
  body.append("description", description);
  body.append("price", String(price));
  body.append("duration", String(duration));
  body.append("categoryId", categoryId);

  if (imageFile && imageFile.size > 0) {
    const safeFile = sanitizeFile(imageFile);
    body.append("image", safeFile);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ não definir Content-Type manualmente
    },
    body,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao criar serviço:", errorData);
    throw new Error(errorData.message || "Erro ao criar serviço.");
  }

  redirect(`/${slug}/dashboard/services`);
}
