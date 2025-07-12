import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentById } from "@/libs/api/fetchAppointmentById";
import { updateAppointment } from "./actions/updateAppointment";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import Link from "next/link";
import { Appointment } from "@/types";

type Params = Promise<{ id: string }>;

export default async function EditAppointmentPage({
  params,
}: {
  params: Params;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { id } = await params;

  let appointment: Appointment;

  try {
    appointment = await fetchAppointmentById(id, token);
  } catch (err) {
    return (
      <ErrorSection
        title="Erro ao carregar agendamento"
        message={(err as Error).message}
        linkHref="/dashboard/appointments"
        linkText="Voltar"
      />
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Agendamento</h1>

      <form action={updateAppointment}>
        <input type="hidden" name="appointmentId" value={appointment.id} />

        <div className="mb-4">
          <label className="block font-medium mb-1">
            Status do agendamento
          </label>
          <select
            name="newAppointmentStatus"
            defaultValue={appointment.status}
            className="w-full border px-3 py-2 rounded bg-black"
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Status do pagamento</label>
          <select
            name="newPaymentStatus"
            defaultValue={appointment.payment.status}
            className="w-full border px-3 py-2 rounded bg-black"
          >
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="REFUNDED">Reembolsado</option>
            <option value="PARTIALLY_PAID">Parcialmente Pago</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-1">Método de pagamento</label>
          <select
            name="newPaymentMethod"
            defaultValue={appointment.payment.method}
            className="w-full border px-3 py-2 rounded bg-black"
          >
            <option value="A VISTA">À Vista</option>
            <option value="CARTÃO DE CRÉDITO">Cartão de Crédito</option>
            <option value="CARTÃO DE DÉBITO">Cartão de Débito</option>
            <option value="PIX">Pix</option>
            <option value="BOLETO">Boleto</option>
          </select>
        </div>

        <div className="flex justify-between items-end">
          <Link
            href="/dashboard/appointments"
            className="hover:underline text-blue-600"
          >
            Voltar
          </Link>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </main>
  );
}
