import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: '行政書士試験の勉強法｜6ヶ月間集中学習',
  description: '毎日更新！兼業農家・社会人のための行政書士試験勉強法。6ヶ月間集中学習で合格を目指す。民法・行政法・憲法など科目別に徹底解説。',
}

export const revalidate = 3600

type Props = {
  searchParams: Promise<{ category?: string; month?: string }>
}

type Article = {
  id: string
  slug: string
  title: string
  category: string
  seo_description: string | null
  published_at: string
}

function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `${year}年${parseInt(month)}月`
}

export default async function SikakuPage({ searchParams }: Props) {
  const { category, month } = await searchParams
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

    if (month) {
      const [yearStr, monthStr] = month.split('-')
      const year = parseInt(yearStr)
      const m = parseInt(monthStr)
      // JST月境界をUTCに変換（JST = UTC+9）
      const startUTC = new Date(Date.UTC(year, m - 1, 1) - 9 * 60 * 60 * 1000)
      const endUTC = new Date(Date.UTC(year, m, 1) - 9 * 60 * 60 * 1000)
      query = query
        .gte('published_at', startUTC.toISOString())
        .lt('published_at', endUTC.toISOString())
    }

    const { data } = await query
    articles = data ?? []
  } catch {
    // Supabase not configured yet
  }

  const activeFilter = category
    ? { label: category, clearHref: '/sikaku' }
    : month
    ? { label: formatMonthLabel(month), clearHref: '/sikaku' }
    : null

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-sm mb-2 tracking-widest">
            <a href="https://agri-gyosei.com" className="hover:text-green-100 transition-colors">
              agri-gyosei.com
            </a>
          </p>
          <h1 className="text-3xl font-bold">
            <Link href="/sikaku" className="hover:opacity-90 transition-opacity">
              行政書士試験の勉強法｜6ヶ月間集中学習
            </Link>
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          {/* 記事一覧 */}
          <main>
            {activeFilter && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {activeFilter.label}
                </span>
                <Link href={activeFilter.clearHref} className="text-xs text-gray-400 hover:underline">
                  ✕ 絞り込みを解除
                </Link>
              </div>
            )}

            {articles.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg">
                  {activeFilter ? 'この期間・カテゴリーの記事はまだありません。' : '記事を準備中です。しばらくお待ちください。'}
                </p>
                {activeFilter && (
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
              <Sidebar currentCategory={category} currentMonth={month} />
            </div>
          </aside>
        </div>

        {/* サイドバー（モバイル）*/}
        <div className="lg:hidden mt-8">
          <Sidebar currentCategory={category} currentMonth={month} />
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
