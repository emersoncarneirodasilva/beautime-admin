import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types";

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);

    return payload;
  } catch {
    return null;
  }
}
