import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { frenchSpacing } from './lib/typography';

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Format attendu : AAAA-MM');
const period = z.object({ start: month, end: month.nullable() });
/** Text shown to visitors: French spacing is applied once, here. */
const prose = z.string().transform(frenchSpacing);

const caseStudies = defineCollection({
  loader: glob({ base: './src/content/etudes-de-cas', pattern: '**/*.md' }),
  schema: z.object({
    title: prose,
    summary: prose,
    sector: prose,
    period,
    stack: z.array(z.string()).min(1),
    order: z.number().int(),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projets', pattern: '**/*.md' }),
  schema: z.object({
    name: prose,
    period: period.optional(),
    summary: prose,
    stack: z.array(z.string()).min(1),
    featured: z.boolean(),
    caseStudy: reference('caseStudies').optional(),
    order: z.number().int(),
    draft: z.boolean().default(false),
  }),
});

const principles = defineCollection({
  loader: file('src/data/principes.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number().int(),
    title: prose,
    text: prose,
    proof: prose,
    caseStudy: reference('caseStudies').optional(),
  }),
});

const career = defineCollection({
  loader: file('src/data/parcours.yaml'),
  schema: z.object({
    id: z.string(),
    start: month,
    end: month.nullable(),
    role: prose,
    org: prose,
    place: prose,
    summary: prose,
    stack: z.array(z.string()).default([]),
  }),
});

const stackTiers = defineCollection({
  loader: file('src/data/stack.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number().int(),
    name: prose,
    items: z.array(z.string()).min(1),
  }),
});

const site = defineCollection({
  loader: file('src/data/site.yaml'),
  schema: z.object({
    id: z.literal('site'),
    name: prose,
    role: prose,
    location: prose,
    headline: prose,
    lead: prose,
    schemaCaption: prose,
    about: z.array(prose).min(1),
    email: z.email(),
    callHref: z.string(),
    photo: z.string().nullable(),
    links: z.object({
      linkedin: z.url(),
      github: z.string(),
      malt: z.url(),
    }),
  }),
});

export const collections = { caseStudies, projects, principles, career, stackTiers, site };
