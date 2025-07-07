import { UserType } from "@/types";

export default async function fetchUsers(token: string): Promise<UserType[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao buscar usuários");
  }

  return res.json();
}
