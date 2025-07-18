import { DeleteImageButton } from "./DeleteImageButton";
import Image from "next/image";

export function Section({
  title,
  images,
  token,
}: {
  title: string;
  images: { id: string; url: string; type: string }[];
  token: string;
}) {
  if (images.length === 0) return null;

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div
            key={img.id}
            className="rounded-lg overflow-hidden shadow-lg bg-gray-900 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={img.url}
                alt={img.type}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover rounded-t-lg"
                placeholder="blur"
                blurDataURL="/placeholder.png" // opcional: colocar um placeholder local para prévia
              />
            </div>
            <div className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-b-lg text-sm text-gray-200">
              <span className="truncate max-w-[70%]" title={img.type}>
                {img.type}
              </span>
              <DeleteImageButton id={img.id} token={token} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
