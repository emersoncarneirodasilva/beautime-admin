import Link from "next/link";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { fetchServices } from "@/libs/api/fetchServices";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Service } from "@/types";

export default async function ServicesPage() {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  let services: Service[] = [];

  try {
    services = await fetchServices(token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar serviços"
        message={(error as Error).message}
        linkHref="/dashboard"
        linkText="Voltar ao painel"
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-200">Serviços</h1>
        <Link
          href="/dashboard/services/create"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Novo Serviço
        </Link>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-200 text-center mt-12">
          Nenhum serviço encontrado.
        </p>
      ) : (
        <ul className="space-y-6">
          {services.map((service) => (
            <li
              key={service.id}
              className="bg-white rounded-lg shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {service.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {service.category?.name}
                </p>
                <p className="text-green-700 font-medium mt-2">
                  💰 R$ {service.price.toFixed(2)} — ⏱ {service.duration} min
                </p>
              </div>

              <div>
                <Link
                  href={`/dashboard/services/${service.id}`}
                  className="inline-block px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  Ver detalhes
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          ← Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
