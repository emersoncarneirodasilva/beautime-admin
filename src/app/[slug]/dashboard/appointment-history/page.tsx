import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentHistory } from "@/libs/api/fetchAppointmentHistory";
import { fetchServices } from "@/libs/api/fetchServices";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { AppointmentHistoryType } from "@/types";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
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

  const queryParams = await searchParams;
  const { slug } = await params;
  const page = Number(queryParams?.page || 1);
  const limit = Number(queryParams?.limit || 10);
  const status = queryParams?.status;

  const statusFiltered =
    status === "CANCELED" || status === "COMPLETED" ? status : undefined;

  const [history, services] = await Promise.all([
    fetchAppointmentHistory({ token, page, limit, status: statusFiltered }),
    fetchServices(token),
  ]);

  const serviceMap = new Map(services.map((s) => [s.id, s.name]));

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📖 Histórico de Agendamentos</h1>
        <Link
          href={`/${slug}/dashboard`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Voltar para o painel
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap gap-4 mb-6">
        <select
          name="status"
          defaultValue={status || ""}
          className="bg-black border px-3 py-2 rounded"
        >
          <option value="">Todos</option>
          <option value="CANCELED">Cancelados</option>
          <option value="COMPLETED">Concluídos</option>
        </select>

        <select
          name="limit"
          defaultValue={String(limit)}
          className="bg-black border px-3 py-2 rounded"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer transition"
        >
          Filtrar
        </button>
      </form>

      <ul className="space-y-4">
        {history.appointmentsHistory.map((appt: AppointmentHistoryType) => (
          <li
            key={appt.id}
            className="bg-gray-800 p-4 rounded shadow-sm space-y-2"
          >
            <p>
              <strong>📅 Horário:</strong>{" "}
              {formatIsoStringRaw(appt.scheduledAt)}
            </p>
            <p>
              <strong>📌 Status:</strong>{" "}
              {appt.status === "CANCELED" ? "Cancelado" : "Concluído"}
            </p>
            <p>
              <strong>📤 Movido em:</strong> {formatIsoStringRaw(appt.movedAt)}
            </p>
            <p>
              <strong>🧾 Serviços:</strong>{" "}
              {appt.services.length > 0
                ? appt.services
                    .map(
                      (s) =>
                        serviceMap.get(s.serviceId) ?? "Serviço desconhecido"
                    )
                    .join(", ")
                : "Nenhum"}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-6">
        <Link
          href={`?page=${page - 1}&limit=${limit}&status=${status || ""}`}
          className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 ${
            page <= 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <Link
          href={`?page=${page + 1}&limit=${limit}&status=${status || ""}`}
          className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 ${
            page >= history.totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Link>
      </div>
    </main>
  );
}
