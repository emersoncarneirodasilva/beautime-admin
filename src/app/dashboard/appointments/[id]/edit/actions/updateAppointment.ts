"use server";

import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateAppointment(formData: FormData) {
  const token = await verifyAdminAuth();

  const appointmentId = formData.get("appointmentId") as string;
  const newAppointmentStatus = formData.get("newAppointmentStatus");
  const newPaymentStatus = formData.get("newPaymentStatus");
  const newPaymentMethod = formData.get("newPaymentMethod");

  const body = {
    newAppointmentStatus,
    newPaymentStatus,
    newPaymentMethod,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error("Erro ao atualizar agendamento.");
  }

  revalidatePath("/dashboard/appointments");

  redirect("/dashboard/appointments");
}
