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
    labels: ["Realizado", "Previsto"],
    datasets: [
      {
        label: "Faturamento",
        data: [completedRevenue ?? 0, expectedRevenue ?? 0],
        backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(59, 130, 246, 0.8)"],
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Faturamento (${periodLabel})`,
        font: { size: 18, weight: "bold" },
        color: "#374151",
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        borderColor: "#4b5563",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (tooltipItem) =>
            `R$ ${Number(tooltipItem.raw || 0).toLocaleString("pt-BR")}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
          callback: (val) => `R$ ${val}`,
        },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#6b7280", font: { size: 14 } },
        grid: { display: false },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeOutQuart",
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}
