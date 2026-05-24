import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { createClient } from '@/lib/supabase/server'

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
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link href="/sikaku" className="text-sm text-green-700 hover:underline">
            ← 記事一覧
          </Link>
        </div>

        <article className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              {article.category}
            </span>
            <time className="text-xs text-gray-400">
              {new Date(article.published_at).toLocaleDateString('ja-JP')}
            </time>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
            {article.title}
          </h1>

          <div className="prose prose-green max-w-none">
            <MDXRemote source={article.body_mdx} />
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/sikaku"
            className="inline-block bg-green-700 text-white px-6 py-2.5 rounded-full text-sm hover:bg-green-800 transition-colors"
          >
            他の記事を読む
          </Link>
        </div>
      </div>
    </div>
  )
}
