"use client";

import { handleLogout } from "@/app/login/actions/handleLogout";

export default function LogoutButton() {
  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className=" 
          px-3 py-2 rounded-md
          bg-[var(--color-error)] hover:bg-[#c92f3b] hover:scale-[1.02]
          text-primary text-sm sm:text-[16px] font-semibold
          shadow-sm hover:shadow-md
          transition-all duration-300 ease-in-out cursor-pointer
        "
      >
        Sair
      </button>
    </form>
  );
}
