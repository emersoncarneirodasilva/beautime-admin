import Image from "next/image";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Beautime Admin - Recuperar Acesso",
  description: "Recuperação de acesso do painel Beautime",
};

export default async function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors relative px-4">
      <ThemeToggle />

      <div className="bg-[var(--color-white)] rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 flex flex-col items-center transition-colors">
        {/* Logo + Nome */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo Beautime"
            width={90}
            height={90}
            className="rounded-full mb-3 max-w-[15vw] sm:max-w-[90px] h-auto"
            priority
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-primary)] text-center">
            Beautime
          </h1>
          <span className="text-xl font-semibold text-[var(--text-secondary)] tracking-wide">
            Admin
          </span>
        </div>

        {/* Subtítulo */}
        <h2 className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-6 text-center">
          Esqueceu seu e-mail de login? Digite o endereço de e-mail associado à
          sua conta para enviarmos instruções de recuperação.
        </h2>

        {/* Formulário */}
        <form className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            required
            className="border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-border)] rounded-lg px-4 py-3 w-full bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] text-[var(--foreground)] placeholder:text-[var(--color-gray-medium)] dark:placeholder:text-[var(--color-gray-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <button
            type="submit"
            className="w-full py-3 sm:py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors text-base sm:text-lg cursor-pointer"
          >
            Enviar instruções
          </button>
        </form>

        <p className="text-center mt-4 text-[var(--text-secondary)] text-sm sm:text-base">
          Lembrou sua senha?{" "}
          <Link
            href="/login"
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    </main>
  );
}
