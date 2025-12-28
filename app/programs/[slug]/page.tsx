import Image from 'next/image';
import Link from 'next/link';
import { getPrograms } from '../../../lib/content';
import { notFound } from 'next/navigation';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export default async function ProgramDetail({
  params,
}: {
  params: { slug: string };
}) {
  const programs = await getPrograms();
  const program = programs.find((p) => p.slug === params.slug);
  if (!program) return notFound();

  return (
    <div>
      {/* ================= HERO ================= */}
<section className="bg-brand-hero text-white py-20">
  <div className="container max-w-4xl text-center">

    {/* PROGRAM IMAGE */}
    {program.logo && (
<div className="relative mx-auto mb-6 w-full px-4 md:px-8">
  <Image
    src={program.logo}
    alt={program.title}
    width={1600}
    height={400}
    priority
    className="
      w-full
      max-h-[150px] md:max-h-[170px]
      object-contain
      
    "
  />
</div>

)}


    {/* TITLE */}
    <h1 className="h1 mb-4">{program.title}</h1>

    {/* DESCRIPTION */}
    {program.shortDescription && (
      <p className="text-lg text-white/85 max-w-2xl mx-auto mb-6">
        {program.shortDescription}
      </p>
    )}

    {/* BADGES */}
    <div className="flex flex-wrap justify-center gap-3">
      {program.featured && (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-accent text-white">
          Featured
        </span>
      )}
      {program.status && (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20">
          {program.status.toUpperCase()}
        </span>
      )}
      {program.category && (
        <span className="px-3 py-1 text-xs rounded-full border border-white/30">
          {program.category}
        </span>
      )}
    </div>

  </div>
</section>

      {/* ================= INTRO VIDEO ================= */}
      {program.introVideoLink && (
        <section className="section bg-white">
          <div className="container max-w-4xl">
            <h2 className="h2 mb-6 text-center">Program Introduction</h2>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
                src={program.introVideoLink.includes('youtube.com') || program.introVideoLink.includes('youtu.be') 
                  ? program.introVideoLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/').split('&')[0]
                  : program.introVideoLink
                }
                title="Program Introduction Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= CONTENT ================= */}
      <section className="section bg-brand-light">
        <div className="container max-w-4xl grid md:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="md:col-span-2">
            {program.fullDescription && (
              <>
                <h2 className="h2 mb-4">Program Overview</h2>
                <div
                  className="text-brand-muted leading-relaxed mb-8 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: program.fullDescription,
                  }}
                />
              </>
            )}
          </div>

          {/* RIGHT */}
          <aside className="bg-white rounded-2xl p-6 shadow-sm border h-fit">
            <h3 className="font-semibold mb-4">Program Details</h3>

            <ul className="space-y-3 text-sm">
              {program.mode && (
                <li>
                  <strong>Mode:</strong> {program.mode}
                </li>
              )}
              {program.location && (
                <li>
                  <strong>Location:</strong> {program.location}
                </li>
              )}
              {program.startDate && (
                <li>
                  <strong>Start Date:</strong> {program.startDate}
                </li>
              )}
              {program.endDate && (
                <li>
                  <strong>End Date:</strong> {program.endDate}
                </li>
              )}
              {program.duration && (
                <li>
                  <strong>Duration:</strong> {program.duration}
                </li>
              )}
              {program.fee && (
                <li>
                  <strong>Fee:</strong> {program.fee}
                </li>
              )}
              {program.seatsLeft !== undefined && program.seatsLeft !== null && (
                <li>
                  <strong>Seats Left:</strong> 
                  <span className={`ml-1 ${program.seatsLeft <= 5 ? 'text-red-600 font-semibold' : program.seatsLeft <= 10 ? 'text-orange-600' : 'text-green-600'}`}>
                    {program.seatsLeft}
                  </span>
                </li>
              )}
            </ul>

            {(program.enrollmentFormUrl || program.ctaUrl) && (
              <a
                href={program.enrollmentFormUrl || program.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full justify-center items-center
                           px-5 py-3 rounded-lg bg-brand-primary text-white
                           font-semibold hover:bg-brand-accent transition"
              >
                {program.enrollmentFormUrl
                  ? 'Enroll'
                  : program.ctaLabel || 'Apply Now'}
              </a>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}
