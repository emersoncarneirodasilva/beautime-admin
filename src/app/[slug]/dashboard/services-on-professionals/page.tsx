import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchServicesByProfessional } from "@/libs/api/fetchServicesByProfessional";
import { Service, ServicePreview } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import { linkServiceToProfessional } from "./actions/linkServiceToProfessional";
import { unlinkServiceFromProfessional } from "./actions/unlinkServiceFromProfessional";
import ProfessionalAvatar from "@/components/Professional/ProfessionalAvatar";
import Link from "next/link";

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

  // Busca profissionais paginados e filtrados
  const { professionals, totalPages, currentPage } = await fetchProfessionals({
    token,
    page,
    limit,
    search,
  });

  // Busca todos os serviços disponíveis (sem paginação)
  const { services: allServices } = await fetchServices(token, 1, 100);

  // Para cada profissional, busca os serviços vinculados
  const professionalsWithServices = await Promise.all(
    professionals.map(async (professional: { id: string }) => {
      const services = await fetchServicesByProfessional(
        professional.id,
        token
      );
      return { ...professional, services };
    })
  );

  return (
    <div className="max-w-6xl mx-auto p-6 my-4 rounded bg-gray-300 min-h-screen">
      <div className="mb-4">
        <Link
          href={`/${slug}/dashboard`}
          className="inline-block text-blue-600 hover:underline hover:cursor-pointer"
        >
          ← Voltar
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Vincular Serviços aos Profissionais
      </h1>

      {/* Formulário de busca */}
      <form method="GET" className="flex gap-3 mb-6">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar profissional..."
          className="flex-grow border border-black text-black rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          name="limit"
          defaultValue={limit.toString()}
          className="border border-black text-black rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Buscar
        </button>
      </form>

      <div className="space-y-8">
        {professionalsWithServices.map((professional) => (
          <div
            key={professional.id}
            className="bg-white rounded-lg shadow p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden border-4 border-purple-400 w-[70px] h-[70px] mb-6">
                <ProfessionalAvatar
                  src={professional.avatarUrl}
                  alt={professional.name}
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {professional.name}
                </h2>
                <p className="text-sm text-gray-500">{professional.email}</p>
              </div>
            </div>

            <ul className="ml-6 list-disc text-sm text-gray-700 space-y-1">
              {professional.services.length > 0 ? (
                professional.services.map((service: ServicePreview) => (
                  <li
                    key={service.id} // id da associação profissional-serviço
                    className="flex justify-between items-center"
                  >
                    <span>{service.service.name}</span>
                    <form action={unlinkServiceFromProfessional}>
                      <input type="hidden" name="slug" value={slug} />
                      <input
                        type="hidden"
                        name="associationId"
                        value={service.id}
                      />

                      <button
                        type="submit"
                        className="text-red-500 text-xs hover:underline hover:cursor-pointer ml-2"
                      >
                        Remover
                      </button>
                    </form>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400">
                  Nenhum serviço vinculado
                </li>
              )}
            </ul>

            <form action={linkServiceToProfessional} className="flex gap-2">
              <input type="hidden" name="slug" value={slug} />
              <input
                type="hidden"
                name="professionalId"
                value={professional.id}
              />

              <select
                name="serviceId"
                className="flex-1 border rounded px-2 py-1 text-sm text-gray-700"
                defaultValue=""
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
                      className={
                        isLinked ? "bg-gray-200 text-gray-400" : "bg-gray-400"
                      }
                    >
                      {service.name}
                    </option>
                  );
                })}
              </select>

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 hover:cursor-pointer transition"
              >
                Vincular
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-8">
        <Link
          href={`?page=${
            currentPage - 1
          }&limit=${limit}&search=${encodeURIComponent(search)}`}
          className={`px-4 py-2 rounded ${
            currentPage <= 1
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-disabled={currentPage <= 1}
        >
          Anterior
        </Link>

        <span className="text-gray-700">
          Página {currentPage} de {totalPages}
        </span>

        <Link
          href={`?page=${
            currentPage + 1
          }&limit=${limit}&search=${encodeURIComponent(search)}`}
          className={`px-4 py-2 rounded ${
            currentPage >= totalPages
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          aria-disabled={currentPage >= totalPages}
        >
          Próxima
        </Link>
      </div>
    </div>
  );
}
