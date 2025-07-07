import Link from "next/link";

interface ErrorSectionProps {
  title: string;
  message?: string;
  linkHref?: string;
  linkText?: string;
}

export default function ErrorSection({
  title,
  message = "Ocorreu um erro inesperado.",
  linkHref = "/",
  linkText = "Voltar para página inicial",
}: ErrorSectionProps) {
  return (
    <section className="grid place-items-center min-h-screen text-center">
      <div className="p-6 bg-red-100 text-red-700 rounded max-w-md">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="mb-4">{message}</p>
        <Link
          href={linkHref}
          className="text-blue-600 underline hover:text-blue-800 hover:cursor-pointer"
        >
          {linkText}
        </Link>
      </div>
    </section>
  );
}
