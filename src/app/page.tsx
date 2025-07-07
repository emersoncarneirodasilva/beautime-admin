import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-6">
        Bem-vindo ao Beautime Admin
      </h1>

      <Link
        href="/login"
        className="block text-center p-2 bg-white rounded-md text-blue-600 hover:underline hover:cursor-pointer"
      >
        <button className="hover:cursor-pointer">Fazer Login</button>
      </Link>

      <p className="text-center mt-4 text-gray-600">
        Não tem uma conta?{" "}
        <a
          href="mailto:mersiocarneiro87@gmail.com"
          className="text-blue-600 hover:underline"
        >
          Entre em contato
        </a>
      </p>
    </div>
  );
}
