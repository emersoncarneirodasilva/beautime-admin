import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchProfessionalImages } from "@/libs/api/fetchProfessionalImages";
import { Section } from "@/components/Images/ImageGallerySection";
import { ImageType } from "@/types";
import ErrorSection from "@/components/Error/ErrorSection";
import BackLink from "@/components/Buttons/BackLink";
import ActionButton from "@/components/Buttons/ActionButton";

/* Metadata */
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Galeria de Imagens dos Profissionais`,
    description: `Gerencie as imagens dos profissionais do salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
}

export default async function GalleryProfessionalImagesPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const query = await searchParams;
  const search = query?.search || "";
  const page = Number(query?.page || 1);

  // 1️⃣ Buscar profissionais com filtro de busca
  let professionalsData;
  try {
    professionalsData = await fetchProfessionals({
      token,
      search,
      page,
      limit: 100,
    });
  } catch {
    return (
      <ErrorSection
        title="Erro ao carregar profissionais"
        message="Não foi possível carregar a lista de profissionais."
      />
    );
  }

  const professionals = professionalsData?.professionals || [];

  if (professionals.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Nenhum profissional encontrado.
      </p>
    );
  }

  // 2️⃣ Buscar imagens de cada profissional e agrupar pelo nome
  const imagesData: Record<string, ImageType[]> = {};

  for (const prof of professionals) {
    try {
      const images = await fetchProfessionalImages(prof.id, token);
      if (images.length > 0) {
        imagesData[prof.name] = images;
      }
    } catch {
      console.warn(`Falha ao carregar imagens do profissional ${prof.name}`);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Imagens dos Profissionais
          </h1>
        </div>
        <ActionButton
          href={`/${slug}/dashboard/images/upload`}
          text="Nova Imagem"
          className="self-start sm:self-auto"
        />
      </header>

      {/* Busca */}
      <section>
        <form
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
          method="GET"
        >
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Buscar por nome do profissional..."
            className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />
          <button
            type="submit"
            className="bg-[var(--color-action)] text-[var(--text-on-action)] px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-action-hover)] transition w-full sm:w-auto cursor-pointer"
          >
            Filtrar
          </button>
        </form>
      </section>

      {/* Lista de imagens agrupadas */}
      {Object.keys(imagesData).length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma imagem encontrada para os profissionais.
        </p>
      ) : (
        Object.entries(imagesData).map(([profName, imgs]) => (
          <Section
            key={profName}
            title={profName}
            images={imgs}
            token={token}
          />
        ))
      )}

      {/* BackLink inferior */}
      <div className="mt-6">
        <BackLink slug={slug} to="dashboard/images" />
      </div>
    </section>
  );
}
