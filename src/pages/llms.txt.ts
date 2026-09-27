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
    `Freelance basé à ${site.location}.`,
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
    `- Email : ${site.email}`,
    `- Site : ${url('/')}`,
    `- LinkedIn : ${site.links.linkedin}`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
