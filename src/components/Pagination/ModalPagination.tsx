"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ModalPagination({
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <nav aria-label="Paginação do seletor" className="flex items-center justify-between gap-2 border-t border-[var(--color-gray-medium)] pt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="ui-button ui-button--secondary"
        aria-label="Página anterior"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Anterior
      </button>

      <span className="text-sm text-[var(--text-secondary)]">
        <span className="sr-only">Página </span>
        <strong className="inline-grid h-9 min-w-9 place-items-center rounded-lg bg-[var(--color-action)] px-2 text-[var(--text-on-action)]">
          {page}
        </strong>
        <span className="mx-1">de</span>
        <strong className="text-[var(--foreground)]">{totalPages}</strong>
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="ui-button ui-button--secondary"
        aria-label="Próxima página"
      >
        Próxima
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
