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

  console.log(`全文字数: ${data.body_mdx.length}`)
  // 2000〜4000文字目
  console.log('\n--- 2000〜4000文字目 ---')
  console.log(data.body_mdx.substring(2000, 4000))
}

main().catch(e => { console.error(e); process.exit(1) })
