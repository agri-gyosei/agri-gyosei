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
    .select('body_mdx')
    .eq('slug', 'what-is-dacha-why-russia-survived-famine')
    .single()

  if (error || !data) { console.error(error); process.exit(1) }

  const keyword = '週末になると家族そろって畑を耕し'
  const idx = data.body_mdx.indexOf(keyword)
  if (idx === -1) {
    console.log('該当テキストなし')
  } else {
    console.log('前後100文字:')
    console.log(data.body_mdx.substring(Math.max(0, idx - 100), idx + keyword.length + 100))
  }
}

main().catch(e => { console.error(e); process.exit(1) })
