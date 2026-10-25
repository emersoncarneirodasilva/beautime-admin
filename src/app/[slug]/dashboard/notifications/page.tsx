import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchNotifications } from "@/libs/api/fetchNotifications";
import { NotificationsResponse, NotificationType } from "@/types/notifications";
import {
  User,
  CalendarDays,
  ClipboardList,
  UserCheck,
  Briefcase,
  Search,
} from "lucide-react";
import Pagination from "@/components/Pagination";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { handleDeleteNotification } from "./actions/handleDeleteNotification";
import EditButton from "@/components/Buttons/EditButton";
import { StatusBadge } from "@/components/Appointment/StatusBadge";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import ErrorSection from "@/components/Error/ErrorSection";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  isRead?: string;
  search?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };
  return { title: "Beautime Admin - Notificações" };
}

export default async function NotificationsPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page || 1);
  const limit = Number(resolvedParams.limit || 10);
  const isRead =
    resolvedParams.isRead === "true"
      ? true
      : resolvedParams.isRead === "false"
      ? false
      : undefined;
  const search = resolvedParams.search || "";

  let notifications: NotificationsResponse["notifications"];

  try {
    const response: NotificationsResponse = await fetchNotifications({
      token,
      page,
      limit,
      isRead,
      search,
    });

    notifications = response.notifications;
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar notificações"
        message={(error as Error).message}
        linkHome={`/${slug}/dashboard`}
        linkHref={`/${slug}/dashboard/notifications`}
        linkText="Voltar"
      />
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Notificações
        </h1>
      </header>

      {/* Filtros */}
      <form method="GET" className="admin-filter-form admin-filter-form--with-status">
        <div className="admin-filter-field admin-filter-search">
          <label htmlFor="notifications-search">Pesquisar notificações</label>
          <div className="admin-filter-input-wrap">
            <Search aria-hidden="true" />
            <input
              id="notifications-search"
              type="search"
              name="search"
              className="admin-filter-control"
              aria-label="Pesquisar notificações"
              placeholder="Buscar por mensagem ou cliente..."
              defaultValue={search}
            />
          </div>
        </div>
        <div className="admin-filter-field">
          <label htmlFor="notifications-read-status">Status de leitura</label>
          <select
            id="notifications-read-status"
            name="isRead"
            aria-label="Filtrar por status de leitura"
            defaultValue={resolvedParams.isRead || ""}
          >
            <option value="">Todas</option>
            <option value="true">Lidas</option>
            <option value="false">Não lidas</option>
          </select>
        </div>
        <div className="admin-filter-field">
          <label htmlFor="notifications-limit">Exibir por página</label>
          <select
            id="notifications-limit"
            name="limit"
            aria-label="Resultados por página"
            defaultValue={String(limit)}
          >
            <option value="5">5 / página</option>
            <option value="10">10 / página</option>
            <option value="20">20 / página</option>
          </select>
        </div>
        <button type="submit" className="ui-button ui-button--primary">
          Filtrar
        </button>
      </form>

      {/* Lista de notificações */}
      {notifications.data.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-center text-gray-500 text-lg">
            Nenhuma notificação encontrada para os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.data.map((notification: NotificationType) => {
            const snapshot = notification.snapshot;
            const userName = snapshot?.data?.user?.name || "Cliente histórico";

            const services = (snapshot?.data?.services || []).map((s: any) => ({
              service:
                "service" in s
                  ? s.service
                  : { id: s.serviceId || "", name: s.serviceName || "" },
              professional:
                "professional" in s
                  ? s.professional
                  : {
                      id: s.professionalId || "",
                      name: s.professionalName || "",
                    },
            }));

            const afterStatus = snapshot?.data?.afterStatus || "PENDING";
            const afterScheduledAt = snapshot?.data?.afterScheduledAt
              ? formatIsoStringRaw(snapshot.data.afterScheduledAt)
              : "-";

            return (
              <div
                key={notification.id}
                className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-xl p-6 shadow-md hover:shadow-lg transition-all flex flex-col gap-4"
              >
                {/* Mensagem principal + Lida / Não Lida */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <p className="text-lg text-center sm:text-start font-semibold text-[var(--foreground)] break-words">
                    {notification.message}
                  </p>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium self-center text-center w-20 inline-block ${
                      notification.isRead
                        ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                        : "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                    }`}
                  >
                    {notification.isRead ? "Lida" : "Não lida"}
                  </span>
                </div>

                {/* Cliente, Data e Status */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-[var(--foreground)]">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                    <User className="w-5 h-5 text-[var(--color-primary)]" />
                    <span>
                      <strong>Cliente:</strong> {userName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-[var(--color-primary)]" />
                      <span>
                        <strong>Data:</strong> {afterScheduledAt}
                      </span>
                    </div>
                    <StatusBadge value={afterStatus} type="appointment" />
                  </div>
                </div>

                {/* Serviços/Profissionais + Botões */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 flex-wrap">
                  <div className="flex flex-wrap gap-4">
                    {services.map((s) => (
                      <div
                        key={`${s.service.id}-${s.professional.id}`}
                        className="flex flex-col gap-5 text-sm text-[var(--foreground)]"
                      >
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-[var(--color-primary)]" />
                          <span>
                            <strong>Serviço:</strong> {s.service.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCheck className="w-5 h-5 text-[var(--color-primary)]" />
                          <span>
                            <strong>Profissional:</strong> {s.professional.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {afterStatus !== "COMPLETED" &&
                    afterStatus !== "CANCELED" &&
                    snapshot.appointmentId && (
                      <div className="flex gap-2 flex-shrink-0 mt-2 sm:mt-0">
                        <EditButton
                          formId=""
                          href={`/${slug}/dashboard/notifications/${notification.id}/edit`}
                          className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--text-on-action)] px-4 py-1.5 rounded-lg font-medium text-sm transition cursor-pointer"
                        />
                        <form
                          id={`delete-notification-form-${notification.id}`}
                          action={handleDeleteNotification}
                        >
                          <input
                            type="hidden"
                            name="notificationId"
                            value={notification.id}
                          />
                          <input type="hidden" name="token" value={token} />
                          <input type="hidden" name="slug" value={slug} />

                          <DeleteButton
                            formId={`delete-notification-form-${notification.id}`}
                            confirmMessage="Tem certeza que deseja excluir essa notificação?"
                            className="min-h-10 rounded-lg bg-[var(--color-error)] px-4 py-1.5 text-sm font-medium text-[var(--text-on-error)] transition hover:bg-[var(--color-error-hover)]"
                          />
                        </form>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Paginação */}
      {notifications.data.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={notifications.totalPages}
          totalItems={notifications.totalCount}
          pageSize={limit}
          hrefBuilder={(p) =>
            `?page=${p}&limit=${limit}&isRead=${
              resolvedParams.isRead || ""
            }&search=${encodeURIComponent(search)}`
          }
        />
      )}
    </section>
  );
}
