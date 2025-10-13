import { Metadata } from "next";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchServicesByProfessional } from "@/libs/api/fetchServicesByProfessional";
import { Service, ServicePreview } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import { linkServiceToProfessional } from "./actions/linkServiceToProfessional";
import { unlinkServiceFromProfessional } from "./actions/unlinkServiceFromProfessional";
import Image from "next/image";
import Pagination from "@/components/Pagination";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import Link from "next/link";
import RemoveServiceLink from "@/components/Buttons/RemoveServiceLink";
import AddServiceButton from "@/components/Buttons/AddServiceButton";
import { fetchWithRetry } from "@/utils/fetchWithRetry";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token).catch(() => null);

  return {
    title: salon
      ? `Beautime Admin - ${salon.name} - Vincular Serviços`
      : "Beautime Admin",
    description: salon
      ? `Gerencie os vínculos entre serviços e profissionais do salão ${salon.name}.`
      : "Gerencie os vínculos entre serviços e profissionais.",
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

export default async function ServicesOnProfessionalsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const searchQuery = await searchParams;

  const page = Number(searchQuery?.page ?? "1");
  const limit = Number(searchQuery?.limit ?? "10");
  const search = searchQuery?.search ?? "";

  // Busca profissionais
  const { professionals, totalPages, currentPage } = await fetchProfessionals({
    token,
    page,
    limit,
    search,
  });

  // Busca todos os serviços
  const { services: allServices } = await fetchServices(token, 1, 100).catch(
    () => ({ services: [] })
  );

  // Chunking para não sobrecarregar fetch
  const chunkSize = 5;
  const professionalsWithServices: ((typeof professionals)[0] & {
    services: ServicePreview[];
  })[] = [];

  for (let i = 0; i < professionals.length; i += chunkSize) {
    const chunk = professionals.slice(i, i + chunkSize);

    const results = await Promise.all(
      chunk.map(async (professional: { id: string }) => {
        try {
          const services = await fetchWithRetry(() =>
            fetchServicesByProfessional(professional.id, token)
          );
          return { ...professional, services };
        } catch (err) {
          console.error(
            `Erro ao buscar serviços do profissional ${professional.id}`,
            err
          );
          return { ...professional, services: [] };
        }
      })
    );

    professionalsWithServices.push(...results);

    // 🧠 Adiciona uma pequena pausa entre os blocos para evitar sobrecarga no servidor
    if (i + chunkSize < professionals.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return (
    <section className="max-w-6xl mx-auto p-4 sm:p-6 my-4 min-h-screen text-[var(--foreground)]">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Vincular Serviços aos Profissionais
        </h1>
      </header>

      {/* Search form */}
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
        <div className="flex gap-3 mt-2 sm:mt-0">
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
            Filtrar
          </button>
        </div>
      </form>

      {/* Professionals list */}
      {professionals.length === 0 ? (
        <div className="flex flex-1 justify-center items-center h-[50vh]">
          <p className="text-center text-gray-500 text-lg">
            Nenhum profissional encontrado.
          </p>
        </div>
      ) : (
        <section className="space-y-8">
          {professionalsWithServices.map((professional) => (
            <article
              key={professional.id}
              className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-xl shadow p-4 sm:p-6 space-y-4"
            >
              {/* Header profissional */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border-b border-[var(--color-gray-medium)] pb-4">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[var(--color-primary)] shadow flex-shrink-0 transition-transform duration-300 hover:scale-[1.05]">
                  <Link
                    href={`/${slug}/dashboard/professionals/${professional.id}`}
                    aria-label={`Ver perfil de ${professional.name}`}
                  >
                    <Image
                      src={
                        professional.avatarUrl || "/images/default-avatar.png"
                      }
                      alt={`Foto de ${professional.name}`}
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-1">
                  <h2 className="font-semibold text-lg text-[var(--foreground)]">
                    {professional.name}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {professional.email}
                  </p>
                </div>
              </div>

              {/* Serviços vinculados */}
              <ul className="ml-0 sm:ml-6 list-disc text-sm text-[var(--foreground)] space-y-1">
                {professional.services.length > 0 ? (
                  professional.services.map((service: ServicePreview) => (
                    <li
                      key={service.id}
                      className="flex justify-between items-center"
                    >
                      <span>{service.service.name}</span>
                      <form
                        id={`unlink-form-${service.id}`}
                        action={unlinkServiceFromProfessional}
                      >
                        <input type="hidden" name="slug" value={slug} />
                        <input
                          type="hidden"
                          name="associationId"
                          value={service.id}
                        />
                        <RemoveServiceLink
                          formId={`unlink-form-${service.id}`}
                          className="text-[var(--color-error)] text-xs hover:underline ml-2"
                        />
                      </form>
                    </li>
                  ))
                ) : (
                  <li className="italic text-[var(--text-secondary)]">
                    Nenhum serviço vinculado
                  </li>
                )}
              </ul>

              {/* Form de vínculo */}
              <form
                id={`link-form-${professional.id}`}
                action={linkServiceToProfessional}
                className="flex flex-col sm:flex-row gap-2 pt-4"
              >
                <input type="hidden" name="slug" value={slug} />
                <input
                  type="hidden"
                  name="professionalId"
                  value={professional.id}
                />

                <select
                  name="serviceId"
                  className="flex-1 border border-[var(--text-secondary)] rounded px-2 py-1 text-sm bg-[var(--color-gray-light)] text-[var(--foreground)]"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Selecione serviço
                  </option>
                  {allServices.map((service: Service) => {
                    const isLinked = professional.services.some(
                      (linked: { service: { id: string } }) =>
                        linked.service.id === service.id
                    );
                    return (
                      <option
                        key={service.id}
                        value={service.id}
                        disabled={isLinked}
                      >
                        {service.name}
                      </option>
                    );
                  })}
                </select>

                <AddServiceButton
                  formId={`link-form-${professional.id}`}
                  className="bg-[var(--color-action)] text-[var(--text-on-action)] px-4 py-1 rounded text-sm hover:bg-[var(--color-action-hover)]"
                />
              </form>
            </article>
          ))}
        </section>
      )}

      {/* Paginação */}
      {professionals.length !== 0 && (
        <footer className="mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            hrefBuilder={(p) =>
              `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
            }
          />
        </footer>
      )}
    </section>
  );
}
