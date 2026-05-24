import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'

export const metadata: Metadata = {
  title: '行政書士試験対策 | agri-gyosei.com',
  description: '毎日更新！兼業農家・社会人のための行政書士試験対策記事。民法・行政法・憲法など科目別に徹底解説。',
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

export default async function SikakuPage({ searchParams }: Props) {
  const { category } = await searchParams
  let articles: Article[] = []

  try {
    const supabase = await createClient()
    let query = supabase
      .from('articles')
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-sm mb-2 tracking-widest">agri-gyosei.com</p>
          <h1 className="text-3xl font-bold mb-2">行政書士試験対策</h1>
          <p className="text-green-200 text-sm">
            毎日1記事更新。兼業農家・社会人受験生のための合格ガイド。
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          {/* 記事一覧 */}
          <main>
            {category && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {category}
                </span>
                <Link href="/sikaku" className="text-xs text-gray-400 hover:underline">
                  ✕ 絞り込みを解除
                </Link>
              </div>
            )}

            {articles.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">
                  {category ? 'このカテゴリーの記事はまだありません。' : '記事を準備中です。しばらくお待ちください。'}
                </p>
                {category && (
                  <Link href="/sikaku" className="mt-4 inline-block text-sm text-green-600 hover:underline">
                    すべての記事を見る
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/sikaku/${article.slug}`}
                    className="block bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {article.category}
                      </span>
                      <time className="text-xs text-gray-400">
                        {new Date(article.published_at).toLocaleDateString('ja-JP')}
                      </time>
                    </div>
                    <h2 className="font-semibold text-gray-800 text-lg leading-snug">
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

          {/* サイドバー（PC）*/}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar currentCategory={category} />
            </div>
          </aside>
        </div>

        {/* サイドバー（モバイル）*/}
        <div className="lg:hidden mt-8">
          <Sidebar currentCategory={category} />
        </div>
      </div>
    </div>
  )
}
