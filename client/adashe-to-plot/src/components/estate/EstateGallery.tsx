"use client";

import { useState } from "react";
import Image from "next/image";

export function EstateGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
        <Image src={images[active]} alt={name} fill className="object-cover" priority sizes="100vw" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${
                active === i ? "border-gold-500" : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="150px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
