import fetchUsers from "@/libs/api/fetchUsers";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UsersList from "@/components/User/UsersList";
import ActionButton from "@/components/Buttons/ActionButton";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Usuários`,
    description: `Informações gerais dos usuários associados ao salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export default async function UsersPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const query = await searchParams;

  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 10);
  const search = query?.search || "";

  let usersData;

  try {
    usersData = await fetchUsers({ token, page, limit, search });
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar usuários"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">{`Usuários`}</h1>
        <ActionButton
          href={`/${slug}/dashboard/users/create`}
          text="Criar Usuário"
          className="self-start sm:self-auto"
        />
      </header>

      {/* Formulário de busca */}
      <section>
        <form
          method="GET"
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar usuários..."
            className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <div className="flex gap-3">
            <select
              name="limit"
              defaultValue={limit.toString()}
              className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            >
              <option value="5">5 / página</option>
              <option value="10">10 / página</option>
              <option value="20">20 / página</option>
            </select>

            <button
              type="submit"
              className="bg-[var(--color-action)] text-[var(--text-on-action)] px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-action-hover)] transition cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </form>
      </section>

      {/* Lista de usuários */}
      <section>
        <UsersList users={usersData.users} slug={slug} />
      </section>

      {/* Paginação */}
      <Pagination
        currentPage={page}
        totalPages={usersData.totalPages}
        hrefBuilder={(p) =>
          `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
        }
      />
    </section>
  );
}
