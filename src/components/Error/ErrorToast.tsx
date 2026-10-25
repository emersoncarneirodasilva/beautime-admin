"use client";

import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";

interface ErrorToastProps {
  message: string;
}

export default function ErrorToast({ message }: ErrorToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div role="alert" className="fixed left-4 right-4 top-20 z-50 animate-slide-in rounded-xl border border-[var(--color-error)]/25 bg-[var(--color-error-soft)] p-4 text-[var(--color-error)] shadow-lg sm:left-auto sm:right-5 sm:max-w-md">
      <div className="flex items-center gap-3">
        <XCircle className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
