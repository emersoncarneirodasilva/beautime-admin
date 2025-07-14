import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchServiceById } from "@/libs/api/fetchServiceById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Service } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { deleteService } from "./edit/actions/deleteService";
import DeleteServiceButton from "@/components/Service/DeleteServiceButton";

interface Params {
  slug: string;
  id: string;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let service: Service | null = null;

  try {
    service = await fetchServiceById(token, id);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar serviço"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para Serviços"
      />
    );
  }

  if (!service) {
    return (
      <ErrorSection
        title="Serviço não encontrado"
        message="O serviço solicitado não foi encontrado."
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para Serviços"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">{service.name}</h1>

      {service.imageUrl && (
        <div className="relative w-80 h-100 mx-auto rounded-lg overflow-hidden bg-gray-100 mb-6">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      )}

      <p className="text-gray-700 mb-4">{service.description}</p>

      <div className="flex flex-wrap gap-6 mb-6 text-gray-800">
        <div>
          <strong>Categoria:</strong> {service.category?.name || "—"}
        </div>
        <div>
          <strong>Preço:</strong> R$ {service.price.toFixed(2)}
        </div>
        <div>
          <strong>Duração:</strong> {service.duration} min
        </div>
        <div>
          <strong>Criado em:</strong>{" "}
          {new Date(service.createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Atualizado em:</strong>{" "}
          {new Date(service.updatedAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <Link
          href={`/${slug}/dashboard/services`}
          className="px-4 py-2 border rounded bg-blue-500 hover:bg-blue-600 transition duration-200"
        >
          Voltar
        </Link>

        <div className="flex gap-4">
          <Link
            href={`/${slug}/dashboard/services/${service.id}/edit`}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
          >
            Editar Serviço
          </Link>

          <form action={deleteService}>
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="id" value={service.id} />

            <DeleteServiceButton />
          </form>
        </div>
      </div>
    </div>
  );
}
