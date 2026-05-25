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

function stripDatePrefix(title: string): string {
  // "M/D｜タイトル" → "タイトル"（SEO用）
  return title.includes('｜') ? title.split('｜').slice(1).join('｜') : title
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('articles')
    .select('title, seo_description')
    .eq('slug', slug)
    .single()

  if (!data) return {}

  const seoTitle = stripDatePrefix(data.title)

  return {
    title: `${seoTitle} | 行政書士試験対策`,
    description: data.seo_description ?? undefined,
    openGraph: {
      title: seoTitle,
      description: data.seo_description ?? undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!article) notFound()

  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from('articles')
      .select('slug, title')
      .lt('published_at', article.published_at)
      .eq('is_member_only', false)
      .order('published_at', { ascending: false })
      .limit(1),
    supabase
      .from('articles')
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
    <header className="bg-green-800 text-white py-4 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap items-baseline gap-2">
        <a href="https://agri-gyosei.com" className="text-green-300 text-xs tracking-widest hover:text-green-100 transition-colors shrink-0">
          agri-gyosei.com
        </a>
        <span className="text-green-600 text-xs">/</span>
        <Link href="/sikaku" className="text-base font-bold text-white hover:opacity-90 transition-opacity">
          行政書士試験の勉強法｜6ヶ月間集中学習
        </Link>
      </div>
    </header>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-5">
          <Link href="/sikaku" className="text-sm text-green-700 hover:underline">
            ← 記事一覧
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
          {/* メイン記事 */}
          <main className="min-w-0">
            <article className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  {article.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 leading-snug">
                {article.title}
              </h1>

              <div className="article-body">
                <MDXRemote
                  source={article.body_mdx}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                  components={articleComponents}
                />
              </div>
            </article>

            {/* ページャー */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {prevArticle ? (
                <Link
                  href={`/sikaku/${prevArticle.slug}`}
                  className="inline-flex items-center border border-green-700 text-green-700 bg-white px-5 py-2.5 rounded-full text-sm hover:bg-green-50 transition-colors"
                >
                  ← 前の記事を読む
                </Link>
              ) : (
                <span className="inline-flex items-center border border-gray-200 text-gray-300 px-5 py-2.5 rounded-full text-sm cursor-not-allowed">
                  ← 前の記事を読む
                </span>
              )}

              <Link
                href="/sikaku"
                className="inline-flex items-center border border-gray-300 text-gray-600 bg-white px-5 py-2.5 rounded-full text-sm hover:bg-gray-50 transition-colors"
              >
                一覧ページへ
              </Link>

              {nextArticle ? (
                <Link
                  href={`/sikaku/${nextArticle.slug}`}
                  className="inline-flex items-center bg-green-700 text-white px-5 py-2.5 rounded-full text-sm hover:bg-green-800 transition-colors"
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

          {/* サイドバー（PC）*/}
          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <Sidebar currentCategory={article.category} />
            </div>
          </aside>
        </div>

        {/* サイドバー（モバイル・記事下）*/}
        <div className="lg:hidden mt-10">
          <Sidebar currentCategory={article.category} />
        </div>
      </div>
    </div>
    <Footer />
    </>
  )
}
