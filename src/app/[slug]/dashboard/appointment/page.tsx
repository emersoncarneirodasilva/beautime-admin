import AppointmentClientContainer from "@/components/Appointment/AppointmentClientContainer";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { Metadata } from "next";

// Metadata
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Agendamento`,
    description: `Crie agendamentos para clientes do ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

export default async function AppointmentPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 space-y-8">
      <ErrorToastFromParams />

      <h1 className="text-3xl font-bold">Criar Agendamento</h1>
      <AppointmentClientContainer token={token} slug={slug} />
    </section>
  );
}
