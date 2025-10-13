"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { DeleteImageButton } from "./DeleteImageButton";

interface ImageType {
  id: string;
  url: string;
  type: string;
}

interface SectionProps {
  title: string;
  images: ImageType[];
  token: string;
}

export function Section({ title, images: initialImages, token }: SectionProps) {
  const [images, setImages] = useState(initialImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <section className="space-y-6 mb-6">
      <h3 className="text-xl font-semibold text-[var(--foreground)] border-b border-[var(--color-gray-medium)] pb-2">
        {title}
      </h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, i) => (
          <li
            key={img.id}
            className="border border-[var(--color-gray-medium)] rounded-xl overflow-hidden bg-[var(--color-white)] dark:bg-[var(--color-gray-light)] shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div
              className="relative w-full aspect-[4/3] overflow-hidden group cursor-pointer"
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={img.url}
                alt={`Imagem: ${img.type}`}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />
            </div>

            <div className="flex justify-between items-center border-t border-[var(--color-gray-medium)] px-4 py-3 text-sm text-[var(--text-secondary)] bg-gradient-to-t from-[var(--color-gray-light)] to-[var(--color-white)]">
              <span className="truncate max-w-[70%]" title={img.type}>
                {img.type}
              </span>
              <DeleteImageButton
                id={img.id}
                token={token}
                onDelete={() =>
                  setImages((prev) => prev.filter((i) => i.id !== img.id))
                }
              />
            </div>
          </li>
        ))}
      </ul>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          open={lightboxIndex !== null}
          index={lightboxIndex}
          close={() => setLightboxIndex(null)}
          slides={images.map((img) => ({ src: img.url }))}
          animation={{ fade: 250 }}
        />
      )}
    </section>
  );
}
