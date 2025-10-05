import Link from "next/link";

interface BackLinkProps {
  slug: string;
  to: string; // caminho relativo após o slug
  label?: string; // opcional, padrão "Voltar"
}

export default function BackLink({
  slug,
  to,
  label = "Voltar",
}: BackLinkProps) {
  return (
    <footer className="mt-6">
      <Link
        href={`/${slug}/${to}`}
        className="text-sm text-[var(--color-primary)] hover:underline transition-colors block"
      >
        ← {label}
      </Link>
    </footer>
  );
}
