import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchServicesByProfessional } from "@/libs/api/fetchServicesByProfessional";
import { Service, ServicePreview } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import { linkServiceToProfessional } from "./actions/linkServiceToProfessional";
import { unlinkServiceFromProfessional } from "./actions/unlinkServiceFromProfessional";
import ProfessionalAvatar from "@/components/Professional/ProfessionalAvatar";
import Link from "next/link";

interface Params {
  slug: string;
}

export default async function ServicesOnProfessionalsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  const [professionals, allServices] = await Promise.all([
    fetchProfessionals(token),
    fetchServices(token),
  ]);

  const professionalsWithServices = await Promise.all(
    professionals.map(async (professional: { id: string }) => {
      const services = await fetchServicesByProfessional(
        professional.id,
        token
      );
      return { ...professional, services };
    })
  );

  return (
    <div className="max-w-6xl mx-auto p-6 my-4 rounded bg-gray-300 min-h-screen">
      <div className="mb-4">
        <Link
          href={`/${slug}/dashboard`}
          className="inline-block text-blue-600 hover:underline hover:cursor-pointer"
        >
          ← Voltar
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900">
        Vincular Serviços aos Profissionais
      </h1>

      <div className="space-y-8">
        {professionalsWithServices.map((professional) => (
          <div
            key={professional.id}
            className="bg-white rounded-lg shadow p-4 space-y-4"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full overflow-hidden border-4 border-purple-400 w-[70px] h-[70px] mb-6">
                <ProfessionalAvatar
                  src={professional.avatarUrl}
                  alt={professional.name}
                  width={150}
                  height={150}
                />
              </div>
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {professional.name}
                </h2>
                <p className="text-sm text-gray-500">{professional.email}</p>
              </div>
            </div>

            <ul className="ml-6 list-disc text-sm text-gray-700 space-y-1">
              {professional.services.length > 0 ? (
                professional.services.map((service: ServicePreview) => (
                  <li
                    key={service.id} // use o id da associação ou service.id
                    className="flex justify-between items-center"
                  >
                    <span>{service.service.name}</span>
                    <form action={unlinkServiceFromProfessional}>
                      <input type="hidden" name="slug" value={slug} />
                      <input
                        type="hidden"
                        name="associationId"
                        value={service.id} // id da associação que liga profissional e serviço
                      />

                      <button
                        type="submit"
                        className="text-red-500 text-xs hover:underline hover:cursor-pointer ml-2"
                      >
                        Remover
                      </button>
                    </form>
                  </li>
                ))
              ) : (
                <li className="italic text-gray-400">
                  Nenhum serviço vinculado
                </li>
              )}
            </ul>

            <form action={linkServiceToProfessional} className="flex gap-2">
              <input type="hidden" name="slug" value={slug} />
              <input
                type="hidden"
                name="professionalId"
                value={professional.id}
              />

              <select
                name="serviceId"
                className="flex-1 border rounded px-2 py-1 text-sm text-gray-700"
              >
                {allServices.map((service: Service) => (
                  <option
                    key={service.id}
                    value={service.id}
                    className="bg-gray-400"
                  >
                    {service.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-1 rounded text-sm hover:bg-purple-700 hover:cursor-pointer transition"
              >
                Vincular
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
