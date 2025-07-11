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
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="border rounded overflow-hidden shadow-sm bg-black"
          >
            <div className="relative w-full h-48">
              <Image
                src={img.url}
                alt={img.type}
                fill
                className="object-cover rounded"
              />
            </div>
            <div className="text-sm text-white px-2 py-1 flex justify-between items-center">
              <span>{img.type}</span>
              <DeleteImageButton id={img.id} token={token} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
