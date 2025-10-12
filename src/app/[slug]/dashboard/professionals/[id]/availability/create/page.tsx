import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { handleCreateAvailability } from "./actions/createAvailability";
import BackLink from "@/components/Buttons/BackLink";
import CreateButton from "@/components/Buttons/CreateButton";
import { Metadata } from "next";
import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

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
    title: `Beautime Admin - ${salon.name} - Criar disponibilidade de ${professional.name}`,
    description: `Crie uma nova disponibilidade para o profissional ${professional.name} no salão ${salon.name}.`,
  };
}

export default async function CreateAvailabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  const labelClasses = "block font-medium text-[var(--foreground)] mb-2";

  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Nova Disponibilidade
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Crie uma nova disponibilidade para o profissional.
        </p>
      </header>

      {/* Form */}
      <form
        id="create-availability-form"
        action={handleCreateAvailability}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 space-y-6"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="professionalId" value={id} />

        {/* Dia da semana */}
        <div>
          <label htmlFor="weekday" className={labelClasses}>
            Dia da semana
          </label>
          <select id="weekday" name="weekday" className={inputClasses}>
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6">Sábado</option>
          </select>
        </div>

        {/* Hora de início */}
        <div>
          <label htmlFor="startTime" className={labelClasses}>
            Início
          </label>
          <input
            id="startTime"
            type="time"
            name="startTime"
            required
            className={inputClasses}
          />
        </div>

        {/* Hora de término */}
        <div>
          <label htmlFor="endTime" className={labelClasses}>
            Término
          </label>
          <input
            id="endTime"
            type="time"
            name="endTime"
            required
            className={inputClasses}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <CreateButton
            formId="create-availability-form"
            label="Criar Horário"
            iconType="availability"
          />
        </div>
      </form>

      {/* Voltar */}
      <footer className="mt-6">
        <BackLink
          slug={slug}
          to={`dashboard/professionals/${id}/availability`}
        />
      </footer>
    </section>
  );
}
