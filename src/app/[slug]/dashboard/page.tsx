import AccessDenied from "@/components/Auth/AccessDenied";
import LogoutButton from "@/components/Auth/LogoutButton";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { getFirstName } from "@/utils/getFirstName";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const salon = await fetchSalonByAdmin(token);

  const admin = await getUserFromToken();
  if (!admin) return <AccessDenied />;

  const adminName = getFirstName(admin?.name);

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
          href={`/${slug}/dashboard/salon`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Salão
        </Link>
        <Link
          href={`/${slug}/dashboard/users`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Usuários
        </Link>
        <Link
          href={`/${slug}/dashboard/professionals`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Profissionais
        </Link>
        <Link
          href={`/${slug}/dashboard/categories`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Categorias
        </Link>
        <Link
          href={`/${slug}/dashboard/services`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Serviços
        </Link>
        <Link
          href={`/${slug}/dashboard/services-on-professionals`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Associação (Profissional/Serviço)
        </Link>
        <Link
          href={`/${slug}/dashboard/appointments`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Agendamentos
        </Link>
        <Link
          href={`/${slug}/dashboard/notifications`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Notificações
        </Link>
        <Link
          href={`/${slug}/dashboard/business-hours`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Horário Comercial
        </Link>
        <Link
          href={`/${slug}/dashboard/images`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Imagens
        </Link>
        <Link
          href={`/${slug}/dashboard/appointment-history`}
          className="text-blue-600 hover:underline"
        >
          Gerenciar Histórico de Agendamentos
        </Link>
      </div>

      <LogoutButton />
    </div>
  );
}
