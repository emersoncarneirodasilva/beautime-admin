"use client";

import { GlobalErrorProps } from "@/types";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  console.error("Erro global:", error);

  return (
    <section className="fixed inset-0 z-50 grid place-items-center bg-[var(--background)]/90 p-4 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col items-center space-y-5 rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-6 text-center shadow-lg">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />

        <h2 className="text-xl font-semibold text-[var(--foreground)]">
          Oops! Algo deu errado
        </h2>

        <p className="text-sm text-[var(--text-secondary)]">
          Não conseguimos carregar esta página. Você pode tentar novamente ou
          recarregar completamente o aplicativo.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
          {/* Tenta apenas remontar a árvore React */}
          <button
            type="button"
            onClick={() => reset()}
            className="min-h-10 flex-1 rounded-lg bg-[var(--color-error)] px-3 py-2 text-sm text-[var(--text-on-error)] transition hover:bg-[var(--color-error-hover)]"
          >
            Tentar novamente
          </button>

          {/* F5 real */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="min-h-10 flex-1 rounded-lg border border-[var(--color-gray-medium)] px-3 py-2 text-sm text-[var(--foreground)] transition hover:bg-[var(--color-gray-light)]"
          >
            Recarregar página
          </button>
        </div>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="min-h-9 rounded-lg px-3 text-xs text-[var(--text-secondary)] hover:underline"
        >
          Voltar para Home
        </button>

        <div className="mt-2">
          <Spinner size={20} color="var(--color-error)" />
        </div>
      </div>
    </section>
  );
}
