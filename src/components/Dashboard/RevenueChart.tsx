"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  completedRevenue: number | null;
  expectedRevenue: number | null;
  periodLabel: string;
}

export default function RevenueChart({
  completedRevenue,
  expectedRevenue,
  periodLabel,
}: RevenueChartProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const titleColor = isDarkMode ? "#b0bdcc" : "#64748b";
  const legendColor = titleColor;

  const data: ChartData<"bar", number[], string> = {
    labels: ["Faturamento"],
    datasets: [
      {
        label: "Realizado",
        data: [completedRevenue ?? 0],
        backgroundColor: isDarkMode
          ? "rgba(117, 201, 154, 0.85)"
          : "rgba(24, 121, 78, 0.82)",
        borderRadius: 6,
        barPercentage: 0.33,
      },
      {
        label: "Previsto",
        data: [expectedRevenue ?? 0],
        backgroundColor: isDarkMode
          ? "rgba(118, 167, 250, 0.85)"
          : "rgba(57, 119, 213, 0.82)",
        borderRadius: 6,
        barPercentage: 0.33,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Faturamento (${periodLabel})`,
        font: { size: 16, weight: "bold" },
        color: legendColor,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        position: "bottom",
        labels: { color: titleColor, padding: 20 },
      },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw || 0;
            const datasetLabel = tooltipItem.dataset.label; // "Realizado" ou "Previsto"
            return `${datasetLabel}: R$ ${Number(value).toLocaleString(
              "pt-BR"
            )}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: titleColor, callback: (val) => `R$ ${val}` },
        grid: { color: isDarkMode ? "#364454" : "#dce3ea" },
      },
      x: {
        ticks: { display: false }, // remove os números/textos no eixo x
        grid: { display: false },
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
