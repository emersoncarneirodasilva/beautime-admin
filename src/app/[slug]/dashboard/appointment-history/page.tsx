import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentHistory } from "@/libs/api/fetchAppointmentHistory";
import { formatIsoStringRaw } from "@/utils/formatIsoStringRaw";
import { AppointmentHistoryType } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";
import { fetchServices } from "@/libs/api/fetchServices";

interface Params {
  slug: string;
}

interface SearchParams {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
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
  const queryParams = await searchParams;

  const page = Number(queryParams?.page || 1);
  const limit = Number(queryParams?.limit || 10);
  const status =
    queryParams?.status === "CANCELED" || queryParams?.status === "COMPLETED"
      ? queryParams.status
      : undefined;
  const search = queryParams?.search;

  const historyData: {
    appointmentsHistory: AppointmentHistoryType[];
    total: number;
  } = await fetchAppointmentHistory({ token, page, limit, status, search });

  const totalPages = Math.ceil(historyData.total / limit);

  const servicesData = await fetchServices(token, 1, 100);

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

      {/* 🔎 Filtros */}
      <form
        action=""
        method="GET"
        className="flex flex-wrap gap-4 bg-gray-700 p-4 rounded-lg mb-6"
      >
        {/* Busca */}
        <input
          type="text"
          name="search"
          placeholder="Buscar por cliente..."
          defaultValue={search || ""}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />

        {/* Status */}
        <select
          name="status"
          defaultValue={status || ""}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-700"
        >
          <option value="">Todos</option>
          <option value="COMPLETED">Concluídos</option>
          <option value="CANCELED">Cancelados</option>
        </select>

        {/* Limite */}
        <select
          name="limit"
          defaultValue={String(limit)}
          className="border border-gray-300 rounded px-3 py-2 bg-gray-700"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Aplicar
        </button>
      </form>

      {/* 📋 Lista */}
      {historyData.appointmentsHistory.length === 0 ? (
        <p className="text-center text-gray-400">
          Nenhum agendamento encontrado para os filtros aplicados.
        </p>
      ) : (
        <ul className="space-y-4">
          {historyData.appointmentsHistory.map(
            (appt: AppointmentHistoryType) => (
              <li
                key={appt.id}
                className="bg-gray-800 text-white p-4 rounded shadow-sm space-y-2"
              >
                <p>
                  <strong>🧾 Serviço:</strong>{" "}
                  {appt.services.length > 0
                    ? appt.services
                        .map((s) => {
                          const serviceInfo = servicesData.services.find(
                            (srv) => srv.id === s.serviceId
                          );
                          return `${
                            serviceInfo?.name || "Serviço desconhecido"
                          } (${s.duration} min - ${formatCurrency(s.price)})`;
                        })
                        .join(", ")
                    : "Nenhum"}
                </p>
                <p>
                  <strong>📅 Agendado:</strong>{" "}
                  {formatIsoStringRaw(appt.scheduledAt)}
                </p>
                <p>
                  <strong>📌 Status:</strong>{" "}
                  {appt.status === "CANCELED" ? "Cancelado" : "Concluído"}
                </p>
                <p>
                  <strong>👤 Cliente:</strong> {appt.clientName}
                </p>
                <p>
                  <strong>📧 E-mail:</strong> {appt.clientEmail}
                </p>
                <p>
                  <strong>📞 Telefone:</strong> {appt.clientPhone}
                </p>
                <p>
                  <strong>📤 Movido em:</strong>{" "}
                  {formatIsoStringRaw(appt.movedAt)}
                </p>
              </li>
            )
          )}
        </ul>
      )}

      {/* 📌 Paginação */}
      <div className="flex justify-between mt-6">
        <Link
          href={`?page=${page - 1}&limit=${limit}&status=${
            status || ""
          }&search=${search || ""}`}
          className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white ${
            page <= 1 ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Anterior
        </Link>
        <Link
          href={`?page=${page + 1}&limit=${limit}&status=${
            status || ""
          }&search=${search || ""}`}
          className={`px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white ${
            page >= totalPages ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          Próxima
        </Link>
      </div>
    </main>
  );
}
