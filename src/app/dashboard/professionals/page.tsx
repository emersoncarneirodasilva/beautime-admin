import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ProfessionalAvatar from "@/components/Professional/ProfessionalAvatar";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { ProfessionalsDTO } from "@/types";
import Link from "next/link";

export default async function ProfessionalsPage() {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  let professionals: ProfessionalsDTO[] = [];

  try {
    professionals = await fetchProfessionals(token);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar profissionais"
        message={(error as Error).message}
        linkHref="/dashboard"
        linkText="Voltar ao painel principal"
      />
    );
  }

  if (professionals.length === 0) {
    return (
      <p className="grid place-content-center h-[100vh] text-gray-500">
        Nenhum profissional encontrado.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profissionais</h1>
      <ul className="space-y-3">
        {professionals.map((professional) => (
          <li key={professional.id} className="border p-3 rounded-md">
            <div className="flex items-center justify-between gap-4">
              <ProfessionalAvatar
                src={professional.avatarUrl}
                alt={`Avatar de ${professional.name}`}
                width={64}
                height={64}
                className="w-16 h-16 rounded-sm object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold">{professional.name}</h2>
                <p className="text-sm text-gray-500">{professional.email}</p>
              </div>
              <Link
                href={`/dashboard/professionals/${professional.id}`}
                className="text-blue-600 hover:underline"
              >
                Ver detalhes
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-4">
        <Link href="/dashboard">
          <p className="hover:text-blue-500 hover:cursor-pointer hover:underline duration-200">
            Voltar
          </p>
        </Link>

        <Link href="/dashboard/professionals/create">
          <p className="hover:text-blue-500 hover:cursor-pointer hover:underline duration-200">
            Criar Profissional
          </p>
        </Link>
      </div>
    </div>
  );
}
