import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";

export async function fetchAppointments({
  page = 1,
  limit = 10,
  status,
  paymentStatus,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
}) {
  const token = await verifyAdminAuth();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.append("appointmentStatus", status);
  if (paymentStatus) params.append("paymentStatus", paymentStatus);
  if (search) params.append("search", search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/admin/salon?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar agendamentos.");
  }

  return res.json();
}
