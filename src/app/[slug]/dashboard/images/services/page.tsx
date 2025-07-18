import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { fetchServices } from "@/libs/api/fetchServices";
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

  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 10);
  const search = query?.search || "";

  // Busca imagens de serviços (type=service) e serviços
  const [{ images, totalPages, currentPage }, { services }] = await Promise.all(
    [
      fetchSalonImages({
        token,
        type: "service",
        page,
        limit,
        search,
      }),
      fetchServices(token, 1, 100), // buscar todos os serviços para tentar casar nomes
    ]
  );

  // Agrupar imagens pelo campo `type`
  const groupedByType = images.reduce(
    (acc: Record<string, ImageType[]>, img) => {
      const key = img.type || "Sem Categoria";
      if (!acc[key]) acc[key] = [];
      acc[key].push(img);
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
        💇 Imagens dos Serviços
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
        Object.entries(groupedByType).map(([type, imgs]) => {
          // Tentar encontrar serviço que tenha nome contido no tipo da imagem (matching simples)
          const serviceMatch = services.find((s) =>
            type.toLowerCase().includes(s.name.toLowerCase())
          );
          const title = serviceMatch ? serviceMatch.name : type;

          return (
            <Section key={type} title={title} images={imgs} token={token} />
          );
        })
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <nav className="flex justify-center gap-4 mt-6" aria-label="Paginação">
          <Link
            href={`/${slug}/dashboard/images/services?page=${
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
            href={`/${slug}/dashboard/images/services?page=${
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
