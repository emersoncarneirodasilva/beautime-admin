// ./src/app/[slug]/dashboard/services/page.tsx

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Metadata } from "next";
import { formatCurrency } from "@/utils/formatCurrency";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import Pagination from "@/components/Pagination";
import { Banknote, Clock3, Search } from "lucide-react";
import { fetchServices } from "@/libs/api/fetchServices";

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Serviços`,
    description: `Lista de serviços oferecidos pelo salão ${salon.name}.`,
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

export default async function ServicesPage({
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

  let servicesData;

  try {
    servicesData = await fetchServices(token, page, limit, search);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar serviços"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between mb-8 gap-4">
        <h1>Serviços</h1>
        <div className="flex justify-start sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/services/create`}
            text="Criar Serviço"
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
            <label htmlFor="services-search">Pesquisar serviços</label>
            <div className="admin-filter-input-wrap">
              <Search aria-hidden="true" />
              <input
                id="services-search"
                type="text"
                name="search"
                className="admin-filter-control"
                aria-label="Pesquisar serviços"
                defaultValue={search}
                placeholder="Buscar serviços..."
              />
            </div>
          </div>
          <div className="admin-filter-field">
            <label htmlFor="services-limit">Exibir por página</label>
            <select
              id="services-limit"
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

      {/* Lista de serviços */}
      <section>
        {servicesData?.services.length === 0 ? (
          <div className="flex flex-1 justify-center items-center h-[60vh]">
            <p className="text-center text-gray-500 text-lg">
              Nenhum serviço encontrado para os filtros aplicados.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {servicesData?.services.map((service) => (
              <li
                key={service.id}
                className="flex h-full flex-col justify-between rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex flex-col items-start text-left">
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    {service.name}
                  </h2>

                  <p className="text-sm text-gray-500 mb-2">
                    {service.category?.name || "Sem categoria"}
                  </p>

                  <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-medium mt-2">
                    {/* Valor */}
                    <div className="flex items-center gap-1 text-[var(--color-warning)]">
                      <Banknote size={18} />
                      <span>{formatCurrency(service.price)}</span>
                    </div>

                    {/* Duração */}
                    <div className="flex items-center gap-1 text-[var(--color-primary)]">
                      <Clock3 size={18} />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`/${slug}/dashboard/services/${service.id}`}
                  className="text-[var(--color-primary)] text-sm font-medium hover:underline mt-4 self-start"
                >
                  Ver detalhes →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Paginação */}
      {servicesData?.services && servicesData.services.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={servicesData.totalPages}
          totalItems={servicesData.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
