import AccessDenied from "@/components/Auth/AccessDenied";
import { updateSalon } from "./actions/updateSalon";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import Link from "next/link";
import { Save } from "lucide-react";
import { Metadata } from "next";

// Função assíncrona para gerar metadata dinâmico
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} (Editar Salão)`,
    description: `Editar informações do salão ${salon.name} no painel de administração do Beautime`,
  };
}

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
    <div className="max-w-3xl mx-auto p-6 md:p-10">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)] font-poppins">
        Editar Salão
      </h1>

      {/* Formulário */}
      <form
        action={updateSalon}
        className="space-y-8 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />

        {/* Grid Nome e Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <label
              htmlFor="name"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Nome do Salão
            </label>
            <input
              type="text"
              name="name"
              defaultValue={salon.name}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label
              htmlFor="logoUrl"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Logo (URL)
            </label>
            <input
              type="url"
              name="logoUrl"
              defaultValue={salon.logoUrl}
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium mb-2 text-[var(--foreground)]"
          >
            Descrição
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={salon.description}
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition resize-none"
            required
          />
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-action)] text-[var(--text-on-action)] rounded-md shadow-md hover:bg-[var(--color-action-hover)] transition-all font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Salvar Alterações
          </button>
        </div>
      </form>

      {/* Link voltar */}
      <Link
        href={`/${slug}/dashboard/salon`}
        className="text-sm text-[var(--color-primary)] hover:underline transition-colors block mt-6"
      >
        ← Voltar
      </Link>
    </div>
  );
}
