import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { fetchServices } from "@/libs/api/fetchServices";
import { Section } from "@/components/Images/ImageGallerySection";
import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function GalleryServiceImagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [images, { services }] = await Promise.all([
    fetchSalonImages(token),
    fetchServices(token, 1, 100), // buscando todos os serviços
  ]);

  // Filtrar imagens que possuem serviceId (não nulo) e professionalId null
  const serviceImages = images.filter(
    (img) => img.serviceId !== null && img.professionalId === null
  );

  // Agrupar imagens por serviceId
  const groupedByService = serviceImages.reduce((acc, img) => {
    if (!img.serviceId) return acc;
    if (!acc[img.serviceId]) acc[img.serviceId] = [];
    acc[img.serviceId].push(img);
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
        💇 Imagens dos Serviços
      </h1>

      {Object.entries(groupedByService).map(([serviceId, imgs]) => {
        const serviceName =
          services.find((s) => s.id === serviceId)?.name ??
          "Serviço Desconhecido";

        return (
          <Section
            key={serviceId}
            title={serviceName}
            images={imgs}
            token={token}
          />
        );
      })}
    </section>
  );
}
