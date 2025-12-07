import Link from "next/link";
import { Lock } from "lucide-react";

export default function AccessDeniedSection() {
  return (
    <section className="grid place-items-center min-h-screen px-6">
      <div
        className="
          bg-[var(--color-white)]
          dark:bg-[var(--color-gray-light)]
          border border-[var(--color-error)]
          shadow-xl
          max-w-md w-full p-8 rounded-xl text-center
          animate-slide-in
        "
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
            inline-block px-6 py-2.5 rounded-lg font-medium
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
