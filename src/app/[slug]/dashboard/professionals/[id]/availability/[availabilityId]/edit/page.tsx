import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { updateAvailability } from "./actions/updateAvailability";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { Metadata } from "next";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { Availability } from "@/types";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

interface Params {
  slug: string;
  id: string;
  availabilityId: string;
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
    title: `Beautime Admin - ${salon.name} - Editar disponibilidade de ${professional.name}`,
    description: `Edite as disponibilidades do profissional ${professional.name} no salão ${salon.name}.`,
  };
}

export default async function EditAvailabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id, availabilityId } = await params;

  let availabilityList: Availability[];
  let professionalName = "";
  try {
    availabilityList = await fetchAvailabilityByProfessional(id, token);
    const professional = await fetchProfessionalById(id, token);
    professionalName = professional.name;
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar disponibilidades"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/professionals/${id}`}
        linkText="Voltar ao profissional"
      />
    );
  }

  const availability = availabilityList.find((a) => a.id === availabilityId);

  if (!availability) {
    return (
      <ErrorSection
        title="Disponibilidade não encontrada"
        message="A disponibilidade que você está tentando editar não existe."
        linkHref={`/${slug}/dashboard/professionals/${id}/availability`}
        linkText="Voltar"
      />
    );
  }

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Disponibilidade
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Atualize as informações do horário do profissional{" "}
          <strong>{professionalName}</strong>
        </p>
      </header>

      {/* Form Card */}
      <form
        id="update-availability-form"
        action={updateAvailability}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6"
      >
        <input type="hidden" name="availabilityId" value={availability.id} />
        <input type="hidden" name="professionalId" value={id} />
        <input type="hidden" name="slug" value={slug} />

        {/* Dia da semana */}
        <div>
          <label htmlFor="weekday" className={labelClasses}>
            Dia da semana
          </label>
          <select
            id="weekday"
            name="weekday"
            defaultValue={availability.weekday}
            className={inputClasses}
          >
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6">Sábado</option>
          </select>
        </div>

        {/* Horário de início e término */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className={labelClasses}>
              Hora de início
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              defaultValue={availability.startTime}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="endTime" className={labelClasses}>
              Hora de término
            </label>
            <input
              id="endTime"
              type="time"
              name="endTime"
              defaultValue={availability.endTime}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <SubmitButton formId="update-availability-form" />
        </div>
      </form>

      {/* BackLink */}
      <footer className="mt-6">
        <BackLink
          slug={slug}
          to={`dashboard/professionals/${id}/availability`}
        />
      </footer>
    </section>
  );
}
