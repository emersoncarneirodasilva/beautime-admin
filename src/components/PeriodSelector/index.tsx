"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PeriodSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // valores iniciais vindos da URL ou padrão
  const initialType =
    (searchParams.get("periodType") as "WEEK" | "MONTH" | "YEAR") || "MONTH";
  const initialValue =
    searchParams.get("periodValue") ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`;

  const [periodType, setPeriodType] = useState<"WEEK" | "MONTH" | "YEAR">(
    initialType
  );
  const [periodValue, setPeriodValue] = useState(initialValue);

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

  // Função auxiliar: calcula semana ISO
  function getWeekNumber(date: Date) {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);
  }

  // Submeter sem reload
  function applyFilter() {
    const params = new URLSearchParams();
    params.set("periodType", periodType);
    params.set("periodValue", periodValue);
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      {/* Radios */}
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            value="WEEK"
            checked={periodType === "WEEK"}
            onChange={() => setPeriodType("WEEK")}
          />{" "}
          Semanal
        </label>
        <label>
          <input
            type="radio"
            value="MONTH"
            checked={periodType === "MONTH"}
            onChange={() => setPeriodType("MONTH")}
          />{" "}
          Mensal
        </label>
        <label>
          <input
            type="radio"
            value="YEAR"
            checked={periodType === "YEAR"}
            onChange={() => setPeriodType("YEAR")}
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
          className="border px-2 py-1 rounded bg-white text-black"
        />
      )}
      {periodType === "MONTH" && (
        <input
          type="month"
          value={periodValue}
          onChange={(e) => setPeriodValue(e.target.value)}
          className="border px-2 py-1 rounded bg-white text-black"
        />
      )}
      {periodType === "YEAR" && (
        <input
          type="number"
          value={periodValue}
          onChange={(e) => setPeriodValue(e.target.value)}
          className="border px-2 py-1 rounded bg-white text-black"
        />
      )}

      <button
        onClick={applyFilter}
        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer"
      >
        Aplicar
      </button>
    </div>
  );
}
