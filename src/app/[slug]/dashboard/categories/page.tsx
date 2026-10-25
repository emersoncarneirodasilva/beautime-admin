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
import { Search } from "lucide-react";

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

  let categoriesData: {
    categories: Category[];
    total: number;
    totalPages: number;
  } = {
    categories: [],
    total: 0,
    totalPages: 0,
  };

  try {
    const result = await fetchCategories(token, search, page, limit);
    categoriesData = {
      categories: result.categories,
      total: result.total,
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
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1>Categorias</h1>
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
        className="admin-filter-form admin-filter-form--simple"
        method="GET"
      >
        <div className="admin-filter-field admin-filter-search">
          <label htmlFor="categories-search">Pesquisar categorias</label>
          <div className="admin-filter-input-wrap">
            <Search aria-hidden="true" />
            <input
              id="categories-search"
              type="text"
              name="search"
              className="admin-filter-control"
              aria-label="Pesquisar categorias"
              defaultValue={search}
              placeholder="Buscar categorias..."
            />
          </div>
        </div>
        <div className="admin-filter-field">
          <label htmlFor="categories-limit">Exibir por página</label>
          <select
            id="categories-limit"
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

      {/* Lista de Categorias */}
      {categoriesData.categories.length === 0 ? (
        <div className="flex flex-1 justify-center items-center h-[60vh]">
          <p className="text-center text-gray-500 text-lg">
            Nenhuma categoria encontrada para os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesData.categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-5 shadow-sm transition-shadow hover:shadow-md"
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
                    confirmMessage={`Tem certeza que deseja excluir a categoria "${category.name}"?`}
                    className="flex min-h-10 w-full items-center justify-center rounded-lg bg-[var(--color-error)] text-sm font-medium text-[var(--text-on-error)] transition hover:bg-[var(--color-error-hover)]"
                  />
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {categoriesData.categories.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={categoriesData.totalPages}
          totalItems={categoriesData.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
