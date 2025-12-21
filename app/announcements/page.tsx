"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "../components/SectionHeading";
import { Announcement } from "../../lib/types";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        const announcementsArray = Array.isArray(data) ? data : [];
        setAnnouncements(announcementsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching announcements:', err);
        setAnnouncements([]);
        setLoading(false);
      });
  }, []);

  return (
    <section className="section bg-brand-light">
      <div className="container max-w-4xl">
        <SectionHeading
          title="Announcements"
          subtitle="Latest updates, programs, and opportunities"
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-brand-muted">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-muted">No announcements available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(announcements) && announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl border shadow-sm overflow-hidden"
            >
              {/* Clickable Card */}
              <button
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                className="w-full flex gap-6 p-4 hover:bg-gray-50 transition text-left"
              >
                {/* IMAGE */}
                <div className="relative w-40 h-24 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="flex flex-col justify-center flex-1">
                  <h3 className="text-lg font-semibold text-brand-dark group-hover:text-brand-primary">
                    {a.title}
                  </h3>
                  <p className="text-sm text-brand-muted mt-1 line-clamp-2">
                    {a.description}
                  </p>
                  <span className="text-xs text-brand-muted mt-2">{a.date}</span>
                </div>

                {/* Expand Icon */}
                <div className="flex items-center">
                  <svg
                    className={`w-6 h-6 text-brand-muted transition-transform ${
                      expandedId === a.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === a.id && (
                <div className="border-t p-6 bg-gray-50 animate-fade-in">
                  <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      className="object-contain bg-white"
                    />
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-brand-muted text-base leading-relaxed">
                      {a.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
