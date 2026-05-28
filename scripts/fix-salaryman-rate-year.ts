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

  const before = data.body_mdx
  const after = before.replace(
    '農林水産省が2024年8月に公表した2023年度（令和5年度）の食料自給率は、カロリーベースでわずか<strong>38%</strong>',
    '農林水産省が公表した2024年度（令和6年度）の食料自給率は、カロリーベースでわずか<strong>38%</strong>'
  )

  if (before === after) {
    console.log('⚠️ 該当テキストが見つかりません（既に修正済みの可能性あり）')
    return
  }

  const { error: updateError } = await supabase
    .from('dacha_articles')
    .update({ body_mdx: after })
    .eq('slug', 'salaryman-becoming-part-time-farmer')

  if (updateError) { console.error('更新エラー:', updateError); process.exit(1) }
  console.log('✅ 修正完了: 2023年度（令和5年度）→ 2024年度（令和6年度）')
}

main().catch(e => { console.error(e); process.exit(1) })
