import Image from "next/image";
import fetchUserById from "@/libs/api/fetchUserById";
import { fetchSalonByAdmin } from "@/libs/api/fetchSalonByAdmin";
import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import AccessDenied from "@/components/Auth/AccessDenied";
import { CalendarDays, User } from "lucide-react";
import { verifyAdmin } from "@/libs/auth/verifyAdmin";
import { Metadata } from "next";
import ActionButton from "@/components/Buttons/ActionButton";

// Metadata dinâmico
export async function generateMetadata(): Promise<Metadata> {
  const token = await verifyAdminAuth();
  if (!token) return { title: "Acesso negado" };

  const salon = await fetchSalonByAdmin(token);
  return {
    title: `Beautime Admin - ${salon.name} - Salão`,
    description: `Informações gerais do salão ${salon.name}.`,
  };
}

interface Params {
  slug: string;
}

export default async function SalonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug } = await params;
  const salon = await fetchSalonByAdmin(token);
  const creator = await fetchUserById(salon.createdBy, token);
  const user = await verifyAdmin();

  if (!user || !salon || salon.slug !== slug) return <AccessDenied />;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Informações do Salão</h1>
        {user.id === creator.id && (
          <ActionButton
            href={`/${slug}/dashboard/salon/edit`}
            text="Editar Salão"
          />
        )}
      </header>

      {/* Card principal */}
      <article className="rounded-2xl shadow-lg p-6 md:p-8 bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] border border-[var(--color-gray-medium)] space-y-8 transition-colors">
        {/* Logo e nome */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600 shadow-md relative flex-shrink-0">
            <Image
              src={salon.logoUrl}
              alt="Logo do salão"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold">{salon.name}</h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Slug: {salon.slug}
            </p>
          </div>
        </div>

        {/* Descrição */}
        <section>
          <h3 className="text-lg font-medium mb-2">Descrição</h3>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            {salon.description}
          </p>
        </section>

        {/* Informações em grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-center gap-2">
            <User size={16} className="text-[var(--color-action)]" />
            <span>
              <span className="font-semibold">Criado por:</span> {creator.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[var(--color-action)]" />
            <span>
              <span className="font-semibold">Criado em:</span>{" "}
              {new Date(salon.createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-[var(--color-action)]" />
            <span>
              <span className="font-semibold">Última atualização:</span>{" "}
              {new Date(salon.updatedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </section>
      </article>
    </section>
  );
}
