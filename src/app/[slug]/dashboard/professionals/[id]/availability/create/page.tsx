import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import Link from "next/link";
import { handleCreateAvailability } from "./actions/createAvailability";

interface Params {
  slug: string;
  id: string;
}

export default async function CreateAvailabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  return (
    <main className="p-6 max-w-xl mx-auto">
      <Link
        href={`/${slug}/dashboard/professionals/${id}/availability`}
        className="text-blue-600 hover:underline"
      >
        ← Voltar
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">Nova disponibilidade</h1>

      <form action={handleCreateAvailability} className="space-y-4">
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="professionalId" value={id} />

        <div className="flex flex-col">
          <label className="font-medium">Dia da semana</label>
          <select name="weekday" className="p-2 border rounded bg-black">
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6">Sábado</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Início</label>
          <input
            type="time"
            name="startTime"
            required
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium">Término</label>
          <input
            type="time"
            name="endTime"
            required
            className="p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 hover:cursor-pointer transition"
        >
          Criar disponibilidade
        </button>
      </form>
    </main>
  );
}
