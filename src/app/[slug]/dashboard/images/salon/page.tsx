import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { Section } from "@/components/Images/ImageGallerySection";
import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function GallerySalonImagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const images = await fetchSalonImages(token);

  // Filtrar apenas imagens do salão (sem vínculo com profissional ou serviço)
  const salonImages = images.filter(
    (img) => img.professionalId === null && img.serviceId === null
  );

  return (
    <section className="p-4 space-y-6">
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

      <Section title="Imagens do Salão" images={salonImages} token={token} />
    </section>
  );
}
