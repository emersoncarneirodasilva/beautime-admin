"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorToast() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [show, setShow] = useState(!!errorParam);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  let message = "Erro ao criar";
  if (errorParam === "email-ja-cadastrado") message = "E-mail já cadastrado";

  return (
    <div className="fixed top-20 right-5 z-50 p-4 bg-[var(--color-error)] text-[var(--text-on-action)] rounded-lg shadow-lg animate-slide-in">
      {message}
    </div>
  );
}
