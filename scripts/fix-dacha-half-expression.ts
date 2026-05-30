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

  const slug = 'what-is-dacha-why-russia-survived-famine'
  const { data, error } = await supabase
    .from('dacha_articles')
    .select('body_mdx')
    .eq('slug', slug)
    .single()

  if (error || !data) { console.error(error); process.exit(1) }

  const before = data.body_mdx
  const after = before.replace(
    'ロシア国民の約半数がこのダーチャを持ち、',
    'ロシアでは数千万世帯がこのダーチャを持つといわれ、'
  )

  if (before === after) {
    console.log('⚠️ 該当テキストなし（既に修正済みか表現が異なる可能性あり）')
    // 「約半数」を含む行を確認
    const lines = before.split('\n').filter((l: string) => l.includes('約半数') || l.includes('半数'))
    if (lines.length) console.log('「半数」を含む行:\n' + lines.map((l: string) => '  ' + l.substring(0, 100)).join('\n'))
    return
  }

  const { error: updateError } = await supabase
    .from('dacha_articles')
    .update({ body_mdx: after })
    .eq('slug', slug)

  if (updateError) { console.error('更新エラー:', updateError); process.exit(1) }
  console.log('✅ 修正完了: 「ロシア国民の約半数が〜」→「ロシアでは数千万世帯が〜」')
}

main().catch(e => { console.error(e); process.exit(1) })
