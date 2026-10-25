import { Metadata } from "next";
import Image from "next/image";
import ThemeToggle from "@/components/Theme/ThemeToggle";
import ErrorToastFromParams from "@/components/Error/ErrorToastFromParams";
import ResetPasswordButtonSubmit from "@/components/Buttons/LoginButtonSubmit"; // você pode trocar por outro se quiser
import { resetPasswordAction } from "./actions/resetPassword";
import Link from "next/link";

interface Params {
  token: string;
}

export const metadata: Metadata = {
  title: "Beautime Admin - Redefinir Senha",
  description: "Redefina sua senha do painel Beautime",
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors relative px-4">
      <ErrorToastFromParams />

      <ThemeToggle />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-6 shadow-sm transition-colors sm:p-8">
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
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)] text-center">
            Beautime
          </h1>
          <span className="text-base font-medium tracking-wide text-[var(--text-secondary)]">
            Admin
          </span>
        </div>

        {/* Subtítulo */}
        <h2 className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-6 text-center">
          Defina sua nova senha para continuar acessando sua conta.
        </h2>

        {/* Formulário */}
        <form
          action={resetPasswordAction}
          id="reset-password-submit"
          className="w-full space-y-4"
        >
          <input type="hidden" name="token" value={token} />

          <input
            type="password"
            name="new-password"
            aria-label="Nova senha"
            placeholder="Nova senha"
            required
            className="border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-border)] rounded-lg px-4 py-3 w-full bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] text-[var(--foreground)] placeholder:text-[var(--color-gray-medium)] dark:placeholder:text-[var(--color-gray-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <input
            type="password"
            name="confirm-password"
            aria-label="Confirme sua nova senha"
            placeholder="Confirme sua nova senha"
            required
            className="border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-border)] rounded-lg px-4 py-3 w-full bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] text-[var(--foreground)] placeholder:text-[var(--color-gray-medium)] dark:placeholder:text-[var(--color-gray-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          />

          <ResetPasswordButtonSubmit
            title="Redefinir Senha"
            id="reset-password-submit"
          />
        </form>

        <p className="text-center mt-4 text-[var(--text-secondary)] text-sm sm:text-base">
          Já lembrou sua senha?{" "}
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
