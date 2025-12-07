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
    <section className="grid place-items-center min-h-screen px-6">
      <div className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-error)] shadow-xl max-w-md w-full p-8 rounded-xl text-center animate-slide-in">
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
          className="inline-block px-6 py-2.5 rounded-lg font-medium bg-[var(--color-action)] hover:bg-[var(--color-action-hover)] text-[var(--text-on-action)] transition-colors"
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
