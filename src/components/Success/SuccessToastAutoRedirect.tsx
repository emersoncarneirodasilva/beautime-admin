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
    <div className="fixed top-18 right-5 z-50 animate-slide-in">
      <div className="flex items-center gap-3 bg-[var(--color-success)] text-[var(--text-on-action)] px-4 py-3 rounded-lg shadow-lg">
        <CheckCircle className="w-6 h-6" />
        <span>{success}</span>
      </div>
    </div>
  );
}
