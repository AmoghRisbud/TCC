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
          <span className="text-brand-primary font-semibold text-lg">{t.name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-brand-dark">{t.name}</p>
          {t.role && <p className="text-sm text-brand-muted">{t.role}</p>}
          {t.organization && <p className="text-xs text-brand-muted">{t.organization}</p>}
          {t.programRef && (
            <div className="mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {t.programRef}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
