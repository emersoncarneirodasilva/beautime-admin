import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import { Availability } from "@/types";
import { translateWeekday } from "@/utils/translateWeekday";
import Link from "next/link";
import { handleDeleteAvailability } from "./actions/deleteAvailability";

type Props = {
  params: {
    id: string;
  };
};

export default async function AvailabilityPage({ params }: Props) {
  let token: string;

  try {
    token = await verifyAdminAuth();
  } catch {
    return <AccessDenied />;
  }

  let availability: Availability[];

  try {
    availability = await fetchAvailabilityByProfessional(params.id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar disponibilidade"
        message={(error as Error).message}
        linkHref={`/dashboard/professionals/${params.id}`}
        linkText="Voltar ao profissional"
      />
    );
  }

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <Link
        href={`/dashboard/professionals/${params.id}`}
        className="text-blue-600 hover:underline"
      >
        ← Voltar ao profissional
      </Link>

      <h1 className="text-2xl font-bold mt-4 mb-6">Disponibilidade</h1>

      {availability.length === 0 ? (
        <p className="text-gray-600">Nenhuma disponibilidade cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {availability.map((slot) => (
            <li
              key={slot.id}
              className="border p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <strong>{translateWeekday(slot.weekday)}</strong>:{" "}
                {slot.startTime} às {slot.endTime}
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-sm px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 hover:cursor-pointer transition">
                  <Link
                    href={`/dashboard/professionals/${params.id}/availability/${slot.id}/edit`}
                  >
                    Editar
                  </Link>
                </button>
                <form action={handleDeleteAvailability}>
                  <input type="hidden" name="availabilityId" value={slot.id} />
                  <input
                    type="hidden"
                    name="professionalId"
                    value={params.id}
                  />

                  <button
                    type="submit"
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer transition"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <Link
          href={`/dashboard/professionals/${params.id}/availability/create`}
          className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Criar disponibilidade
        </Link>
      </div>
    </main>
  );
}
