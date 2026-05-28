import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const [{ data: sikakuArticles }, { data: dachaArticles }] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, published_at')
      .eq('is_member_only', false)
      .order('published_at', { ascending: false }),
    supabase
      .from('dacha_articles')
      .select('slug, published_at')
      .eq('is_member_only', false)
      .order('published_at', { ascending: false }),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://agri-gyosei.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: 'https://agri-gyosei.com/sikaku',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://agri-gyosei.com/dacha',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  const sikakuPages: MetadataRoute.Sitemap = (sikakuArticles ?? []).map((article) => ({
    url: `https://agri-gyosei.com/sikaku/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const dachaPages: MetadataRoute.Sitemap = (dachaArticles ?? []).map((article) => ({
    url: `https://agri-gyosei.com/dacha/${article.slug}`,
    lastModified: new Date(article.published_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticPages, ...sikakuPages, ...dachaPages]
}
