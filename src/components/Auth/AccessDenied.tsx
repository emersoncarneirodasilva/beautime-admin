import Link from "next/link";
import { Lock } from "lucide-react";

export default function AccessDeniedSection() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-4 py-8 sm:px-6">
      <div
        className="w-full max-w-md animate-fadeIn rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-white)] p-6 text-center shadow-lg sm:p-8"
      >
        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <Lock className="w-14 h-14 text-[var(--color-error)]" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">
          Acesso negado
        </h2>

        {/* Mensagem */}
        <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
          Acesso restrito: apenas usuários autorizados podem visualizar esta
          página.
        </p>

        {/* Botão */}
        <Link
          href="/"
          className="
            inline-flex min-h-11 items-center justify-center rounded-lg px-6 py-2.5 font-medium
            bg-[var(--color-action)]
            hover:bg-[var(--color-action-hover)]
            text-[var(--text-on-action)]
            transition-colors cursor-pointer
          "
        >
          Voltar para página inicial
        </Link>
      </div>
    </section>
  );
}
