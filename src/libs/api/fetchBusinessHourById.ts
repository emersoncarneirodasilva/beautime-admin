import { BusinessHour } from "@/types";
import { fetchBusinessHours } from "./fetchBusinessHours";

export async function fetchBusinessHourById(
  id: string,
  slug: string
): Promise<BusinessHour> {
  const all = await fetchBusinessHours(slug);

  const found = all.find((hour) => hour.id === id);

  if (!found) {
    throw new Error("Horário não encontrado");
  }

  return found;
}
