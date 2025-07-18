import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      <div className="flex justify-between items-center">
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline hover:cursor-pointer mb-4 inline-block"
        >
          ← Voltar para o Dashboard
        </Link>
        <h1 className="text-3xl font-bold">📸 Galeria de Imagens</h1>
        <Link
          href={`/${slug}/dashboard/images/upload`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Nova Imagem
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <Link
          href={`/${slug}/dashboard/images/salon`}
          className="border rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">🏠 Imagens do Salão</h2>
          <p className="text-gray-500 hover:text-blue-500 transition">
            Ver todas as imagens gerais do salão.
          </p>
        </Link>

        <Link
          href={`/${slug}/dashboard/images/professionals`}
          className="border rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            👤 Imagens dos Profissionais
          </h2>
          <p className="text-gray-500 hover:text-blue-500 transition">
            Ver imagens organizadas por profissional.
          </p>
        </Link>

        <Link
          href={`/${slug}/dashboard/images/services`}
          className="border rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">
            💇 Imagens dos Serviços
          </h2>
          <p className="text-gray-500 hover:text-blue-500 transition">
            Ver imagens organizadas por serviço.
          </p>
        </Link>
      </div>
    </div>
  );
}
