import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import Footer from './components/Footer'
import { DACHA_CARD_IMAGE_SLUGS } from '@/lib/dacha-eyecatch'

export const metadata: Metadata = {
  title: 'ダーチャという生き方｜農地と食料安全保障',
  description: '農地取得・食料安全保障・ダーチャ文化について発信。外資による農地買い占めから日本の国土を守り、家族の食を自分たちの手で守る生き方を提案します。',
  alternates: {
    canonical: 'https://agri-gyosei.com/dacha',
  },
}

export const revalidate = 3600

const CATEGORY_GRADIENTS: Record<string, string> = {
  '食料安全保障':         'linear-gradient(135deg, #C4714A 0%, #D4856E 100%)',
  '農地取得ガイド':       'linear-gradient(135deg, #7B5B4A 0%, #9B7B6A 100%)',
  'ダーチャという生き方': 'linear-gradient(135deg, #D4856E 0%, #E8B4B8 100%)',
  '兼業農家入門':         'linear-gradient(135deg, #C49060 0%, #D4A878 100%)',
  '外資と農地問題':       'linear-gradient(135deg, #5C3D2E 0%, #7B5548 100%)',
  '家庭菜園・保存食':     'linear-gradient(135deg, #9B7B5A 0%, #B89878 100%)',
}

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
          {/* モバイル：コンパクト / デスクトップ：余裕あり */}
          <div className="max-w-5xl mx-auto px-6 py-14 text-center">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
                agri-gyosei.com
              </a>
              {' '}/ dacha
            </p>
            <h1
              className="font-bold text-white leading-tight mb-3 sm:mb-6"
              style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
            >
              食料自給は、国防と同じだ。
            </h1>
            {/* サブテキストはモバイルで非表示 */}
            <p
              className="hidden sm:block leading-relaxed max-w-md mx-auto"
              style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.82)' }}
            >
              外資による農地買い占めが進む今、日本人が自らの手で食と国土を守る「ダーチャ」という選択肢がある。
            </p>
          </div>
        </section>

        {/* ── カテゴリーフィルター（折り返しタグ） ──
            横スクロールはstickyと競合しやすいため flex-wrap で複数行折り返しに変更。
            モバイルでは2行、デスクトップでは1行に収まる。 */}
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

          {articles.length === 0 ? (
            <div className="text-center py-20">
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
                <div className="mb-6 sm:mb-8">
                  <Link
                    href={`/dacha/${featuredArticle.slug}`}
                    className="group block rounded-2xl overflow-hidden transition-shadow hover:shadow-xl"
                    style={{
                      background: '#fff',
                      border: '1px solid #F0D8D0',
                      boxShadow: '0 2px 16px rgba(61,43,31,0.07)',
                    }}
                  >
                    <div className="flex flex-col sm:flex-row">

                      {/* 上（モバイル）/ 左（デスクトップ）：画像 or カラーブロック */}
                      <div
                        className="w-full sm:w-[48%] relative"
                        style={{ minHeight: '200px', height: 'clamp(200px, 30vw, 320px)' }}
                      >
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
                            className="w-full h-full flex flex-col items-center justify-center gap-3 p-6"
                            style={{ background: '#FAF7F2' }}
                          >
                            <div
                              style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '6px',
                                background: CATEGORY_GRADIENTS[featuredArticle.category]
                                  ?? 'linear-gradient(135deg, #C4714A, #D4856E)',
                              }}
                            />
                            <span
                              className="text-xs px-3 py-1 rounded-full font-medium"
                              style={{ background: '#E8B4B8', color: '#3D2B1F' }}
                            >
                              {featuredArticle.category}
                            </span>
                            <p
                              className="font-bold text-center leading-snug"
                              style={{ fontSize: 'clamp(0.9rem, 2vw, 1.25rem)', color: '#3D2B1F', maxWidth: '90%' }}
                            >
                              {featuredArticle.title}
                            </p>
                            <span className="text-xs mt-auto" style={{ color: '#C4714A' }}>
                              agri-gyosei.com/dacha
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 下（モバイル）/ 右（デスクトップ）：テキスト */}
                      <div className="w-full sm:w-[52%] p-5 sm:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-3">
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
                          className="font-bold leading-snug mb-3"
                          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', color: '#3D2B1F' }}
                        >
                          {featuredArticle.title}
                        </h2>
                        {featuredArticle.seo_description && (
                          <p
                            className="hidden sm:block text-sm leading-relaxed line-clamp-3 mb-5"
                            style={{ color: '#6B5550' }}
                          >
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

              {/* ── グリッド（モバイル1列 / タブレット2列 / PC3列） ── */}
              {gridArticles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {gridArticles.map((article) => {
                    const hasEyecatch = DACHA_CARD_IMAGE_SLUGS.has(article.slug)
                    return (
                      <Link
                        key={article.id}
                        href={`/dacha/${article.slug}`}
                        className="group block rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                        style={{ background: '#fff', border: '1px solid #F0D8D0' }}
                      >
                        {/* 画像 or カラーブロック（16:9） */}
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
                              className="w-full h-full flex items-end p-3 sm:p-4 transition-opacity group-hover:opacity-90"
                              style={{
                                background: CATEGORY_GRADIENTS[article.category]
                                  ?? 'linear-gradient(135deg, #C4714A, #D4856E)',
                              }}
                            >
                              <span
                                className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(0,0,0,0.22)' }}
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
                            className="font-semibold text-sm sm:text-base leading-snug line-clamp-3"
                            style={{ color: '#3D2B1F' }}
                          >
                            {article.title}
                          </h3>
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
