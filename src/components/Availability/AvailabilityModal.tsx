"use client";

import { useMemo, useState } from "react";
import { useAvailability } from "@/hooks/useAvailability";
import { getNextDates } from "@/utils/dateHelpers";
import DayItem from "@/components/Availability/DayItem";
import ModalPagination from "../Pagination/ModalPagination";

export default function AvailabilityModal({
  token,
  professionalId,
  serviceDuration,
  onClose,
  onSelect,
}: {
  token: string;
  professionalId: string;
  serviceDuration: number;
  onClose: () => void;
  onSelect: (data: {
    date: string;
    startTime: string;
    endTime: string;
  }) => void;
}) {
  const { availability, loading } = useAvailability(token, professionalId);

  const [page, setPage] = useState(1);
  const daysPerPage = 7;

  const allNextDates = useMemo(() => {
    const dates = getNextDates(60);
    return dates.filter((d) =>
      availability.some((a) => a.weekday === d.getDay())
    );
  }, [availability]);

  const totalPages = Math.max(1, Math.ceil(allNextDates.length / daysPerPage));
  const paginatedDates = allNextDates.slice(
    (page - 1) * daysPerPage,
    page * daysPerPage
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className="
          w-full max-w-lg 
          bg-[var(--color-white)] text-[var(--foreground)]
          rounded-2xl shadow-2xl 
          p-6 space-y-6 
          transition-all
        "
      >
        {/* HEADER */}
        <header className="flex justify-between items-center pb-2 border-b border-[var(--color-gray-medium)]">
          <h2 className="text-2xl font-semibold tracking-tight">
            Selecionar Horário
          </h2>

          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--color-error)] text-2xl leading-none transition cursor-pointer"
          >
            ✕
          </button>
        </header>

        {/* LISTA DE DIAS/ HORÁRIOS */}
        <div
          className="
            max-h-80 overflow-y-auto 
            rounded-md border border-[var(--color-gray-medium)]
            shadow-inner bg-[var(--color-gray-light)]
            divide-y divide-[var(--color-gray-medium)] sidebar-scroll
          "
        >
          {loading ? (
            <p className="p-4 text-center text-[var(--text-secondary)] animate-pulse">
              Carregando...
            </p>
          ) : paginatedDates.length === 0 ? (
            <p className="p-4 text-center text-[var(--text-secondary)]">
              Nenhuma disponibilidade encontrada.
            </p>
          ) : (
            paginatedDates.map((date) => (
              <DayItem
                key={date.toISOString()}
                date={date}
                slots={availability.filter((a) => a.weekday === date.getDay())}
                serviceDuration={serviceDuration}
                onSelect={onSelect}
              />
            ))
          )}
        </div>

        {/* Paginação dos dias */}
        {!loading && allNextDates.length > daysPerPage && (
          <ModalPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded-md border border-[var(--color-gray-medium)] text-[var(--foreground)] hover:bg-[var(--color-gray-medium)/20] transition cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
