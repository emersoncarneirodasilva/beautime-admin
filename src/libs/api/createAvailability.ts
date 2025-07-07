import { Availability } from "@/types";

type CreateAvailabilityInput = {
  professionalId: string;
  weekday: number;
  startTime: string;
  endTime: string;
};

export async function createAvailability(
  data: CreateAvailabilityInput,
  token: string
): Promise<Availability> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Erro ao criar disponibilidade: " + errorText);
  }

  return res.json();
}
