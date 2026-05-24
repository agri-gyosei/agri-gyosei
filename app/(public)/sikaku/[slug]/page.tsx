import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '../components/Sidebar'
import { articleComponents } from '@/lib/mdx-components'

export const revalidate = 3600

type Props = {
  params: Promise<{ slug: string }>
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

  return {
    title: `${data.title} | 行政書士試験対策`,
    description: data.seo_description ?? undefined,
    openGraph: {
      title: data.title,
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

  return (
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
                <time className="text-xs text-gray-400">
                  {new Date(article.published_at).toLocaleDateString('ja-JP')}
                </time>
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

            <div className="mt-6 text-center">
              <Link
                href="/sikaku"
                className="inline-block bg-green-700 text-white px-6 py-2.5 rounded-full text-sm hover:bg-green-800 transition-colors"
              >
                他の記事を読む
              </Link>
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
  )
}
