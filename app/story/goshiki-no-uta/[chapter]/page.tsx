import fs from 'fs'
import path from 'path'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { Navigation } from '@/components/story/navigation'
import { Footer } from '@/components/story/footer'

const MD_PATH = path.join(process.cwd(), 'content/story/五色の詩_ムーの子供たちへ.md')

type ChapterData = {
  index: number
  label: string
  title: string
  body: string
}

function parseChapters(): ChapterData[] {
  const raw = fs.readFileSync(MD_PATH, 'utf-8')
  const parts = raw.split(/(?=^## (?:第.+?章|最終章|エピローグ))/m)

  return parts
    .filter(p => /^## /.test(p.trim()))
    .map((p, i) => {
      const lines = p.trim().split('\n')
      const headingRaw = lines[0].replace(/^## /, '').trim()
      const labelMatch = headingRaw.match(/^(第.+?章|最終章|エピローグ)/)
      const label = labelMatch ? labelMatch[1] : headingRaw
      const titleMatch = headingRaw.match(/「([^」]+)」/)
      const title = titleMatch ? titleMatch[1] : headingRaw
      const body = lines.slice(1).join('\n').trim()
      return { index: i + 1, label, title, body }
    })
}

type Props = { params: Promise<{ chapter: string }> }

export async function generateStaticParams() {
  const chapters = parseChapters()
  return chapters.map((_, i) => ({ chapter: String(i + 1) }))
}

export default async function ChapterPage({ params }: Props) {
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
          href="/story/goshiki-no-uta"
          className="text-paper/30 text-xs tracking-[0.3em] uppercase hover:text-gold/70 transition-colors duration-300"
        >
          ← 五色の詩　目次
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
            href={`/story/goshiki-no-uta/${prev.index}`}
            className="flex flex-col gap-1 text-paper/40 text-xs tracking-wide hover:text-gold/70 transition-colors duration-300"
          >
            <span className="text-gold/30 tracking-[0.2em]">← 前の章</span>
            <span>{prev.label}「{prev.title}」</span>
          </Link>
        ) : <span />}

        {next ? (
          <Link
            href={`/story/goshiki-no-uta/${next.index}`}
            className="flex flex-col gap-1 text-paper/40 text-xs tracking-wide hover:text-gold/70 transition-colors duration-300 text-right"
          >
            <span className="text-gold/30 tracking-[0.2em]">次の章 →</span>
            <span>{next.label}「{next.title}」</span>
          </Link>
        ) : <span />}
      </nav>

      <Footer />
    </div>
  )
}
