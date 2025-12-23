"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  image: string | string[];
}

export default function ScrollingGallery({ items }: { items: GalleryItem[] }) {
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  // Normalize to string URLs (first image if array)
  const urls = items.map(i => ({ id: i.id, title: i.title, src: Array.isArray(i.image) ? i.image[0] : i.image }));

  useEffect(() => {
    // Preload images on client to avoid issues where optimization or lazy-loading prevents display
    urls.forEach(u => {
      const img = new window.Image();
      img.src = u.src;
      img.onload = () => setLoaded(s => ({ ...s, [u.id]: true }));
      img.onerror = () => setLoaded(s => ({ ...s, [u.id]: false }));
    });
  }, [items]);

  // Duplicate for seamless marquee
  const scrolling = [...urls, ...urls];

  return (
    <div className="relative mt-10 overflow-hidden">
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-brand-light to-transparent z-10" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-brand-light to-transparent z-10" />

      <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
        {scrolling.map((u, idx) => (
          <div key={`${u.id}-${idx}`} className="mx-4 w-64 shrink-0 overflow-hidden rounded-xl shadow-card group">
            <div className="relative h-40 bg-gray-50">
              {/* Use Next/Image normally but if preloading failed fallback to regular img */}
              {loaded[u.id] === false ? (
                <img src={u.src} alt={u.title} className="w-full h-full object-cover" />
              ) : (
                <Image
                  src={u.src}
                  alt={u.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 30vw, (max-width: 1024px) 20vw, 256px"
                  loading={idx < 6 ? "eager" : "lazy"}
                  priority={idx === 0}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
