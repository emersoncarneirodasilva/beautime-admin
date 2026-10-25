import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hrefBuilder: (page: number) => string; // função que gera o href
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  hrefBuilder,
}: PaginationProps) {
  if (totalItems <= pageSize || totalPages <= 1) return null;

  return (
    <nav
      aria-label="Paginação"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-gray-medium)] pt-5 sm:flex-row"
    >
      <Link
        href={hrefBuilder(currentPage - 1)}
        className="ui-button ui-button--secondary w-full sm:w-auto"
        aria-disabled={currentPage <= 1}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Anterior
      </Link>

      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] px-4 py-2 shadow-sm">
        <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-[var(--color-action)] px-2 text-sm font-semibold text-[var(--text-on-action)]">
          {currentPage}
        </span>
        <span className="text-sm text-[var(--text-secondary)]">
          de <strong className="font-semibold text-[var(--foreground)]">{totalPages}</strong>
        </span>
      </div>

      <Link
        href={hrefBuilder(currentPage + 1)}
        className="ui-button ui-button--secondary w-full sm:w-auto"
        aria-disabled={currentPage >= totalPages}
      >
        Próxima
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </nav>
  );
}
