import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Footer from './components/Footer'
import { AnimatedSikakuHero, AnimatedSikakuArticles } from './components/AnimatedSikakuContent'

export const metadata: Metadata = {
  title: '行政書士試験を半年で突破する｜agri-gyosei.com',
  description: '毎日更新！社会人受験生のための行政書士試験合格ガイド。行政法・民法・憲法・商法を効率よく学ぶ。',
  alternates: {
    canonical: 'https://agri-gyosei.com/sikaku',
  },
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
  { period: '5・6月', subject: '行政法・憲法',     color: '#4A7ACA', desc: '試験の配点No.1。まず行政法を固める。',           href: '/sikaku?category=%E8%A1%8C%E6%94%BF%E6%B3%95%E3%83%BB%E6%86%B2%E6%B3%95' },
  { period: '7月',    subject: '民法',             color: '#3B9E6A', desc: '身近な法律で得点源に。条文と判例を整理。',       href: '/sikaku?category=%E6%B0%91%E6%B3%95' },
  { period: '8月',    subject: '商法・会社法',      color: '#9B59B6', desc: '商法は条文中心。条文の読み込みで確実に得点。',   href: '/sikaku?category=%E5%95%86%E6%B3%95%E3%83%BB%E4%BC%9A%E7%A4%BE%E6%B3%95' },
  { period: '8月',    subject: '基礎知識・足切り対策', color: '#9B59B6', desc: '足切りを回避して合格を確実にする。',         href: '/sikaku?category=%E5%9F%BA%E7%A4%8E%E7%9F%A5%E8%AD%98%E3%83%BB%E8%B6%B3%E5%88%87%E3%82%8A%E5%AF%BE%E7%AD%96' },
  { period: '9〜11月', subject: '過去問演習',      color: '#E67E22', desc: '本試験形式で弱点を洗い出し、確実に得点。',       href: '/sikaku?category=%E9%81%8E%E5%8E%BB%E5%95%8F%E6%BC%94%E7%BF%92' },
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
            <AnimatedSikakuHero />
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
          <div className="max-w-4xl mx-auto" style={{ padding: '12px 16px' }}>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const isActive = tag === 'すべて' ? !category : category === tag
                return (
                  <Link
                    key={tag}
                    href={tag === 'すべて' ? '/sikaku' : `/sikaku?category=${encodeURIComponent(tag)}`}
                    className="font-medium transition-colors"
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
                {ROADMAP.map((item, i) => (
                  <Link
                    key={item.subject}
                    href={item.href}
                    className={`p-4 block transition-shadow hover:shadow-md${i === ROADMAP.length - 1 && ROADMAP.length % 2 !== 0 ? ' col-span-2' : ''}`}
                    style={{
                      background: '#fff',
                      border: '1px solid #E8E4DC',
                      borderLeft: `3px solid ${item.color}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
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
                  </Link>
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

          <AnimatedSikakuArticles articles={articles} category={category} />
        </div>
      </div>
      <Footer />
    </>
  )
}
