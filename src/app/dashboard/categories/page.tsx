import AccessDenied from "@/components/Auth/AccessDenied";
import DeleteCategoryButton from "@/components/Category/DeleteCategoryButton";
import EditCategoryButton from "@/components/Category/EditCategoryButton";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Category } from "@/types";
import Link from "next/link";

export default async function CategoriesPage() {
  let token: string;

  try {
    token = await verifyAdminAuth();
  } catch {
    return <AccessDenied />;
  }

  let categories: Category[] = [];

  try {
    categories = await fetchCategories(token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar categorias"
        message={(error as Error).message}
        linkHref="/dashboard"
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-200 mb-8">Categorias</h1>

      {categories.length === 0 ? (
        <p className="text-gray-200 text-center mt-12">
          Nenhuma categoria encontrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h2>

              <div className="flex items-center gap-2">
                <EditCategoryButton id={category.id} />
                <DeleteCategoryButton id={category.id} token={token} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Voltar ao painel
        </Link>
        <Link
          href="/dashboard/categories/create"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Nova Categoria
        </Link>
      </div>
    </div>
  );
}
