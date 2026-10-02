import type { APIRoute } from 'astro';
import { getPrinciples, getPublishedCaseStudies, getSite } from '../lib/content';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const site = await getSite();
  const principles = await getPrinciples();
  const studies = await getPublishedCaseStudies();
  const url = (path: string) => new URL(path, siteUrl).toString();

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.headline} ${site.lead}`,
    '',
    `${site.jobTitle}, basé à ${site.location}.`,
    '',
    '## Comment je travaille',
    '',
    site.about.intro,
    '',
    ...site.about.ways.map((way) => `- ${way}`),
    ...(site.about.partner ? ['', site.about.partner] : []),
    '',
    '## Comment je décide',
    '',
    ...principles.map(({ data }) => `- ${data.title} : ${data.text}`),
    '',
    '## Études de cas',
    '',
    ...(studies.length > 0
      ? studies.map((study) => `- [${study.data.title}](${url(`/etudes-de-cas/${study.id}/`)}) : ${study.data.summary}`)
      : ['- Aucune étude publiée pour le moment.']),
    '',
    '## Contact',
    '',
    `- Réserver un appel : ${site.callHref}`,
    `- Email : ${site.email}`,
    `- Site : ${url('/')}`,
    `- LinkedIn : ${site.links.linkedin}`,
    `- GitHub : ${site.links.github}`,
    `- Malt : ${site.links.malt}`,
    `- Mentions légales : ${url('/mentions-legales/')}`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
