import Image from "next/image";
import LogoutButton from "@/components/Auth/LogoutButton";

export default function Navbar({
  salonName,
  adminName,
}: {
  salonName: string;
  adminName?: string | null;
}) {
  const navbarHeight = 64; // Altura fixa da navbar em pixels

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 h-16 bg-primary text-primary 
                    shadow-md z-50 transition-colors`}
      >
        <div className="h-full flex items-center justify-between px-4 sm:px-6 md:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Beautime Logo"
              width={30}
              height={30}
              className="rounded-full invisible md:visible"
              priority
            />
            {salonName && (
              <span className="hidden sm:inline font-semibold text-md">
                {salonName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-md">
              Olá{adminName ? `, ${adminName}` : ""}
            </span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Placeholder para empurrar conteúdo */}
      <div style={{ height: navbarHeight }} />
    </>
  );
}
