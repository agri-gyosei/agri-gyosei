import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Footer from './components/Footer'
import { DACHA_EYECATCH_SLUGS, DACHA_CARD_IMAGE_SLUGS } from '@/lib/dacha-eyecatch'

export const metadata: Metadata = {
  title: 'ダーチャという生き方｜農地と食料安全保障',
  description: '農地取得・食料安全保障・ダーチャ文化について発信。外資による農地買い占めから日本の国土を守り、家族の食を自分たちの手で守る生き方を提案します。',
}

export const revalidate = 3600

const CATEGORY_GRADIENTS: Record<string, string> = {
  '食料安全保障':         'linear-gradient(135deg, #C4714A 0%, #D4856E 100%)',
  '農地取得ガイド':       'linear-gradient(135deg, #7B5B4A 0%, #9B7B6A 100%)',
  'ダーチャという生き方': 'linear-gradient(135deg, #D4856E 0%, #E8B4B8 100%)',
  '兼業農家入門':         'linear-gradient(135deg, #C49060 0%, #D4A878 100%)',
  '外資と農地問題':       'linear-gradient(135deg, #5C3D2E 0%, #7B5548 100%)',
  '家庭菜園・保存食':     'linear-gradient(135deg, #9B7B5A 0%, #B89878 100%)',
  '農地×不動産':         'linear-gradient(135deg, #B87B6A 0%, #C8998A 100%)',
}

const GENRES = [
  '食料安全保障',
  '農地取得ガイド',
  'ダーチャという生き方',
  '兼業農家入門',
  '外資と農地問題',
  '家庭菜園・保存食',
  '農地×不動産',
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
          <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32 text-center">
            <p className="text-xs tracking-widest uppercase mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
                agri-gyosei.com
              </a>
              {' '}/ dacha
            </p>
            <h1
              className="font-bold text-white mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.75rem)', letterSpacing: '-0.02em' }}
            >
              食料自給は、<br className="sm:hidden" />国防と同じだ。
            </h1>
            <p className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.82)' }}>
              外資による農地買い占めが進む今、日本人が自らの手で食と国土を守る「ダーチャ」という選択肢がある。
            </p>
          </div>
        </section>

        {/* ── カテゴリーフィルター（横スクロールタグ） ── */}
        <div
          className="sticky top-0 z-20 border-b scrollbar-none overflow-x-auto"
          style={{ background: '#FAF7F2', borderColor: '#F0D8D0', scrollbarWidth: 'none' } as any}
        >
          <div className="max-w-5xl mx-auto">
            <div
              className="flex items-center gap-2 py-3 px-4 sm:px-6"
              style={{ width: 'max-content', minWidth: '100%' }}
            >
              <Link
                href="/dacha"
                className="flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
                style={!category
                  ? { background: '#C4714A', color: '#fff' }
                  : { background: '#F5E6E8', color: '#C4714A' }
                }
              >
                すべて
              </Link>
              {GENRES.map((genre) => (
                <Link
                  key={genre}
                  href={`/dacha?category=${encodeURIComponent(genre)}`}
                  className="flex-shrink-0 text-sm px-4 py-1.5 rounded-full font-medium transition-colors"
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

          {articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-base mb-4" style={{ color: '#C4714A' }}>
                {category ? 'このジャンルの記事はまだありません。' : '記事を準備中です。しばらくお待ちください。'}
              </p>
              {category && (
                <Link href="/dacha" className="text-sm hover:underline" style={{ color: '#C4714A' }}>
                  すべての記事を見る →
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* ── フィーチャード記事（カテゴリー未選択時のみ） ── */}
              {featuredArticle && (
                <div className="mb-8">
                  <Link
                    href={`/dacha/${featuredArticle.slug}`}
                    className="group block rounded-2xl overflow-hidden transition-shadow hover:shadow-xl"
                    style={{
                      background: '#fff',
                      border: '1px solid #F0D8D0',
                      boxShadow: '0 2px 16px rgba(61,43,31,0.07)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row" style={{ minHeight: '280px' }}>

                      {/* 左：画像 or カラーブロック */}
                      <div className="sm:w-[48%] relative" style={{ minHeight: '220px' }}>
                        {DACHA_CARD_IMAGE_SLUGS.has(featuredArticle.slug) ? (
                          <Image
                            src={`/dacha/images/${featuredArticle.slug}.png`}
                            alt={featuredArticle.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <div
                            className="w-full h-full flex flex-col items-start justify-end p-6"
                            style={{
                              background: CATEGORY_GRADIENTS[featuredArticle.category]
                                ?? 'linear-gradient(135deg, #C4714A, #D4856E)',
                            }}
                          >
                            <span className="font-bold text-xl leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>
                              {featuredArticle.category}
                            </span>
                          </div>
                        )}
                        {/* FEATURED バッジ */}
                        <span
                          className="absolute top-4 left-4 z-10 text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.92)', color: '#C4714A' }}
                        >
                          FEATURED
                        </span>
                      </div>

                      {/* 右：テキスト */}
                      <div className="sm:w-[52%] p-6 sm:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: '#F5E6E8', color: '#C4714A' }}
                          >
                            {featuredArticle.category}
                          </span>
                          <time className="text-xs text-gray-400">
                            {new Date(featuredArticle.published_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                          </time>
                        </div>
                        <h2
                          className="font-bold leading-snug mb-4"
                          style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', color: '#3D2B1F' }}
                        >
                          {featuredArticle.title}
                        </h2>
                        {featuredArticle.seo_description && (
                          <p className="text-sm leading-relaxed line-clamp-3 mb-6" style={{ color: '#6B5550' }}>
                            {featuredArticle.seo_description}
                          </p>
                        )}
                        <span
                          className="text-sm font-semibold transition-opacity group-hover:opacity-70"
                          style={{ color: '#C4714A' }}
                        >
                          この記事を読む →
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* ── 3カラムグリッド ── */}
              {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {gridArticles.map((article) => {
                    const hasEyecatch = DACHA_CARD_IMAGE_SLUGS.has(article.slug)
                    return (
                      <Link
                        key={article.id}
                        href={`/dacha/${article.slug}`}
                        className="group block rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                        style={{ background: '#fff', border: '1px solid #F0D8D0' }}
                      >
                        {/* 画像 or カラーブロック */}
                        <div className="w-full aspect-video relative overflow-hidden">
                          {hasEyecatch ? (
                            <Image
                              src={`/dacha/images/${article.slug}.png`}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-end p-4 transition-opacity group-hover:opacity-90"
                              style={{
                                background: CATEGORY_GRADIENTS[article.category]
                                  ?? 'linear-gradient(135deg, #C4714A, #D4856E)',
                              }}
                            >
                              <span
                                className="text-xs font-bold text-white px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(0,0,0,0.2)' }}
                              >
                                {article.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* カード本文 */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: '#F5E6E8', color: '#C4714A' }}
                            >
                              {article.category}
                            </span>
                            <time className="text-xs text-gray-400">
                              {new Date(article.published_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                            </time>
                          </div>
                          <h3
                            className="font-semibold text-base leading-snug line-clamp-3"
                            style={{ color: '#3D2B1F' }}
                          >
                            {article.title}
                          </h3>
                          {article.seo_description && (
                            <p
                              className="text-xs leading-relaxed line-clamp-2 mt-1.5"
                              style={{ color: '#7A6260' }}
                            >
                              {article.seo_description}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
