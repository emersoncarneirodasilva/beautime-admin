import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateCategory } from "./actions/updateCategory";
import { fetchCategoryById } from "@/libs/api/fetchCategoryById";
import { Metadata } from "next";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

interface Params {
  slug: string;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const { id } = await params;

  const salon = await fetchSalonByAdmin(token);

  try {
    const category = await fetchCategoryById(id, token);
    return {
      title: `Beautime Admin - ${salon.name} - Editar Categoria - ${category.name}`,
      description: `Edite a categoria "${category.name}" do salão ${salon.name}.`,
    };
  } catch {
    return {
      title: "Beautime Admin - Editar Categoria",
      description: "Edite a categoria do salão.",
    };
  }
}

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

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

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Categoria
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Atualize as informações da categoria <strong>{category.name}</strong>
        </p>
      </header>

      <form
        id="update-category-form"
        action={updateCategory}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6"
      >
        <input type="hidden" name="id" value={category.id} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="name" className={labelClasses}>
            Nome da Categoria
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={category.name}
            required
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end mt-4">
          <SubmitButton formId="update-category-form" />
        </div>
      </form>

      <footer className="mt-6">
        <BackLink slug={slug} to="dashboard/categories" />
      </footer>
    </section>
  );
}
