"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();
  const [periodType, setPeriodType] = useState<"WEEK" | "MONTH" | "YEAR">(
    (searchParams.get("periodType") as "WEEK" | "MONTH" | "YEAR") || "MONTH"
  );
  const [periodValue, setPeriodValue] = useState(
    searchParams.get("periodValue") ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
        2,
        "0"
      )}`
  );

  const labelStyle = `border border-[var(--color-gray-medium)] dark:border-[var(--color-gray-light)] 
             px-2 py-1 rounded 
             bg-[var(--color-gray-light)] dark:bg-[var(--color-gray-medium)] 
             text-[var(--foreground)]`;

  const buttonStyle = `bg-[var(--color-action)] text-[var(--text-on-action)] 
             px-4 py-1 rounded hover:bg-[var(--color-action-hover)] 
             cursor-pointer flex items-center gap-2 transition-colors`;

  // Atualiza valor padrão quando muda o tipo
  useEffect(() => {
    const now = new Date();
    if (periodType === "YEAR") {
      setPeriodValue(now.getFullYear().toString());
    } else if (periodType === "MONTH") {
      const month = String(now.getMonth() + 1).padStart(2, "0");
      setPeriodValue(`${now.getFullYear()}-${month}`);
    } else if (periodType === "WEEK") {
      const week = String(getWeekNumber(now)).padStart(2, "0");
      setPeriodValue(`${now.getFullYear()}-W${week}`);
    }
  }, [periodType]);

  function getWeekNumber(date: Date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  }

  function applyFilter() {
    const params = new URLSearchParams();
    params.set("periodType", periodType);
    params.set("periodValue", periodValue);

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
      {/* Tipo de período */}
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            value="WEEK"
            checked={periodType === "WEEK"}
            onChange={() => setPeriodType("WEEK")}
            disabled={isPending}
          />{" "}
          Semanal
        </label>
        <label>
          <input
            type="radio"
            value="MONTH"
            checked={periodType === "MONTH"}
            onChange={() => setPeriodType("MONTH")}
            disabled={isPending}
          />{" "}
          Mensal
        </label>
        <label>
          <input
            type="radio"
            value="YEAR"
            checked={periodType === "YEAR"}
            onChange={() => setPeriodType("YEAR")}
            disabled={isPending}
          />{" "}
          Anual
        </label>
      </div>

      {/* Campo dinâmico */}
      {periodType === "WEEK" && (
        <input
          type="week"
          value={periodValue}
          onChange={(e) => setPeriodValue(e.target.value)}
          className={labelStyle}
          disabled={isPending}
        />
      )}
      {periodType === "MONTH" && (
        <input
          type="month"
          value={periodValue}
          onChange={(e) => setPeriodValue(e.target.value)}
          className={labelStyle}
          disabled={isPending}
        />
      )}
      {periodType === "YEAR" && (
        <input
          type="number"
          value={periodValue}
          onChange={(e) => setPeriodValue(e.target.value)}
          className={labelStyle}
          disabled={isPending}
        />
      )}

      <button
        onClick={applyFilter}
        className={buttonStyle}
        disabled={isPending}
      >
        {isPending ? (
          <span className="animate-pulse">Carregando...</span>
        ) : (
          "Aplicar"
        )}
      </button>
    </div>
  );
}
