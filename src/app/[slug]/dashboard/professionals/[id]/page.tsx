import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { fetchServicesByProfessional } from "@/libs/api/fetchServicesByProfessional";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import BackLink from "@/components/Buttons/BackLink";
import { translateWeekday } from "@/utils/translateWeekday";
import { formatProfessionalBio } from "@/utils/formatProfessionalBio";
import { Availability, ProfessionalDetail } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import ActionButton from "@/components/Buttons/ActionButton";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProfessional } from "./actions/deleteProfessional";
import DeleteButton from "@/components/Buttons/DeleteButton";

interface Params {
  slug: string;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const { id } = await params;
  const professional = await fetchProfessionalById(id, token);
  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - ${professional.name}`,
    description: `Detalhes e gerenciamento do profissional ${professional.name} no salão ${salon.name}.`,
  };
}

export default async function ProfessionalPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let professional: ProfessionalDetail;
  try {
    professional = await fetchProfessionalById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados do profissional"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/professionals`}
        linkText="Voltar à lista de profissionais"
      />
    );
  }

  const services = await fetchServicesByProfessional(id, token);
  const availability: Availability[] = await fetchAvailabilityByProfessional(
    id,
    token,
  );

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Dados do Profissional
        </h1>
        <p className="text-[var(--text-secondary)]">
          Gerencie as informações, serviços e disponibilidade deste
          profissional.
        </p>
      </header>

      {/* Card principal */}
      <div className="flex flex-col gap-7 rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-5 shadow-sm transition-colors duration-200 sm:p-7">
        {/* Avatar + Nome */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative w-44 h-44 rounded-full overflow-hidden border-5 border-[var(--color-primary)] shadow-md hover:scale-[1.02] transition-transform duration-300">
            <Image
              src={professional.avatarUrl || "/images/default-avatar.png"}
              alt={professional.name}
              fill
              className="object-cover"
              sizes="176px"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            {professional.name}
          </h2>
          <span className="text-[var(--text-secondary)] text-sm">
            Profissional do salão
          </span>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-gray-light)] p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <i className="lucide lucide-user text-[var(--color-secondary)]"></i>{" "}
              Bio
            </h3>
            <p>{formatProfessionalBio(professional.bio) || "Não informada"}</p>
          </div>
          <div className="rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-gray-light)] p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <i className="lucide lucide-mail text-[var(--color-secondary)]"></i>{" "}
              Contato
            </h3>
            <div className="w-full break-words">
              <span className="font-medium">Email:</span>{" "}
              {professional.email || "Não informado"}
            </div>
            <div className="w-full break-words mt-1">
              <span className="font-medium">Telefone:</span>{" "}
              {professional.phone || "Não informado"}
            </div>
          </div>
        </div>

        {/* Serviços */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="lucide lucide-scissors text-[var(--color-secondary)]"></i>{" "}
            Serviços
          </h3>
          {services.length === 0 ? (
            <p className="text-[var(--text-secondary)]">
              Nenhum serviço vinculado.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {services.map((s) => (
                <Link
                  key={s.service.id}
                  href={`/${slug}/dashboard/services/${s.service.id}`}
                  className="inline-flex min-h-9 items-center rounded-full bg-[var(--color-action-soft)] px-3 py-1 text-sm font-medium text-[var(--color-action)] transition-colors hover:brightness-95"
                >
                  {s.service.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Disponibilidade */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="lucide lucide-calendar text-[var(--color-secondary)]"></i>{" "}
            Disponibilidade
          </h3>
          {availability.length === 0 ? (
            <p className="text-[var(--text-secondary)]">
              Nenhuma disponibilidade cadastrada.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {availability.map((slot) => (
                <li
                  key={slot.id}
                  className="rounded-lg border border-[var(--color-gray-medium)] bg-[var(--color-gray-light)] px-2 py-2 text-center text-sm"
                >
                  {translateWeekday(slot.weekday)} <br /> {slot.startTime} às{" "}
                  {slot.endTime}
                </li>
              ))}
            </ul>
          )}

          <ActionButton
            href={`/${slug}/dashboard/professionals/${id}/availability`}
            text="Gerenciar disponibilidade"
            variant="info"
            className="mt-4"
          />
        </div>

        {/* Ações */}
        <div className="mt-6 flex flex-col sm:flex-row justify-start gap-4">
          <ActionButton
            href={`/${slug}/dashboard/professionals/${id}/edit`}
            text={
              <span className="flex items-center gap-2">
                <Pencil className="w-4 h-4" />
                Atualizar
              </span>
            }
            variant="secondary"
            className="w-fit"
          />

          <form action={deleteProfessional} id="delete-professional-form">
            <input type="hidden" name="slug" value={slug} />
            <input type="hidden" name="id" value={id} />

            <DeleteButton
              formId="delete-professional-form"
              text={
                <span className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </span>
              }
              confirmMessage={`Tem certeza que deseja excluir o profissional "${professional.name}"?`}
            />
          </form>
        </div>
      </div>

      {/* Link Voltar (inferior esquerdo) */}
      <div className="flex justify-start -mt-8">
        <BackLink slug={slug} to="dashboard/professionals" label="Voltar" />
      </div>
    </section>
  );
}
