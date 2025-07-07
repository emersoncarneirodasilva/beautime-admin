import { ServiceUpdate } from "@/types";

export async function updateServiceById(
  token: string,
  id: string,
  data: ServiceUpdate
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao atualizar serviço:", errorData);
    throw new Error("Erro ao atualizar serviço.");
  }

  return res.json();
}
