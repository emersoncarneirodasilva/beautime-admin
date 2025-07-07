"use client";

import { handleLogout } from "@/app/login/actions/handleLogout";

export default function LogoutButton() {
  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 hover:cursor-pointer transition"
      >
        Sair
      </button>
    </form>
  );
}
