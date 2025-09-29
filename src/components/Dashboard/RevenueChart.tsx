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

  const titleColor = isDarkMode ? "#c4c4c4" : "#374151";
  const legendColor = isDarkMode ? "#c4c4c4" : "#6b7280";

  const data: ChartData<"bar", number[], string> = {
    labels: ["Faturamento"],
    datasets: [
      {
        label: "Realizado",
        data: [completedRevenue ?? 0],
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 6,
        barPercentage: 0.33,
      },
      {
        label: "Previsto",
        data: [expectedRevenue ?? 0],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderRadius: 6,
        barPercentage: 0.33,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { color: titleColor } },
      title: {
        display: true,
        text: `Faturamento (${periodLabel})`,
        font: { size: 18, weight: "bold" },
        color: legendColor,
      },
      tooltip: {
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
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
        ticks: { color: "#6b7280", callback: (val) => `R$ ${val}` },
        grid: { color: "#e5e7eb" },
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
