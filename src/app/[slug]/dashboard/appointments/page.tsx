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
import {
  CalendarClock,
  CalendarDays,
  CreditCard,
  Filter,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react";
import EditButton from "@/components/Buttons/EditButton";
import { StatusBadge } from "@/components/Appointment/StatusBadge";
import { formatIsoWithTimezone } from "@/utils/formatIsoWithTimezone";

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
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header>
        <div>
          <h1>Agendamentos</h1>
          <p>Consulte e acompanhe os horários marcados no salão.</p>
        </div>
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--color-gray-medium)] bg-[var(--color-white)] px-3.5 text-sm font-medium text-[var(--text-secondary)]">
          <CalendarDays size={16} aria-hidden="true" />
          {data.total} {data.total === 1 ? "agendamento" : "agendamentos"}
        </span>
      </header>

      {/* Filtros */}
      <section aria-label="Pesquisa e filtros">
        <form
          id="appointment-form"
          method="GET"
          className="appointments-filter-form flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter size={17} className="text-[var(--color-action)]" aria-hidden="true" />
            <h2 className="text-sm font-semibold">Pesquisar e filtrar</h2>
          </div>

          <div className="appointments-filter-fields grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(16rem,1.5fr)_minmax(11rem,1fr)_minmax(11rem,1fr)_minmax(9rem,0.8fr)]">
            <div className="min-w-0 space-y-1.5">
              <label htmlFor="appointment-search" className="block text-xs font-semibold text-[var(--text-secondary)]">
                Cliente
              </label>
              <div className="appointments-search-wrapper relative">
                <Search size={17} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                <input
                  id="appointment-search"
                  type="text"
                  name="search"
                  aria-label="Pesquisar agendamentos"
                  defaultValue={search}
                  placeholder="Buscar por nome do cliente..."
                  className="appointments-search-input w-full"
                />
              </div>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label htmlFor="appointment-status" className="block text-xs font-semibold text-[var(--text-secondary)]">
                Status do agendamento
              </label>
              <select
                id="appointment-status"
                name="appointmentStatus"
                defaultValue={status}
                className="w-full"
              >
                <option value="">Todos os Status</option>
                <option value="PENDING">Pendente</option>
                <option value="CONFIRMED">Confirmado</option>
              </select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label htmlFor="payment-status" className="block text-xs font-semibold text-[var(--text-secondary)]">
                Status do pagamento
              </label>
              <select
                id="payment-status"
                name="paymentStatus"
                defaultValue={paymentStatus}
                className="w-full"
              >
                <option value="">Todos os Pagamentos</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="PARTIALLY_PAID">Parcialmente Pago</option>
              </select>
            </div>

            <div className="min-w-0 space-y-1.5">
              <label htmlFor="appointment-limit" className="block text-xs font-semibold text-[var(--text-secondary)]">
                Exibir por página
              </label>
              <select
                id="appointment-limit"
                name="limit"
                aria-label="Resultados por página"
                defaultValue={limit.toString()}
                className="w-full"
              >
                <option value="5">5 / página</option>
                <option value="10">10 / página</option>
                <option value="20">20 / página</option>
              </select>
            </div>
          </div>

          <div className="appointments-filter-actions flex flex-col-reverse gap-2 border-t border-[var(--color-gray-medium)] pt-4 sm:flex-row sm:items-center sm:justify-end">
            {(search || status || paymentStatus) && (
              <a
                href={`/${slug}/dashboard/appointments?limit=${limit}`}
                className="ui-button ui-button--secondary w-full sm:w-auto"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Limpar filtros
              </a>
            )}
            <button type="submit" className="ui-button ui-button--primary w-full whitespace-nowrap sm:w-auto">
              <Search size={16} aria-hidden="true" />
              Aplicar filtro
            </button>
          </div>
        </form>
      </section>

      {/* Lista */}
      <section aria-label="Lista de agendamentos" className="space-y-4">
        {data.appointments.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-gray-border)] bg-[var(--color-white)] px-5 py-12 text-center">
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--color-action-soft)] text-[var(--color-action)]">
              <CalendarClock size={22} aria-hidden="true" />
            </span>
            <h2 className="text-base font-semibold">Nenhum agendamento encontrado</h2>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              Não há resultados para os filtros aplicados. Ajuste a pesquisa ou os status selecionados.
            </p>
          </div>
        ) : (
          data.appointments.map((appointment: Appointment) => (
            <div
              key={appointment.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6">
                <div className="min-w-0 space-y-5">
                  <div className="flex flex-col gap-4 border-b border-[var(--color-gray-medium)] pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-action-soft)] text-[var(--color-action)]">
                        <CalendarClock size={20} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                          Agendado para
                        </p>
                        <time
                          dateTime={appointment.scheduledAt}
                          className="mt-1 block break-words font-[var(--font-poppins)] text-base font-semibold text-[var(--foreground)] sm:text-lg"
                        >
                          {formatIsoStringRaw(appointment.scheduledAt)}
                        </time>
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          Criado em {formatIsoWithTimezone(appointment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:min-w-64">
                      <div className="min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-2.5">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                          Agendamento
                        </p>
                        <StatusBadge value={appointment.status} type="appointment" />
                      </div>
                      <div className="min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-2.5">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                          Pagamento
                        </p>
                        <StatusBadge value={appointment.payment.status} type="payment" />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <section className="min-w-0">
                      <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                        <UserRound size={15} aria-hidden="true" />
                        Cliente
                      </h2>
                      <p className="break-words font-semibold text-[var(--foreground)]">
                        {appointment.user.name}
                      </p>
                      <p className="mt-1 break-all text-sm text-[var(--text-secondary)]">
                        {appointment.user.email}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                        {appointment.user.phone}
                      </p>
                    </section>

                    <section className="min-w-0">
                      <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                        <CreditCard size={15} aria-hidden="true" />
                        Pagamento
                      </h2>
                      <p className="font-[var(--font-poppins)] text-lg font-semibold text-[var(--foreground)]">
                        {formatCurrency(appointment.payment.amount)}
                      </p>
                      <p className="mt-1 break-words text-sm text-[var(--text-secondary)]">
                        {appointment.payment.method}
                      </p>
                    </section>
                  </div>

                  <section className="border-t border-[var(--color-gray-medium)] pt-4">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Serviços e profissionais
                    </h2>
                    <ul className="divide-y divide-[var(--color-gray-medium)]">
                      {appointment.services.map((s) => (
                        <li
                          key={s.id}
                          className="grid gap-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-4"
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm font-semibold text-[var(--foreground)]">
                              {s.service.name}
                            </p>
                            <p className="mt-0.5 break-words text-sm text-[var(--text-secondary)]">
                              {s.professional.name}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-[var(--text-secondary)]">
                            {s.service.duration} min
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="flex items-end justify-start border-t border-[var(--color-gray-medium)] pt-4 lg:items-start lg:justify-end lg:border-0 lg:pt-0">
                  <EditButton
                    formId="appointment-form"
                    href={`/${slug}/dashboard/appointments/${appointment.id}/edit`}
                    text="Editar"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Paginação */}
      {data.appointments.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={data.totalPages}
          totalItems={data.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&appointmentStatus=${status}&paymentStatus=${paymentStatus}&search=${encodeURIComponent(
              search
            )}`
          }
        />
      )}
    </section>
  );
}
