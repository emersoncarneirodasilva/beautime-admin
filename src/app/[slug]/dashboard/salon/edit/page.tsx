import AccessDenied from "@/components/Auth/AccessDenied";
import { updateSalon } from "./actions/updateSalon";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function EditSalonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const salon = await fetchSalonByAdmin(token);

  return (
    <div className="max-w-2xl mx-auto py-10 text-gray-700">
      <h1 className="text-2xl font-bold mb-4">Editar Salão</h1>

      <form
        action={updateSalon}
        className="space-y-6 bg-white p-6 rounded-2xl shadow"
      >
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            Nome
          </label>
          <input
            type="text"
            name="name"
            defaultValue={salon.name}
            className="w-full px-4 py-2 border rounded-xl"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            Descrição
          </label>
          <textarea
            name="description"
            rows={4}
            defaultValue={salon.description}
            className="w-full px-4 py-2 border rounded-xl"
            required
          />
        </div>

        <div>
          <label htmlFor="logoUrl" className="block font-medium mb-1">
            Logo (URL)
          </label>
          <input
            type="url"
            name="logoUrl"
            defaultValue={salon.logoUrl}
            className="w-full px-4 py-2 border rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Salvar Alterações
        </button>
      </form>

      <Link
        href={`/${slug}/dashboard/salon`}
        className="text-sm text-blue-600 hover:underline block mt-6"
      >
        ← Voltar
      </Link>
    </div>
  );
}
