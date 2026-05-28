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
    .eq('slug', 'salaryman-becoming-part-time-farmer')
    .single()

  if (error || !data) { console.error(error); process.exit(1) }

  const lines = data.body_mdx.split('\n')
  lines.forEach((line: string, i: number) => {
    if (line.includes('38%') || line.includes('自給率') || line.includes('2023年') || line.includes('2024年')) {
      console.log(`L${i + 1}: ${line.substring(0, 120)}`)
    }
  })
}

main().catch(e => { console.error(e); process.exit(1) })
