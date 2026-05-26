import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: '行政書士試験を半年で突破する｜agri-gyosei.com',
  description: '毎日更新！社会人受験生のための行政書士試験合格ガイド。行政法・民法・憲法・商法を効率よく学ぶ。',
}

export const revalidate = 3600

// 科目ごとの左ボーダーカラー
const BORDER_COLORS: Record<string, string> = {
  '行政法':               '#4A7ACA',
  '行政法・憲法':         '#4A7ACA',
  '民法':                 '#3B9E6A',
  '憲法':                 '#C4714A',
  '商法':                 '#9B59B6',
  '商法・会社法':         '#9B59B6',
  '合格戦略':             '#9B59B6',
  '頻出条文':             '#E67E22',
  '過去問演習':           '#4A7ACA',
  '基礎知識・足切り対策': '#E67E22',
}
const DEFAULT_BORDER = '#4A7ACA'

const TAGS = ['すべて', '行政法', '民法', '憲法', '商法', '合格戦略', '頻出条文']

const ROADMAP = [
  { period: '5・6月', subject: '行政法・憲法',  color: '#4A7ACA', desc: '試験の配点No.1。まず行政法を固める。' },
  { period: '7月',    subject: '民法',          color: '#3B9E6A', desc: '身近な法律で得点源に。条文と判例を整理。' },
  { period: '8月',    subject: '商法・基礎知識', color: '#9B59B6', desc: '商法は条文中心。基礎知識は得点を守る。' },
  { period: '9〜11月', subject: '過去問演習',   color: '#E67E22', desc: '本試験形式で弱点を洗い出し、確実に得点。' },
]

