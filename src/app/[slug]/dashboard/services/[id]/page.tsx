import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchServiceById } from "@/libs/api/fetchServiceById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Service } from "@/types";
import Image from "next/image";
import { Metadata } from "next";
import ActionButton from "@/components/Buttons/ActionButton";
import {
  CalendarDays,
  Clock,
  Pencil,
  RefreshCcw,
  Tag,
  Trash2,
  Wallet,
} from "lucide-react";
import { deleteService } from "./edit/actions/deleteService";
import DeleteButton from "@/components/Buttons/DeleteButton";
import BackLink from "@/components/Buttons/BackLink";

interface Params {
  slug: string;
  id: string;
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const { id } = await params;
  const service = await fetchServiceById(token, id);
  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - ${service?.name}`,
    description: `Detalhes e gerenciamento do serviço ${service?.name} do salão ${salon.name}.`,
  };
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
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Dados do Serviço
        </h1>
        <p className="text-[var(--text-secondary)]">
          Visualize e gerencie as informações deste serviço.
        </p>
      </header>

      {/* Card principal */}
      <div className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 md:p-12 flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl">
        {/* Imagem */}
        <div className="relative w-32 sm:w-44 h-32 sm:h-44 mx-auto rounded-full overflow-hidden border-5 border-[var(--color-primary)] shadow-md mb-4">
          <Image
            src={service.imageUrl || "/images/default-service.png"}
            alt={service.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* Nome e categoria */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[var(--foreground)]">
          {service.name}
        </h2>

        <p className="text-center text-base sm:text-lg text-gray-500 mb-6 flex justify-center items-center gap-2">
          <Tag className="w-4 h-4 text-[var(--color-primary)]" />
          Categoria:{" "}
          <span className="text-[var(--color-primary)] font-medium">
            {service.category?.name || "Sem categoria"}
          </span>
        </p>

        {/* Descrição */}
        {service.description && (
          <p className="text-[var(--text-secondary)] leading-relaxed border-l-4 border-[var(--color-primary)]/60 pl-4">
            {service.description}
          </p>
        )}

        {/* Informações */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 text-[var(--foreground)]">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[var(--color-primary)]" />
            <strong>Preço:</strong> R$ {service.price.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" />
            <strong>Duração:</strong> {service.duration} min
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-[var(--color-primary)]" />
            <strong>Criado em:</strong>{" "}
            {new Date(service.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-[var(--color-primary)]" />
            <strong>Atualizado em:</strong>{" "}
            {new Date(service.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Ações */}
        <div className="mt-6 flex flex-col sm:flex-row justify-start gap-3 sm:gap-4">
          <ActionButton
            href={`/${slug}/dashboard/services/${service.id}/edit`}
            text={
              <span className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Editar
              </span>
            }
            className="w-fit"
          />

          <form action={deleteService} id="delete-service-form">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="id" value={service.id} />
            <DeleteButton
              formId="delete-service-form"
              text={
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </span>
              }
              confirmMessage={`Tem certeza que deseja excluir o serviço "${service.name}"?`}
              className="px-5 py-2.5 bg-[var(--color-error)] hover:bg-[#d62828] text-[var(--text-on-action)] rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
            />
          </form>
        </div>
      </div>

      {/* Link Voltar */}
      <div className="flex justify-start -mt-8">
        <BackLink slug={slug} to="dashboard/services" label="Voltar" />
      </div>
    </section>
  );
}
