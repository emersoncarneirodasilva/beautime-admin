export async function postLogin(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    try {
      const err = await res.json();
      console.error("Erro no login:", err);
    } catch {
      // Ignora falha de parsing
    }

    throw new Error("E-mail ou senha inválidos.");
  }

  return await res.json();
}
