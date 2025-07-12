import { ProfessionalDetail } from "@/types";

export async function fetchProfessionalById(
  id: string,
  token: string
): Promise<ProfessionalDetail> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/professionals/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar profissional:", errorData);
    throw new Error("Erro ao buscar profissional.");
  }

  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatarUrl,
    email: data.email,
    phone: data.phone,
  };
}
