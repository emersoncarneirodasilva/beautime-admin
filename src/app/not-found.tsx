"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Garante que renderização só acontece no cliente (evita hydration errors)
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4">
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
        <AlertCircle className="h-12 w-12 text-[var(--color-error)]" />
        <h1 className="text-4xl font-bold text-[var(--foreground)]">404</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          A página que você está procurando não foi encontrada.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-2 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--text-white-fixed)] rounded-md text-sm transition cursor-pointer"
        >
          Voltar para a página inicial
        </button>
      </div>
    </main>
  );
}
