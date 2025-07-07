import { ProfessionalType } from "@/types";

type ProfessionalPreview = Pick<
  ProfessionalType,
  "id" | "name" | "email" | "avatarUrl"
>;

export async function fetchProfessionals(
  token: string
): Promise<ProfessionalPreview[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/professionals`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar profissionais:", errorData);
    throw new Error("Erro ao buscar profissionais.");
  }

  const data: ProfessionalType[] = await res.json();

  // Filtra apenas os campos usados na listagem
  return data.map((prof) => ({
    id: prof.id,
    name: prof.name,
    email: prof.email,
    avatarUrl: prof.avatarUrl,
  }));
}
