import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { WEEKDAYS } from "@/utils/constants";
import { handleCreateBusinessHour } from "./actions/handleCreateBusinessHour";
import BackLink from "@/components/Buttons/BackLink";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Metadata } from "next";
import SubmitButton from "@/components/Buttons/SubmitButton";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";

interface Params {
  slug: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);
  return {
    title: `Beautime Admin - ${salon.name} - Criar Horário`,
    description: `Crie um novo horário de funcionamento para o salão ${salon.name}.`,
  };
}

export default async function CreateBusinessHourPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const labelClasses = "block font-medium text-[var(--foreground)] mb-2";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <header>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Horário
        </h1>
        <p className="text-[var(--text-secondary)]">
          Adicione um novo horário de funcionamento para o salão.
        </p>
      </header>

      <form
        id="create-businessHour-form"
        action={handleCreateBusinessHour}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Dia da semana */}
          <div>
            <label htmlFor="weekday" className={labelClasses}>
              Dia da semana
            </label>
            <select
              id="weekday"
              name="weekday"
              required
              className={inputClasses}
            >
              {WEEKDAYS.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Início */}
          <div>
            <label htmlFor="startTime" className={labelClasses}>
              Início
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              required
              className={inputClasses}
            />
          </div>

          {/* Fim */}
          <div>
            <label htmlFor="endTime" className={labelClasses}>
              Fim
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Botão salvar */}
        <div className="flex justify-end mt-8">
          <SubmitButton formId="create-businessHour-form" />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/business-hours" />
    </section>
  );
}
