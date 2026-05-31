import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Footer from './components/Footer'
import { AnimatedHero, AnimatedArticleList } from './components/AnimatedArticles'

export const metadata: Metadata = {
  title: 'ダーチャという生き方 | agri-gyosei.com',
  description: '食料自給・農地取得・兼業農家。ダーチャ的な暮らしを日本で実現するための情報メディア。',
  alternates: {
    canonical: 'https://agri-gyosei.com/dacha',
  },
  openGraph: {
    title: 'ダーチャという生き方 | agri-gyosei.com',
    description: '食料自給・農地取得・兼業農家。ダーチャ的な暮らしを日本で実現するための情報メディア。',
    url: 'https://agri-gyosei.com/dacha',
    siteName: 'agri-gyosei.com',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ダーチャという生き方 | agri-gyosei.com',
    description: '食料自給・農地取得・兼業農家。ダーチャ的な暮らしを日本で実現するための情報メディア。',
  },
}

export const revalidate = 3600

const GENRES = [
  '食料安全保障',
  '農地取得ガイド',
  'ダーチャという生き方',
  '兼業農家入門',
  '外資と農地問題',
  '家庭菜園・保存食',
]

type Props = {
  searchParams: Promise<{ category?: string }>
}

type Article = {
  id: string
  slug: string
  title: string
  category: string
  seo_description: string | null
  published_at: string
}

export default async function DachaPage({ searchParams }: Props) {
  const { category } = await searchParams
  let articles: Article[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('dacha_articles')
      .select('id, slug, title, category, seo_description, published_at')
      .eq('is_member_only', false)
      .order('published_at', { ascending: false })
      .limit(30)

    if (category) {
      query = query.eq('category', category)
    }

    const { data } = await query
    articles = data ?? []
  } catch {
    // Supabase not configured yet
  }

  const featuredArticle = !category && articles.length > 0 ? articles[0] : null
  const gridArticles = !category && articles.length > 0 ? articles.slice(1) : articles

  return (
    <>
      <div style={{ background: '#FAF7F2' }}>

        {/* ── ヒーローセクション ── */}
        <section style={{ background: 'linear-gradient(160deg, #C4714A 0%, #D4856E 45%, #E8B4B8 100%)' }}>
          <div className="max-w-5xl mx-auto px-6 py-14 text-center">
            <AnimatedHero />
          </div>
        </section>

        {/* ── カテゴリーフィルター ── */}
        <div
          className="sticky top-0 z-20 border-b"
          style={{ background: '#FAF7F2', borderColor: '#F0D8D0' }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/dacha"
                className="text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
                style={!category
                  ? { background: '#C4714A', color: '#fff' }
                  : { background: '#fff', color: '#C4714A', border: '1px solid #C4714A' }
                }
              >
                すべて
              </Link>
              {GENRES.map((genre) => (
                <Link
                  key={genre}
                  href={`/dacha?category=${encodeURIComponent(genre)}`}
                  className="text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
                  style={category === genre
                    ? { background: '#C4714A', color: '#fff' }
                    : { background: '#F5E6E8', color: '#C4714A' }
                  }
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── コンテンツエリア ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <AnimatedArticleList
            featuredArticle={featuredArticle}
            gridArticles={gridArticles}
            category={category}
          />
        </div>
      </div>
      <Footer />
    </>
  )
}
