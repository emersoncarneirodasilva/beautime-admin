import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import fetchUsers from "@/libs/api/fetchUsers";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchAppointments } from "@/libs/api/fetchAppointments";
import { fetchAppointmentHistory } from "@/libs/api/fetchAppointmentHistory";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { getFirstName } from "@/utils/getFirstName";
import { formatCurrency } from "@/utils/formatCurrency";
import { fetchProfessionals } from "@/libs/api/fetchProfessionals";
import {
  AppointmentHistoryType,
  AppointmentResponse,
  UserType,
  Service,
  ProfessionalType,
  SalonType,
} from "@/types";
import PeriodSelector from "@/components/PeriodSelector";
import { filterByPeriod } from "@/utils/filterByPeriod";
import {
  calculateCompletedRevenue,
  calculateExpectedRevenue,
} from "@/utils/dashboardMetrics";

interface DashboardProps {
  searchParams?: Promise<{
    periodType?: string;
    periodValue?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: DashboardProps) {
  const token = await verifyAdminAuth();

  const admin = await getUserFromToken();

  const salon: SalonType | null = await fetchSalonByAdmin(token);

  if (!token || !admin || !salon) return <AccessDenied />;

  // Fetch dos dados
  const usersData: { users: UserType[]; total: number } = await fetchUsers({
    token,
    page: 1,
    limit: 100,
  });

  const servicesData: { services: Service[]; total: number } =
    await fetchServices(token, 1, 100);

  const professionalsData: {
    professionals: ProfessionalType[];
    total: number;
  } = await fetchProfessionals({
    token,
    page: 1,
    limit: 100,
  });

  const appointmentsData: AppointmentResponse = await fetchAppointments({
    page: 1,
    limit: 100,
  });

  // Histórico concluído e cancelado
  const completedData: {
    appointmentsHistory: AppointmentHistoryType[];
    total: number;
  } = await fetchAppointmentHistory({
    token,
    page: 1,
    limit: 100,
    status: "COMPLETED",
  });

  const canceledData: {
    appointmentsHistory: AppointmentHistoryType[];
    total: number;
  } = await fetchAppointmentHistory({
    token,
    page: 1,
    limit: 100,
    status: "CANCELED",
  });

  const totalUsers: number = usersData.users.filter(
    (u) => u.role === "USER"
  ).length;

  const totalAdmins: number = usersData.users.filter(
    (u) => u.role === "ADMIN" || u.role === "OWNER"
  ).length;

  const adminName: string = getFirstName(admin.name);

  // Período padrão: mensal (mês atual)
  const queryParams = searchParams ? await searchParams : {};
  const periodType: "WEEK" | "MONTH" | "YEAR" =
    (queryParams.periodType as "WEEK" | "MONTH" | "YEAR") || "MONTH";

  const periodValue: string =
    queryParams.periodValue ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`;

  // Filtrar agendamentos
  const filteredCompleted = filterByPeriod(
    completedData.appointmentsHistory,
    periodType,
    periodValue,
    "movedAt"
  );

  const filteredCanceled = filterByPeriod(
    canceledData.appointmentsHistory,
    periodType,
    periodValue,
    "movedAt"
  );

  const filteredActive = filterByPeriod(
    appointmentsData.appointments,
    periodType,
    periodValue,
    "scheduledAt"
  );

  // Faturamento
  const completedRevenue = calculateCompletedRevenue(filteredCompleted);
  const expectedRevenue = calculateExpectedRevenue(filteredActive);

  const periodLabel: string =
    periodType === "WEEK"
      ? "Semanal"
      : periodType === "MONTH"
      ? "Mensal"
      : "Anual";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Bem-vindo(a) <span className="font-semibold">{adminName}</span> ao
        painel de administração do{" "}
        <span className="font-semibold">{salon.name}</span>.
      </p>

      {/* Período */}
      <PeriodSelector />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Usuários</h2>
          <p className="text-2xl font-bold text-gray-600">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Administradores</h2>
          <p className="text-2xl font-bold text-gray-600">{totalAdmins}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Serviços</h2>
          <p className="text-2xl font-bold text-gray-600">
            {servicesData.total}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Profissionais</h2>
          <p className="text-2xl font-bold text-gray-600">
            {professionalsData.total}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">
            Agendamentos Ativos
          </h2>
          <p className="text-2xl font-bold text-gray-600">
            {filteredActive.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Concluídos</h2>
          <p className="text-2xl font-bold text-gray-600">
            {filteredCompleted.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-gray-500 text-sm font-medium">Cancelados</h2>
          <p className="text-2xl font-bold text-gray-600">
            {filteredCanceled.length}
          </p>
        </div>
      </div>

      {/* Faturamento */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-gray-500 text-sm font-medium mb-2">
          Faturamento ({periodLabel})
        </h2>
        <p className="text-xl font-bold text-green-600">
          Realizado: {formatCurrency(completedRevenue)}
        </p>
        <p className="text-xl font-bold text-blue-600">
          Previsto: {formatCurrency(expectedRevenue)}
        </p>
      </div>
    </div>
  );
}
