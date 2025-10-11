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
    const { message } = await res.json().catch(() => ({
      message: "Erro desconhecido.",
    }));
    throw new Error(message);
  }
}
