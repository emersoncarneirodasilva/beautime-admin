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
    <section className="mx-auto max-w-6xl space-y-7 px-4 py-6 sm:px-6 md:px-8">
      {/* Header */}
      <header>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Visão Geral</h1>
        <p className="text-[var(--text-secondary)]">
          Bem-vindo(a) <span className="font-bold">{adminName}</span> ao painel
          de administração do <span className="font-bold">{salon.name}</span>.
        </p>
      </header>

      {/* Período */}
      <section aria-label="Filtros do painel">
        <PeriodSelector />
      </section>

      {/* Estatísticas Gerais */}
      <section aria-label="Indicadores gerais" className="rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm sm:p-6">
        <GeneralStatsCards
          users={totalUsers}
          admins={totalAdmins}
          services={servicesData.total}
          professionals={professionalsData.total}
        />
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="h-[380px] rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm sm:p-6">
          <AppointmentsChart
            active={filteredActive.length}
            completed={filteredCompleted.length}
            canceled={filteredCanceled.length}
            periodLabel={periodLabel}
          />
        </div>
        <div className="h-[380px] rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm sm:p-6">
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
