import { SalonProvider } from "@/context/SalonContext";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("Token não encontrado nos cookies");
  }

  const salon = await fetchSalonByAdmin(token);

  return <SalonProvider salon={salon}>{children}</SalonProvider>;
}
