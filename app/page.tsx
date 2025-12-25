import SectionHeading from "./components/SectionHeading";
import Link from "next/link";
import { getPrograms, getTestimonials, getGallery } from "../lib/content";
import Image from "next/image";
import { getAnnouncements } from "../lib/announcements";
import React from "react";
import ScrollingGallery from "./components/ScrollingGallery";

// Force dynamic rendering to always fetch fresh announcements
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const announcements = await getAnnouncements();
  const allPrograms = await getPrograms();

  // Show featured programs on homepage if any; otherwise show first 3
  const featuredPrograms = allPrograms.filter(p => p.featured === true || (p.featured as any) === 'true');
  const programs = featuredPrograms.length > 0 ? featuredPrograms.slice(0, 3) : allPrograms.slice(0, 3);
  const allTestimonials = await getTestimonials();
  const gallery = await getGallery();

  // Show only featured testimonials if any exist, otherwise show first 3
  const featuredTestimonials = allTestimonials.filter(t => 
    t.featured === true || (t.featured as any) === 'true'
  );
  const testimonials = featuredTestimonials.length > 0 
    ? featuredTestimonials.slice(0, 3)
    : allTestimonials.slice(0, 3);

  // Helper to strip HTML and collapse whitespace (server-side safe)
  const stripHtml = (html?: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Duplicate testimonials to create a seamless horizontal marquee
  const scrollingTestimonials = [...testimonials, ...testimonials];

  // Duplicate gallery for seamless marquee
  const scrollingGallery = [...gallery, ...gallery];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-pattern">
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="h1 text-white mb-6 animate-fade-in">
              Helping Law Students and Legal Professionals Find{" "}
              <span className="text-brand-secondary">Clarity</span>,{" "}
              <span className="text-brand-secondary">Skills</span> &{" "}
              <span className="text-brand-secondary">Direction</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              Join a community-led upskilling ecosystem designed to empower the next generation of legal professionals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/community"
                className="btn bg-white text-brand-primary hover:bg-gray-100 hover:text-brand-primary shadow-xl"
              >
                <span className="flex items-center gap-2">
                  Join the Community
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </Link>

              <Link
                href="/programs"
                className="btn bg-transparent text-white hover:bg-white hover:text-brand-primary"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9F7F1"
            />
          </svg>
        </div>
      </section>

      {/* Floating Announcements */}
      <section className="relative z-20 -mt-14">
        <div className="container">
          <div
            className="
             backdrop-blur-md bg-white/85
             border border-white/60
             shadow-xl
             rounded-2xl
             px-6 py-4
             flex items-center gap-6
           "
          >
            {/* Badge */}
            <span
              className="
               shrink-0
               inline-flex items-center gap-2
               text-xs font-semibold
               px-3 py-1
               rounded-full
               bg-brand-secondary/15
               text-brand-secondary
             "
            >
              📢 Announcements
            </span>

            {/* Marquee */}
            <div className="relative overflow-hidden flex-1">
              <div className="flex w-max gap-10 animate-marquee hover:[animation-play-state:paused]">
                {announcements.map((a) => (
                  <Link
                    key={a.id}
                    href="/announcements"
                    className="flex items-center gap-4 group"
                  >
                    <div className="relative w-24 h-14 rounded-lg overflow-hidden shadow-sm border bg-white">
                      <Image
                        src={a.image}
                        alt={a.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-brand-dark group-hover:text-brand-primary transition">
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Optional CTA */}
            <Link
              href="/announcements"
              className="text-sm font-medium text-brand-primary hover:underline shrink-0"
            >
              View all →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-brand-light -mt-1">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "700+", label: "Students Mentored" },
              { value: "50+", label: "Expert Educators" },
              { value: "20+", label: "Programs Delivered" },
              { value: "10+", label: "Partner Institutions" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-brand-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="section relative overflow-hidden bg-gradient-to-br from-white via-brand-light to-white">
        {/* Decorative glow */}
        <div
          aria-hidden
          className="absolute -top-24 left-1/2 -translate-x-1/2
                     w-[600px] h-[600px] rounded-full
                     bg-brand-secondary/10 blur-3xl"
        />

        <div className="container relative">
          <SectionHeading
            title="Featured Programs"
            subtitle="Discover our carefully curated programs designed to enhance your legal career."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((p) => (
              <Link key={p.slug} href={`/programs/${p.slug}`} className="group block">
                <div className="card-interactive flex flex-col h-full
                            bg-gradient-to-br from-white via-white to-brand-light/40
                            border border-brand-primary/10
                            shadow-sm hover:shadow-xl hover:-translate-y-1
                            transition-all duration-300 overflow-hidden">

                  {/* Wide image (logo or hero) */}
                  {p.logo && (
                    <div className="mb-4 overflow-hidden">
                      <Image
                        src={p.logo}
                        alt={`${p.title} logo`}
                        width={400}
                        height={200}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6 pt-0">
                    <h3 className="h3 mb-2 group-hover:text-brand-primary transition-colors">{p.title}</h3>

                    <p className="text-brand-muted text-sm leading-relaxed line-clamp-3 mb-6 break-words overflow-hidden flex-1">{p.shortDescription}</p>

                    <div className="flex flex-col items-center gap-3">
                      <span className="inline-flex items-center justify-center px-5 py-2 rounded-lg
                                  bg-brand-primary text-white text-sm font-semibold
                                  shadow-md hover:bg-brand-accent hover:shadow-lg
                                  transition-all w-full">Apply Now</span>

                      <span className="inline-flex items-center gap-2 text-brand-primary text-sm font-medium
                                      group-hover:gap-3 transition-all">View Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/programs" className="btn-secondary">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Community Moments – Scrolling Gallery */}
      {gallery.length > 0 && (
        <section className="section bg-brand-light overflow-hidden">
          <div className="container">
            <SectionHeading
              title="Moments from Our Community"
              subtitle="Snapshots from workshops, events, and learning experiences"
            />
          </div>

          {/* Use client-side component that preloads and gracefully falls back on error */}
          <div className="container">
            <React.Suspense fallback={<div className="text-center py-10">Loading gallery…</div>}>
              {/* @ts-ignore - client component import */}
              <ScrollingGallery items={gallery} />
            </React.Suspense>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section
        className="section relative overflow-hidden
                   bg-gradient-to-br from-brand-light via-white to-brand-light"
      >
        {/* Decorative radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0
               bg-[radial-gradient(circle_at_20%_20%,rgba(230,182,92,0.10),transparent_45%)]"
        />

        <div className="container relative">
          <SectionHeading
            title="What Our Community Says"
            subtitle="Hear from students and educators who have been part of our journey."
          />

          <div className="relative mt-6 overflow-hidden">
            {/* Left/right fade for nicer visual */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-brand-light to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-brand-light to-transparent z-10" />

            <div className="flex w-max gap-6 animate-marquee hover:[animation-play-state:paused]">
              {scrollingTestimonials.map((t, idx) => {
                const plain = stripHtml(t.quote);
                return (
                  <div
                    key={`${t.id}-${idx}`}
                    className="mx-4 w-80 shrink-0
                      bg-gradient-to-br
                      from-[#F8F6EE]
                      via-[#F1F4EF]
                      to-[#FBFAF6]
                      ring-1 ring-black/10
                      shadow-md
                      hover:-translate-y-1 hover:shadow-xl
                      transition-all duration-300
                      flex flex-col p-4"
                  >
                    {/* Quote icon */}
                    <svg
                      className="absolute top-4 right-4 w-8 h-8 text-brand-primary/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>

                    {/* Quote as plain text */}
                    <p className="text-brand-dark leading-relaxed mb-4 italic line-clamp-5 prose-sm max-w-none">{plain}</p>

                    {/* Optional "Read more" hint */}
                    {plain.length > 250 && (
                      <span className="text-sm text-brand-primary font-medium">Read more</span>
                    )}

                    <div className="flex-grow" />

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-brand-primary font-semibold">{t.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark">{t.name}</p>
                        {t.role && <p className="text-sm text-brand-muted">{t.role}</p>}
                        {t.programRef && (
                          <div className="mt-1">
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full">
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
              })}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/testimonials" className="btn-secondary">
              Read More Testimonials
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-brand-dark">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 text-white mb-6">
              Ready to Start Your Legal Journey?
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of law students who are already part of our
              thriving community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/community" className="btn shadow-2xl">
                Join the Community
              </Link>

              <Link href="/programs" className="btn shadow-2xl">
                Explore Programs
              </Link>

              <Link
                href="/contact"
                className="btn bg-transparent text-white hover:bg-white hover:text-brand-dark"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
