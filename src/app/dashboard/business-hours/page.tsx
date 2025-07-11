import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchBusinessHours } from "@/libs/api/fetchBusinessHours";
import Link from "next/link";
import { WEEKDAYS } from "@/utils/constants";
import AccessDenied from "@/components/Auth/AccessDenied";
import { DeleteBusinessHourButton } from "@/components/BusinessHours/DeleteBusinessHourButton";

export default async function BusinessHoursPage() {
  let token: string;

  try {
    token = await verifyAdminAuth();
  } catch {
    return <AccessDenied />;
  }

  const businessHours = await fetchBusinessHours(token);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Horários de Funcionamento</h1>
      <div className="grid grid-cols-1 gap-4">
        {businessHours.map((hour) => (
          <div
            key={hour.id}
            className="border p-4 rounded-xl shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-medium text-lg">{WEEKDAYS[hour.weekday]}</p>
              <p className="text-sm text-gray-600">
                {hour.startTime} - {hour.endTime}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/business-hours/${hour.id}/edit`}
                className="text-blue-600 hover:underline"
              >
                Editar
              </Link>

              <DeleteBusinessHourButton id={hour.id} token={token} />
            </div>
          </div>
        ))}

        <div className="flex justify-between">
          <Link
            href="/dashboard/"
            className="mb-8 w-fit text-blue-600 hover:underline hover:cursor-pointer inline-block"
          >
            ← Voltar
          </Link>
          <Link
            href="/dashboard/business-hours/create"
            className="mb-8 w-fit text-blue-600 hover:underline hover:cursor-pointer inline-block"
          >
            Criar Horário
          </Link>
        </div>
      </div>
    </div>
  );
}
