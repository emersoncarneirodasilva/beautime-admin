import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { Section } from "@/components/Images/ImageGallerySection";
import { ImageType } from "@/types";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import BackLink from "@/components/Buttons/BackLink";

/* Metadata */
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Galeria de Imagens do Salão`,
    description: `Gerencie as imagens do salão ${salon.name}.`,
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

export default async function GallerySalonImagesPage({
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

  const page = Number(query?.page || 1);
  const search = query?.search || "";

  let imagesData: {
    total: number;
    totalPages: number;
    currentPage: number;
    images: ImageType[];
  } | null = null;

  try {
    imagesData = await fetchSalonImages({
      token,
      page,
      limit: 100,
      search,
      type: "salon",
    });
  } catch {
    return (
      <ErrorSection
        title="Erro ao carregar imagens"
        message="Não foi possível carregar as imagens do salão."
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col justify-between min-h-[calc(100vh-80px)] space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-[var(--foreground)]">
            Imagens do Salão
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
            placeholder="Buscar por título ou descrição..."
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

      {/* Lista de imagens ou mensagem centralizada */}
      <div className="flex-1 flex flex-col justify-center">
        {imagesData?.images.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Nenhuma imagem encontrada para os filtros aplicados.
          </p>
        ) : (
          <Section
            title="Imagens do Salão"
            images={imagesData.images}
            token={token}
          />
        )}
      </div>

      {/* BackLink inferior */}
      <div className="mt-6">
        <BackLink slug={slug} to="dashboard/images" />
      </div>
    </section>
  );
}
