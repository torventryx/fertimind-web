export default function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold text-plum">{title}</h1>
      <p className="mt-1 text-xs text-ink/45">Última actualización: {updated}</p>
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-semibold text-plum">{s.h}</h2>
            {s.p.map((paragraph, i) => (
              <p key={i} className="mt-1.5 text-[15px] leading-7 text-ink/75">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
