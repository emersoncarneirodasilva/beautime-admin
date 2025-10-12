import { createService } from "./actions/createService";
import CreateButton from "@/components/Buttons/CreateButton";
import BackLink from "@/components/Buttons/BackLink";
import { Metadata } from "next";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { Category } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Criar Serviço`,
    description: `Crie um novo serviço associado ao salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

const labelStyles = "block font-medium mb-2 text-[var(--foreground)]";

const inputStyles =
  "w-full px-4 py-3 bg-[var(--color-gray-light)] rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

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
    const res = await fetchCategories(token);
    categories = res.categories;
  } catch {
    categories = [];
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <header>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Serviço
        </h1>
        <p className="text-[var(--text-secondary)]">
          Preencha os dados para adicionar um novo serviço ao salão.
        </p>
      </header>

      <form
        id="create-service-form"
        action={createService}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="token" value={token} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label htmlFor="name" className={labelStyles}>
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className={inputStyles}
            />
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="categoryId" className={labelStyles}>
              Categoria
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              className={inputStyles}
              defaultValue=""
            >
              <option value="" disabled>
                Selecione uma categoria
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Preço */}
          <div>
            <label htmlFor="price" className={labelStyles}>
              Preço (R$)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              required
              className={inputStyles}
            />
          </div>

          {/* Duração */}
          <div>
            <label htmlFor="duration" className={labelStyles}>
              Duração (minutos)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              required
              className={inputStyles}
            />
          </div>
        </div>

        {/* Upload de Imagem */}
        <div>
          <label htmlFor="image" className={labelStyles}>
            Imagem
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className={inputStyles}
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className={labelStyles}>
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className={inputStyles}
          />
        </div>

        <div className="flex justify-end">
          <CreateButton formId="create-service-form" label="Criar Serviço" />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/services" />
    </section>
  );
}
