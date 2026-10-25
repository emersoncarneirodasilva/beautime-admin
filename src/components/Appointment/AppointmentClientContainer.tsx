"use client";

import { useState, type ReactNode } from "react";

import UserSelector from "@/components/User/UserSelector";
import ServiceSelector from "@/components/Service/ServiceSelector";
import AvailabilitySelector from "@/components/Availability/AvailabilitySelector";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import createAppointmentAction from "@/app/[slug]/dashboard/appointment/actions/createAppointment";
import { CalendarClock, CreditCard, Scissors, UserRound } from "lucide-react";

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

  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

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

      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold">Detalhes do atendimento</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Siga as etapas para definir os dados do agendamento.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section
            aria-labelledby="appointment-client-heading"
            className="appointment-step min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-4 sm:p-5"
          >
            <StepHeading
              id="appointment-client-heading"
              number="01"
              title="Cliente"
              icon={<UserRound size={17} aria-hidden="true" />}
            />
            <UserSelector token={token} onSelectUser={setUserId} />
          </section>

          <section
            aria-labelledby="appointment-service-heading"
            className="appointment-step min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-4 sm:p-5"
          >
            <StepHeading
              id="appointment-service-heading"
              number="02"
              title="Serviço e profissional"
              icon={<Scissors size={17} aria-hidden="true" />}
            />
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
          </section>

          {professionalId && serviceDuration && (
            <section
              aria-labelledby="appointment-schedule-heading"
              className="appointment-step min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-4 sm:p-5"
            >
              <StepHeading
                id="appointment-schedule-heading"
                number="03"
                title="Data e horário"
                icon={<CalendarClock size={17} aria-hidden="true" />}
              />
              <AvailabilitySelector
                token={token}
                professionalId={professionalId}
                serviceDuration={serviceDuration}
                onSelectDateTime={(date, time) => {
                  setScheduledDate(date);
                  setScheduledTime(time);
                }}
              />
            </section>
          )}

          <section
            aria-labelledby="appointment-payment-heading"
            className="appointment-step min-w-0 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--background)] p-4 sm:p-5"
          >
            <StepHeading
              id="appointment-payment-heading"
              number={professionalId && serviceDuration ? "04" : "03"}
              title="Pagamento"
              icon={<CreditCard size={17} aria-hidden="true" />}
            />
            <PaymentMethodSelector onSelect={setPaymentMethod} />
          </section>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-sm text-[var(--text-secondary)]">
          {isLoading
            ? "Criando o agendamento..."
            : "Preencha todas as etapas para liberar a confirmação."}
        </p>
        <button
          disabled={
            isLoading ||
            !userId ||
            !serviceOnProfessionalId ||
            !scheduledDate ||
            !scheduledTime ||
            !paymentMethod
          }
          onClick={handleCreate}
          className={`ui-button ui-button--primary w-full sm:w-auto sm:min-w-48 ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {isLoading ? "Carregando..." : "Criar Agendamento"}
        </button>
      </div>
    </div>
  );
}

function StepHeading({
  id,
  number,
  title,
  icon,
}: {
  id: string;
  number: string;
  title: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--color-action-soft)] text-[var(--color-action)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Etapa {number}
        </p>
        <h3 id={id} className="text-sm font-semibold">
          {title}
        </h3>
      </div>
    </div>
  );
}
