import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { SalonProvider } from "@/context/SalonContext";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { getFirstName } from "@/utils/getFirstName";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("Token não encontrado nos cookies");

  const salon = await fetchSalonByAdmin(token);

  const admin = await getUserFromToken();
  const adminName = admin ? getFirstName(admin.name) : null;

  return (
    <SalonProvider salon={salon}>
      <Navbar salonName={salon.name} adminName={adminName} />
      <Sidebar params={params} />
      <main className="ml-64 mt-16 p-6">{children}</main>
    </SalonProvider>
  );
}
