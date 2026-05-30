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

  // 最新3件を確認
  const { data } = await supabase
    .from('articles')
    .select('id, slug, title')
    .order('created_at', { ascending: false })
    .limit(3)

  console.log('最新記事:')
  data?.forEach(a => console.log(`  [${a.id}] ${a.title}`))

  const from = process.argv[2]  // 例: "5/25"
  const to = process.argv[3]    // 例: "5/26"
  const slugFilter = process.argv[4]  // 例: slug一部

  if (!from || !to) {
    console.log('\nUsage: npx tsx scripts/fix-title-date.ts <from> <to> [slug-contains]')
    return
  }

  const query = supabase.from('articles').select('id, title')
  const { data: targets } = await (slugFilter
    ? query.ilike('slug', `%${slugFilter}%`)
    : query.ilike('title', `%${from}%`))

  for (const t of targets ?? []) {
    if (!t.title.includes(from)) continue
    const newTitle = t.title.replace(from, to)
    await supabase.from('articles').update({ title: newTitle }).eq('id', t.id)
    console.log(`修正: ${t.title} → ${newTitle}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
