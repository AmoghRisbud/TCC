'use client';
import { useState } from 'react';
import { Testimonial } from '../../lib/types';

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = t.quote.length > 250; // adjust length as needed

  return (
    <div
      className="card relative flex flex-col h-full
                 bg-gradient-to-br from-[#F8F6EE] via-[#F1F4EF] to-[#FBFAF6]
                 ring-1 ring-black/10 shadow-md hover:-translate-y-1 hover:shadow-xl
                 transition-all duration-300 p-4"
    >
      {/* Quote */}
      <p className={`text-brand-dark leading-relaxed italic ${!expanded ? 'line-clamp-5' : ''}`}>
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Read more / less */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm text-brand-primary font-medium self-start"
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}

      <div className="flex-grow" />

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center">
          <span className="text-brand-primary font-semibold text-lg">
            {t.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-brand-dark">{t.name}</p>
          {t.role && <p className="text-sm text-brand-muted">{t.role}</p>}
          {t.organization && <p className="text-xs text-brand-muted">{t.organization}</p>}
        </div>
      </div>
    </div>
  );
}
