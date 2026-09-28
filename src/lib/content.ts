import { getCollection, getEntry } from 'astro:content';
import { isPublished, showsDrafts } from './publish';

const SHOW_DRAFTS = showsDrafts(import.meta.env.PUBLIC_SITE_ENV, import.meta.env.DEV);

export async function getSite() {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('src/data/site.yaml must contain an entry with id "site"');
  return entry.data;
}

export async function getPublishedCaseStudies() {
  const studies = await getCollection('caseStudies', (study) => isPublished(study.data.draft, SHOW_DRAFTS));
  return studies.sort((a, b) => a.data.order - b.data.order);
}

export async function getPublishedCaseStudyIds(): Promise<Set<string>> {
  return new Set((await getPublishedCaseStudies()).map((study) => study.id));
}

export async function getPublishedProjects() {
  const projects = await getCollection('projects', (project) => isPublished(project.data.draft, SHOW_DRAFTS));
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getPrinciples() {
  return (await getCollection('principles')).sort((a, b) => a.data.order - b.data.order);
}

export async function getCareer() {
  return (await getCollection('career')).sort((a, b) => b.data.start.localeCompare(a.data.start));
}

export async function getDiplomas() {
  return (await getCollection('diplomas')).sort((a, b) => b.data.year - a.data.year);
}

export async function getStackTiers() {
  return (await getCollection('stackTiers')).sort((a, b) => a.data.order - b.data.order);
}
