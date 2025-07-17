import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { fetchServiceById } from "@/libs/api/fetchServiceById";
import { Category, Service } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateService } from "./actions/updateService";
import Link from "next/link";

interface Params {
  slug: string;
  id: string;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let service: Service | null = null;
  let categories: Category[] = [];

  try {
    [service, { categories }] = await Promise.all([
      fetchServiceById(token, id),
      fetchCategories(token),
    ]);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para serviços"
      />
    );
  }

  if (!service) {
    return (
      <ErrorSection
        title="Serviço não encontrado"
        message="O serviço solicitado não foi localizado."
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para serviços"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Serviço</h1>

      <form action={updateService} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={service.id} />

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Nome
          </label>
          <input
            name="name"
            defaultValue={service.name}
            className="w-full border px-3 py-2 rounded bg-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            defaultValue={service.description}
            className="w-full border px-3 py-2 rounded bg-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Preço
            </label>
            <input
              name="price"
              type="number"
              step="0.01"
              defaultValue={service.price}
              className="w-full border px-3 py-2 rounded bg-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Duração (min)
            </label>
            <input
              name="duration"
              type="number"
              defaultValue={service.duration}
              className="w-full border px-3 py-2 rounded bg-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Imagem (URL)
          </label>
          <input
            name="imageUrl"
            type="url"
            defaultValue={service.imageUrl ?? ""}
            className="w-full border px-3 py-2 rounded bg-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Categoria
          </label>
          <select
            name="categoryId"
            defaultValue={service.categoryId}
            className="w-full border px-3 py-2 rounded bg-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition duration-200"
          >
            Salvar Alterações
          </button>

          <Link
            href={`/${slug}/dashboard/services/${id}`}
            className="text-blue-600 px-4 py-2 hover:underline"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
