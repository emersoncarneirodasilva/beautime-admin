import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateCategory } from "./actions/updateCategory";
import { fetchCategoryById } from "@/libs/api/fetchCategoryById";

type Params = Promise<{ slug: string; id: string }>;

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const { id } = await params;

  let category;

  try {
    category = await fetchCategoryById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar categoria"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/categories`}
        linkText="Voltar"
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Categoria</h1>

      <form action={updateCategory}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={category.id} />

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nome da Categoria
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={category.name}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-end justify-between mt-6">
          <a
            href={`/${slug}/dashboard/categories`}
            className="text-blue-600 hover:underline"
          >
            Cancelar
          </a>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
