import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { WEEKDAYS } from "@/utils/constants";
import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchBusinessHourById } from "@/libs/api/fetchBusinessHourById";
import { handleUpdateBusinessHour } from "./actions/updateBusinessHour";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { Metadata } from "next";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";

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

  const { id, slug } = await params;
  const hour = await fetchBusinessHourById(id, slug);
  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Editar Horário (${
      WEEKDAYS[hour.weekday]
    })`,
    description: `Edite o horário de funcionamento de ${
      WEEKDAYS[hour.weekday]
    } no salão ${salon.name}.`,
  };
}

export default async function EditBusinessHourPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;
  const hour = await fetchBusinessHourById(id, slug);

  const labelClasses = "block font-medium text-[var(--foreground)] mb-2";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar horário
        </h1>
        <p className="text-[var(--text-secondary)]">
          Altere o horário de{" "}
          <span className="font-bold">{WEEKDAYS[hour.weekday]}</span> conforme
          necessário.
        </p>
      </header>

      <form
        id="edit-businessHour-form"
        action={handleUpdateBusinessHour}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 transition-colors"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={hour.id} />

        {/* Início */}
        <div>
          <label htmlFor="startTime" className={labelClasses}>
            Início
          </label>
          <input
            id="startTime"
            type="time"
            name="startTime"
            defaultValue={hour.startTime}
            required
            className={inputClasses}
          />
        </div>

        {/* Fim */}
        <div>
          <label htmlFor="endTime" className={labelClasses}>
            Término
          </label>
          <input
            id="endTime"
            type="time"
            name="endTime"
            defaultValue={hour.endTime}
            required
            className={inputClasses}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <SubmitButton formId="edit-businessHour-form" />
        </div>
      </form>

      <BackLink slug={slug} to="dashboard/business-hours" />
    </section>
  );
}
