"use client";

import { ServiceProfessional } from "@/types";
import { useServicesOnProfessionals } from "@/hooks/useServicesOnProfessionals";
import ModalPagination from "../Pagination/ModalPagination";

type Props = {
  token: string;
  onSelect: (item: ServiceProfessional) => void;
  onClose: () => void;
};

export default function ServiceModal({ token, onSelect, onClose }: Props) {
  const { items, loading, page, search, totalPages, setPage, setSearch } =
    useServicesOnProfessionals(token);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-service-title"
        className="w-full max-w-lg space-y-5 rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-5 text-[var(--foreground)] shadow-2xl transition-all sm:p-6"
      >
        {/* Header */}
        <header className="flex justify-between items-center pb-2 border-b border-[var(--color-gray-medium)]">
          <h2 id="select-service-title" className="text-xl font-semibold tracking-tight">
            Selecionar Serviço
          </h2>

          <button
            type="button"
            aria-label="Fechar seleção de serviço"
            onClick={onClose}
            className="
              text-[var(--text-secondary)] hover:text-[var(--color-error)] 
              text-2xl leading-none transition cursor-pointer
            "
          >
            ✕
          </button>
        </header>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            aria-label="Buscar serviço ou profissional"
            placeholder="Buscar serviço ou profissional..."
            className="
              w-full px-4 py-2.5 
              rounded-md border border-[var(--color-gray-medium)]
              bg-[var(--color-gray-light)] text-[var(--foreground)]
              focus:ring-2 focus:ring-[var(--color-action)] 
              focus:bg-[var(--color-white)]
              transition-all duration-300
            "
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Lista */}
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
          ) : items.length === 0 ? (
            <p className="p-4 text-center text-[var(--text-secondary)]">
              Nenhum serviço encontrado.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="
                  p-4
                  flex flex-col sm:flex-row
                  sm:items-center sm:justify-between
                  gap-3
                  hover:bg-[var(--color-gray-light)]
                  transition cursor-pointer
                "
              >
                <div className="mr-3 flex-1">
                  <p className="font-medium text-[var(--foreground)]">
                    {item.service.name}
                  </p>

                  <p className="text-sm text-[var(--text-secondary)]">
                    Profissional: {item.professional.name}
                  </p>
                </div>

                <button
                  onClick={() => onSelect(item)}
                  className="ui-button ui-button--primary w-full sm:w-auto"
                >
                  Selecionar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        {!loading && items.length > 0 && (
          <ModalPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
