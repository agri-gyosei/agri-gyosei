"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"

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

type Article = {
  id: string
  slug: string
  title: string
  category: string
  seo_description: string | null
  published_at: string
}

/* ── ヒーロータイトル ── */
export function AnimatedSikakuHero() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        className="mb-2"
        style={{ color: '#F0F5FF', fontSize: '2rem', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.3 }}
      >
        行政書士試験を半年で突破する
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.85, delay: 0.3, ease: "easeOut" }}
        style={{ color: '#8AA0C8', fontSize: '13px' }}
      >
        毎日更新分だけ学ぶ｜社会人受験生のための合格ガイド
      </motion.p>
    </>
  )
}

/* ── 記事カード一覧 ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

type ArticlesProps = {
  articles: Article[]
  category?: string
}

export function AnimatedSikakuArticles({ articles, category }: ArticlesProps) {
  if (articles.length === 0) {
    return (
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
    )
  }

  return (
    <motion.div
      className="space-y-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
    >
      {articles.map((article) => {
        const borderColor = BORDER_COLORS[article.category] ?? DEFAULT_BORDER
        return (
          <motion.div
            key={article.id}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Link
              href={`/sikaku/${article.slug}`}
              className="block p-5"
              style={{
                background: 'rgba(255,255,255,0.88)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '1px solid #E8E4DC',
                borderLeft: `3px solid ${borderColor}`,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(26,39,68,0.06)',
                transition: 'box-shadow 0.25s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(26,39,68,0.13)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(26,39,68,0.06)'
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
          </motion.div>
        )
      })}
    </motion.div>
  )
}
