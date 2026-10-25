"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessToastAutoRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const success = searchParams.get("success");

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  if (!success) return null;

  return (
    <div role="status" className="fixed left-4 right-4 top-20 z-50 animate-slide-in sm:left-auto sm:right-5 sm:max-w-md">
      <div className="flex items-center gap-3 rounded-xl border border-[var(--color-success)]/25 bg-[var(--color-success-soft)] px-4 py-3 text-[var(--color-success)] shadow-lg">
        <CheckCircle className="h-5 w-5 shrink-0" />
        <span>{success}</span>
      </div>
    </div>
  );
}
