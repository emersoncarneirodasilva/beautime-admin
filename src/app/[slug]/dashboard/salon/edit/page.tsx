import { Metadata } from "next";
import { updateSalon } from "./actions/updateSalon";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import LogoInput from "@/components/Salon/LogoInput";
import SubmitButton from "@/components/Buttons/SubmitButton";
import BackLink from "@/components/Buttons/BackLink";

// Metadata dinâmico
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Editar Salão`,
    description: `Edite as informações do salão ${salon.name}.`,
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
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-8 text-[var(--foreground)] font-poppins">
          Editar Salão
        </h1>
        <p className="text-[var(--text-secondary)]">
          Atualize as informações do seu salão.
        </p>
      </header>

      {/* Formulário */}
      <form
        id="edit-salon-form"
        action={updateSalon}
        className="space-y-8 border border-[var(--color-gray-medium)] bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />

        {/* Grid Nome e Logo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 lg:gap-30 items-center">
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
            />
          </div>

          <LogoInput
            name="logo"
            defaultLogoUrl={salon.logoUrl || "/images/default-logo.png"}
          />
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
          />
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
          <SubmitButton formId="edit-salon-form" />
        </div>
      </form>

      {/* Footer */}
      <BackLink slug={slug} to="dashboard/salon" />
    </section>
  );
}
