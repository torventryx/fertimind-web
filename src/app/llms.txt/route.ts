import { SITE } from '@/lib/i18n';
import { forumSections } from '@/data/taxonomy';
import { clinics } from '@/data/clinics-seed';
import { listCourses } from '@/lib/content';

export const revalidate = 3600;

/**
 * llms.txt — mapa del sitio para modelos de lenguaje (estándar emergente
 * adoptado por ChatGPT, Claude y otros). Resumen + enlaces clave.
 */
export async function GET() {
  const courses = await listCourses();
  const lines: string[] = [];

  lines.push('# FertiMind');
  lines.push('');
  lines.push(`> ${SITE.es.description}`);
  lines.push('> Comunidad y cursos de fertilidad y reproducción asistida en español (e inglés).');
  lines.push('> Información con base científica (ESHRE, ASRM, NICE, SEF, OMS). No es consejo médico.');
  lines.push('');
  lines.push('## Contenido principal');
  lines.push('');
  lines.push(`- [Foros de fertilidad](${SITE.url}/foros): 16 categorías por etapa y tratamiento`);
  for (const section of forumSections) {
    lines.push(
      `  - ${section.title}: ` +
        section.categories.map((c) => `[${c.name}](${SITE.url}/foros/${c.id})`).join(', '),
    );
  }
  lines.push('');
  lines.push('## Cursos (con referencias científicas)');
  lines.push('');
  for (const c of courses) {
    lines.push(`- [${c.title}](${SITE.url}/cursos/${c.id}): ${c.description}`);
  }
  lines.push('');
  lines.push('## Directorio de clínicas (España)');
  lines.push('');
  for (const c of clinics) {
    lines.push(`- [${c.name}](${SITE.url}/clinicas/${c.slug}) — ${c.city}`);
  }
  lines.push('');
  lines.push('## Aviso');
  lines.push('');
  lines.push(
    '- FertiMind ofrece información y apoyo, no consejos médicos. Para decisiones de salud, consulta a tu equipo médico.',
  );
  lines.push('- El contenido de la comunidad es de usuarias individuales y puede incluir experiencias personales no verificables.');
  lines.push('');

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
