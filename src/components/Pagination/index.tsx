import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getPaginationItems } from "./pageNumbers";

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

  const paginationItems = getPaginationItems(currentPage, totalPages);
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Paginação"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-gray-medium)] pt-5 lg:flex-row"
    >
      <span className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-[var(--color-gray-medium)] bg-[var(--color-white)] px-3 text-sm text-[var(--text-secondary)] shadow-sm">
        <span>Exibindo</span>
        <strong className="font-semibold text-[var(--foreground)]">
          {firstItem}–{lastItem}
        </strong>
        <span>de</span>
        <strong className="font-semibold text-[var(--color-action)]">
          {totalItems}
        </strong>
        <span>registros</span>
      </span>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {currentPage <= 1 ? (
          <span
            aria-label="Página anterior"
            aria-disabled="true"
            className="ui-button ui-button--secondary ui-button--disabled"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Anterior
          </span>
        ) : (
          <Link
            href={hrefBuilder(currentPage - 1)}
            className="ui-button ui-button--secondary"
            aria-label="Página anterior"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Anterior
          </Link>
        )}

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
            <Link
              key={item}
              href={hrefBuilder(item)}
              aria-label={`Página ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              className={`ui-button min-w-10 px-3 ${
                item === currentPage
                  ? "ui-button--primary"
                  : "ui-button--secondary"
              }`}
            >
              {item}
            </Link>
          )
        )}

        {currentPage >= totalPages ? (
          <span
            aria-label="Próxima página"
            aria-disabled="true"
            className="ui-button ui-button--secondary ui-button--disabled"
          >
            Próxima
            <ArrowRight size={16} aria-hidden="true" />
          </span>
        ) : (
          <Link
            href={hrefBuilder(currentPage + 1)}
            className="ui-button ui-button--secondary"
            aria-label="Próxima página"
          >
            Próxima
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
    </nav>
  );
}
