import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { Navigation } from '@/components/story/navigation'
import { Footer } from '@/components/story/footer'

const MD_PATH = path.join(process.cwd(), 'content/story/杉の根_エ梢は天に、根は地に.md')

type ChapterData = {
  index: number
  label: string
  title: string
  body: string
}

function parseChapters(): ChapterData[] {
  const raw = fs.readFileSync(MD_PATH, 'utf-8')
  const parts = raw.split(/(?=^## )/m)

  return parts
    .filter(p => /^## /.test(p.trim()))
    .map((p, i) => {
      const lines = p.trim().split('\n')
      const headingRaw = lines[0].replace(/^## /, '').trim()
      const spaceIdx = headingRaw.indexOf('　')
      let label: string, title: string
      if (spaceIdx > -1) {
        label = headingRaw.slice(0, spaceIdx).trim()
        title = headingRaw.slice(spaceIdx + 1).trim()
      } else {
        label = headingRaw
        title = headingRaw
      }
      const body = lines.slice(1).join('\n').trim()
      return { index: i + 1, label, title, body }
    })
}

type Props = { params: Promise<{ chapter: string }> }

export async function generateStaticParams() {
  const chapters = parseChapters()
  return chapters.map((_, i) => ({ chapter: String(i + 1) }))
}

export async function generateMetadata({ params }: Props) {
  const { chapter: chapterParam } = await params
  const chapters = parseChapters()
  const idx = parseInt(chapterParam, 10) - 1
  if (isNaN(idx) || idx < 0 || idx >= chapters.length) return {}
  const current = chapters[idx]
  const chapterUrl = `https://agri-gyosei.com/story/suginone-kozue-wa-ten-ni/${current.index}`
  return {
    title: `${current.label}${current.label !== current.title ? `「${current.title}」` : ''} | 杉の根 ～梢は天に、根は地に～ | 時の杜`,
    description: '三十年間、計画の内側にいた男が初めて地上を見た。イスラエルの諜報機関員・エレズが奥多摩の杉林で根を張り始める物語。',
    alternates: { canonical: chapterUrl },
    openGraph: {
      title: `${current.label} | 杉の根 ～梢は天に、根は地に～`,
      description: '三十年間、計画の内側にいた男が初めて地上を見た。イスラエルの諜報機関員・エレズが奥多摩の杉林で根を張り始める物語。',
      url: chapterUrl,
      type: 'article',
      images: [{ url: '/images/suginone-cover.png' }],
    },
  }
}

export default async function SuginoneChapterPage({ params }: Props) {
  const { chapter: chapterParam } = await params
  const chapters = parseChapters()
  const idx = parseInt(chapterParam, 10) - 1

  if (isNaN(idx) || idx < 0 || idx >= chapters.length) notFound()

  const current = chapters[idx]
  const prev = idx > 0 ? chapters[idx - 1] : null
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null

  return (
    <div className="bg-ink min-h-screen text-paper">
      <Navigation />

      {/* Back link */}
      <div className="pt-28 pb-0 px-6 max-w-2xl mx-auto">
        <Link
          href="/story/suginone-kozue-wa-ten-ni"
          className="text-paper/30 text-xs tracking-[0.3em] uppercase hover:text-gold/70 transition-colors duration-300"
        >
          ← 杉の根　目次
        </Link>
      </div>

      {/* Chapter header */}
      <header className="pt-16 pb-16 px-6 text-center">
        <p className="text-gold/60 text-xs tracking-[0.5em] mb-5">{current.label}</p>
        <h1 className="font-serif text-paper text-[clamp(1.6rem,4vw,2.8rem)] font-light leading-snug tracking-wide">
          {current.title}
        </h1>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mt-8" />
      </header>

      {/* Body */}
      <article className="max-w-2xl mx-auto px-6 pb-24">
        <div className="chapter-body">
          <MDXRemote
            source={current.body}
            options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          />
        </div>
      </article>

      {/* Prev / Next navigation */}
      <nav className="max-w-2xl mx-auto px-6 pb-24 border-t border-paper/10 pt-12 flex justify-between items-start gap-8">
        {prev ? (
          <Link
            href={`/story/suginone-kozue-wa-ten-ni/${prev.index}`}
            className="flex flex-col gap-1 text-paper/40 text-xs tracking-wide hover:text-gold/70 transition-colors duration-300"
          >
            <span className="text-gold/30 tracking-[0.2em]">← 前の章</span>
            <span>{prev.label}{prev.label !== prev.title ? `「${prev.title}」` : ''}</span>
          </Link>
        ) : <span />}

        {next ? (
          <Link
            href={`/story/suginone-kozue-wa-ten-ni/${next.index}`}
            className="flex flex-col gap-1 text-paper/40 text-xs tracking-wide hover:text-gold/70 transition-colors duration-300 text-right"
          >
            <span className="text-gold/30 tracking-[0.2em]">次の章 →</span>
            <span>{next.label}{next.label !== next.title ? `「${next.title}」` : ''}</span>
          </Link>
        ) : <span />}
      </nav>

      <Footer />
    </div>
  )
}
