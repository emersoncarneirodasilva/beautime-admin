import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { SalonProvider } from "@/context/SalonContext";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { getFirstName } from "@/utils/getFirstName";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  const salon = await fetchSalonByAdmin(token);

  const admin = await getUserFromToken();
  const adminName = admin ? getFirstName(admin.name) : null;

  const { slug } = await params;

  return (
    <SalonProvider salon={salon}>
      <Navbar salonName={salon.name} adminName={adminName} />
      <Sidebar slug={slug} />
      <main className="p-6 md:ml-60 transition-all">{children}</main>
    </SalonProvider>
  );
}
