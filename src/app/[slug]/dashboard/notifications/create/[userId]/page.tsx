import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentsByUserId } from "@/libs/api/fetchAppointmentsByUserId";

import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";
import fetchUserById from "@/libs/api/fetchUserById";
import { createNotification } from "./actions/createNotification";

const statusMap: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado",
  COMPLETED: "Concluído",
};

type Params = { slug: string; userId: string };

export default async function CreateNotificationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const { userId } = await params;

  const user = await fetchUserById(userId, token);
  const appointments = await fetchAppointmentsByUserId(userId);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <Link
        href={`/${slug}/dashboard/users/${userId}`}
        className="text-blue-600 hover:underline"
      >
        ← Voltar para usuário
      </Link>

      <h1 className="text-2xl font-bold my-6">Criar Notificação</h1>

      <form action={createNotification} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="userId" value={userId} />

        <div>
          <label className="block font-semibold">Cliente</label>
          <p className="text-gray-300">{user.name}</p>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="appointmentId">
            Agendamento
          </label>
          <select
            name="appointmentId"
            id="appointmentId"
            required
            className="w-full p-2 bg-black border rounded"
          >
            <option value="">Selecione um agendamento</option>
            {appointments.map((a) => {
              const date = new Date(a.scheduledAt);
              const datePart = date.toLocaleDateString("pt-BR"); // ex: 04/06/2025
              const timePart = date.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return (
                <option key={a.id} value={a.id}>
                  {datePart}, {timePart} – Status:{" "}
                  {statusMap[a.status] || a.status} – Serviços:{" "}
                  {a.services.map((s) => s.service.name).join(", ")}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="message">
            Mensagem
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={4}
            className="w-full p-2 bg-black border rounded"
            placeholder="Digite a mensagem da notificação"
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded hover:cursor-pointer"
        >
          Criar Notificação
        </button>
      </form>
    </main>
  );
}
