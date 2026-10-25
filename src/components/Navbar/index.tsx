"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import LogoutButton from "@/components/Auth/LogoutButton";
import { Moon, Sun } from "lucide-react";

interface NavbarProps {
  salonName: string;
  adminName?: string | null;
}

export default function Navbar({ salonName, adminName }: NavbarProps) {
  const navbarHeight = 64;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-primary text-primary shadow-sm transition-colors">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between pl-16 pr-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Beautime Logo"
              width={30}
              height={30}
              className="rounded-full"
              priority
            />
            {salonName && (
              <span className="hidden truncate text-sm font-semibold sm:inline md:text-base">
                {salonName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm sm:inline md:text-base">
              Olá{adminName ? `, ${adminName}` : ""}
            </span>
            <button
              onClick={toggleTheme}
              type="button"
              aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg transition-colors hover:bg-black/10 hover:text-[var(--color-secondary)]"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div style={{ height: navbarHeight }} />
    </>
  );
}
