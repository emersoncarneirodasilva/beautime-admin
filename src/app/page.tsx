import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/Theme/ThemeToggle";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors relative px-4">
      <ThemeToggle />

      <div className="bg-[var(--color-white)] rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 flex flex-col items-center transition-colors">
        <div className="mb-6 flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Logo Beautime"
            width={90}
            height={90}
            className="rounded-full mb-3 max-w-[15vw] sm:max-w-[90px] h-auto"
            priority
          />
          <h1 className="text-4xl font-bold text-[var(--color-primary)]">
            Beautime
          </h1>
          <span className="text-xl font-semibold text-[var(--text-secondary)] tracking-wide">
            Admin
          </span>
        </div>

        <h2 className="text-base sm:text-lg md:text-xl text-[var(--text-secondary)] mb-6 text-center">
          Bem-vindo ao painel de administração
        </h2>

        <Link href="/login" className="w-full">
          <button className="w-full py-3 sm:py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-lg transition-colors cursor-pointer text-base sm:text-lg">
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
