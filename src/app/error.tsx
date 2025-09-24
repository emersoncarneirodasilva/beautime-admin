"use client";

import { GlobalErrorProps } from "@/types";
import { useRouter } from "next/navigation";

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const router = useRouter();

  console.error("Global error:", error);

  return (
    <section className="grid place-items-center min-h-screen text-center px-4">
      <div className="p-8 bg-red-100 text-red-800 rounded shadow max-w-md">
        <h2 className="text-xl font-semibold mb-2">Erro inesperado</h2>
        <p className="mb-4">
          Algo deu errado durante o carregamento da página. Por favor, tente
          novamente mais tarde.
        </p>

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 w-fit bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
          >
            Tentar novamente
          </button>

          <button
            onClick={() => router.push("/")}
            className="text-blue-600 underline hover:text-blue-800 hover:cursor-pointer"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </section>
  );
}
