import { verifyAdminAuth } from "@/libs/auth/verifyAdminAuth";
import { fetchCategories } from "@/libs/api/fetchCategories";
import { fetchServiceById } from "@/libs/api/fetchServiceById";
import { Category, Service } from "@/types";
import AccessDenied from "@/components/Auth/AccessDenied";
import ErrorSection from "@/components/Error/ErrorSection";
import { updateService } from "./actions/updateService";
import BackLink from "@/components/Buttons/BackLink";
import SubmitButton from "@/components/Buttons/SubmitButton";
import AvatarUpload from "@/components/Images/AvatarUpload";

interface Params {
  slug: string;
  id: string;
}

export default async function EditServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const token = await verifyAdminAuth();
  if (!token) return <AccessDenied />;

  const { slug, id } = await params;

  let service: Service | null = null;
  let categories: Category[] = [];

  try {
    [service, { categories }] = await Promise.all([
      fetchServiceById(token, id),
      fetchCategories(token),
    ]);
  } catch (error) {
    return (
      <ErrorSection
        title="Erro ao carregar dados"
        message={(error as Error).message}
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para serviços"
      />
    );
  }

  if (!service) {
    return (
      <ErrorSection
        title="Serviço não encontrado"
        message="O serviço solicitado não foi localizado."
        linkHref={`/${slug}/dashboard/services`}
        linkText="Voltar para serviços"
      />
    );
  }

  const labelClasses = "block font-medium text-[var(--foreground)] mb-4";
  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-[var(--color-gray-medium)] bg-[var(--color-gray-light)] focus:ring-2 focus:ring-[var(--color-action)] focus:outline-none transition";

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-8">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Editar Serviço
        </h1>
        <p className="text-[var(--text-secondary)] text-base">
          Atualize as informações do serviço abaixo. As alterações serão salvas
          imediatamente após o envio.
        </p>
      </header>

      {/* Form */}
      <form
        id="update-service-form"
        action={updateService}
        className="bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] rounded-2xl shadow-lg p-8 space-y-6 transition-colors duration-300 hover:shadow-xl"
      >
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="id" value={service.id} />

        {/* Upload de Imagem */}
        <AvatarUpload
          fieldName="image"
          title="Imagem do Serviço"
          currentFile={service.imageUrl}
          altText={service.name}
        />

        {/* Nome */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            defaultValue={service.name}
            className={inputClasses}
            required
          />
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className={labelClasses}>
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={service.description}
            className={inputClasses}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preço */}
          <div>
            <label htmlFor="price" className={labelClasses}>
              Preço
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={service.price}
              className={inputClasses}
              required
            />
          </div>

          {/* Duração */}
          <div>
            <label htmlFor="duration" className={labelClasses}>
              Duração (min)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              defaultValue={service.duration}
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="categoryId" className={labelClasses}>
            Categoria
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={service.categoryId}
            className={inputClasses}
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botão salvar */}
        <div className="flex justify-end mt-6">
          <SubmitButton formId="update-service-form" />
        </div>
      </form>

      {/* BackLink fora do card */}
      <div className="flex justify-start -mt-6">
        <BackLink slug={slug} to={`dashboard/services/${service.id}`} />
      </div>
    </section>
  );
}
