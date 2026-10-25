import AppointmentClientContainer from "@/components/Appointment/AppointmentClientContainer";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Metadata } from "next";
import { CalendarPlus, Sparkles } from "lucide-react";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Agendamento`,
    description: `Crie agendamentos para clientes do ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

export default async function AppointmentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      <ErrorToastFromParams />

      <header className="mb-0">
        <div>
          <h1>Agendar</h1>
          <p>
            Selecione o cliente, o serviço, o horário e a forma de pagamento
            para concluir o agendamento.
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-action-soft)] text-[var(--color-action)]">
          <CalendarPlus size={22} aria-hidden="true" />
        </span>
      </header>
      <AppointmentClientContainer token={token} slug={slug} />
    </section>
  );
}
