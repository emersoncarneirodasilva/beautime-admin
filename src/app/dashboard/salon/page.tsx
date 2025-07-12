import Link from "next/link";
import fetchUserById from "@/libs/api/fetchUserById";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";

export default async function SalonPage() {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const salon = await fetchSalonByAdmin(token);
  const creator = await fetchUserById(salon.createdBy, token);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Voltar
        </Link>

        <Link href="/dashboard/salon/edit">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer transition"
          >
            Editar Salão
          </button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Informações do Salão</h1>
      <div className="rounded-2xl shadow-lg p-6 bg-white space-y-6">
        <div className="flex items-center gap-4">
          <img
            src={salon.logoUrl}
            alt="Logo do salão"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {salon.name}
            </h2>
            <p className="text-sm text-gray-500">Slug: {salon.slug}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800">Descrição</h3>
          <p className="text-gray-700">{salon.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Criado por:</span> {creator.name}
          </p>
          <p>
            <span className="font-semibold">Criado em:</span>{" "}
            {new Date(salon.createdAt).toLocaleDateString("pt-BR")}
          </p>
          <p>
            <span className="font-semibold">Última atualização:</span>{" "}
            {new Date(salon.updatedAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>
    </div>
  );
}
