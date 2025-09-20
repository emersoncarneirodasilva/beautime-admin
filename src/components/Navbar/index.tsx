// components/Navbar.tsx
import LogoutButton from "@/components/Auth/LogoutButton";

export default function Navbar({
  salonName,
  adminName,
}: {
  salonName: string;
  adminName?: string | null;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gray-900 text-white flex items-center z-40 shadow-md">
      <div className="flex-1 pl-64 px-6 flex items-center justify-between relative">
        {/* Nome do salão centralizado */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="font-semibold text-lg">{salonName}</span>
        </div>

        {/* Lado direito */}
        <div className="flex items-center gap-4 ml-auto">
          <span className="text-sm text-gray-300">
            Olá{adminName ? `, ${adminName}` : ""}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
