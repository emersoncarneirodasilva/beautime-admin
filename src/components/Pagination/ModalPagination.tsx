"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPaginationItems } from "./pageNumbers";

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
  const paginationItems = getPaginationItems(page, totalPages);

  return (
    <nav
      aria-label="Paginação do seletor"
      className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-gray-medium)] pt-4"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="ui-button ui-button--secondary"
        aria-label="Página anterior"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Anterior
      </button>

      {paginationItems.map((item, index) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="px-1 text-sm font-medium text-[var(--text-secondary)]"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={item === page ? undefined : () => onPageChange(item)}
            aria-label={`Página ${item}`}
            aria-current={item === page ? "page" : undefined}
            className={`ui-button min-w-10 px-3 ${
              item === page
                ? "ui-button--primary"
                : "ui-button--secondary"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
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
