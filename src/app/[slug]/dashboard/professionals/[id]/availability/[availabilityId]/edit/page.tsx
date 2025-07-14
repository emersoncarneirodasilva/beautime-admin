import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { Availability } from "@/types";
import Link from "next/link";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import { updateAvailability } from "./actions/updateAvailability";

interface Params {
  slug: string;
  id: string; // profissionalId
  availabilityId: string;
}

export default async function EditAvailabilityPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id, availabilityId } = await params;

  let availabilityList: Availability[];

  try {
    availabilityList = await fetchAvailabilityByProfessional(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar disponibilidades"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/professionals/${id}/availability`}
        linkText="Voltar"
      />
    );
  }

  const availability = availabilityList.find((a) => a.id === availabilityId);

  if (!availability) {
    return (
      <ErrorSection
        title="Disponibilidade não encontrada"
        message="A disponibilidade que você está tentando editar não existe."
        linkHref={`/${slug}/dashboard/professionals/${id}/availability`}
        linkText="Voltar"
      />
    );
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Disponibilidade</h1>

      <form action={updateAvailability}>
        <input type="hidden" name="availabilityId" value={availability.id} />
        <input type="hidden" name="professionalId" value={id} />
        <input type="hidden" name="slug" value={slug} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Dia da semana:</label>
          <select
            name="weekday"
            defaultValue={availability.weekday}
            className="w-full border px-3 py-2 rounded bg-black"
          >
            <option value="0">Domingo</option>
            <option value="1">Segunda</option>
            <option value="2">Terça</option>
            <option value="3">Quarta</option>
            <option value="4">Quinta</option>
            <option value="5">Sexta</option>
            <option value="6">Sábado</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Hora de início:</label>
          <input
            type="time"
            name="startTime"
            defaultValue={availability.startTime}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Hora de término:</label>
          <input
            type="time"
            name="endTime"
            defaultValue={availability.endTime}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <Link
            href={`/${slug}/dashboard/professionals/${id}/availability`}
            className="hover:text-blue-500 hover:underline transition"
          >
            Voltar
          </Link>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 hover:cursor-pointer transition"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </main>
  );
}
