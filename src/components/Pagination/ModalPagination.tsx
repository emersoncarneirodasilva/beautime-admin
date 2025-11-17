"use client";

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
    <div className="flex justify-between items-center pt-4">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="
          px-4 py-2 rounded-md border border-[var(--color-gray-medium)] 
          text-[var(--foreground)]
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:bg-[var(--color-gray-medium)/20] transition cursor-pointer
        "
      >
        Anterior
      </button>

      <span className="text-sm text-[var(--text-secondary)]">
        Página <strong>{page}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="
          px-4 py-2 rounded-md border border-[var(--color-gray-medium)] 
          text-[var(--foreground)]
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:bg-[var(--color-gray-medium)/20] transition cursor-pointer
        "
      >
        Próxima
      </button>
    </div>
  );
}
