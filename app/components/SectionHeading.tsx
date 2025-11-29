export default function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 text-center max-w-2xl mx-auto">
      <h2 className="h2 mb-3">{title}</h2>
      {subtitle && <p className="text-brand-dark/70 p">{subtitle}</p>}
    </div>
  );
}
