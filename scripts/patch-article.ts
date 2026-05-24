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

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const slug = process.argv[2]
  const from = process.argv[3]
  const to = process.argv[4]
  // optional 5th arg: table name (default: dacha_articles, use 'articles' for sikaku)
  const table = (process.argv[5] ?? 'dacha_articles') as 'dacha_articles' | 'articles'

  if (!slug || !from || !to) {
    throw new Error('Usage: npx tsx scripts/patch-article.ts <slug> <from> <to> [table]')
  }

  const { data: article } = await supabase
    .from(table)
    .select('id, body_mdx')
    .eq('slug', slug)
    .single()

  if (!article) throw new Error('Article not found')

  if (!article.body_mdx.includes(from)) {
    console.log('パターンが見つかりません:', from)
    return
  }

  const fixed = article.body_mdx.replaceAll(from, to)

  const { error } = await supabase
    .from(table)
    .update({ body_mdx: fixed })
    .eq('id', article.id)

  if (error) throw error
  console.log('修正完了')
}

main().catch(e => { console.error(e); process.exit(1) })
