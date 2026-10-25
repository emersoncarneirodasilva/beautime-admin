"use client";

import { handleLogout } from "@/app/login/actions/handleLogout";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <form action={handleLogout}>
      <button
        type="submit"
        className="ui-button ui-button--tertiary logout-button"
      >
        <LogOut size={16} aria-hidden="true" />
        Sair
      </button>
    </form>
  );
}
