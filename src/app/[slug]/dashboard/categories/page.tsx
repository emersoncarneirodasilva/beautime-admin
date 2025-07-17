import AccessDenied from "@/components/Auth/AccessDenied";
import DeleteCategoryButton from "@/components/Category/DeleteCategoryButton";
import EditCategoryButton from "@/components/Category/EditCategoryButton";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Category } from "@/types";
import Link from "next/link";

interface Params {
  slug: string;
}

interface SearchParams {
  search?: string;
  page?: string;
  limit?: string;
}

export default async function CategoriesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const searchParamsResolved = await searchParams;
  const page = Number(searchParamsResolved?.page) || 1;
  const limit = Number(searchParamsResolved?.limit) || 10;
  const search = searchParamsResolved?.search || "";

  let data: { categories: Category[]; total: number } = {
    categories: [],
    total: 0,
  };

  try {
    data = await fetchCategories(token, search, page, limit);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar categorias"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-200 mb-6">Categorias</h1>

      <form method="GET" className="mb-6 flex gap-2">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar por nome"
          className="px-3 py-2 border rounded-md flex-grow"
        />
        <select
          name="limit"
          defaultValue={limit.toString()}
          className="border rounded px-2 bg-black"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="15">15 por página</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Buscar
        </button>
      </form>

      {data.categories.length === 0 ? (
        <p className="text-gray-200 text-center mt-12">
          Nenhuma categoria encontrada para os filtros aplicados.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h2>

              <div className="flex items-center gap-2">
                <EditCategoryButton id={category.id} slug={slug} />
                <DeleteCategoryButton id={category.id} token={token} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Link
              key={i}
              href={`/${slug}/dashboard/categories?search=${encodeURIComponent(
                search
              )}&page=${i + 1}&limit=${limit}`}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar ao painel
        </Link>
        <Link
          href={`/${slug}/dashboard/categories/create`}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Nova Categoria
        </Link>
      </div>
    </div>
  );
}
