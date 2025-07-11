import { BusinessHour } from "@/types";
import { fetchBusinessHours } from "./fetchBusinessHours";

export async function fetchBusinessHourById(
  id: string,
  token: string
): Promise<BusinessHour> {
  const all = await fetchBusinessHours(token);

  const found = all.find((hour) => hour.id === id);

  if (!found) {
    throw new Error("Horário não encontrado");
  }

  return found;
}