function getPhase(month: number): { phase: number; label: string } {
  if (month === 5)                       return { phase: 1, label: '5・6月 行政法・憲法' }
  if (month === 6)                       return { phase: 2, label: '5・6月 行政法・憲法' }
  if (month === 7)                       return { phase: 3, label: '7月 民法' }
  if (month === 8)                       return { phase: 4, label: '8月 商法・基礎知識' }
  if (month >= 9 && month <= 11)         return { phase: 5, label: '9〜11月 過去問演習' }
  return                                        { phase: 6, label: '合格まであと少し！' }
}

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

  // 現在の日本時間
  const now = new Date(new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }))
  const month = now.getMonth() + 1
  const { phase, label: phaseLabel } = getPhase(month)

  // 6バーの色（phase6は全部完了色）
  const barColors = Array.from({ length: 6 }, (_, i) => {
    if (phase === 6) return '#4A7ACA'
    const barPhase = i + 1
    if (barPhase < phase)  return '#4A7ACA' // 完了
    if (barPhase === phase) return '#7AABF0' // 現在地
    return '#3A4F7A'                         // 未実施
  })

  return (
    <>
      <div style={{ background: '#F8F7F4', minHeight: '100vh' }}>

        {/* ── ヒーロー＋進捗バー（ネイビー帯） ── */}
        <div style={{ background: '#1A2744' }}>

          {/* ヒーロー */}
          <div className="max-w-4xl mx-auto px-6 py-8 text-center">
            <p
              className="mb-3"
              style={{ color: '#7A9BD4', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              <a href="https://agri-gyosei.com" className="hover:opacity-70 transition-opacity">
                agri-gyosei.com
              </a>
              {' / '}
              <Link href="/sikaku" className="hover:opacity-70 transition-opacity">
                sikaku
              </Link>
            </p>
            <h1
              className="mb-2"
              style={{ color: '#F0F5FF', fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}
            >
              行政書士試験を半年で突破する
            </h1>
            <p style={{ color: '#8AA0C8', fontSize: '13px' }}>
              毎日更新分だけ学ぶ｜社会人受験生のための合格ガイド
            </p>
          </div>

          {/* 学習進捗バー */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
            <div
              className="flex items-center gap-3"
              style={{ background: '#243057', borderRadius: '8px', padding: '12px 16px' }}
            >
              <span
                className="flex-shrink-0"
                style={{ color: '#7A9BD4', fontSize: '10px', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
              >
                学習進捗
              </span>
              <div className="flex gap-1.5 flex-1 min-w-0">
                {barColors.map((color, i) => (
                  <div
                    key={i}
                    style={{ flex: 1, height: '6px', borderRadius: '3px', background: color }}
                  />
                ))}
              </div>
              <span
                className="flex-shrink-0"
                style={{ color: '#7A9BD4', fontSize: '10px', whiteSpace: 'nowrap' }}
              >
                {phaseLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── カテゴリータグバー ── */}
        <div
          className="sticky top-0 z-20 border-b"
          style={{ background: '#F8F7F4', borderColor: '#E4E0D8' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div
              className="overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: 'none' } as React.CSSProperties}
            >
              <div className="flex gap-2 py-3 w-max min-w-full">
                {TAGS.map((tag) => {
                  const isActive = tag === 'すべて' ? !category : category === tag
                  return (
                    <Link
                      key={tag}
                      href={tag === 'すべて' ? '/sikaku' : `/sikaku?category=${encodeURIComponent(tag)}`}
                      className="flex-shrink-0 font-medium transition-colors whitespace-nowrap"
                      style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: isActive ? '0.5px solid #1A2744' : '0.5px solid #ccc',
                        background: isActive ? '#1A2744' : '#fff',
                        color: isActive ? '#B8D0F5' : '#555',
                      }}
                    >
                      {tag}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── メインコンテンツ ── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* ── ロードマップセクション（カテゴリー未選択時のみ） ── */}
          {!category && (
            <div className="mb-10">
              <p
                className="mb-4"
                style={{
                  fontSize: '11px', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#8A8880',
                }}
              >
                半年合格ロードマップ
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROADMAP.map((item) => (
                  <div
                    key={item.period}
                    className="p-4"
                    style={{
                      background: '#fff',
                      border: '1px solid #E8E4DC',
                      borderLeft: `3px solid ${item.color}`,
                      borderRadius: '10px',
                    }}
                  >
                    <div
                      className="text-xs font-bold mb-1"
                      style={{ color: item.color }}
                    >
                      {item.period}
                    </div>
                    <div
                      className="text-sm font-semibold mb-1 leading-snug"
                      style={{ color: '#1A2744' }}
                    >
                      {item.subject}
                    </div>
                    <p
                      className="text-xs leading-relaxed hidden sm:block"
                      style={{ color: '#7A7870' }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* カテゴリーフィルター中の表示 */}
          {category && (
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: '#EEF2FA', color: '#1A2744' }}
              >
                {category}
              </span>
              <Link
                href="/sikaku"
                className="text-xs hover:underline"
                style={{ color: '#8A8880' }}
              >
                ✕ 絞り込みを解除
              </Link>
            </div>
          )}

          {/* ── 記事一覧セクションラベル ── */}
          <p
            className="mb-4"
            style={{
              fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#8A8880',
            }}
          >
            {category ? `${category}の記事` : '最新の記事'}
          </p>

          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm mb-3" style={{ color: '#8A8880' }}>
                {category ? 'このカテゴリーの記事はまだありません。' : '記事を準備中です。しばらくお待ちください。'}
              </p>
              {category && (
                <Link href="/sikaku" className="text-sm hover:underline" style={{ color: '#4A7ACA' }}>
                  すべての記事を見る →
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {articles.map((article) => {
                const borderColor = BORDER_COLORS[article.category] ?? DEFAULT_BORDER
                return (
                  <Link
                    key={article.id}
                    href={`/sikaku/${article.slug}`}
                    className="block p-5 transition-shadow hover:shadow-md"
                    style={{
                      background: '#fff',
                      border: '1px solid #E8E4DC',
                      borderLeft: `3px solid ${borderColor}`,
                      borderRadius: '10px',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: '#EEF2FA', color: '#1A2744' }}
                      >
                        {article.category}
                      </span>
                      <time className="text-xs" style={{ color: '#9A9890' }}>
                        {new Date(article.published_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                      </time>
                    </div>
                    <h2
                      className="font-semibold text-base leading-snug mb-1"
                      style={{ color: '#1A2744' }}
                    >
                      {article.title}
                    </h2>
                    {article.seo_description && (
                      <p
                        className="text-xs leading-relaxed line-clamp-2"
                        style={{ color: '#7A7870' }}
                      >
                        {article.seo_description}
                      </p>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
