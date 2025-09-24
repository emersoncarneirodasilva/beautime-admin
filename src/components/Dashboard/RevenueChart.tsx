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
      legend: { position: "bottom", labels: { color: "#6b7280" } },
      title: {
        display: true,
        text: `Faturamento (${periodLabel})`,
        font: { size: 18, weight: "bold" },
        color: "#374151",
      },
      tooltip: {
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
