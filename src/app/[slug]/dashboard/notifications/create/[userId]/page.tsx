import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchAppointmentsByUserId } from "@/libs/api/fetchAppointmentsByUserId";
import AccessDenied from "@/components/Auth/AccessDenied";
import fetchUserById from "@/libs/api/fetchUserById";
import { createNotification } from "./actions/createNotification";
import BackLink from "@/components/Buttons/BackLink";
import CreateButton from "@/components/Buttons/CreateButton";
import { Metadata } from "next";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Criar Notificação`,
    description: `Criação de notificação para o usuário associado ao salão ${salon.name}.`,
  };
}

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
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Criar Notificação
        </h1>
        <p className="text-[var(--text-secondary)]">
          Selecione o agendamento e digite a mensagem da notificação.
        </p>
      </header>

      {/* Card do formulário */}
      <form
        id="create-notification-form"
        action={createNotification}
        className="space-y-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-md p-8 transition-colors"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="userId" value={userId} />

        {/* Cliente */}
        <div className="flex flex-col gap-2">
          <label className="font-medium text-[var(--foreground)]">
            Cliente
          </label>
          <p className="text-[var(--text-secondary)]">{user.name}</p>
        </div>

        {/* Agendamento */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="appointmentId"
            className="font-medium text-[var(--foreground)]"
          >
            Agendamento
          </label>
          <select
            name="appointmentId"
            id="appointmentId"
            required
            className="w-full p-3 rounded-xl border border-[var(--color-gray-medium)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action)] bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] transition"
          >
            <option value="">Selecione um agendamento</option>
            {appointments.map((a) => {
              const date = new Date(a.scheduledAt);
              const datePart = date.toLocaleDateString("pt-BR");
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

        {/* Mensagem */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="message"
            className="font-medium text-[var(--foreground)]"
          >
            Mensagem
          </label>
          <textarea
            name="message"
            id="message"
            required
            rows={4}
            placeholder="Digite a mensagem da notificação"
            className="w-full p-3 rounded-xl border border-[var(--color-gray-medium)] focus:outline-none focus:ring-2 focus:ring-[var(--color-action)] bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] placeholder-[var(--text-secondary)] transition"
          />
        </div>

        {/* Botão */}
        <div className="flex justify-end mt-10">
          <CreateButton
            formId="create-notification-form"
            label="Criar Notificação"
            iconType="notification"
          />
        </div>
      </form>

      {/* Rodapé: BackLink */}
      <footer className="mt-6">
        <BackLink slug={slug} to={`dashboard/users/${userId}`} />
      </footer>
    </section>
  );
}
