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
    .select('body_mdx')
    .eq('slug', process.argv[2])
    .single()

  if (!data) { console.log('not found'); return }
  // Q前後50文字だけ出力
  const matches = [...data.body_mdx.matchAll(/Q\d[\s\S]{0,200}/g)]
  matches.forEach(m => console.log('---\n' + m[0]))
}

main().catch(e => { console.error(e); process.exit(1) })
