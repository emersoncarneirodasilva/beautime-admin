import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import Pagination from "@/components/Pagination";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { fetchAppointments } from "@/libs/api/fetchAppointments";
import { AppointmentResponse, Appointment } from "@/types";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { formatCurrency } from "@/utils/formatCurrency";
import { Pencil } from "lucide-react";
import EditButton from "@/components/Buttons/EditButton";
import { StatusBadge } from "@/components/Appointment/StatusBadge";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Agendamentos`,
    description: `Gerencie os agendamentos do salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  appointmentStatus?: string;
  paymentStatus?: string;
  search?: string;
}

export default async function AppointmentsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const query = await searchParams;

  const page = Number(query?.page || 1);
  const limit = Number(query?.limit || 10);
  const status =
    typeof query?.appointmentStatus === "string" ? query.appointmentStatus : "";
  const paymentStatus =
    typeof query?.paymentStatus === "string" ? query.paymentStatus : "";
  const search = typeof query?.search === "string" ? query.search : "";

  let data: AppointmentResponse;

  try {
    data = await fetchAppointments({
      page,
      limit,
      status,
      paymentStatus,
      search,
    });
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar agendamentos"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
      </header>

      {/* Filtros */}
      <section>
        <form
          id="appointment-form"
          method="GET"
          className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-10"
        >
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Buscar por nome do cliente..."
            className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <select
            name="appointmentStatus"
            defaultValue={status}
            className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option value="">Todos os Status</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          <select
            name="paymentStatus"
            defaultValue={paymentStatus}
            className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option value="">Todos os Pagamentos</option>
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="REFUNDED">Reembolsado</option>
            <option value="PARTIALLY_PAID">Parcialmente Pago</option>
          </select>

          <select
            name="limit"
            defaultValue={limit.toString()}
            className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          >
            <option value="5">5 / página</option>
            <option value="10">10 / página</option>
            <option value="20">20 / página</option>
          </select>

          <button
            type="submit"
            className="bg-[var(--color-action)] text-[var(--text-on-action)] px-6 py-2.5 rounded-lg font-medium hover:bg-[var(--color-action-hover)] transition cursor-pointer"
          >
            Filtrar
          </button>
        </form>
      </section>

      {/* Lista */}
      <section className="space-y-4">
        {data.appointments.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            Nenhum agendamento encontrado para os filtros aplicados.
          </p>
        ) : (
          data.appointments.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              className="border border-[var(--color-gray-medium)] rounded-xl p-6 bg-[var(--color-white)] shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Cabeçalho */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 pb-4 border-b border-[var(--color-gray-light)]">
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    {appointment.user.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatIsoStringRaw(appointment.scheduledAt)}
                  </p>
                </div>

                {/* Status do agendamento */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">
                      Agendamento
                    </div>
                    <StatusBadge
                      value={appointment.status}
                      type="appointment"
                    />
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-400 uppercase">
                      Pagamento
                    </div>
                    <StatusBadge
                      value={appointment.payment.status}
                      type="payment"
                    />
                  </div>
                </div>
              </div>

              {/* Corpo */}
              <div className="py-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Pagamento:</strong>{" "}
                    {formatCurrency(appointment.payment.amount)}
                  </p>
                  <p>
                    <strong>Método:</strong> {appointment.payment.method}
                  </p>
                </div>

                <EditButton
                  formId="appointment-form"
                  className="inline-flex w-fit items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium duration-300 transition-colors cursor-pointer"
                  href={`/${slug}/dashboard/appointments/${appointment.id}/edit`}
                  text={
                    <>
                      <Pencil className="w-4 h-4" />
                      Editar
                    </>
                  }
                />
              </div>

              {/* Serviços */}
              <div className="pt-4 border-t border-[var(--color-gray-light)]">
                <strong className="block mb-2 text-sm text-[var(--foreground)]">
                  Serviços:
                </strong>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {appointment.services.map((s) => (
                    <li key={s.id}>
                      <span className="font-medium text-[var(--foreground)]">
                        {s.service.name}
                      </span>{" "}
                      ({s.service.duration} min) –{" "}
                      <span className="text-gray-500">
                        {s.professional.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Paginação */}
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        hrefBuilder={(p) =>
          `?page=${p}&limit=${limit}&appointmentStatus=${status}&paymentStatus=${paymentStatus}&search=${encodeURIComponent(
            search
          )}`
        }
      />
    </section>
  );
}
