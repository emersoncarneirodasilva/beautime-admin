import { createCategory } from "./actions/createCategory";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function CreateCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Nova Categoria</h1>

      <form action={createCategory} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome da Categoria
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Ex: Tratamentos Faciais"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <Link
            href={`/${slug}/dashboard/categories`}
            className="text-blue-600 hover:underline"
          >
            ← Voltar
          </Link>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition"
          >
            Criar Categoria
          </button>
        </div>
      </form>
    </div>
  );
}
