import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateNotification } from "./actions/updateNotification";
import { fetchNotificationById } from "@/libs/api/fetchNotificationById";
import { NotificationType } from "@/types";

interface Params {
  slug: string;
  id: string;
}

export default async function EditNotificationPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, id } = await params;

  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

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

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Notificação</h1>

      <form action={updateNotification}>
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={notification.id} />

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Mensagem
          </label>
          <textarea
            id="message"
            name="message"
            defaultValue={notification.message}
            required
            rows={4}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="flex items-end justify-between mt-6">
          <a
            href={`/${slug}/dashboard/notifications`}
            className="text-blue-600 hover:underline"
          >
            Cancelar
          </a>

          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 hover:cursor-pointer transition"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}
