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

  const { data } = await supabase
    .from('articles')
    .select('slug, title, body_mdx')
    .order('published_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) throw new Error('No articles found')
  console.log('slug:', data.slug)
  console.log('title:', data.title)
  fs.writeFileSync('tmp-sikaku.txt', data.body_mdx, 'utf-8')
  console.log('Written to tmp-sikaku.txt')
}

main().catch(e => { console.error(e); process.exit(1) })
