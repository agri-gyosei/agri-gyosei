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

  // 対象記事: what-is-dacha-why-russia-survived-famine
  // 修正内容: 38% → 37%（農水省令和6年度確定値）
  const TARGET_SLUG = 'what-is-dacha-why-russia-survived-famine'

  const { data: article, error: fetchError } = await supabase
    .from('dacha_articles')
    .select('id, slug, title, body_mdx, seo_description')
    .eq('slug', TARGET_SLUG)
    .single()

  if (fetchError || !article) {
    console.error('記事が見つかりません:', fetchError)
    process.exit(1)
  }

  const before38Count = (article.body_mdx.match(/38%/g) ?? []).length
  console.log(`タイトル: ${article.title}`)
  console.log(`body_mdx 内の "38%" 件数: ${before38Count}`)

  if (before38Count === 0) {
    console.log('修正対象なし（既に37%になっているか、該当テキストなし）')
    return
  }

  const newBodyMdx = article.body_mdx
    .replace(/38%（2024年度、農林水産省発表値）/g, '37%（2024年度、農林水産省確定値）')
    .replace(/38%（2024年度・カロリーベース、農林水産省発表値）/g, '37%（2024年度・カロリーベース、農林水産省確定値）')
    .replace(/2023年度で38%/g, '2024年度で37%')
    .replace(/カロリーベース\)は<strong>2023年度で38%<\/strong>/g, 'カロリーベース）は<strong>2024年度で37%</strong>')
    .replace(/38%/g, '37%')

  const newSeoDescription = (article.seo_description ?? '')
    .replace(/38%/g, '37%')

  const after38Count = (newBodyMdx.match(/38%/g) ?? []).length
  console.log(`修正後の "38%" 件数: ${after38Count}（差分: ${before38Count - after38Count} 件修正）`)

  const { error: updateError } = await supabase
    .from('dacha_articles')
    .update({
      body_mdx: newBodyMdx,
      seo_description: newSeoDescription,
    })
    .eq('slug', TARGET_SLUG)

  if (updateError) {
    console.error('更新エラー:', updateError)
    process.exit(1)
  }

  console.log('✅ 更新完了: 38% → 37%（農水省令和6年度確定値）')
}

main().catch(e => { console.error(e); process.exit(1) })
