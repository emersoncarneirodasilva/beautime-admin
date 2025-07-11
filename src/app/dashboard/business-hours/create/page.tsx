import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { WEEKDAYS } from "@/utils/constants";
import { handleCreateBusinessHour } from "./actions/createBusinessHour";
import Link from "next/link";

export default async function CreateBusinessHourPage() {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  return (
    <form
      action={handleCreateBusinessHour}
      className="max-w-md mx-auto mt-10 space-y-6"
    >
      <h1 className="text-2xl font-bold">Criar novo horário</h1>

      <input type="hidden" name="token" value={token} />

      <div>
        <label className="block text-sm font-medium mb-1">Dia da semana</label>
        <select
          name="weekday"
          required
          className="border rounded w-full px-3 py-2 bg-black"
        >
          {WEEKDAYS.map((day, index) => (
            <option key={index} value={index}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Início</label>
        <input
          type="time"
          name="startTime"
          required
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fim</label>
        <input
          type="time"
          name="endTime"
          required
          className="border rounded w-full px-3 py-2"
        />
      </div>

      <div className="flex items-end justify-between">
        <Link
          href="/dashboard/business-hours"
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
