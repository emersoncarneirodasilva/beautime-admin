import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { updateProfessional } from "./actions/updateProfessional";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { Metadata } from "next";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import AvatarUpload from "@/components/Images/AvatarUpload";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";

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
  const professional = await fetchProfessionalById(id, token);
  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Editar ${professional.name}`,
    description: `Gerencie e atualize as informações do profissional ${professional.name} no salão ${salon.name}.`,
  };
}

export default async function EditProfessionalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let professional;

  try {
    professional = await fetchProfessionalById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/professionals`}
        linkText="Voltar à lista de profissionais"
      />
    );
  }

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Profissional
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Atualize as informações do profissional abaixo. As alterações serão
          salvas imediatamente após o envio.
        </p>
      </header>

      {/* Form */}
      <form
        id="update-professional-form"
        action={updateProfessional}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={professional.id} />

        {/* Upload de Imagem */}
        <AvatarUpload
          fieldName="avatar"
          title="Imagem do Profissional"
          currentFile={professional.avatarUrl}
          altText={professional.name}
        />

        {/* Nome */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            defaultValue={professional.name}
            className={inputClasses}
          />
        </div>

        {/* E-mail */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={professional.email}
            className={inputClasses}
          />
        </div>

        {/* Telefone */}
        <div>
          <label htmlFor="phone" className={labelClasses}>
            Telefone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            pattern="\d*"
            inputMode="numeric"
            defaultValue={professional.phone || ""}
            className={inputClasses}
          />
        </div>

        {/* Biografia */}
        <div>
          <label htmlFor="bio" className={labelClasses}>
            Biografia
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            defaultValue={professional.bio || ""}
            className={inputClasses}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-10">
          <SubmitButton formId="update-professional-form" />
        </div>
      </form>

      {/* Voltar */}
      <footer className="mt-6">
        <BackLink
          slug={slug}
          to={`dashboard/professionals/${professional.id}`}
        />
      </footer>
    </section>
  );
}
