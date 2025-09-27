import Link from "next/link";

interface Params {
  slug: string;
}

export default async function Sidebar({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  return (
    <aside
      className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 
      bg-[var(--color-gray-light)] dark:bg-[var(--color-gray-dark)] 
      text-[var(--foreground)] flex flex-col shadow-lg transition-colors"
    >
      <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
        <Link
          href={`/${slug}/dashboard`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Painel
        </Link>

        <h3 className="mt-4 mb-2 text-gray-400 uppercase text-xs tracking-wider">
          Gerenciamento
        </h3>
        <Link
          href={`/${slug}/dashboard/salon`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Salão
        </Link>
        <Link
          href={`/${slug}/dashboard/users`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Usuários
        </Link>
        <Link
          href={`/${slug}/dashboard/professionals`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Profissionais
        </Link>
        <Link
          href={`/${slug}/dashboard/categories`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Categorias
        </Link>
        <Link
          href={`/${slug}/dashboard/services`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Serviços
        </Link>
        <Link
          href={`/${slug}/dashboard/services-on-professionals`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Associação Profissional/Serviço
        </Link>

        <h3 className="mt-4 mb-2 text-gray-400 uppercase text-xs tracking-wider">
          Agendamentos
        </h3>
        <Link
          href={`/${slug}/dashboard/appointments`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Agendamentos
        </Link>
        <Link
          href={`/${slug}/dashboard/appointment-history`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Histórico
        </Link>

        <h3 className="mt-4 mb-2 text-gray-400 uppercase text-xs tracking-wider">
          Configurações
        </h3>
        <Link
          href={`/${slug}/dashboard/notifications`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Notificações
        </Link>
        <Link
          href={`/${slug}/dashboard/business-hours`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Horário Comercial
        </Link>
        <Link
          href={`/${slug}/dashboard/images`}
          className="hover:bg-gray-700 p-2 rounded transition-colors"
        >
          Imagens
        </Link>
      </nav>
    </aside>
  );
}
