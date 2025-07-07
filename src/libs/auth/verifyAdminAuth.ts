import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types";

export async function verifyAdminAuth(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: JwtPayload;

  try {
    payload = jwtDecode<JwtPayload>(token);
  } catch {
    redirect("/login");
  }

  if (!payload.role || payload.role !== "ADMIN") {
    throw new Error("Acesso restrito: apenas administradores.");
  }

  return token;
}
