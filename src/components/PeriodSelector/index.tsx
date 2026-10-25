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

  const labelStyle = `min-h-11 border border-[var(--color-gray-medium)]
             px-3 py-2 rounded-lg
             bg-[var(--color-white)] text-[var(--foreground)]`;

  const buttonStyle = "ui-button ui-button--primary";

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
    <div className="flex flex-col items-start gap-4 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      {/* Tipo de período */}
      <fieldset className="flex flex-wrap gap-x-5 gap-y-2">
        <legend className="sr-only">Período dos indicadores</legend>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="radio"
            value="WEEK"
            checked={periodType === "WEEK"}
            onChange={() => setPeriodType("WEEK")}
            disabled={isPending}
          />{" "}
          Semanal
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="radio"
            value="MONTH"
            checked={periodType === "MONTH"}
            onChange={() => setPeriodType("MONTH")}
            disabled={isPending}
          />{" "}
          Mensal
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="radio"
            value="YEAR"
            checked={periodType === "YEAR"}
            onChange={() => setPeriodType("YEAR")}
            disabled={isPending}
          />{" "}
          Anual
        </label>
      </fieldset>

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
