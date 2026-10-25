import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import Pagination from "@/components/Pagination";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { fetchAppointmentHistory } from "@/libs/api/fetchAppointmentHistory";
import { fetchServices } from "@/libs/api/fetchServices";
import { AppointmentHistoryType } from "@/types";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { formatCurrency } from "@/utils/formatCurrency";
import { StatusBadge } from "@/components/Appointment/StatusBadge";
import {
  CalendarClock,
  CalendarDays,
  ClipboardList,
  Filter,
  Mail,
  Phone,
  Search,
  UserRound,
} from "lucide-react";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);
  return {
    title: `Beautime Admin - ${salon.name} - Histórico de Agendamentos`,
    description: `Visualize o histórico de agendamentos do salão ${salon.name}.`,
  };
}

export default async function AppointmentHistoryPage({
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
    query?.status === "CANCELED" || query?.status === "COMPLETED"
      ? query.status
      : "";
  const search = query?.search || "";

  let historyData: {
    appointmentsHistory: AppointmentHistoryType[];
    total: number;
  };

  let servicesData: {
    services: { id: string; name: string; price: number; duration: number }[];
  };

  try {
    historyData = await fetchAppointmentHistory({
      token,
      page,
      limit,
      status,
      search,
    });
    servicesData = await fetchServices(token, 1, 100);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar histórico"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard`}
        linkText="Voltar ao painel"
      />
    );
  }

  const totalPages = Math.ceil(historyData.total / limit);
  const currentPageCount = historyData.appointmentsHistory.length;

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      <header>
        <div>
          <h1>Histórico de Agendamentos</h1>
          <p>Consulte os atendimentos concluídos e cancelados do salão.</p>
        </div>
        <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--color-gray-medium)] bg-[var(--color-white)] px-3.5 text-sm font-medium text-[var(--text-secondary)]">
          <CalendarDays size={16} aria-hidden="true" />
          {historyData.total}{" "}
          {historyData.total === 1 ? "registro" : "registros"}
        </span>
      </header>

      <section aria-label="Pesquisa e filtros">
        <form method="GET" className="history-filter-form">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Filter
              size={17}
              className="text-[var(--color-action)]"
              aria-hidden="true"
            />
            <h2 className="text-sm font-semibold">Pesquisar e filtrar</h2>
          </div>

          <div className="history-filter-fields">
            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="history-search"
                className="block text-xs font-semibold text-[var(--text-secondary)]"
              >
                Cliente
              </label>
              <div className="relative">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                />
                <input
                  id="history-search"
                  type="text"
                  name="search"
                  aria-label="Pesquisar no histórico"
                  defaultValue={search}
                  placeholder="Buscar por cliente..."
                  className="history-search-input w-full"
                />
              </div>
            </div>
            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="history-status"
                className="block text-xs font-semibold text-[var(--text-secondary)]"
              >
                Status
              </label>
              <select
                id="history-status"
                name="status"
                aria-label="Filtrar por status"
                defaultValue={status}
                className="w-full"
              >
                <option value="">Todos</option>
                <option value="COMPLETED">Concluídos</option>
                <option value="CANCELED">Cancelados</option>
              </select>
            </div>
            <div className="min-w-0 space-y-1.5">
              <label
                htmlFor="history-limit"
                className="block text-xs font-semibold text-[var(--text-secondary)]"
              >
                Exibir por página
              </label>
              <select
                id="history-limit"
                name="limit"
                aria-label="Resultados por página"
                defaultValue={String(limit)}
                className="w-full"
              >
                <option value="5">5 / página</option>
                <option value="10">10 / página</option>
                <option value="20">20 / página</option>
              </select>
            </div>
          </div>

          <div className="history-filter-actions">
            <button
              type="submit"
              className="ui-button ui-button--primary"
            >
              <Search size={16} aria-hidden="true" />
              Filtrar
            </button>
          </div>
        </form>
      </section>

      {historyData.appointmentsHistory.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-gray-border)] bg-[var(--color-white)] px-5 py-12 text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--color-action-soft)] text-[var(--color-action)]">
            <CalendarClock size={22} aria-hidden="true" />
          </span>
          <h2 className="text-base font-semibold">
            Nenhum registro encontrado
          </h2>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
            Nenhum agendamento corresponde aos filtros aplicados. Ajuste a
            pesquisa ou o status selecionado.
          </p>
        </div>
      ) : (
        <section
          aria-label="Registros do histórico"
          className="space-y-4"
        >
          {historyData.appointmentsHistory.map((appt) => (
            <div
              key={appt.id}
              className="overflow-hidden rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
            >
              <div className="flex flex-col gap-4 border-b border-[var(--color-gray-medium)] pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--color-action-soft)] text-[var(--color-action)]">
                    <UserRound size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h2 className="break-words text-base font-semibold">
                      {appt.clientName}
                    </h2>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                      Agendado para
                    </p>
                    <time
                      dateTime={appt.scheduledAt}
                      className="mt-0.5 block text-sm font-medium text-[var(--foreground)]"
                    >
                      {formatIsoStringRaw(appt.scheduledAt)}
                    </time>
                  </div>
                </div>
                <StatusBadge
                  value={appt.status}
                  type="appointment"
                />
              </div>

              <div className="grid gap-5 pt-4 sm:grid-cols-2">
                <div className="grid gap-4">
                  <p className="flex min-w-0 items-start gap-2.5 text-sm">
                    <Mail
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--color-action)]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-all">
                      <span className="mr-1 font-semibold">E-mail:</span>
                      {appt.clientEmail}
                    </span>
                  </p>
                  <p className="flex min-w-0 items-start gap-2.5 text-sm">
                    <Phone
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--color-action)]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">
                      <span className="mr-1 font-semibold">Telefone:</span>
                      {appt.clientPhone}
                    </span>
                  </p>
                  <p className="flex min-w-0 items-start gap-2.5 text-sm">
                    <CalendarClock
                      size={17}
                      className="mt-0.5 shrink-0 text-[var(--color-action)]"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words">
                      <span className="mr-1 font-semibold">Movido em:</span>
                      {formatIsoStringRaw(appt.movedAt)}
                    </span>
                  </p>
                </div>
                <div className="min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-4">
                  <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                    <ClipboardList
                      size={15}
                      className="text-[var(--color-action)]"
                      aria-hidden="true"
                    />
                    Serviços
                  </h3>
                  <p className="break-words text-sm leading-relaxed text-[var(--foreground)]">
                    {appt.services.length > 0
                      ? appt.services
                          .map((s) => {
                            const srv = servicesData.services.find(
                              (srv) => srv.id === s.serviceId
                            );
                            return srv
                              ? `${srv.name} (${s.duration} min - ${formatCurrency(
                                  s.price
                                )})`
                              : "Desconhecido";
                          })
                          .join(", ")
                      : "Nenhum"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {currentPageCount > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={historyData.total}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&status=${status}&search=${encodeURIComponent(
              search
            )}`
          }
        />
      )}
    </section>
  );
}
