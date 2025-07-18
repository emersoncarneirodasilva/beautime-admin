import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
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
  const limit = Number(query?.limit || 10);
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
      limit,
      search,
      type: "salon",
    });
  } catch (error) {
    return (
      <p className="text-center text-red-500">
        Erro ao carregar imagens: {(error as Error).message}
      </p>
    );
  }

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
        🏠 Imagens do Salão
      </h1>

      {/* Busca */}
      <form method="GET" className="max-w-md mx-auto mb-4 flex gap-2">
        <input
          type="search"
          name="search"
          defaultValue={search}
          placeholder="Buscar por título, descrição..."
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

      {/* Imagens */}
      {imagesData && imagesData.images.length === 0 ? (
        <p className="text-center text-gray-400 mt-12">
          Nenhuma imagem encontrada.
        </p>
      ) : (
        <Section
          title="Imagens do Salão"
          images={imagesData?.images || []}
          token={token}
        />
      )}

      {/* Paginação */}
      {imagesData && imagesData.totalPages > 1 && (
        <nav className="flex justify-center gap-4 mt-6" aria-label="Paginação">
          <Link
            href={`/${slug}/dashboard/images/salon?page=${
              imagesData.currentPage - 1
            }&limit=${limit}&search=${encodeURIComponent(search)}`}
            className={`px-4 py-2 rounded ${
              imagesData.currentPage === 1
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={imagesData.currentPage === 1}
            tabIndex={imagesData.currentPage === 1 ? -1 : 0}
          >
            Anterior
          </Link>

          <span className="text-gray-300 flex items-center">
            Página {imagesData.currentPage} de {imagesData.totalPages}
          </span>

          <Link
            href={`/${slug}/dashboard/images/salon?page=${
              imagesData.currentPage + 1
            }&limit=${limit}&search=${encodeURIComponent(search)}`}
            className={`px-4 py-2 rounded ${
              imagesData.currentPage === imagesData.totalPages
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            aria-disabled={imagesData.currentPage === imagesData.totalPages}
            tabIndex={imagesData.currentPage === imagesData.totalPages ? -1 : 0}
          >
            Próxima
          </Link>
        </nav>
      )}
    </section>
  );
}
