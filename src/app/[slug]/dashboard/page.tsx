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
import { Metadata } from "next";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Painel`,
    description: `Visão geral e estatísticas do salão ${salon.name}.`,
  };
}

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

  // Dados
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
  } = await fetchProfessionals({ token, page: 1, limit: 100 });

  const appointmentsData: AppointmentResponse = await fetchAppointments({
    page: 1,
    limit: 100,
  });

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

  const totalUsers = usersData.users.filter((u) => u.role === "USER").length;
  const totalAdmins = usersData.users.filter(
    (u) => u.role === "ADMIN" || u.role === "OWNER"
  ).length;
  const adminName = getFirstName(admin.name);

  // Período
  const queryParams = searchParams ? await searchParams : {};
  const periodType: "WEEK" | "MONTH" | "YEAR" =
    (queryParams.periodType as "WEEK" | "MONTH" | "YEAR") || "MONTH";
  const periodValue: string =
    queryParams.periodValue ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`;

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

  const completedRevenue = calculateCompletedRevenue(filteredCompleted);
  const expectedRevenue = calculateExpectedRevenue(filteredActive);

  const periodLabel: string =
    periodType === "WEEK"
      ? "Semanal"
      : periodType === "MONTH"
      ? "Mensal"
      : "Anual";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold mb-6">Visão Geral</h1>
        <p className="text-[var(--text-secondary)]">
          Bem-vindo(a) <span className="font-bold">{adminName}</span> ao painel
          de administração do <span className="font-bold">{salon.name}</span>.
        </p>
      </header>

      {/* Período */}
      <section>
        <PeriodSelector />
      </section>

      {/* Estatísticas Gerais */}
      <section className="bg-[var(--color-white)] rounded-xl shadow p-6">
        <GeneralStatsCards
          users={totalUsers}
          admins={totalAdmins}
          services={servicesData.total}
          professionals={professionalsData.total}
        />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--color-white)] rounded-xl shadow p-6 h-[380px]">
          <AppointmentsChart
            active={filteredActive.length}
            completed={filteredCompleted.length}
            canceled={filteredCanceled.length}
            periodLabel={periodLabel}
          />
        </div>
        <div className="bg-[var(--color-white)] rounded-xl shadow p-6 h-[380px]">
          <RevenueChart
            completedRevenue={completedRevenue}
            expectedRevenue={expectedRevenue}
            periodLabel={periodLabel}
          />
        </div>
      </section>
    </section>
  );
}
