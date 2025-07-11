import { CreateBusinessHourInput } from "@/types";

export async function createBusinessHour({
  token,
  weekday,
  startTime,
  endTime,
}: CreateBusinessHourInput): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/business-hours`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ weekday, startTime, endTime }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Erro ao criar horário:", error);
    throw new Error("Falha ao criar horário.");
  }
}
