"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface AppointmentsChartProps {
  active: number;
  completed: number;
  canceled: number;
  periodLabel: string;
}

export default function AppointmentsChart({
  active,
  completed,
  canceled,
  periodLabel,
}: AppointmentsChartProps) {
  const data: ChartData<"doughnut", number[], string> = {
    labels: ["Ativos", "Concluídos", "Cancelados"],
    datasets: [
      {
        label: "Agendamentos",
        data: [active, completed, canceled],
        backgroundColor: [
          "rgba(250, 204, 21, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Agendamentos (${periodLabel})`,
        font: { size: 18, weight: "bold" },
        color: "#374151",
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        position: "bottom",
        labels: { color: "#6b7280" },
      },
      tooltip: {
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: (tooltipItem) => {
            const value = data.datasets[0].data[tooltipItem.dataIndex] || 0;
            const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percent = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: "350px", width: "100%" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
