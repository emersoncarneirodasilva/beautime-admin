import { UserType } from "@/types";

export default async function fetchUserById(
  id: string,
  token: string
): Promise<UserType> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao buscar usuário:", errorData);
    throw new Error("Falha ao buscar o usuário.");
  }

  return res.json();
}
