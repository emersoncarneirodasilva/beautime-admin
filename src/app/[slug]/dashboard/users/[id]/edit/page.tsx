import fetchUserById from "@/libs/api/fetchUserById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { UserType } from "@/types";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateUser } from "./actions/updateUser";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Editar Usuário`,
    description: `Edição das informações do usuário associado ao salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
  id: string;
}

const labelClasses = "block font-medium text-[var(--foreground)]";

const inputClasses =
  "w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

export default async function EditUserPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let user: UserType;

  try {
    user = await fetchUserById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados do usuário"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/users`}
        linkText="Voltar à lista de usuários"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Usuário
        </h1>
        <p className="text-[var(--text-secondary)]">
          Atualize as informações do usuário selecionado.
        </p>
      </header>

      {/* Formulário */}
      <form
        id="edit-user-form"
        action={updateUser}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={user.id} />

        {/* Nome */}
        <div className="flex flex-col gap-4">
          <label htmlFor="name" className={labelClasses}>
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={user.name ?? ""}
            required
            className={inputClasses}
          />
        </div>

        {/* Telefone */}
        <div className="flex flex-col gap-4">
          <label htmlFor="phone" className={labelClasses}>
            Telefone
          </label>
          <input
            type="number"
            id="phone"
            name="phone"
            defaultValue={user.phone ?? ""}
            required
            className={inputClasses}
          />
        </div>

        {/* Botão de atualização */}
        <div className="flex justify-end mt-10">
          <SubmitButton formId="edit-user-form" />
        </div>
      </form>

      {/* Link de volta */}
      <BackLink slug={slug} to={`dashboard/users/${user.id}`} />
    </section>
  );
}
