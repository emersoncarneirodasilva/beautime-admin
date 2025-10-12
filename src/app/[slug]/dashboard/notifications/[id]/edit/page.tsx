import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateNotification } from "./actions/updateNotification";
import { fetchNotificationById } from "@/libs/api/fetchNotificationById";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { NotificationType } from "@/types";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import { Metadata } from "next";

interface Params {
  slug: string;
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const { id } = await params;

  try {
    const salon = await fetchSalonByAdmin(token);
    const notification = await fetchNotificationById(id, token);

    return {
      title: `Beautime Admin - ${salon.name} - Editar Notificação`,
      description: `Edite a notificação "${notification.message}" do salão ${salon.name}.`,
    };
  } catch {
    return {
      title: "Beautime Admin - Editar Notificação",
      description: "Edite a notificação no painel administrativo.",
    };
  }
}

export default async function EditNotificationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let notification: NotificationType;
  try {
    notification = await fetchNotificationById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar notificação"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/notifications`}
        linkText="Voltar"
      />
    );
  }

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Notificação
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Atualize a mensagem da notificação
        </p>
      </header>

      <form
        id="update-notification-form"
        action={updateNotification}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] rounded-2xl shadow-lg p-8 transition-colors duration-300 hover:shadow-xl space-y-6"
      >
        <input type="hidden" name="id" value={notification.id} />
        <input type="hidden" name="slug" value={slug} />

        <div>
          <label htmlFor="message" className={labelClasses}>
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            defaultValue={notification.message}
            required
            rows={4}
            className={inputClasses}
          />
        </div>

        <div className="flex justify-end mt-4">
          <SubmitButton formId="update-notification-form" />
        </div>
      </form>

      <footer className="mt-6">
        <BackLink slug={slug} to="dashboard/notifications" />
      </footer>
    </section>
  );
}
