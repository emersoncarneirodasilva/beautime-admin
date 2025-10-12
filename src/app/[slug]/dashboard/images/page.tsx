import { Metadata } from "next";
import Link from "next/link";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import ActionButton from "@/components/Buttons/ActionButton";
import { Home, User, Briefcase } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);

  return {
    title: `Beautime Admin - ${salon.name} - Galeria de Imagens`,
    description: `Gerencie as imagens do salão ${salon.name}, incluindo fotos do salão, profissionais e serviços.`,
  };
}

interface Params {
  slug: string;
}

export default async function SalonImagesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  let slug: string;

  try {
    const resolvedParams = await params;
    slug = resolvedParams.slug;
  } catch {
    return (
      <ErrorSection
        title="Erro ao carregar dados"
        message="Não foi possível obter o slug do salão."
      />
    );
  }

  const cards = [
    {
      href: `/${slug}/dashboard/images/salon`,
      title: "Imagens do Salão",
      description: "Veja e gerencie as imagens gerais do salão.",
      icon: <Home className="w-6 h-6 text-white" />,
      bgColor: "bg-[var(--color-primary)]",
    },
    {
      href: `/${slug}/dashboard/images/professionals`,
      title: "Imagens dos Profissionais",
      description: "Gerencie imagens vinculadas a cada profissional.",
      icon: <User className="w-6 h-6 text-white" />,
      bgColor: "bg-[var(--color-success)]",
    },
    {
      href: `/${slug}/dashboard/images/services`,
      title: "Imagens dos Serviços",
      description: "Organize as imagens relacionadas aos serviços do salão.",
      icon: <Briefcase className="w-6 h-6 text-white" />,
      bgColor: "bg-[var(--color-secondary)]",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Galeria de Imagens</h1>
        <ActionButton
          href={`/${slug}/dashboard/images/upload`}
          text="Nova Imagem"
          className="self-start sm:self-auto"
        />
      </header>

      {/* Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block border border-[var(--color-gray-medium)] hover:border-[var(--color-primary)] rounded-xl p-6 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] hover:shadow-lg transition-all duration-200"
          >
            {/* Top row: ícone + título */}
            <div className="flex items-start gap-4 mb-3">
              <div
                className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${card.bgColor}`}
              >
                {card.icon}
              </div>
              <h2 className="text-lg sm:text-xl font-semibold leading-snug text-[var(--foreground)]">
                {card.title}
              </h2>
            </div>
            {/* Descrição */}
            <p className="text-[var(--text-secondary)] text-sm sm:text-base">
              {card.description}
            </p>
          </Link>
        ))}
      </section>
    </section>
  );
}
