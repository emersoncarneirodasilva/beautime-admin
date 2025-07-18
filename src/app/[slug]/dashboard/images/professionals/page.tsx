import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { Section } from "@/components/Images/ImageGallerySection";
import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function GalleryProfessionalImagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [images, { professionals }] = await Promise.all([
    fetchSalonImages(token),
    fetchProfessionals({ token, page: 1, limit: 100 }),
  ]);

  // Filtrar imagens que possuem professionalId (não nulo) e serviceId null
  const professionalImages = images.filter(
    (img) => img.professionalId !== null && img.serviceId === null
  );

  // Agrupar imagens por professionalId
  const groupedByProfessional = professionalImages.reduce((acc, img) => {
    if (!img.professionalId) return acc;
    if (!acc[img.professionalId]) acc[img.professionalId] = [];
    acc[img.professionalId].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

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

      {Object.entries(groupedByProfessional).map(([professionalId, imgs]) => {
        const professionalName =
          professionals.find((p: { id: string }) => p.id === professionalId)
            ?.name ?? "Profissional Desconhecido";

        return (
          <Section
            key={professionalId}
            title={professionalName}
            images={imgs}
            token={token}
          />
        );
      })}
    </section>
  );
}
