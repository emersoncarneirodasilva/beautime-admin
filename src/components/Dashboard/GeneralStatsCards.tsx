"use client";

import { Users, UserCog, Scissors, Briefcase } from "lucide-react";

interface GeneralStatsCardsProps {
  users: number;
  admins: number;
  services: number;
  professionals: number;
}

const stats = [
  { key: "users", label: "Usuários", icon: Users, color: "info" },
  {
    key: "admins",
    label: "Administradores",
    icon: UserCog,
    color: "brand",
  },
  {
    key: "services",
    label: "Serviços",
    icon: Scissors,
    color: "warning",
  },
  {
    key: "professionals",
    label: "Profissionais",
    icon: Briefcase,
    color: "success",
  },
];

export default function GeneralStatsCards({
  users,
  admins,
  services,
  professionals,
}: GeneralStatsCardsProps) {
  const values: Record<string, number> = {
    users,
    admins,
    services,
    professionals,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <div
          key={key}
          className="flex min-h-28 items-center gap-4 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-white)] p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div
            className={`rounded-xl p-3 ${
              color === "success"
                ? "bg-[var(--color-success-soft)] text-[var(--color-success)]"
                : color === "warning"
                ? "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                : color === "info"
                ? "bg-[var(--color-info-soft)] text-[var(--color-info)]"
                : "bg-[var(--color-gray-light)] text-[var(--color-primary)]"
            }`}
          >
            <Icon size={24} strokeWidth={1.8} />
          </div>
          <div>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight text-[var(--foreground)]">{values[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
