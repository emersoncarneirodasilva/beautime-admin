import CreateButton from "@/components/Buttons/CreateButton";
import { createUser } from "./actions/createUser";
import BackLink from "@/components/Buttons/BackLink";
import { Metadata } from "next";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Criar Usuário`,
    description: `Crie um novo usuário associado ao salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

export default async function CreateUserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <header>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Usuário
        </h1>
        <p className="text-[var(--text-secondary)]">
          Preencha os dados para criar um novo usuário associado ao salão.
        </p>
      </header>

      <form
        id="create-user-form"
        action={createUser}
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
              required
              pattern="\d*"
              inputMode="numeric"
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          {/* Senha */}
          <div>
            <label
              htmlFor="password"
              className="block font-medium mb-2 text-[var(--foreground)]"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={6}
              required
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <CreateButton
            formId="create-user-form"
            label="Criar Usuário"
            iconType="user"
          />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/users" />
    </section>
  );
}
