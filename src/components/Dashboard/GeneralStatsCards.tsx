"use client";

import { Users, UserCog, Scissors, Briefcase } from "lucide-react";

interface GeneralStatsCardsProps {
  users: number;
  admins: number;
  services: number;
  professionals: number;
}

const stats = [
  { key: "users", label: "Usuários", icon: Users, color: "bg-blue-500" },
  {
    key: "admins",
    label: "Administradores",
    icon: UserCog,
    color: "bg-indigo-500",
  },
  {
    key: "services",
    label: "Serviços",
    icon: Scissors,
    color: "bg-yellow-500",
  },
  {
    key: "professionals",
    label: "Profissionais",
    icon: Briefcase,
    color: "bg-emerald-500",
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
          className="flex items-center gap-4 bg-[var(--color-white)] rounded-xl shadow p-5 hover:shadow-md transition"
        >
          <div className={`${color} p-3 rounded-lg text-[var(--color-white)]`}>
            <Icon size={28} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{label}</p>
            <p className="text-2xl font-bold text-gray-600/90">{values[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
