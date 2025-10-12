import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { Availability } from "@/types";
import { handleDeleteAvailability } from "./actions/handleDeleteAvailability";
import { translateWeekday } from "@/utils/translateWeekday";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import BackLink from "@/components/Buttons/BackLink";
import { Metadata } from "next";
import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import ActionButton from "@/components/Buttons/ActionButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import EditButton from "@/components/Buttons/EditButton";

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
    title: `Beautime Admin - ${salon.name} - Disponibilidade de ${professional.name}`,
    description: `Gerencie as disponibilidades do profissional ${professional.name} no salão ${salon.name}.`,
  };
}

export default async function AvailabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let availability: Availability[];
  let professionalName = "";
  try {
    availability = await fetchAvailabilityByProfessional(id, token);
    const professional = await fetchProfessionalById(id, token);
    professionalName = professional.name;
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar disponibilidade"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/professionals/${id}`}
        linkText="Voltar ao profissional"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-8">
            Disponibilidade
          </h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm sm:text-base">
            Gerencie as disponibilidades do profissional{" "}
            <strong>{professionalName}</strong>
          </p>
        </div>

        <div className="flex-shrink-0 w-fit sm:w-auto">
          <ActionButton
            href={`/${slug}/dashboard/professionals/${id}/availability/create`}
            text="Criar disponibilidade"
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Lista de disponibilidades */}
      {availability.length === 0 ? (
        <div className="text-center p-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-xl shadow-sm">
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Nenhuma disponibilidade cadastrada.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availability.map((slot) => (
            <li
              key={slot.id}
              className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-xl shadow-sm p-4 flex flex-col lg:flex-row justify-between gap-2 transition hover:shadow-md"
            >
              {/* Horário */}
              <div className="text-[var(--foreground)] font-medium text-sm sm:text-base mb-2 lg:mb-0">
                <strong>{translateWeekday(slot.weekday)}</strong> <br />
                {slot.startTime} às {slot.endTime}
              </div>

              {/* Ações */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap w-full lg:w-auto">
                <EditButton
                  formId={`availability-form-delete-${slot.id}`}
                  href={`/${slug}/dashboard/professionals/${id}/availability/${slot.id}/edit`}
                  className="px-3 py-1.5 h-fit bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--text-on-action)] rounded-md text-sm transition w-full lg:w-auto text-center cursor-pointer"
                />

                <form
                  id={`availability-form-delete-${slot.id}`}
                  action={handleDeleteAvailability}
                  className="w-full lg:w-auto"
                >
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="availabilityId" value={slot.id} />
                  <input type="hidden" name="professionalId" value={id} />

                  <DeleteButton
                    formId={`availability-form-delete-${slot.id}`}
                    confirmMessage="Deseja realmente excluir esse horário?"
                    className="px-3 py-1.5 bg-[var(--color-error)] text-[var(--text-on-action)] rounded-md text-sm hover:bg-red-700 transition w-full lg:w-auto cursor-pointer"
                  />
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Botão Voltar */}
      <div className="mt-6 flex justify-start w-full sm:w-auto">
        <BackLink slug={slug} to="dashboard/professionals" label="Voltar" />
      </div>
    </section>
  );
}
