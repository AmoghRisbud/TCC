export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-12 text-center max-w-3xl mx-auto">
      <h2 className="h2 mb-4 text-brand-dark">{title}</h2>
      {subtitle && <p className="text-lg text-brand-muted leading-relaxed">{subtitle}</p>}
    </div>
  );
}
