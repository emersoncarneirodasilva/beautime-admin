import { BusinessHour } from "@/types";

export async function fetchBusinessHours(
  slug: string
): Promise<BusinessHour[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/business-hours/public/${slug}`,
    {
      headers: {
        method: "GET",
      },
      next: { tags: ["business-hours"] },
    }
  );

  if (!res.ok) throw new Error("Erro ao buscar horários");

  return res.json();
}
