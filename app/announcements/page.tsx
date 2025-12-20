"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SectionHeading from "../components/SectionHeading";
import { Announcement } from "../../lib/types";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        // Ensure data is an array
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

  // Modal state
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string>("");

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
              className="
                flex gap-6
                bg-white rounded-xl
                border shadow-sm
                hover:shadow-md
                transition
                overflow-hidden
              "
            >
              {/* IMAGE (clickable) */}
              <button
                onClick={() => {
                  setActiveImage(a.image);
                  setActiveTitle(a.title);
                }}
                className="relative w-40 h-24 shrink-0 focus:outline-none"
              >
                <Image
                  src={a.image}
                  alt={a.title}
                  fill
                  className="object-cover hover:scale-105 transition"
                />
              </button>

              {/* CONTENT — height matches image */}
              <div className="flex flex-col justify-center py-3 pr-4">
                <h3 className="text-lg font-semibold text-brand-dark">
                  {a.title}
                </h3>
                <p className="text-sm text-brand-muted mt-1 line-clamp-2">
                  {a.description}
                </p>
                <span className="text-xs text-brand-muted mt-2">{a.date}</span>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {activeImage && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/70 backdrop-blur-sm
          "
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="
                absolute -top-10 right-0
                text-white text-3xl font-bold
                hover:opacity-80
              "
              aria-label="Close"
            >
              ×
            </button>

            {/* Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
              <Image
                src={activeImage}
                alt={activeTitle}
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
