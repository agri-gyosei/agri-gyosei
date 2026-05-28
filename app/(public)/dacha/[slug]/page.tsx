import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'
import { createClient } from '@/lib/supabase/server'
import { DACHA_EYECATCH_SLUGS } from '@/lib/dacha-eyecatch'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { articleComponents } from '@/lib/mdx-components'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('dacha_articles')
    .select('title, seo_description')
    .eq('slug', slug)
    .single()

  if (!data) return {}

  return {
    title: `${data.title} | ダーチャという生き方`,
    description: data.seo_description ?? undefined,
    openGraph: {
      title: data.title,
      description: data.seo_description ?? undefined,
    },
  }
}

export default async function DachaArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('dacha_articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article) notFound()

  const hasEyecatch = DACHA_EYECATCH_SLUGS.has(slug)

  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from('dacha_articles')
      .select('slug, title')
      .lt('published_at', article.published_at)
      .eq('is_member_only', false)
      .order('published_at', { ascending: false })
      .limit(1),
    supabase
      .from('dacha_articles')
      .select('slug, title')
      .gt('published_at', article.published_at)
      .eq('is_member_only', false)
      .order('published_at', { ascending: true })
      .limit(1),
  ])

  const prevArticle = prevData?.[0] ?? null
  const nextArticle = nextData?.[0] ?? null

  return (
    <>
    {/* スリムなナビバー */}
    <header className="px-6 py-4 border-b" style={{ background: '#FAF8F6', borderColor: '#E4CFC9' }}>
      <div className="max-w-5xl mx-auto flex flex-wrap items-baseline gap-2">
        <a href="https://agri-gyosei.com" className="text-xs tracking-widest uppercase transition-colors shrink-0" style={{ color: '#7A6260' }}>
          agri-gyosei.com
        </a>
        <span className="text-xs" style={{ color: '#C9A8A5' }}>/</span>
        <Link href="/dacha" className="text-sm font-semibold transition-opacity hover:opacity-70" style={{ color: '#B86B5A' }}>
          ダーチャという生き方
        </Link>
      </div>
    </header>

    <div className="min-h-screen" style={{ background: '#FAF8F6' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-6">
          <Link href="/dacha" className="text-sm transition-colors hover:opacity-70" style={{ color: '#B86B5A' }}>
            ← 記事一覧
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          <main className="min-w-0">
            <article className="rounded-xl p-6 sm:p-10" style={{ background: '#FFFFFF', border: '1px solid #E4CFC9' }}>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#EDD5D0', color: '#A85F50' }}>
                  {article.category}
                </span>
                <time className="text-xs" style={{ color: '#7A6260' }}>
                  {new Date(article.published_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' })}
                </time>
              </div>

              {hasEyecatch && (
                <div className="mb-8 rounded-lg overflow-hidden" style={{ border: '1px solid #E4CFC9' }}>
                  <Image
                    src={`/dacha/images/${slug}.png`}
                    alt={article.title}
                    width={800}
                    height={450}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-bold mb-8 leading-snug" style={{ color: '#2A1A16' }}>
                {article.title}
              </h1>

              <div className="dacha-body">
                <MDXRemote
                  source={article.body_mdx}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]] } }}
                  components={articleComponents}
                />
              </div>

              <div className="mt-8 pt-6 border-t text-xs leading-relaxed" style={{ borderColor: '#E4CFC9', color: '#7A6260' }}>
                本記事は一般的な情報提供を目的としており、個別の法的アドバイスではありません。詳細は農業委員会または行政書士にご相談ください。
              </div>
            </article>

            {/* 前後ナビゲーション */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {prevArticle ? (
                <Link
                  href={`/dacha/${prevArticle.slug}`}
                  className="inline-flex items-center border px-5 py-2.5 rounded-full text-sm transition-opacity hover:opacity-70 bg-white"
                  style={{ borderColor: '#C9A8A5', color: '#B86B5A' }}
                >
                  ← 前の記事を読む
                </Link>
              ) : (
                <span className="inline-flex items-center border px-5 py-2.5 rounded-full text-sm cursor-not-allowed" style={{ borderColor: '#E4CFC9', color: '#C9A8A5' }}>
                  ← 前の記事を読む
                </span>
              )}

              <Link
                href="/dacha"
                className="inline-flex items-center border bg-white px-5 py-2.5 rounded-full text-sm transition-colors hover:bg-gray-50"
                style={{ borderColor: '#E4CFC9', color: '#4A3530' }}
              >
                一覧ページへ
              </Link>

              {nextArticle ? (
                <Link
                  href={`/dacha/${nextArticle.slug}`}
                  className="inline-flex items-center text-white px-5 py-2.5 rounded-full text-sm transition-opacity hover:opacity-80"
                  style={{ background: '#B86B5A' }}
                >
                  次の記事を読む →
                </Link>
              ) : (
                <span className="inline-flex items-center px-5 py-2.5 rounded-full text-sm cursor-not-allowed" style={{ background: '#F3ECE9', color: '#C9A8A5' }}>
                  次の記事を読む →
                </span>
              )}
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar currentCategory={article.category} />
            </div>
          </aside>
        </div>

        <div className="lg:hidden mt-10">
          <Sidebar currentCategory={article.category} />
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
