"use client";

import { handleLogout } from "@/app/login/actions/handleLogout";

export default function LogoutButton() {
  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="
          px-4 py-2 rounded-md
          bg-[var(--color-error)] hover:bg-[#c92f3b]
          text-primary font-semibold
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out cursor-pointer
        "
      >
        Sair
      </button>
    </form>
  );
}
