import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentById } from "@/libs/api/fetchAppointmentById";
import { updateAppointment } from "./actions/updateAppointment";
import { Appointment } from "@/types";
import BackLink from "@/components/Buttons/BackLink";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { StatusBadge } from "@/components/Appointment/StatusBadge";
import ConfirmSubmitButton from "@/components/Buttons/ConfirmSubmitButton";

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
  const salon = await fetchSalonByAdmin(token);
  const appointment = await fetchAppointmentById(id, token);

  return {
    title: `Beautime Admin - ${salon.name} - Editar Agendamento`,
    description: `Editar agendamento de ${appointment.user.name} no salão ${salon.name}.`,
  };
}

const labelClasses = "block font-medium text-[var(--foreground)]";
const inputClasses =
  "w-full px-4 py-3 rounded-xl border bg-[var(--color-gray-light)] border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let appointment: Appointment;

  try {
    appointment = await fetchAppointmentById(id, token);
  } catch (err) {
    return (
      <ErrorSection
        title="Erro ao carregar agendamento"
        message={(err as Error).message}
        linkHref={`/${slug}/dashboard/appointments`}
        linkText="Voltar"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Cabeçalho */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Agendamento
        </h1>
        <p className="text-[var(--text-secondary)]">
          Atualize os status e métodos de pagamento do agendamento.
        </p>
      </header>

      {/* Formulário */}
      <form
        id="edit-appointment-form"
        action={updateAppointment}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="appointmentId" value={appointment.id} />

        {/* Statuses com badges coloridas */}
        <div className="flex gap-4 mb-4">
          <StatusBadge value={appointment.status} type="appointment" />
          <StatusBadge value={appointment.payment.status} type="payment" />
        </div>

        {/* Status do agendamento */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newAppointmentStatus" className={labelClasses}>
            Alterar status do agendamento
          </label>
          <select
            id="newAppointmentStatus"
            name="newAppointmentStatus"
            defaultValue={appointment.status}
            className={inputClasses}
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
        </div>

        {/* Status do pagamento */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newPaymentStatus" className={labelClasses}>
            Alterar status do pagamento
          </label>
          <select
            id="newPaymentStatus"
            name="newPaymentStatus"
            defaultValue={appointment.payment.status}
            className={inputClasses}
          >
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="REFUNDED">Reembolsado</option>
            <option value="PARTIALLY_PAID">Parcialmente Pago</option>
          </select>
        </div>

        {/* Método de pagamento */}
        <div className="flex flex-col gap-2">
          <label htmlFor="newPaymentMethod" className={labelClasses}>
            Método de pagamento
          </label>
          <select
            id="newPaymentMethod"
            name="newPaymentMethod"
            defaultValue={appointment.payment.method}
            className={inputClasses}
          >
            <option value="A VISTA">À Vista</option>
            <option value="CARTÃO DE CRÉDITO">Cartão de Crédito</option>
            <option value="CARTÃO DE DÉBITO">Cartão de Débito</option>
            <option value="PIX">Pix</option>
            <option value="BOLETO">Boleto</option>
          </select>
        </div>

        {/* Botão de salvar */}
        <div className="flex justify-end mt-6">
          <ConfirmSubmitButton
            formId="edit-appointment-form"
            originalStatus={appointment.status}
            originalPaymentStatus={appointment.payment.status}
            originalPaymentMethod={appointment.payment.method}
          />
        </div>
      </form>

      {/* Link de volta */}
      <BackLink slug={slug} to={`dashboard/appointments`} />
    </section>
  );
}
