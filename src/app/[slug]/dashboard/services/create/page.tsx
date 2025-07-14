import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { Category } from "@/types";
import { createService } from "./actions/createService";

interface Params {
  slug: string;
}

export default async function CreateServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  let categories: Category[] = [];

  try {
    categories = await fetchCategories(token);
  } catch {
    categories = [];
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Serviço</h1>
      <form action={createService} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Nome
          </label>
          <input
            required
            type="text"
            id="name"
            name="name"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Descrição
          </label>
          <textarea
            required
            id="description"
            name="description"
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="price" className="block font-medium mb-1">
            Preço (R$)
          </label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            id="price"
            name="price"
            className="w-full border rounded px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block font-medium mb-1">
            Duração (minutos)
          </label>
          <input
            required
            type="number"
            min="1"
            id="duration"
            name="duration"
            className="w-full border rounded px-3 py-2 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block font-medium mb-1">
            URL da Imagem
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            className="w-full border rounded px-3 py-2"
            placeholder="https://..."
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block font-medium mb-1">
            Categoria
          </label>
          <select
            required
            id="categoryId"
            name="categoryId"
            className="w-full border rounded px-3 py-2"
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-zinc-700">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-5 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition"
        >
          Criar Serviço
        </button>
      </form>
    </div>
  );
}
