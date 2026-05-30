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

  const { data, error } = await supabase
    .from('dacha_articles')
    .select('slug, title, body_mdx')
    .ilike('body_mdx', '%約半数%')

  if (error) { console.error(error); process.exit(1) }

  if (!data || data.length === 0) {
    console.log('「約半数」を含む記事なし')
    return
  }

  for (const art of data) {
    const idx = art.body_mdx.indexOf('約半数')
    const ctx = art.body_mdx.substring(Math.max(0, idx - 50), idx + 80)
    console.log(`slug: ${art.slug}`)
    console.log(`title: ${art.title}`)
    console.log(`context: ...${ctx}...`)
    console.log('---')
  }
}

main().catch(e => { console.error(e); process.exit(1) })
