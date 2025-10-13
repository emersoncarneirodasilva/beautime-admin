import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchBusinessHours } from "@/libs/api/fetchBusinessHours";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { WEEKDAYS } from "@/utils/constants";
import ActionButton from "@/components/Buttons/ActionButton";
import ErrorSection from "@/components/Error/ErrorSection";
import EditButton from "@/components/Buttons/EditButton";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { handleDeleteBusinessHour } from "./actions/handleDeleteBusinessHour";

interface Params {
  slug: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);
  return {
    title: `Beautime Admin - ${salon.name} - Horários de Funcionamento`,
    description: `Gerencie os horários de funcionamento do salão ${salon.name}.`,
  };
}

export default async function BusinessHoursPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  let businessHours;
  try {
    businessHours = await fetchBusinessHours(token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar horários"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
          Horários de Funcionamento
        </h1>
        <div className="flex justify-center sm:justify-end">
          <ActionButton
            href={`/${slug}/dashboard/business-hours/create`}
            text="Criar Horário"
          />
        </div>
      </header>

      {/* Lista de horários */}
      <section>
        {businessHours.length === 0 ? (
          <div className="flex flex-1 justify-center items-center h-[60vh]">
            <p className="text-center text-gray-500 text-lg">
              Nenhum horário cadastrado ainda.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessHours.map((hour) => (
              <li
                key={hour.id}
                className="
                  border border-[var(--color-gray-medium)]
                  rounded-xl
                  p-4
                  bg-[var(--color-white)]
                  dark:bg-[var(--color-gray-light)]
                  hover:shadow-md
                  transition-all
                  duration-200
                  shadow-sm
                  flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2
                "
              >
                {/* Container do dia + horário + botões */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full flex-wrap gap-2">
                  {/* Dia + horário */}
                  <div className="flex flex-col items-center sm:items-start flex-shrink-0">
                    <h2 className="text-lg font-semibold text-[var(--foreground)] whitespace-nowrap">
                      {WEEKDAYS[hour.weekday]}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 whitespace-nowrap">
                      {hour.startTime} - {hour.endTime}
                    </p>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2 mt-2 sm:mt-0 flex-wrap justify-center sm:justify-start flex-shrink">
                    <EditButton
                      formId=""
                      href={`/${slug}/dashboard/business-hours/${hour.id}/edit`}
                      className="
                        px-2.5 py-1 rounded-md font-medium
                        text-[var(--text-on-action)]
                        bg-[var(--color-secondary)]
                        hover:bg-[var(--color-secondary-hover)]
                        transition shadow-sm hover:shadow-md cursor-pointer text-sm
                      "
                    />
                    <form
                      id={`delete-hour-form-${hour.id}`}
                      action={handleDeleteBusinessHour}
                    >
                      <input type="hidden" name="hourId" value={hour.id} />
                      <input type="hidden" name="token" value={token} />
                      <input type="hidden" name="slug" value={slug} />
                      <DeleteButton
                        formId={`delete-hour-form-${hour.id}`}
                        confirmMessage="Tem certeza que deseja excluir este horário?"
                        className="
                          px-2.5 py-1 rounded-md font-medium
                          text-[var(--text-on-action)]
                          bg-[var(--color-error)]
                          hover:bg-[#d62828]
                          transition shadow-sm hover:shadow-md cursor-pointer text-sm
                        "
                      />
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </section>
  );
}
