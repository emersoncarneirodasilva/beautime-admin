export async function promoteUserClient(userId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/promote`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Erro ao promover o usuário.");
  }
}

export async function demoteUserClient(userId: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/demote`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Erro ao rebaixar o usuário.");
  }
}
