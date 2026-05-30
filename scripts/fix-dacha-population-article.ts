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

  const before = data.body_mdx
  const target = 'ロシア国民の約半数がこのダーチャを持ち、週末になると家族そろって畑を耕し、'
  const replacement = '国民の3人に1人がこのダーチャを持つとされ（2012年・ロシア政府情報紙）、週末になると家族そろって畑を耕し、'

  if (!before.includes(target)) {
    console.log('⚠️ 該当テキストなし。「約半数」を含む箇所を全文検索:')
    const idx = before.indexOf('約半数')
    if (idx === -1) {
      console.log('  →「約半数」は記事内に存在しません（既に修正済みの可能性）')
    } else {
      console.log('  →' + before.substring(Math.max(0, idx - 30), idx + 60))
    }
    return
  }

  const after = before.replace(target, replacement)

  const { error: updateError } = await supabase
    .from('dacha_articles')
    .update({ body_mdx: after })
    .eq('slug', 'what-is-dacha-why-russia-survived-famine')

  if (updateError) { console.error('更新エラー:', updateError); process.exit(1) }
  console.log('✅ 修正完了')
  console.log('  前: ' + target)
  console.log('  後: ' + replacement)
}

main().catch(e => { console.error(e); process.exit(1) })
