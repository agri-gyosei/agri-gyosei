import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/lib/supabase/server'
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
    <header className="text-white py-4 px-6" style={{ background: 'linear-gradient(135deg, #C4714A 0%, #D4937A 100%)' }}>
      <div className="max-w-5xl mx-auto flex flex-wrap items-baseline gap-2">
        <a href="https://agri-gyosei.com" className="text-xs tracking-widest hover:text-white transition-colors shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
          agri-gyosei.com
        </a>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
        <Link href="/dacha" className="text-base font-bold text-white hover:opacity-90 transition-opacity">
          ダーチャという生き方
        </Link>
      </div>
    </header>
    <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5">
          <Link href="/dacha" className="text-sm hover:underline" style={{ color: '#C4714A' }}>
            ← 記事一覧
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          <main className="min-w-0">
            <article className="bg-white rounded-xl shadow-sm p-6 sm:p-8" style={{ border: '1px solid #F0D8D0' }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ background: '#F5E6E8', color: '#C4714A' }}>
                  {article.category}
                </span>
                <time className="text-xs text-gray-400">
                  {new Date(article.published_at).toLocaleDateString('ja-JP')}
                </time>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold mb-8 leading-snug" style={{ color: '#3D2B1F' }}>
                {article.title}
              </h1>

              <div className="dacha-body">
                <MDXRemote
                  source={article.body_mdx}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                  components={articleComponents}
                />
              </div>
            </article>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {prevArticle ? (
                <Link
                  href={`/dacha/${prevArticle.slug}`}
                  className="inline-flex items-center border px-5 py-2.5 rounded-full text-sm hover:opacity-80 transition-opacity bg-white"
                  style={{ borderColor: '#C4714A', color: '#C4714A' }}
                >
                  ← 前の記事を読む
                </Link>
              ) : (
                <span className="inline-flex items-center border border-gray-200 text-gray-300 px-5 py-2.5 rounded-full text-sm cursor-not-allowed">
                  ← 前の記事を読む
                </span>
              )}

              <Link
                href="/dacha"
                className="inline-flex items-center border border-gray-300 text-gray-600 bg-white px-5 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                一覧ページへ
              </Link>

              {nextArticle ? (
                <Link
                  href={`/dacha/${nextArticle.slug}`}
                  className="inline-flex items-center text-white px-5 py-2.5 rounded-full text-sm hover:opacity-80 transition-opacity"
                  style={{ background: '#C4714A' }}
                >
                  次の記事を読む →
                </Link>
              ) : (
                <span className="inline-flex items-center bg-gray-100 text-gray-300 px-5 py-2.5 rounded-full text-sm cursor-not-allowed">
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
