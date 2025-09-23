// app/login/error.tsx
"use client";

export default function LoginError() {
  return (
    <section className="grid place-items-center min-h-screen">
      <div className="p-8 bg-red-200 text-red-800 rounded">
        <p>Erro no login: E-mail ou senha inválidos.</p>
        <button
          onClick={() => window.location.reload()}
          className="underline mt-4 cursor-pointer"
        >
          Tentar novamente
        </button>
      </div>
    </section>
  );
}
