"use client";

import { useEffect, useState } from "react";
import { fetchAvailabilityByProfessional } from "@/libs/api/fetchAvailabilityByProfessional";

export type Availability = {
  id: string;
  professionalId: string;
  weekday: number;
  startTime: string;
  endTime: string;
};

export function useAvailability(token: string, professionalId: string) {
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchAvailabilityByProfessional(
          professionalId,
          token
        );
        if (!mounted) return;
        setAvailability(data ?? []);
      } catch (err) {
        console.error("Erro ao buscar disponibilidade:", err);
        if (!mounted) return;
        setAvailability([]);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token, professionalId]);

  return { availability, loading };
}
