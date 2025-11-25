import { BusinessHour } from "@/types";

export async function fetchBusinessHours(
  token: string
): Promise<BusinessHour[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours`, {
    headers: {
      method: "GET",
      Authorization: `Bearer ${token}`,
    },
    next: { tags: ["business-hours"] },
  });

  if (!res.ok) throw new Error("Erro ao buscar horários");

  return res.json();
}
