"use server";

import { redirect } from "next/navigation";

interface CreateAppointmentInput {
  token: string;
  slug: string;
  userId: string;
  serviceOnProfessionalIds: string[];
  scheduledDate: string;
  scheduledTime: string;
  method: string;
}

export default async function createAppointmentAction(
  input: CreateAppointmentInput
): Promise<void> {
  const {
    token,
    slug,
    userId,
    serviceOnProfessionalIds,
    scheduledDate,
    scheduledTime,
    method,
  } = input;

  if (
    !userId ||
    !serviceOnProfessionalIds.length ||
    !scheduledDate ||
    !scheduledTime
  ) {
    redirect(
      `/${slug}/dashboard/appointment/error-bridge?error=${encodeURIComponent(
        "Todos os campos são obrigatórios."
      )}&_=${Date.now()}`
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments/admin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        serviceOnProfessionalIds,
        scheduledDate,
        scheduledTime,
        method,
      }),
    }
  );

  if (!res.ok) {
    let backendMsg = "Erro ao criar agendamento";

    try {
      const json = await res.json();
      backendMsg = json.message || backendMsg;
    } catch {}

    redirect(
      `/${slug}/dashboard/appointment/error-bridge?error=${encodeURIComponent(
        backendMsg
      )}&t=${Date.now()}`
    );
  }

  redirect(`/${slug}/dashboard/appointments`);
}
