"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { DACHA_CARD_IMAGE_SLUGS } from "@/lib/dacha-eyecatch"

const CATEGORY_GRADIENTS: Record<string, string> = {
  '食料安全保障':         'linear-gradient(135deg, #C4714A 0%, #D4856E 100%)',
  '農地取得ガイド':       'linear-gradient(135deg, #7B5B4A 0%, #9B7B6A 100%)',
  'ダーチャという生き方': 'linear-gradient(135deg, #D4856E 0%, #E8B4B8 100%)',
  '兼業農家入門':         'linear-gradient(135deg, #C49060 0%, #D4A878 100%)',
  '外資と農地問題':       'linear-gradient(135deg, #5C3D2E 0%, #7B5548 100%)',
  '家庭菜園・保存食':     'linear-gradient(135deg, #9B7B5A 0%, #B89878 100%)',
}

type Article = {
  id: string
  slug: string
  title: string
  category: string
  seo_description: string | null
  published_at: string
}

/* ── ヒーローアニメーション ── */
export function AnimatedHero() {
  return (
    <>
      <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
        <a href="https://agri-gyosei.com" className="hover:text-white transition-colors">
          agri-gyosei.com
        </a>
        {' '}/ dacha
      </p>
      <motion.h1
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="font-bold text-white leading-tight mb-3 sm:mb-6"
        style={{ fontSize: 'clamp(1.5rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
      >
        食料自給は、国防と同じだ。
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
        className="hidden sm:block leading-relaxed max-w-md mx-auto"
        style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.82)' }}
      >
        外資による農地買い占めが進む今、日本人が自らの手で食と国土を守る「ダーチャ」という選択肢がある。
      </motion.p>
    </>
  )
}

/* ── 記事カードアニメーション ── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

type Props = {
  featuredArticle: Article | null
  gridArticles: Article[]
  category?: string
}

export function AnimatedArticleList({ featuredArticle, gridArticles, category }: Props) {
  return (
    <>
      {/* ── フィーチャード記事 ── */}
      {featuredArticle && (
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
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
          </motion.div>
        </motion.div>
      )}

      {/* ── グリッド ── */}
      {gridArticles.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {gridArticles.map((article) => {
            const hasEyecatch = DACHA_CARD_IMAGE_SLUGS.has(article.slug)
            return (
              <motion.div key={article.id} variants={cardVariants} whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                <Link
                  href={`/dacha/${article.slug}`}
                  className="group block rounded-xl overflow-hidden transition-shadow hover:shadow-md h-full"
                  style={{ background: '#fff', border: '1px solid #F0D8D0' }}
                >
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
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* 記事なし */}
      {gridArticles.length === 0 && !featuredArticle && (
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
      )}
    </>
  )
}
