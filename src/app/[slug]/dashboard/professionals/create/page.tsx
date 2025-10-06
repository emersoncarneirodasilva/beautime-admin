import { createProfessional } from "./actions/createProfessional";
import CreateButton from "@/components/Buttons/CreateButton";
import BackLink from "@/components/Buttons/BackLink";
import { Metadata } from "next";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import ErrorToast from "@/components/Error/ErrorToast";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Criar Profissional`,
    description: `Crie um novo profissional associado ao salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

export default async function CreateProfessionalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToast />

      <header>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Profissional
        </h1>
        <p className="text-[var(--text-secondary)]">
          Preencha os dados para criar um novo profissional associado ao salão.
        </p>
      </header>

      <form
        id="create-professional-form"
        action={createProfessional}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Nome */}
          <div>
            <label
              htmlFor="name"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="email"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Telefone */}
          <div>
            <label
              htmlFor="phone"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              pattern="\d*"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>

          {/* Avatar */}
          <div>
            <label
              htmlFor="avatar"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Imagem
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>
        </div>

        {/* Biografia */}
        <div>
          <label
            htmlFor="bio"
            className="block font-medium mb-2 text-[var(--foreground)]"
          >
            Biografia
          </label>
          <textarea
            id="bio"
            name="bio"
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
          />
        </div>

        <div className="flex justify-end">
          <CreateButton
            formId="create-professional-form"
            label="Criar Profissional"
            iconType="professional"
          />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/professionals" />
    </section>
  );
}
