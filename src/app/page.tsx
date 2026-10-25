import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/Theme/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors relative px-4">
      <ThemeToggle />

      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-6 shadow-sm transition-colors sm:p-8">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo Beautime"
            width={90}
            height={90}
            className="rounded-full mb-3 max-w-[15vw] sm:max-w-[90px] h-auto"
            priority
          />
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
            Beautime
          </h1>
          <span className="text-base font-medium tracking-wide text-[var(--text-secondary)]">
            Admin
          </span>
        </div>

        <h2 className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-6 text-center">
          Bem-vindo ao painel de administração
        </h2>

        <Link href="/login" className="w-full">
          <button className="min-h-12 w-full rounded-lg bg-[var(--color-action)] py-3 text-base font-semibold text-[var(--text-on-action)] transition-colors hover:bg-[var(--color-action-hover)] sm:py-4 sm:text-lg">
            Fazer Login
          </button>
        </Link>

        <p className="text-center mt-4 text-[var(--text-secondary)] text-sm sm:text-base">
          Não tem uma conta?{" "}
          <a
            href="mailto:mersiocarneiro87@gmail.com"
            className="text-[var(--color-primary)] font-medium hover:underline"
          >
            Entre em contato
          </a>
        </p>
      </div>
    </div>
  );
}
