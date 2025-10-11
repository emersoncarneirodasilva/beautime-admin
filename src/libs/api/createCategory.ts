export async function createCategoryApi({
  name,
  salonId,
  token,
}: {
  name: string;
  salonId: string;
  token: string;
}): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, salonId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error("Erro ao criar categoria:", errorData);
    throw new Error(errorData?.message || "Erro ao criar categoria");
  }
}
