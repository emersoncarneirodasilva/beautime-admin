"use client";

import { useEffect, useState } from "react";

export default function LoginError({ error }: { error: Error }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <section className="grid place-items-center min-h-screen">
      <div className="p-8 bg-red-200 text-red-800 rounded">
        <p>Erro no login: {error.message}</p>
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
