import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { Section } from "@/components/Images/ImageGallerySection";
import { ImageType } from "@/types";

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

  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 10);
  const search = query?.search || "";

  // Buscar imagens e profissionais
  const [{ images, totalPages, currentPage }] = await Promise.all([
    fetchSalonImages({
      token,
      type: "professional",
      page,
      limit,
      search,
    }),
    fetchProfessionals({ token, page: 1, limit: 100 }),
  ]);

  // Agrupar imagens pelo campo `type` (ex: "Imagens da Amanda Rodrigues Nunes")
  const groupedByType = images.reduce(
    (acc: Record<string, ImageType[]>, img) => {
      const groupKey = img.type || "Sem Categoria";
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(img);
      return acc;
    },
    {}
  );

  return (
    <section className="p-4 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <Link
          href={`/${slug}/dashboard/images`}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para galeria
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-center">
        👤 Imagens dos Profissionais
      </h1>

      {/* Busca */}
      <form method="GET" className="max-w-md mx-auto mb-4 flex gap-2">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Buscar por tipo de imagem..."
          className="flex-grow border border-gray-300 rounded px-4 py-2"
        />
        <select
          name="limit"
          defaultValue={String(limit)}
          className="p-2 rounded border border-gray-300 bg-black"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Buscar
        </button>
      </form>

      {/* Se não encontrar imagens */}
      {images.length === 0 ? (
        <p className="text-center text-gray-400 mt-12">
          Nenhuma imagem encontrada.
        </p>
      ) : (
        // Mapear grupos por campo `type`
        Object.entries(groupedByType).map(([groupTitle, imgs]) => (
          <Section
            key={groupTitle}
            title={groupTitle}
            images={imgs}
            token={token}
          />
        ))
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-4 mt-6" aria-label="Paginação">
          <Link
            href={`/${slug}/dashboard/images/professional?page=${
              currentPage - 1
            }&limit=${limit}&search=${encodeURIComponent(search)}`}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          >
            Anterior
          </Link>

          <span className="text-gray-300 flex items-center">
            Página {currentPage} de {totalPages}
          </span>

          <Link
            href={`/${slug}/dashboard/images/professional?page=${
              currentPage + 1
            }&limit=${limit}&search=${encodeURIComponent(search)}`}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={currentPage === totalPages}
            tabIndex={totalPages === currentPage ? -1 : 0}
          >
            Próxima
          </Link>
        </nav>
      )}
    </section>
  );
}
