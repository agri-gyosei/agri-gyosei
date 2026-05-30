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
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) throw new Error('env vars missing')

  const supabase = createClient(supabaseUrl, serviceRoleKey)

  const { data: article } = await supabase
    .from('dacha_articles')
    .select('id, body_mdx')
    .eq('slug', 'farmland-law-beginner-guide-for-salaried-workers')
    .single()

  if (!article) throw new Error('Article not found')

  // **ステップN：...** の後に単一改行があれば二重改行に変換
  const fixed = article.body_mdx.replace(
    /(\*\*ステップ[0-9１-３][:：][^\n*]+\*\*)\n([^\n])/g,
    '$1\n\n$2'
  )

  if (fixed === article.body_mdx) {
    console.log('パターン不一致。確認用に前後を表示：')
    const idx = article.body_mdx.indexOf('ステップ')
    console.log(JSON.stringify(article.body_mdx.slice(idx, idx + 200)))
    return
  }

  const { error } = await supabase
    .from('dacha_articles')
    .update({ body_mdx: fixed })
    .eq('id', article.id)

  if (error) throw error
  console.log('修正完了')
}

main().catch((err) => { console.error(err); process.exit(1) })
