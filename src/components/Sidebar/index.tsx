"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Users,
  Calendar,
  ImageIcon,
  Box,
  Bell,
  Clock,
  UserCheck,
  Tags,
  Briefcase,
  LinkIcon,
  History,
  X,
  Menu as MenuIcon,
  PenIcon,
} from "lucide-react";

interface SidebarProps {
  slug: string;
}

export default function Sidebar({ slug }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Painel", href: `/${slug}/dashboard`, icon: Home },
    {
      label: "Gerenciamento",
      items: [
        { label: "Salão", href: `/${slug}/dashboard/salon`, icon: Box },
        { label: "Usuários", href: `/${slug}/dashboard/users`, icon: Users },
        {
          label: "Profissionais",
          href: `/${slug}/dashboard/professionals`,
          icon: UserCheck,
        },
        {
          label: "Categorias",
          href: `/${slug}/dashboard/categories`,
          icon: Tags,
        },
        {
          label: "Serviços",
          href: `/${slug}/dashboard/services`,
          icon: Briefcase,
        },
        {
          label: "Associação Profissional/Serviço",
          href: `/${slug}/dashboard/services-on-professionals`,
          icon: LinkIcon,
        },
      ],
    },
    {
      label: "Agendamentos",
      items: [
        {
          label: "Agendar",
          href: `/${slug}/dashboard/appointment`,
          icon: PenIcon,
        },
        {
          label: "Agendamentos",
          href: `/${slug}/dashboard/appointments`,
          icon: Calendar,
        },

        {
          label: "Histórico",
          href: `/${slug}/dashboard/appointment-history`,
          icon: History,
        },
      ],
    },
    {
      label: "Configurações",
      items: [
        {
          label: "Notificações",
          href: `/${slug}/dashboard/notifications`,
          icon: Bell,
        },
        {
          label: "Horário Comercial",
          href: `/${slug}/dashboard/business-hours`,
          icon: Clock,
        },
        {
          label: "Imagens",
          href: `/${slug}/dashboard/images`,
          icon: ImageIcon,
        },
      ],
    },
  ];

  return (
    <>
      {/* Hamburger button - Mobile */}
      <button
        className="md:hidden fixed top-3.5 left-4.5 z-50 p-2 bg-[var(--color-primary)] text-primary rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon size={20} />
      </button>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex fixed left-0 top-16 h-[calc(100vh-50px)] w-50 bg-[var(--color-gray-light)] text-[var(--foreground)] flex-col shadow-lg transition-colors">
        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto sidebar-scroll">
          {menuItems.map((block, idx) => (
            <div
              key={idx}
              className={`mt-4 ${idx === menuItems.length - 1 ? "pb-6" : ""}`}
            >
              {block.items ? (
                <>
                  <h3 className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                    {block.label}
                  </h3>
                  {block.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      <item.icon size={16} />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={block.href}
                  className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  <block.icon size={16} />
                  <span className="text-sm">{block.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Sidebar Mobile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Sidebar */}
          <aside className="relative w-64 bg-[var(--color-gray-light)] text-[var(--foreground)] flex flex-col shadow-lg transition-transform animate-slide-in">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
              {menuItems.map((block, idx) => (
                <div key={idx} className="mt-4">
                  {block.items ? (
                    <>
                      <h3 className="px-4 py-2 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider">
                        {block.label}
                      </h3>
                      {block.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon size={16} />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={block.href}
                      className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <block.icon size={16} />
                      <span className="text-sm">{block.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
