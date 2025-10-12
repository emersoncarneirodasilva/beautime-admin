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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Profissionais
        </h1>
        <div className="flex justify-center sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/professionals/create`}
            text="Criar Profissional"
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
            placeholder="Buscar profissionais..."
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

      {/* Lista de profissionais */}
      <section>
        {professionalsData.professionals.length === 0 ? (
          <p className="text-center text-gray-500">
            Nenhum profissional encontrado para os filtros aplicados.
          </p>
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
      <Pagination
        currentPage={page}
        totalPages={professionalsData.totalPages}
        hrefBuilder={(p) =>
          `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
        }
      />
    </section>
  );
}
