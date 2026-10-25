import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface ErrorSectionProps {
  title: string;
  message?: string;
  linkHome?: string;
  linkHref?: string;
  linkText?: string;
}

export default function ErrorSection({
  title,
  message = "Ocorreu um erro inesperado.",
  linkHome = "/",
  linkHref = "/",
  linkText = "Voltar para página inicial",
}: ErrorSectionProps) {
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md animate-fadeIn rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-white)] p-6 text-center shadow-lg sm:p-8">
        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-14 h-14 text-[var(--color-error)]" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">
          {title}
        </h2>

        {/* Mensagem */}
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          {message}
        </p>

        {/* Botão principal */}
        <Link
          href={linkHref}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--color-action)] px-6 py-2.5 font-medium text-[var(--text-on-action)] transition-colors hover:bg-[var(--color-action-hover)]"
        >
          {linkText}
        </Link>

        {/* Link discreto */}
        <Link
          href={linkHome}
          className="mt-4 block text-sm text-[var(--text-secondary)] hover:underline"
        >
          Ir para a página inicial
        </Link>
      </div>
    </section>
  );
}
