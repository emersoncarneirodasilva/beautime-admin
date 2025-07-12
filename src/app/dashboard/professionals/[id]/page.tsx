import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import ProfessionalAvatar from "@/components/Professional/ProfessionalAvatar";
import Link from "next/link";
import { fetchProfessionalById } from "@/libs/api/fetchProfessionalById";
import { fetchServicesByProfessional } from "@/libs/api/fetchServicesByProfessional";
import ErrorSection from "@/components/Error/ErrorSection";
import DeleteProfessionalButton from "@/components/Professional/DeleteProfessionalButton";
import { Availability, ProfessionalDetail, ServicePreview } from "@/types";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";
import { translateWeekday } from "@/utils/translateWeekday";

type Params = Promise<{ id: string }>;

export default async function ProfessionalPage({ params }: { params: Params }) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { id } = await params;

  let professional: ProfessionalDetail;

  try {
    professional = await fetchProfessionalById(id, token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados do profissional"
        message={(error as Error).message}
        linkHref="/dashboard/professionals"
        linkText="Voltar à lista de profissionais"
      />
    );
  }

  const services: ServicePreview[] = await fetchServicesByProfessional(
    id,
    token
  );

  const availability: Availability[] = await fetchAvailabilityByProfessional(
    id,
    token
  );

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-6">
      <Link
        href="/dashboard/professionals"
        className="absolute top-4 left-4 text-blue-600 hover:underline hover:cursor-pointer"
      >
        ← Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-4 text-center">
        {professional.name}
      </h1>

      <div className="rounded-full overflow-hidden border-4 border-purple-400 w-[150px] h-[150px] mb-6">
        <ProfessionalAvatar
          src={professional.avatarUrl}
          alt={professional.name}
          width={150}
          height={150}
        />
      </div>

      <div className="w-full max-w-xl text-left space-y-4">
        <p>
          <strong>Bio:</strong> {professional.bio}
        </p>
        <p>
          <strong>Email:</strong> {professional.email}
        </p>
        <p>
          <strong>Phone:</strong> {professional.phone}
        </p>

        <div>
          <h2 className="mt-8 text-xl font-semibold">Serviços Oferecidos:</h2>
          <ul className="list-disc list-inside space-y-1">
            {services
              .filter((s) => s.name) // remove serviços sem nome
              .map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/dashboard/services/${service.id}`}
                    className="text-blue-600 hover:underline hover:text-blue-800 transition"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
          </ul>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Disponibilidade</h2>

            {availability.length === 0 ? (
              <p className="text-gray-600">
                Nenhuma disponibilidade cadastrada.
              </p>
            ) : (
              <ul className="list-disc list-inside space-y-1 max-w-xl">
                {availability.map((slot) => (
                  <li key={slot.id}>
                    {translateWeekday(slot.weekday)} — {slot.startTime} às{" "}
                    {slot.endTime}
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/dashboard/professionals/${id}/availability`}
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Gerenciar disponibilidade
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Link href={`/dashboard/professionals/${professional.id}/edit`}>
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer transition">
                Editar Profissional
              </button>
            </Link>

            <DeleteProfessionalButton id={professional.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
