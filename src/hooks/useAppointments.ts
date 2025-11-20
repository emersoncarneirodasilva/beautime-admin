"use client";

import { useEffect, useState } from "react";
import { fetchAppointmentsByProfessional } from "@/libs/api/fetchAppointmentsByProfessional";
import { AppointmentsByProfessional } from "@/types";

export function useAppointments(token: string, professionalId: string) {
  const [appointments, setAppointments] = useState<
    AppointmentsByProfessional[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchAppointmentsByProfessional(
          professionalId,
          token
        );
        if (!mounted) return;
        setAppointments(data ?? []);
      } catch (err) {
        console.error("Erro ao buscar agendamentos:", err);
        if (!mounted) return;
        setAppointments([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, professionalId]);

  return { appointments, loading };
}
