import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types";
import { redirect } from "next/navigation";

export async function verifyAdmin(): Promise<JwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: JwtPayload | null = null;

  try {
    payload = jwtDecode<JwtPayload>(token!);
  } catch {
    throw new Error("Token inválido.");
  }

  if (!payload || !payload.role || payload.role !== "ADMIN") {
    throw new Error("Acesso restrito: apenas administradores.");
  }

  return payload;
}
