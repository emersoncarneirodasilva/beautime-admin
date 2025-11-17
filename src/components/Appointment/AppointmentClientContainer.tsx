"use client";

import { useState } from "react";

import UserSelector from "@/components/User/UserSelector";
import ServiceSelector from "@/components/Service/ServiceSelector";
import AvailabilitySelector from "@/components/Availability/AvailabilitySelector";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";

import createAppointmentAction from "@/app/[slug]/dashboard/appointment/actions/createAppointment";

export default function AppointmentClientContainer({
  token,
  slug,
}: {
  token: string;
  slug: string;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [serviceOnProfessionalId, setServiceOnProfessionalId] = useState<
    string | null
  >(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);
  const [serviceDuration, setServiceDuration] = useState<number | null>(null);
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);

  const handleCreate = async () => {
    if (
      !userId ||
      !serviceOnProfessionalId ||
      !scheduledDate ||
      !scheduledTime ||
      !paymentMethod
    ) {
      alert("Preencha todos os campos antes de criar o agendamento.");
      return;
    }

    try {
      await createAppointmentAction({
        token,
        slug,
        userId,
        serviceOnProfessionalIds: [serviceOnProfessionalId],
        scheduledDate,
        scheduledTime,
        method: paymentMethod,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <UserSelector token={token} onSelectUser={setUserId} />

      <ServiceSelector
        token={token}
        onSelectService={(serviceId, profId, duration) => {
          setServiceOnProfessionalId(serviceId);
          setProfessionalId(profId);
          setServiceDuration(duration);

          setScheduledDate(null);
          setScheduledTime(null);
        }}
      />

      {professionalId && serviceDuration && (
        <AvailabilitySelector
          token={token}
          professionalId={professionalId}
          serviceDuration={serviceDuration}
          onSelectDateTime={(date, time) => {
            setScheduledDate(date);
            setScheduledTime(time);
          }}
        />
      )}

      <PaymentMethodSelector onSelect={setPaymentMethod} />

      <button
        disabled={
          !userId ||
          !serviceOnProfessionalId ||
          !scheduledDate ||
          !scheduledTime ||
          !paymentMethod
        }
        onClick={handleCreate}
        className="px-6 py-3 bg-[var(--color-action)] text-[var(--text-on-action)] rounded-lg disabled:opacity-50 hover:bg-[var(--color-action-hover)] disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        Criar Agendamento
      </button>
    </div>
  );
}
