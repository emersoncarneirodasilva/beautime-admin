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
    <div className="fixed top-18 right-5 z-50 p-4 bg-[var(--color-error)] text-[var(--text-on-action)] rounded-lg shadow-lg animate-slide-in">
      <div className="flex items-center gap-3 rounded-lg shadow-lg">
        <XCircle className="w-6 h-6" />
        <span>{message}</span>
      </div>
    </div>
  );
}
