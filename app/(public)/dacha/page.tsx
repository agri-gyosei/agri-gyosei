import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'ダーチャという生き方｜農地と食料安全保障',
  description: '農地取得・食料安全保障・ダーチャ文化について発信。外資による農地買い占めから日本の国土を守り、家族の食を自分たちの手で守る生き方を提案します。',
}

export const revalidate = 3600

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

  return (
    <>
    <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
      <header className="text-white py-10 px-6" style={{ background: 'linear-gradient(135deg, #C4714A 0%, #D4937A 50%, #E8B4B8 100%)' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm mb-2 tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
              agri-gyosei.com
            </a>
          </p>
          <h1 className="text-3xl font-bold">
            <Link href="/dacha" className="hover:opacity-90 transition-opacity">
              ダーチャという生き方
            </Link>
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          <main>
            {category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm px-3 py-1 rounded-full font-medium" style={{ background: '#E8B4B8', color: '#3D2B1F' }}>
                  {category}
                </span>
                <Link href="/dacha" className="text-xs text-gray-400 hover:underline">
                  ✕ 絞り込みを解除
                </Link>
              </div>
            )}

            {articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg" style={{ color: '#C4714A' }}>
                  {category ? 'このジャンルの記事はまだありません。' : '記事を準備中です。しばらくお待ちください。'}
                </p>
                {category && (
                  <Link href="/dacha" className="mt-4 inline-block text-sm hover:underline" style={{ color: '#C4714A' }}>
                    すべての記事を見る
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/dacha/${article.slug}`}
                    className="block rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                    style={{ background: 'white', border: '1px solid #F0D8D0' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5E6E8', color: '#C4714A' }}>
                        {article.category}
                      </span>
                      <time className="text-xs text-gray-400">
                        {new Date(article.published_at).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                    <h2 className="font-semibold text-lg leading-snug" style={{ color: '#3D2B1F' }}>
                      {article.title}
                    </h2>
                    {article.seo_description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {article.seo_description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar currentCategory={category} />
            </div>
          </aside>
        </div>

        <div className="lg:hidden mt-8">
          <Sidebar currentCategory={category} />
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
