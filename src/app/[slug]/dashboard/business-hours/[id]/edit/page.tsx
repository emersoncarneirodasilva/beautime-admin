import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { WEEKDAYS } from "@/utils/constants";
import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchBusinessHourById } from "@/libs/api/fetchBusinessHourById";
import { handleUpdateBusinessHour } from "./actions/updateBusinessHour";
import Link from "next/link";

type Params = { slug: string; id: string };

export default async function EditBusinessHourPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const { id } = await params;

  const hour = await fetchBusinessHourById(id, token);

  return (
    <form
      action={handleUpdateBusinessHour}
      className="max-w-md mx-auto mt-10 space-y-6"
    >
      <h1 className="text-2xl font-bold">
        Editar horário de {WEEKDAYS[hour.weekday]}
      </h1>

      {/* Enviar ID via formData */}
      <input type="hidden" name="id" value={hour.id} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="token" value={token} />

      <div>
        <label className="block text-sm font-medium mb-1">Início</label>
        <input
          type="time"
          name="startTime"
          defaultValue={hour.startTime}
          required
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fim</label>
        <input
          type="time"
          name="endTime"
          defaultValue={hour.endTime}
          required
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <div className="flex items-end justify-between">
        <Link
          href={`/${slug}/dashboard/business-hours`}
          className="text-blue-600 hover:underline hover:cursor-pointer inline-block"
        >
          ← Voltar
        </Link>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
