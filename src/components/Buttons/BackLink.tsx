import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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
        className="ui-button ui-button--secondary w-fit"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {label}
      </Link>
    </footer>
  );
}
