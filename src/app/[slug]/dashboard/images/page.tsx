import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonImages } from "@/libs/api/fetchSalonImages";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import { Section } from "@/components/Images/ImageGallerySection";

interface Params {
  slug: string;
}

export default async function SalonImagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [images, professionals, services] = await Promise.all([
    fetchSalonImages(token),
    fetchProfessionals(token),
    fetchServices(token),
  ]);

  const salonImages = images.filter(
    (img) => img.salonId && !img.professionalId && !img.serviceId
  );
  const professionalImages = images.filter(
    (img) => img.professionalId && !img.serviceId
  );
  const serviceImages = images.filter(
    (img) => img.serviceId && !img.professionalId
  );

  const groupedByProfessional = professionalImages.reduce((acc, img) => {
    if (!img.professionalId) return acc;
    if (!acc[img.professionalId]) acc[img.professionalId] = [];
    acc[img.professionalId].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

  const groupedByService = serviceImages.reduce((acc, img) => {
    if (!img.serviceId) return acc;
    if (!acc[img.serviceId]) acc[img.serviceId] = [];
    acc[img.serviceId].push(img);
    return acc;
  }, {} as Record<string, typeof images>);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      <div className="flex justify-between items-center">
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline hover:cursor-pointer mb-4 inline-block"
        >
          ← Voltar para o Dashboard
        </Link>
        <h1 className="text-3xl font-bold">📸 Galeria do Salão</h1>
        <Link
          href={`/${slug}/dashboard/images/upload`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nova Imagem
        </Link>
      </div>

      <Section title="🏠 Imagens do Salão" images={salonImages} token={token} />

      <div>
        <h2 className="text-2xl font-semibold mb-4">
          👤 Imagens dos Profissionais
        </h2>
        {Object.entries(groupedByProfessional).map(([id, imgs]) => {
          const name =
            professionals.find(
              (professional: { id: string; name: string }) =>
                professional.id === id
            )?.name || "Profissional Desconhecido";
          return <Section key={id} title={name} images={imgs} token={token} />;
        })}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">💇 Imagens dos Serviços</h2>
        {Object.entries(groupedByService).map(([id, imgs]) => {
          const name =
            services.find((s) => s.id === id)?.name || "Serviço Desconhecido";
          return <Section key={id} title={name} images={imgs} token={token} />;
        })}
      </div>
    </div>
  );
}
