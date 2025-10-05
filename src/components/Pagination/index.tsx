import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hrefBuilder: (page: number) => string; // função que gera o href
}

export default function Pagination({
  currentPage,
  totalPages,
  hrefBuilder,
}: PaginationProps) {
  return (
    <nav className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mt-10">
      {/* Botão Anterior */}
      <Link
        href={hrefBuilder(currentPage - 1)}
        className={`px-5 py-2.5 rounded-lg font-medium transition ${
          currentPage <= 1
            ? "bg-[var(--color-gray-medium)] text-gray-400 cursor-not-allowed"
            : "bg-[var(--color-primary)] text-[var(--text-on-action)] hover:bg-[var(--color-primary-hover)]"
        }`}
        aria-disabled={currentPage <= 1}
      >
        ← Anterior
      </Link>

      {/* Página atual */}
      <span className="text-sm sm:text-base text-[var(--text-secondary)]">
        Página {currentPage} de {totalPages}
      </span>

      {/* Botão Próxima */}
      <Link
        href={hrefBuilder(currentPage + 1)}
        className={`px-5 py-2.5 rounded-lg font-medium transition ${
          currentPage >= totalPages
            ? "bg-[var(--color-gray-medium)] text-gray-400 cursor-not-allowed"
            : "bg-[var(--color-primary)] text-[var(--text-on-action)] hover:bg-[var(--color-primary-hover)]"
        }`}
        aria-disabled={currentPage >= totalPages}
      >
        Próxima →
      </Link>
    </nav>
  );
}
