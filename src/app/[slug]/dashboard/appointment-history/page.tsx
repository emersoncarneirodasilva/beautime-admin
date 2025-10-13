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
import { CalendarClock, Mail, Phone, ClipboardList } from "lucide-react";

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

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Histórico de Agendamentos</h1>
      </header>

      {/* Filtros */}
      <form className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-10">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar por cliente..."
          className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />
        <select
          name="status"
          defaultValue={status}
          className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        >
          <option value="">Todos</option>
          <option value="COMPLETED">Concluídos</option>
          <option value="CANCELED">Cancelados</option>
        </select>
        <select
          name="limit"
          defaultValue={String(limit)}
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

      {/* Lista */}
      {historyData.appointmentsHistory.length === 0 ? (
        <div className="flex flex-1 justify-center items-center h-[60vh]">
          <p className="text-center text-gray-500 text-lg">
            Nenhum agendamento encontrado para os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historyData.appointmentsHistory.map((appt) => (
            <div
              key={appt.id}
              className="border border-[var(--color-gray-medium)] rounded-xl p-6 bg-[var(--color-white)] shadow-sm hover:shadow-md transition"
            >
              {/* Header do Card */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-lg font-semibold text-[var(--foreground)]">
                    {appt.clientName}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {formatIsoStringRaw(appt.scheduledAt)}
                  </p>
                </div>
                <StatusBadge value={appt.status} type="appointment" />
              </div>

              {/* Corpo */}
              <div className="flex flex-col gap-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[var(--color-action)]" />
                  <strong>E-mail:</strong> {appt.clientEmail}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[var(--color-action)]" />
                  <strong>Telefone:</strong> {appt.clientPhone}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarClock className="w-5 h-5 text-[var(--color-action)]" />
                  <strong>Movido em:</strong> {formatIsoStringRaw(appt.movedAt)}
                </p>
                <p className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[var(--color-action)]" />
                  <strong>Serviços:</strong>{" "}
                  {appt.services.length > 0
                    ? appt.services
                        .map((s) => {
                          const srv = servicesData.services.find(
                            (srv) => srv.id === s.serviceId
                          );
                          return srv
                            ? `${srv.name} (${
                                s.duration
                              } min - ${formatCurrency(s.price)})`
                            : "Desconhecido";
                        })
                        .join(", ")
                    : "Nenhum"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {historyData.appointmentsHistory.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
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
