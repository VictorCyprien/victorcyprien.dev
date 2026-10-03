// Schema.org data (JSON-LD) for search engines and AI search, built from the same data as the pages.
// None of it shows as a rich result; it tells who Victor is, where he works and what each page is.

/** The site facts the structured data needs, as read from src/data/site.yaml. */
export interface SiteFacts {
  name: string;
  jobTitle: string;
  city: string;
  description: string;
  email: string;
  photo: string | null;
  links: { linkedin: string; github: string; malt: string };
}

/** What the home page graph draws from the other data files. */
export interface HomeFacts {
  /** The core tier of the stack. */
  skills: string[];
  diplomas: { school: string; url: string }[];
  career: { org?: string; url?: string; end: string | null }[];
}

/** A published case study, as read from src/content/etudes-de-cas. */
export interface CaseStudyFacts {
  id: string;
  data: { title: string; summary: string };
}

// The French no-break spaces are for the page layout; structured data takes plain text.
const plain = (text: string) => text.replace(/[\u00a0\u202f]/g, ' ');

const ids = (siteUrl: URL) => ({
  person: new URL('/#victor', siteUrl).href,
  service: new URL('/#activite', siteUrl).href,
  website: new URL('/#site', siteUrl).href,
});

/** The trail from the home page. The last step is the page itself, so it carries no link. */
function breadcrumb(siteUrl: URL, steps: { name: string; path?: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: steps.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      ...(step.path && { item: new URL(step.path, siteUrl).href }),
    })),
  };
}

/** The home page: Victor, his freelance activity and the site. */
export function homeGraph(site: SiteFacts, siteUrl: URL, facts: HomeFacts) {
  const id = ids(siteUrl);
  const home = new URL('/', siteUrl).href;
  const address = { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'FR' };
  const profiles = [site.links.linkedin, site.links.github, site.links.malt];
  // Each school once, though it gave several diplomas.
  const schools = [...new Map(facts.diplomas.map((diploma) => [diploma.school, diploma.url])).entries()].map(([school, url]) => ({
    '@type': 'EducationalOrganization',
    name: plain(school),
    url,
  }));
  // The companies Victor still works for, besides his own activity.
  const companies = facts.career
    .filter((job) => job.end === null && job.org)
    .map((job) => ({ '@type': 'Organization', name: plain(job.org!), ...(job.url && { url: job.url }) }));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': id.person,
        name: plain(site.name),
        jobTitle: plain(site.jobTitle),
        url: home,
        ...(site.photo && { image: new URL(site.photo, siteUrl).href }),
        email: site.email,
        address,
        knowsAbout: facts.skills,
        alumniOf: schools,
        worksFor: [{ '@id': id.service }, ...companies],
        sameAs: profiles,
      },
      {
        '@type': 'ProfessionalService',
        '@id': id.service,
        name: plain(site.name),
        description: plain(site.description),
        url: home,
        image: new URL('/og.png', siteUrl).href,
        email: site.email,
        address,
        areaServed: { '@type': 'Country', name: 'France' },
        founder: { '@id': id.person },
        sameAs: profiles,
      },
      {
        '@type': 'WebSite',
        '@id': id.website,
        url: home,
        name: plain(site.name),
        inLanguage: 'fr-FR',
        publisher: { '@id': id.person },
      },
    ],
  };
}

/** A case study page: where it sits in the site, what it is and who wrote it. */
export function caseStudyGraph(study: CaseStudyFacts, site: SiteFacts, siteUrl: URL) {
  const id = ids(siteUrl);
  const home = new URL('/', siteUrl).href;
  const page = new URL(`/etudes-de-cas/${study.id}/`, siteUrl).href;
  const title = plain(study.data.title);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Short copies of the home page nodes, so each page's references resolve on their own.
      { '@type': 'Person', '@id': id.person, name: plain(site.name), url: home },
      { '@type': 'WebSite', '@id': id.website, name: plain(site.name), url: home },
      breadcrumb(siteUrl, [{ name: 'Accueil', path: '/' }, { name: 'Études de cas', path: '/etudes-de-cas/' }, { name: title }]),
      {
        '@type': 'WebPage',
        '@id': `${page}#page`,
        url: page,
        name: title,
        description: plain(study.data.summary),
        inLanguage: 'fr-FR',
        isPartOf: { '@id': id.website },
        author: { '@id': id.person },
      },
    ],
  };
}

/** The case study list: where it sits in the site. */
export function caseStudiesGraph(siteUrl: URL) {
  return {
    '@context': 'https://schema.org',
    '@graph': [breadcrumb(siteUrl, [{ name: 'Accueil', path: '/' }, { name: 'Études de cas' }])],
  };
}
