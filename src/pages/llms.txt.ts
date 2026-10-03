import type { APIRoute } from 'astro';
import { getCareer, getCaseStudyNames, getDiplomas, getPrinciples, getPublishedCaseStudies, getServices, getSite, getStackTiers } from '../lib/content';
import { formatPeriod } from '../lib/format';

export const GET: APIRoute = async ({ site: siteUrl }) => {
  const site = await getSite();
  const services = await getServices();
  const names = await getCaseStudyNames();
  const principles = await getPrinciples();
  const studies = await getPublishedCaseStudies();
  const tiers = await getStackTiers();
  const career = await getCareer();
  const diplomas = await getDiplomas();
  const url = (path: string) => new URL(path, siteUrl).toString();

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.headline} ${site.lead}`,
    '',
    `${site.jobTitle}, basé à ${site.location}.`,
    '',
    '## Ce que je fais',
    '',
    ...services.map(({ data }) => {
      const proof = data.proof.filter((ref) => names.has(ref.id)).map((ref) => `[${names.get(ref.id)}](${url(`/etudes-de-cas/${ref.id}/`)})`);
      const label = proof.length > 1 ? 'Exemples' : 'Exemple';
      return `- ${data.title} : ${data.text}${proof.length > 0 ? ` ${label} : ${proof.join(', ')}.` : ''}`;
    }),
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
    '## Stack',
    '',
    ...tiers.map(({ data }) => `- ${data.name} : ${data.items.join(', ')}`),
    '',
    '## Parcours',
    '',
    ...career.map(({ data }) => `- ${formatPeriod(data.start, data.end)} : ${data.role}${data.org ? `, ${data.org}` : ''}. ${data.summary}`),
    '',
    '## Diplômes',
    '',
    ...diplomas.map(({ data }) => `- ${data.year} : ${data.title}, ${data.school}`),
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
