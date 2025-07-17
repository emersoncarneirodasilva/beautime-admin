import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ProfessionalAvatar from "@/components/Professional/ProfessionalAvatar";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { ProfessionalsDTO } from "@/types";

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
  searchParams: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const query = await searchParams;

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const search = query.search || "";

  let data;
  try {
    data = await fetchProfessionals({ token, page, limit, search });
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar profissionais"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel principal"
      />
    );
  }

  const { professionals, totalPages } = data;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar ao painel
        </Link>
        <Link
          href={`/${slug}/dashboard/professionals/create`}
          className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Criar Profissional
        </Link>
      </div>

      {/* Título centralizado */}
      <h1 className="text-3xl font-bold text-center mb-8">Profissionais</h1>

      {/* Filtros */}
      <form className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <input
          type="text"
          name="search"
          placeholder="Buscar por nome..."
          defaultValue={search}
          className="bg-black text-white border px-4 py-2 rounded w-full sm:w-auto"
        />
        <select
          name="limit"
          defaultValue={String(limit)}
          className="bg-black text-white border px-4 py-2 rounded w-full sm:w-auto"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition w-full sm:w-auto"
        >
          Filtrar
        </button>
      </form>

      {professionals.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhum profissional encontrado para os filtros aplicados.
        </p>
      ) : (
        <ul className="space-y-4">
          {professionals.map((professional: ProfessionalsDTO) => (
            <li key={professional.id} className="border p-4 rounded shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <ProfessionalAvatar
                  src={professional.avatarUrl}
                  alt={`Avatar de ${professional.name}`}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{professional.name}</h2>
                  <p className="text-sm text-gray-500">{professional.email}</p>
                </div>
                <Link
                  href={`/${slug}/dashboard/professionals/${professional.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Paginação */}
      <div className="flex justify-between mt-8">
        <Link
          href={`?page=${page - 1}&limit=${limit}&search=${search}`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white ${
            page <= 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <Link
          href={`?page=${page + 1}&limit=${limit}&search=${search}`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white ${
            page >= totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Link>
      </div>
    </div>
  );
}
