import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchNotifications } from "@/libs/api/fetchNotifications";
import fetchUserById from "@/libs/api/fetchUserById";
import { NotificationType } from "@/types/notifications";
import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";

interface SearchParams {
  page?: string;
  limit?: string;
  isRead?: string;
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const page = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 10;
  const isRead =
    searchParams?.isRead === "true"
      ? true
      : searchParams?.isRead === "false"
      ? false
      : undefined;

  const { notifications } = await fetchNotifications({
    token,
    page,
    limit,
    isRead,
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:underline">
        ← Voltar
      </Link>

      <h1 className="text-3xl font-bold my-6">📬 Notificações</h1>

      <form className="flex flex-wrap gap-6 mb-6">
        <select
          name="isRead"
          defaultValue={searchParams?.isRead || ""}
          className="border px-3 py-2 rounded bg-black"
        >
          <option value="">Todas</option>
          <option value="true">Lidas</option>
          <option value="false">Não lidas</option>
        </select>

        <select
          name="limit"
          defaultValue={String(limit)}
          className="border px-3 py-2 rounded bg-black"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>

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
                  <div className="space-y-1">
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
        <Link
          href={`?page=${page - 1}&limit=${limit}&isRead=${
            searchParams?.isRead || ""
          }`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 ${
            page === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <Link
          href={`?page=${page + 1}&limit=${limit}&isRead=${
            searchParams?.isRead || ""
          }`}
          className={`px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 ${
            page >= notifications.totalPages
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
        >
          Próxima
        </Link>
      </div>
    </main>
  );
}
