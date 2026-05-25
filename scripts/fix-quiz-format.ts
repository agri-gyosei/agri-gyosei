import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([^=]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim()
  }
}

// ### Q1\n\n問題文（<strong>強調</strong>あり）。
// → ### Q1.問題文。
function fixQuizFormat(body: string): string {
  return body.replace(
    /### (Q\d+)\n\n([^\n]+)\n/g,
    (_, qNum, questionLine) => {
      const text = questionLine
        .replace(/<strong>([\s\S]*?)<\/strong>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .trim()
      return `### ${qNum}.${text}\n`
    }
  )
}

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const slug = process.argv[2]
  const table = (process.argv[3] ?? 'articles') as 'articles' | 'dacha_articles'

  if (!slug) {
    throw new Error('Usage: npx tsx scripts/fix-quiz-format.ts <slug> [table]')
  }

  const { data: article } = await supabase
    .from(table)
    .select('id, body_mdx')
    .eq('slug', slug)
    .single()

  if (!article) throw new Error('Article not found')

  const fixed = fixQuizFormat(article.body_mdx)

  if (fixed === article.body_mdx) {
    console.log('修正箇所なし（すでに正しい形式）')
    return
  }

  const { error } = await supabase
    .from(table)
    .update({ body_mdx: fixed })
    .eq('id', article.id)

  if (error) throw error
  console.log('修正完了')
}

main().catch(e => { console.error(e); process.exit(1) })
