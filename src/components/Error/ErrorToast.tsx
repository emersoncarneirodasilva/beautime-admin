"use client";

import { useEffect, useState } from "react";

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
    <div className="fixed top-20 right-5 z-50 p-4 bg-[var(--color-error)] text-[var(--text-on-action)] rounded-lg shadow-lg animate-slide-in">
      {message}
    </div>
  );
}
