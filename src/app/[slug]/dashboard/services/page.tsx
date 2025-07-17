import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Service } from "@/types";

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

  const searchQueryParams = await searchParams;

  const page = Number(searchQueryParams?.page || 1);
  const limit = Number(searchQueryParams?.limit || 10);
  const search = searchQueryParams?.search || "";

  let servicesData: {
    total: number;
    totalPages: number;
    currentPage: number;
    services: Service[];
  } | null = null;

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) query.append("search", search);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error("Erro ao buscar serviços.");

    servicesData = await res.json();
  } catch (error) {
    return (
      <p className="text-center text-red-500">
        Erro ao carregar serviços: {(error as Error).message}
      </p>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Serviços</h1>
        <Link
          href={`/${slug}/dashboard/services/create`}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Novo Serviço
        </Link>
      </div>

      <form method="GET" className="mb-6 max-w-sm flex gap-2">
        <input
          name="search"
          defaultValue={search}
          placeholder="Buscar serviço..."
          className="flex-grow p-2 rounded border border-gray-300"
          type="search"
          autoComplete="off"
        />
        <select
          name="limit"
          defaultValue={String(limit)}
          className="p-2 rounded border border-gray-300 bg-black"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 hover:cursor-pointer transition"
        >
          Buscar
        </button>
      </form>

      {servicesData?.services.length === 0 ? (
        <p className="text-center text-gray-400 mt-12">
          Nenhum serviço encontrado.
        </p>
      ) : (
        <ul className="space-y-6">
          {servicesData?.services.map((service) => (
            <li
              key={service.id}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {service.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {service.category?.name}
                </p>
                <p className="text-green-700 font-medium mt-2">
                  💰 R$ {service.price.toFixed(2)} — ⏱ {service.duration} min
                </p>
              </div>

              <div>
                <Link
                  href={`/${slug}/dashboard/services/${service.id}`}
                  className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paginação */}
      {servicesData && servicesData.totalPages > 1 && (
        <nav className="flex justify-center gap-4 mt-8" aria-label="Pagination">
          <Link
            href={`/${slug}/dashboard/services?search=${encodeURIComponent(
              search
            )}&page=${servicesData.currentPage - 1}&limit=${limit}`}
            className={`px-4 py-2 rounded ${
              servicesData.currentPage === 1
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            aria-disabled={servicesData.currentPage === 1}
            tabIndex={servicesData.currentPage === 1 ? -1 : 0}
          >
            Anterior
          </Link>

          <span className="text-gray-300 flex items-center">
            Página {servicesData.currentPage} de {servicesData.totalPages}
          </span>

          <Link
            href={`/${slug}/dashboard/services?search=${encodeURIComponent(
              search
            )}&page=${servicesData.currentPage + 1}&limit=${limit}`}
            className={`px-4 py-2 rounded ${
              servicesData.currentPage === servicesData.totalPages
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
            aria-disabled={servicesData.currentPage === servicesData.totalPages}
            tabIndex={
              servicesData.currentPage === servicesData.totalPages ? -1 : 0
            }
          >
            Próximo
          </Link>
        </nav>
      )}

      <div className="mt-8">
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
