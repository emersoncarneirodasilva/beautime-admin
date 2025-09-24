import AccessDenied from "@/components/Auth/AccessDenied";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import fetchUsers from "@/libs/api/fetchUsers";
import { fetchServices } from "@/libs/api/fetchServices";
import { fetchAppointments } from "@/libs/api/fetchAppointments";
import { fetchAppointmentHistory } from "@/libs/api/fetchAppointmentHistory";
import { getUserFromToken } from "@/libs/auth/getUserFromToken";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { getFirstName } from "@/utils/getFirstName";
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
import RevenueChart from "@/components/Dashboard/RevenueChart";
import AppointmentsChart from "@/components/Dashboard/AppointmentsChart";
import GeneralStatsCards from "@/components/Dashboard/GeneralStatsCards";

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

      {/* Gráfico de Estatísticas Gerais */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <GeneralStatsCards
          users={totalUsers}
          admins={totalAdmins}
          services={servicesData.total}
          professionals={professionalsData.total}
        />
      </div>

      {/* Gráfico de Agendamentos */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <AppointmentsChart
          active={filteredActive.length}
          completed={filteredCompleted.length}
          canceled={filteredCanceled.length}
          periodLabel={periodLabel}
        />
      </div>

      {/* Gráfico de Faturamento */}
      <div className="bg-white rounded-xl shadow p-6">
        <RevenueChart
          completedRevenue={completedRevenue}
          expectedRevenue={expectedRevenue}
          periodLabel={periodLabel}
        />
      </div>
    </div>
  );
}
