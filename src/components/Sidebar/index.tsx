"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const isNavItemActive = (href: string) =>
    normalizedPathname === href ||
    (href !== `/${slug}/dashboard` &&
      normalizedPathname.startsWith(`${href}/`));
  const navItemClass = (href: string) =>
    `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm transition-colors ${
      isNavItemActive(href)
        ? "border-[var(--color-action)] bg-[var(--color-action-soft)] font-semibold text-[var(--color-action)]"
        : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--color-white)] hover:text-[var(--foreground)]"
    }`;

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
        type="button"
        aria-label="Abrir menu de navegação"
        aria-expanded={isOpen}
        className="fixed left-4 top-3.5 z-50 grid h-11 w-11 cursor-pointer place-items-center rounded-lg bg-[var(--color-primary)] p-0 text-[var(--color-primary-foreground)] shadow-sm transition-colors hover:bg-[var(--color-primary-hover)] md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon size={20} />
      </button>

      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-60 flex-col border-r border-[var(--color-gray-medium)] bg-[var(--color-white)] text-[var(--foreground)] transition-colors md:flex">
        <div className="border-b border-[var(--color-gray-medium)] px-5 py-5">
          <p className="font-[var(--font-poppins)] text-base font-semibold tracking-tight">
            Beautime
          </p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            Administração
          </p>
        </div>
        <nav aria-label="Navegação principal" className="sidebar-scroll flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {menuItems.map((block, idx) => (
            <div
              key={idx}
              className={`${idx === 0 ? "" : "mt-5"} ${idx === menuItems.length - 1 ? "pb-6" : ""}`}
            >
              {block.items ? (
                <>
                  <h3 className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                    {block.label}
                  </h3>
                  {block.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={navItemClass(item.href)}
                      aria-current={
                        isNavItemActive(item.href) ? "page" : undefined
                      }
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={block.href}
                  className={navItemClass(block.href)}
                  aria-current={
                    isNavItemActive(block.href) ? "page" : undefined
                  }
                >
                  <block.icon size={16} />
                  <span>{block.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Sidebar Mobile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Sidebar */}
          <aside role="dialog" aria-modal="true" aria-label="Menu de navegação" className="relative flex w-72 max-w-[85vw] flex-col bg-[var(--color-white)] text-[var(--foreground)] shadow-[var(--shadow-popover)] transition-transform animate-slide-in">
            <div className="flex items-center justify-between border-b border-[var(--color-gray-medium)] px-5 py-4">
              <div>
                <p className="font-[var(--font-poppins)] text-base font-semibold tracking-tight">
                  Beautime
                </p>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                  Administração
                </p>
              </div>
              <button type="button" aria-label="Fechar menu de navegação" onClick={() => setIsOpen(false)} className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg p-0 text-[var(--text-secondary)] transition-colors hover:bg-[var(--color-gray-light)] hover:text-[var(--foreground)]">
                <X size={20} />
              </button>
            </div>
            <nav aria-label="Navegação principal" className="sidebar-scroll flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              {menuItems.map((block, idx) => (
                <div key={idx} className={idx === 0 ? "" : "mt-5"}>
                  {block.items ? (
                    <>
                      <h3 className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                        {block.label}
                      </h3>
                      {block.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={navItemClass(item.href)}
                          aria-current={
                            isNavItemActive(item.href) ? "page" : undefined
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          <item.icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={block.href}
                      className={navItemClass(block.href)}
                      aria-current={
                        isNavItemActive(block.href) ? "page" : undefined
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      <block.icon size={16} />
                      <span>{block.label}</span>
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
