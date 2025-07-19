import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import fetchUserById from "@/libs/api/fetchUserById";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchNotifications } from "@/libs/api/fetchNotifications";
import { NotificationType } from "@/types/notifications";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  isRead?: string;
  search?: string;
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

  const { notifications } = await fetchNotifications({
    token,
    page,
    limit,
    isRead,
    search,
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <Link
        href={`/${slug}/dashboard`}
        className="text-blue-600 hover:underline"
      >
        ← Voltar
      </Link>

      <h1 className="text-3xl font-bold my-6">📬 Notificações</h1>

      <form className="flex flex-wrap gap-6 mb-6">
        <select
          name="isRead"
          defaultValue={resolvedParams.isRead || ""}
          className="border px-3 py-2 rounded bg-black text-white"
        >
          <option value="">Todas</option>
          <option value="true">Lidas</option>
          <option value="false">Não lidas</option>
        </select>

        <select
          name="limit"
          defaultValue={String(limit)}
          className="border px-3 py-2 rounded bg-black text-white"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>

        <input
          type="search"
          name="search"
          placeholder="Buscar por mensagem ou cliente"
          defaultValue={search}
          className="border px-3 py-2 rounded bg-black text-white w-64"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Filtrar
        </button>
      </form>

      <ul className="space-y-4">
        {await Promise.all(
          notifications.data.map(async (notification: NotificationType) => {
            const user = await fetchUserById(
              notification.appointment.userId,
              token
            );

            return (
              <li
                key={notification.id}
                className={`border p-4 rounded shadow-sm flex flex-col gap-2 ${
                  notification.isRead ? "bg-gray-800" : "bg-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-white">
                    <p>
                      <strong>📩 Mensagem:</strong> {notification.message}
                    </p>
                    <p>
                      <strong>👤 Cliente:</strong> {user.name}
                    </p>
                    <p>
                      <strong>📅 Data:</strong>{" "}
                      {formatIsoStringRaw(notification.createdAt)}
                    </p>
                    <p>
                      <strong>📖 Status:</strong>{" "}
                      {notification.isRead ? "Lida" : "Não lida"}
                    </p>
                  </div>
                </div>
              </li>
            );
          })
        )}
      </ul>

      <div className="flex justify-between mt-6">
        {
          page > 1 ? (
            <Link
              href={`?page=${page - 1}&limit=${limit}&isRead=${
                resolvedParams.isRead || ""
              }&search=${encodeURIComponent(search)}`}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
            >
              Anterior
            </Link>
          ) : (
            <div></div>
          ) /* Espaço vazio para manter o alinhamento */
        }

        {page < notifications.totalPages && (
          <Link
            href={`?page=${page + 1}&limit=${limit}&isRead=${
              resolvedParams.isRead || ""
            }&search=${encodeURIComponent(search)}`}
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600"
          >
            Próxima
          </Link>
        )}
      </div>
    </main>
  );
}
