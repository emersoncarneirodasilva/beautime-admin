import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import AccessDenied from "@/components/Auth/AccessDenied";
import { createImage } from "./actions/createImage";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";
import BackLink from "@/components/Buttons/BackLink";
import CreateButton from "@/components/Buttons/CreateButton";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import ImageTargets from "@/components/Images/ImageTargets";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Enviar Imagem`,
    description: `Faça upload de imagens para o salão ${salon.name}, incluindo fotos do salão, profissionais ou serviços.`,
  };
}

interface Params {
  slug: string;
}

export default async function UploadImagePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [{ professionals }, { services }] = await Promise.all([
    fetchProfessionals({ token, page: 1, limit: 100 }),
    fetchServices(token, 1, 100),
  ]);

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <header>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Enviar Imagem
        </h1>
        <p className="text-[var(--text-secondary)]">
          Faça upload de uma imagem para o salão, profissional ou serviço.
        </p>
      </header>

      <form
        id="upload-image-form"
        action={createImage}
        className="space-y-6 border border-[var(--color-gray-medium)] bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />

        {/* Upload de Imagem */}
        <div>
          <label
            htmlFor="banner"
            className="block font-medium mb-2 text-[var(--foreground)]"
          >
            Upload da Imagem
          </label>
          <input
            type="file"
            id="banner"
            name="banner"
            accept="image/*"
            required
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
          />
        </div>

        {/* Descrição / tipo */}
        <div>
          <label
            htmlFor="type"
            className="block font-medium mb-2 text-[var(--foreground)]"
          >
            Descrição (tipo)
          </label>
          <input
            type="text"
            id="type"
            name="type"
            required
            placeholder="Ex: capa, perfil, destaque..."
            className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition"
          />
        </div>

        <ImageTargets professionals={professionals} services={services} />

        {/* Botão de envio */}
        <div className="flex justify-end">
          <CreateButton
            formId="upload-image-form"
            label="Enviar Imagem"
            iconType="image"
          />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/images" />
    </section>
  );
}
