import { Metadata } from "next";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import fetchUserById from "@/libs/api/fetchUserById";
import { fetchNotifications } from "@/libs/api/fetchNotifications";
import { NotificationsResponse, NotificationType } from "@/types/notifications";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { Mail, User, CalendarDays } from "lucide-react";
import Pagination from "@/components/Pagination";
import DeleteButton from "@/components/Buttons/DeleteButton";
import { handleDeleteNotification } from "./actions/handleDeleteNotification";
import EditButton from "@/components/Buttons/EditButton";

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

  const { notifications }: NotificationsResponse = await fetchNotifications({
    token,
    page,
    limit,
    isRead,
    search,
  });

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Notificações</h1>
      </header>

      {/* Filtros */}
      <form className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 mb-10">
        <input
          type="search"
          name="search"
          placeholder="Buscar por mensagem ou cliente..."
          defaultValue={search}
          className="flex-grow border border-[var(--color-gray-medium)] rounded-lg px-4 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        />
        <select
          name="isRead"
          defaultValue={resolvedParams.isRead || ""}
          className="border border-[var(--color-gray-medium)] rounded-lg px-3 py-2.5 bg-[var(--color-white)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
        >
          <option value="">Todas</option>
          <option value="true">Lidas</option>
          <option value="false">Não lidas</option>
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
      {notifications.data.length === 0 ? (
        <div className="flex flex-1 justify-center items-center h-[60vh]">
          <p className="text-center text-gray-500 text-lg">
            Nenhuma notificação encontrada para os filtros aplicados.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {await Promise.all(
            notifications.data.map(async (notification: NotificationType) => {
              const user = await fetchUserById(
                notification.appointment.userId,
                token
              );

              return (
                <div
                  key={notification.id}
                  className="border border-[var(--color-gray-medium)] rounded-xl p-6 bg-[var(--color-white)] shadow-md hover:shadow-lg transition-all w-full"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                    <p className="text-lg font-semibold text-[var(--foreground)] flex-1 break-words">
                      {notification.message}
                    </p>

                    <div className="flex flex-col lg:flex-row gap-2 mt-2 lg:mt-0 flex-shrink-0">
                      <EditButton
                        formId=""
                        href={`/${slug}/dashboard/notifications/${notification.id}/edit`}
                        className="bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--text-on-action)] px-4 py-1.5 rounded transition cursor-pointer w-full lg:w-auto"
                      />
                      <form
                        id={`delete-notification-form-${notification.id}`}
                        action={handleDeleteNotification}
                        className="w-full lg:w-auto"
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
                          className="bg-[var(--color-error)] hover:bg-[#d62828] text-[var(--text-on-action)] px-4 py-1.5 rounded transition cursor-pointer w-full lg:w-auto"
                        />
                      </form>
                    </div>
                  </div>

                  {/* Corpo */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-sm text-[var(--foreground)] mt-8">
                    <p className="flex items-center gap-2 flex-1 min-w-0">
                      <User className="w-5 h-5 text-[var(--color-action)]" />
                      <strong>Cliente:</strong> {user.name}
                    </p>
                    <p className="flex items-center gap-2 flex-1 min-w-0">
                      <CalendarDays className="w-5 h-5 text-[var(--color-action)]" />
                      <strong>Data:</strong>{" "}
                      {formatIsoStringRaw(notification.createdAt)}
                    </p>
                    <p className="flex items-center gap-2 flex-1 min-w-0">
                      <Mail className="w-5 h-5 text-[var(--color-action)]" />
                      <strong>Status:</strong>{" "}
                      {notification.isRead ? "Lida" : "Não lida"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Paginação */}
      {notifications.data.length !== 0 && (
        <Pagination
          currentPage={page}
          totalPages={notifications.totalPages}
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
