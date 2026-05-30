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
    .from('dacha_articles')
    .select('id, body_mdx')
    .eq('slug', 'farmland-law-beginner-guide-for-salaried-workers')
    .single()

  if (!data) throw new Error('not found')

  const fixed = data.body_mdx.replace(/\*\*([^*\n]+?)\*\*/g, '<strong>$1</strong>')
  const { error } = await supabase.from('dacha_articles').update({ body_mdx: fixed }).eq('id', data.id)
  if (error) throw error
  console.log('完了')
}

main().catch(e => { console.error(e); process.exit(1) })
