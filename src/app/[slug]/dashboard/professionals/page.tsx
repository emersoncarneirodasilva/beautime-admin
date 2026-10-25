import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import Pagination from "@/components/Pagination";
import Image from "next/image";
import { ProfessionalsDTO } from "@/types";
import { Metadata } from "next";
import { Search } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Profissionais`,
    description: `Lista de profissionais associados ao salão ${salon.name}.`,
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

export default async function ProfessionalsPage({
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

  let professionalsData;

  try {
    professionalsData = await fetchProfessionals({
      token,
      page,
      limit,
      search,
    });
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar profissionais"
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
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Profissionais
        </h1>
        <div className="flex justify-center sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/professionals/create`}
            text="Criar Profissional"
            variant="secondary"
          />
        </div>
      </header>

      {/* Filtros */}
      <section>
        <form
          method="GET"
          className="admin-filter-form admin-filter-form--simple"
        >
          <div className="admin-filter-field admin-filter-search">
            <label htmlFor="professionals-search">Pesquisar profissionais</label>
            <div className="admin-filter-input-wrap">
              <Search aria-hidden="true" />
              <input
                id="professionals-search"
                type="text"
                name="search"
                className="admin-filter-control"
                aria-label="Pesquisar profissionais"
                defaultValue={search}
                placeholder="Buscar profissionais..."
              />
            </div>
          </div>
          <div className="admin-filter-field">
            <label htmlFor="professionals-limit">Exibir por página</label>
            <select
              id="professionals-limit"
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

      {/* Lista de profissionais */}
      <section>
        {professionalsData.professionals.length === 0 ? (
          <div className="flex flex-1 justify-center items-center h-[60vh]">
            <p className="text-center text-gray-500 text-lg">
              Nenhum profissional encontrado para os filtros aplicados.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {professionalsData.professionals.map(
              (professional: ProfessionalsDTO) => (
                <li
                  key={professional.id}
                  className="border border-[var(--color-gray-medium)] rounded-xl p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 hover:shadow-md transition bg-[var(--color-white)] dark:bg-[var(--color-gray-light)]"
                >
                  <Image
                    src={professional.avatarUrl || "/images/default-avatar.png"}
                    alt={`Avatar de ${professional.name}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <div className="flex flex-col text-center sm:text-left">
                    <h2 className="text-lg font-semibold">
                      {professional.name}
                    </h2>
                    <p className="text-sm text-gray-500 break-all">
                      {professional.email}
                    </p>
                    <a
                      href={`/${slug}/dashboard/professionals/${professional.id}`}
                      className="text-[var(--color-primary)] text-sm font-medium hover:underline mt-1"
                    >
                      Ver detalhes →
                    </a>
                  </div>
                </li>
              )
            )}
          </ul>
        )}
      </section>

      {/* Paginação */}
      {professionalsData.professionals.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={professionalsData.totalPages}
          totalItems={professionalsData.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
