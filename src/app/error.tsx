"use client";

import { GlobalErrorProps } from "@/types";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  console.error("Erro global:", error);

  return (
    <section className="fixed inset-0 grid place-items-center bg-black/10 backdrop-blur-sm z-50 p-4">
      <div className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-lg max-w-md w-full p-6 flex flex-col items-center text-center space-y-5">
        <AlertCircle className="h-10 w-10 text-[var(--color-error)]" />
        <h2 className="text-xl font-semibold text-[var(--text-secondary)]">
          Oops! Algo deu errado
        </h2>
        <p className="text-gray-600 dark:text-[var(--text-secondary)] text-sm">
          Não conseguimos carregar esta página. Tente novamente ou volte para a
          página inicial.
        </p>

        <div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
          <button
            onClick={() => reset()}
            className="flex-1 px-3 py-2 bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-[var(--text-white-fixed)] rounded-md text-sm transition cursor-pointer"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-3 py-2 border border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-md text-sm hover:bg-[var(--color-secondary)]/10 transition cursor-pointer"
          >
            Voltar para a página inicial
          </button>
        </div>

        <div className="mt-2">
          <Spinner size={20} color="var(--color-error)" />
        </div>
      </div>
    </section>
  );
}
