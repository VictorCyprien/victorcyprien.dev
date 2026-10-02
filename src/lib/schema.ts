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

/** The home page: Victor, his freelance activity and the site. */
export function homeGraph(site: SiteFacts, siteUrl: URL) {
  const id = ids(siteUrl);
  const home = new URL('/', siteUrl).href;
  const address = { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'FR' };
  const profiles = [site.links.linkedin, site.links.github, site.links.malt];
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
        worksFor: { '@id': id.service },
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
        sameAs: [site.links.malt],
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
export function caseStudyGraph(study: CaseStudyFacts, siteUrl: URL) {
  const id = ids(siteUrl);
  const page = new URL(`/etudes-de-cas/${study.id}/`, siteUrl).href;
  const title = plain(study.data.title);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: new URL('/', siteUrl).href },
          { '@type': 'ListItem', position: 2, name: 'Études de cas', item: new URL('/etudes-de-cas/', siteUrl).href },
          { '@type': 'ListItem', position: 3, name: title },
        ],
      },
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
