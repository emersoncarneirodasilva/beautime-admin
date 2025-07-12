import Link from "next/link";
import { fetchAppointments } from "@/libs/api/fetchAppointments";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { Appointment, AppointmentResponse } from "@/types";

interface SearchParams {
  page?: string;
  limit?: string;
  appointmentStatus?: string;
  paymentStatus?: string;
}

export default async function AppointmentsPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 10;
  const status =
    typeof searchParams.appointmentStatus === "string"
      ? searchParams.appointmentStatus
      : "";
  const paymentStatus =
    typeof searchParams.paymentStatus === "string"
      ? searchParams.paymentStatus
      : "";

  const data: AppointmentResponse = await fetchAppointments({
    page,
    limit,
    status,
    paymentStatus,
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        ← Voltar
      </Link>

      <h1 className="text-2xl font-bold my-6">Agendamentos</h1>

      <form className="flex gap-4 mb-6">
        <select
          name="appointmentStatus"
          defaultValue={status}
          className="border px-3 py-2 rounded bg-black text-white"
        >
          <option value="">Todos os Status</option>
          <option value="PENDING">Pendente</option>
          <option value="CONFIRMED">Confirmado</option>
          <option value="CANCELED">Cancelado</option>
          <option value="COMPLETED">Concluído</option>
        </select>

        <select
          name="paymentStatus"
          defaultValue={paymentStatus}
          className="border px-3 py-2 rounded bg-black text-white"
        >
          <option value="">Todos os Pagamentos</option>
          <option value="PENDING">Pendente</option>
          <option value="PAID">Pago</option>
          <option value="REFUNDED">Reembolsado</option>
          <option value="PARTIALLY_PAID">Parcialmente Pago</option>
        </select>

        <select
          name="limit"
          defaultValue={String(limit)}
          className="border px-3 py-2 rounded bg-black text-white"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Filtrar
        </button>
      </form>

      <ul className="space-y-4">
        {data.appointments.map((appointment: Appointment) => (
          <li
            key={appointment.id}
            className="border p-4 rounded shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <div>
                <p>
                  <strong>Cliente:</strong> {appointment.user.name}
                </p>
                <p>
                  <strong>Data:</strong>{" "}
                  {formatIsoStringRaw(appointment.scheduledAt)}
                </p>
                <p>
                  <strong>Status:</strong> {appointment.status}
                </p>
                <p>
                  <strong>Pagamento:</strong> {appointment.payment.status} – R${" "}
                  {appointment.payment.amount}
                </p>
                <p>
                  <strong>Método:</strong> {appointment.payment.method}
                </p>
              </div>
              <Link
                href={`/dashboard/appointments/${appointment.id}/edit`}
                className="self-start px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm hover:cursor-pointer transition"
              >
                Editar
              </Link>
            </div>

            <div>
              <strong>Serviços:</strong>
              <ul className="list-disc list-inside">
                {appointment.services.map((s) => (
                  <li key={s.id}>
                    {s.service.name} – {s.professional.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6">
        <Link
          href={`?page=${
            page - 1
          }&limit=${limit}&appointmentStatus=${status}&paymentStatus=${paymentStatus}`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 ${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <Link
          href={`?page=${
            page + 1
          }&limit=${limit}&appointmentStatus=${status}&paymentStatus=${paymentStatus}`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 ${
            page >= data.totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Link>
      </div>
    </main>
  );
}
