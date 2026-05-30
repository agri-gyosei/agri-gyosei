import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

import { createClient } from '@supabase/supabase-js'

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('articles')
    .select('body_mdx')
    .eq('slug', 'strategic-study-method-for-passing-score')
    .single()

  if (error || !data) throw new Error(`取得失敗: ${error?.message}`)

  const lines = data.body_mdx.split('\n')
  lines.forEach((line: string, i: number) => {
    if (line.includes('一般知識')) {
      console.log(`行${i + 1}: ${line.trim()}`)
    }
  })
}

main().catch(console.error)
