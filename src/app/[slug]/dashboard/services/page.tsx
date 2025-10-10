// ./src/app/[slug]/dashboard/services/page.tsx

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Metadata } from "next";
import { Service } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import Pagination from "@/components/Pagination";
import { Banknote, Clock3 } from "lucide-react";

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

  let servicesData: {
    total: number;
    totalPages: number;
    currentPage: number;
    services: Service[];
  } | null = null;

  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/services`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));
    if (search) url.searchParams.set("search", search);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Erro ao carregar serviços.");

    servicesData = await res.json();
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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-left">Serviços</h1>
        <div className="flex justify-start sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/services/create`}
            text="Criar Serviço"
          />
        </div>
      </header>

      {/* Filtros */}
      <section>
        <form
          method="GET"
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar serviços..."
            className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
              className="bg-[var(--color-action)] text-[var(--text-on-action)] px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-action-hover)] transition cursor-pointer w-full sm:w-auto"
            >
              Filtrar
            </button>
          </div>
        </form>
      </section>

      {/* Lista de serviços */}
      <section>
        {servicesData?.services.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum serviço encontrado para os filtros aplicados.
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {servicesData?.services.map((service) => (
              <li
                key={service.id}
                className="border border-[var(--color-gray-light)] rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] h-full"
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
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
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
      {servicesData && (
        <Pagination
          currentPage={page}
          totalPages={servicesData.totalPages}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
