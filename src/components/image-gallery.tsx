"use client";

import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0] ?? "";

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-beige-100">
        <Image
          src={activeImage}
          alt={images.length > 1 ? `${alt} (${activeIndex + 1}/${images.length})` : alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" aria-label="이미지 선택">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`${index + 1}번째 이미지 보기`}
                aria-current={index === activeIndex}
                className={`relative block aspect-square w-full overflow-hidden rounded-lg border-2 ${
                  index === activeIndex ? "border-terracotta-600" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
