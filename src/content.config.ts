import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['game', 'app']),
    hero: z.string(),
    dek: z.string(),
    url: z.string().url().optional(),
  }),
});

export const collections = { posts };
