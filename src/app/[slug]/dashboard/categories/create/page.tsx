import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { createCategory } from "./actions/createCategory";
import BackLink from "@/components/Buttons/BackLink";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import CreateButton from "@/components/Buttons/CreateButton";

interface Params {
  slug: string;
}

export async function generateMetadata() {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Criar Categoria`,
    description: `Crie uma nova categoria para o salão ${salon.name}.`,
  };
}

export default async function CreateCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Categoria
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Crie uma nova categoria para o salão
        </p>
      </header>

      {/* Form */}
      <form
        id="create-category-form"
        action={createCategory}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6"
      >
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="name" className={labelClasses}>
            Nome da Categoria
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ex: Tratamentos Faciais"
            required
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end mt-4">
          <CreateButton
            formId="create-category-form"
            iconType="category"
            label="Criar Categoria"
          />
        </div>
      </form>

      {/* BackLink */}
      <footer className="mt-6">
        <BackLink slug={slug} to="dashboard/categories" />
      </footer>
    </section>
  );
}
