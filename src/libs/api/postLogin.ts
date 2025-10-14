export async function postLogin(email: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    let errMsg = "Credenciais inválidas.";
    try {
      const buffer = await res.arrayBuffer();
      const text = new TextDecoder("utf-8").decode(buffer);
      const json = JSON.parse(text);
      if (json?.message) errMsg = json.message;
      else if (typeof json === "string") errMsg = json;
    } catch {
      // ignora falha de parsing
    }

    throw new Error(errMsg);
  }

  return await res.json();
}
