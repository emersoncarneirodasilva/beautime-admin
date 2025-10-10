import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import EditButton from "@/components/Buttons/EditButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import Pagination from "@/components/Pagination";
import { Category } from "@/types";
import { Metadata } from "next";
import { handleDeleteCategory } from "./actions/handleDeleteCategory";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Categorias`,
    description: `Gerencie as categorias de serviços do salão ${salon.name}.`,
  };
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
  const query = await searchParams;

  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 10);
  const search = query?.search || "";

  let categoriesData: { categories: Category[]; totalPages: number } = {
    categories: [],
    totalPages: 0,
  };

  try {
    const result = await fetchCategories(token, search, page, limit);
    categoriesData = {
      categories: result.categories,
      totalPages: Math.ceil(result.total / limit),
    };
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

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Categorias
        </h1>
        <div className="flex justify-start sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/categories/create`}
            text="Criar Categoria"
          />
        </div>
      </header>

      {/* Formulário de Busca */}
      <form
        id="category-form"
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
        method="GET"
      >
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar categorias..."
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

      {/* Lista de Categorias */}
      {categoriesData.categories.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">
          Nenhuma categoria encontrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.categories.map((category) => (
            <div
              key={category.id}
              className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-xl shadow-sm p-4 flex flex-col justify-between gap-4 hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {category.name}
              </h2>

              <div className="flex gap-2 w-full">
                <EditButton
                  formId="category-form"
                  href={`/${slug}/dashboard/categories/${category.id}/edit`}
                  className="flex-1 flex items-center justify-center bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--text-on-action)] rounded-md text-sm font-medium transition h-9 cursor-pointer"
                />

                <form
                  id={`delete-category-form-${category.id}`}
                  action={handleDeleteCategory}
                  className="flex-1"
                >
                  <input type="hidden" name="id" value={category.id} />
                  <input type="hidden" name="token" value={token} />
                  <input type="hidden" name="slug" value={slug} />
                  <DeleteButton
                    formId={`delete-category-form-${category.id}`}
                    confirmMessage="Tem certeza que deseja excluir esta categoria?"
                    className="w-full h-9 flex items-center justify-center rounded-md text-sm font-medium cursor-pointer"
                  />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <Pagination
        currentPage={page}
        totalPages={categoriesData.totalPages}
        hrefBuilder={(p) =>
          `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
        }
      />
    </section>
  );
}
