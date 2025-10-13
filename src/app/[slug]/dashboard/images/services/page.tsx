import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchServiceImages } from "@/libs/api/fetchServiceImages";
import { Section } from "@/components/Images/ImageGallerySection";
import { ImageType } from "@/types";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import BackLink from "@/components/Buttons/BackLink";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

/* Metadata */
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Galeria de Imagens dos Serviços`,
    description: `Gerencie as imagens dos serviços do salão ${salon.name}.`,
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

export default async function GalleryServiceImagesPage({
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

  // Buscar todos os serviços
  let services: { id: string; name: string }[] = [];
  try {
    const servicesResponse = await fetchServices(token, 1, 100);
    services = servicesResponse.services;
  } catch {
    return (
      <ErrorSection
        title="Erro ao carregar serviços"
        message="Não foi possível carregar a lista de serviços."
      />
    );
  }

  // Buscar imagens de cada serviço
  const imagesData: Record<string, ImageType[]> = {};
  for (const service of services) {
    try {
      const imgs = await fetchServiceImages(service.id, token);
      if (imgs.length > 0) imagesData[service.name] = imgs;
    } catch {
      console.warn(`Falha ao carregar imagens do serviço ${service.name}`);
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col justify-between min-h-[calc(100vh-80px)] space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Imagens dos Serviços
        </h1>
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
            placeholder="Buscar por nome do serviço..."
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
        {Object.keys(imagesData).length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Nenhuma imagem encontrada para os serviços.
          </p>
        ) : (
          Object.entries(imagesData).map(([serviceName, imgs]) => (
            <Section
              key={serviceName}
              title={serviceName}
              images={imgs}
              token={token}
            />
          ))
        )}
      </div>

      {/* BackLink inferior */}
      <div className="mt-6">
        <BackLink slug={slug} to="dashboard/images" />
      </div>
    </section>
  );
}
