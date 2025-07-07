import AccessDenied from "@/components/Auth/AccessDenied";
import LogoutButton from "@/components/Auth/LogoutButton";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { getFirstName } from "@/utils/getFirstName";
import Link from "next/link";

export default async function DashboardPage() {
  let token: string;

  try {
    token = await verifyAdminAuth();
  } catch {
    return <AccessDenied />;
  }

  const salon = await fetchSalonByAdmin(token);

  const admin = await getUserFromToken();

  const adminName = getFirstName(admin?.name);

  if (!admin) {
    return <AccessDenied />;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Bem-vindo(a) <span className="text-gray-300">{adminName}</span> ao
        painel de administração do{" "}
        <span className="text-gray-300">{salon.name}</span>. Aqui você pode
        gerenciar usuários, serviços e agendamentos.
      </p>
      <div className="flex flex-col gap-4 my-6">
        <Link
          href="/dashboard/users"
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          Gerenciar Usuários
        </Link>
        <Link
          href="/dashboard/professionals"
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          Gerenciar Profissionais
        </Link>
        <Link
          href="/dashboard/categories"
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          Gerenciar Categorias
        </Link>
        <Link
          href="/dashboard/services"
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          Gerenciar Serviços
        </Link>
        <Link
          href="/dashboard/services-on-professionals"
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          Gerenciar Associação (Profissional/Serviço)
        </Link>
      </div>

      <LogoutButton />
    </div>
  );
}
