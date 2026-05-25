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
  const idx = data.body_mdx.indexOf('Q1')
  process.stdout.write(JSON.stringify(data.body_mdx.slice(Math.max(0, idx - 30), idx + 150)) + '\n')
}
main().catch(e => { console.error(e); process.exit(1) })
