import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeExternalLinks from 'rehype-external-links'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { articleComponents } from '@/lib/mdx-components'

export const revalidate = 3600

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
  const borderColor = BORDER_COLORS[article.category] ?? DEFAULT_BORDER

  return (
    <>
      {/* ── ヘッダー（ネイビー帯） ── */}
      <div style={{ background: '#1A2744' }}>
        <div className="max-w-5xl mx-auto px-6 py-5">
          <p style={{ color: '#7A9BD4', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            <a href="https://agri-gyosei.com" className="hover:opacity-70 transition-opacity">
              agri-gyosei.com
            </a>
            {' / '}
            <Link href="/sikaku" className="hover:opacity-70 transition-opacity" style={{ color: '#7A9BD4' }}>
              行政書士試験の勉強法｜6ヶ月間集中学習
            </Link>
          </p>
        </div>
      </div>

      <div style={{ background: '#F8F7F4', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-5">
            <Link href="/sikaku" className="text-sm hover:underline" style={{ color: '#4A7ACA' }}>
              ← 記事一覧
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_272px] gap-8">
            {/* メイン記事 */}
            <main className="min-w-0">
              <article
                style={{
                  background: '#fff',
                  border: '1px solid #E8E4DC',
                  borderLeft: `3px solid ${borderColor}`,
                  borderRadius: '10px',
                  padding: '24px 28px',
                }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className="text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: '#EEF2FA', color: '#1A2744' }}
                  >
                    {article.category}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold mb-8 leading-snug" style={{ color: '#1A2744' }}>
                  {article.title}
                </h1>

                <div className="article-body">
                  <MDXRemote
                    source={article.body_mdx}
                    options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeRaw, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]] } }}
                    components={articleComponents}
                  />
                </div>
              </article>

              {/* ページャー */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {prevArticle ? (
                  <Link
                    href={`/sikaku/${prevArticle.slug}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-sm transition-opacity hover:opacity-70"
                    style={{ border: '1px solid #1A2744', color: '#1A2744', background: '#fff' }}
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
                  className="inline-flex items-center px-5 py-2.5 rounded-full text-sm transition-opacity hover:opacity-70"
                  style={{ border: '0.5px solid #ccc', color: '#555', background: '#fff' }}
                >
                  一覧ページへ
                </Link>

                {nextArticle ? (
                  <Link
                    href={`/sikaku/${nextArticle.slug}`}
                    className="inline-flex items-center px-5 py-2.5 rounded-full text-sm text-white transition-opacity hover:opacity-80"
                    style={{ background: '#1A2744' }}
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
