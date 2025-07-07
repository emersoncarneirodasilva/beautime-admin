import Link from "next/link";

export default function AccessDenied() {
  return (
    <section className="grid place-items-center min-h-screen text-center">
      <div className="p-6 bg-red-100 text-red-700 rounded max-w-md">
        <h2 className="text-lg font-semibold mb-2">Acesso negado</h2>
        <p className="mb-4">
          Acesso restrito: apenas usuários autorizados podem visualizar esta
          página.
        </p>
        <Link href="/" className="text-blue-600 underline hover:text-blue-800">
          Voltar para página inicial
        </Link>
      </div>
    </section>
  );
}
