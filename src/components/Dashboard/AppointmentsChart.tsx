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
import { useEffect, useState } from "react";

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

  const data: ChartData<"doughnut", number[], string> = {
    labels: ["Ativos", "Concluídos", "Cancelados"],
    datasets: [
      {
        label: "Agendamentos",
        data: [active, completed, canceled],
        backgroundColor: [
          isDarkMode ? "rgba(141, 199, 230, 0.85)" : "rgba(40, 101, 138, 0.82)",
          isDarkMode ? "rgba(117, 201, 154, 0.85)" : "rgba(24, 121, 78, 0.82)",
          isDarkMode ? "rgba(240, 139, 149, 0.85)" : "rgba(180, 35, 54, 0.82)",
        ],
        borderColor: isDarkMode ? "#202a35" : "#ffffff",
        borderWidth: 3,
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
        font: { size: 16, weight: "bold" },
        color: titleColor,
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        position: "bottom",
        labels: {
          color: legendColor,
          usePointStyle: true, // <--- faz os retângulos virarem círculos
          pointStyle: "circle",
          padding: 18,
        },
      },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
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
