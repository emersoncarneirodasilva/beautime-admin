import fetchUsers from "@/libs/api/fetchUsers";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import UsersList from "@/components/User/UsersList";
import ActionButton from "@/components/Buttons/ActionButton";
import Pagination from "@/components/Pagination";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Search } from "lucide-react";

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
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
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
          className="admin-filter-form admin-filter-form--simple"
        >
          <div className="admin-filter-field admin-filter-search">
            <label htmlFor="users-search">Pesquisar usuários</label>
            <div className="admin-filter-input-wrap">
              <Search aria-hidden="true" />
              <input
                id="users-search"
                type="text"
                name="search"
                className="admin-filter-control"
                aria-label="Pesquisar usuários"
                defaultValue={search}
                placeholder="Buscar usuários..."
              />
            </div>
          </div>
          <div className="admin-filter-field">
            <label htmlFor="users-limit">Exibir por página</label>
            <select
              id="users-limit"
              name="limit"
              aria-label="Resultados por página"
              defaultValue={limit.toString()}
            >
              <option value="5">5 / página</option>
              <option value="10">10 / página</option>
              <option value="20">20 / página</option>
            </select>
          </div>
          <button type="submit" className="ui-button ui-button--primary">
            Filtrar
          </button>
        </form>
      </section>
      {/* Lista de usuários */}
      <section>
        <UsersList users={usersData.users} slug={slug} />
      </section>

      {/* Paginação */}

      {usersData && (
        <Pagination
          currentPage={page}
          totalPages={usersData.totalPages}
          totalItems={usersData.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
